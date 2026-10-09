#!/usr/bin/env node
// Teste REAL de RLS (OMEGA V4 §34/§44): sobe um Postgres descartável no Docker,
// emula o schema `auth` do Supabase (auth.uid()/auth.role() a partir dos claims
// do JWT), aplica TODAS as migrations e executa casos positivos e negativos como
// usuários diferentes. Sai com código 1 se qualquer caso falhar.
//
// Uso: npm run test:rls   (requer Docker em execução)
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const NOME = 'msf-rls-test';
const IMG = process.env.RLS_PG_IMAGE || 'postgres:15-alpine';
const MIG = path.resolve('supabase/migrations');

const sh = (args, input) => spawnSync('docker', args, { input, encoding: 'utf8' });
function psql(sql) {
  const r = sh(['exec', '-i', NOME, 'psql', '-U', 'postgres', '-d', 'postgres', '-v', 'ON_ERROR_STOP=1', '-q', '-t', '-A', '-X'], sql);
  return { ok: r.status === 0, out: (r.stdout || '').trim(), err: (r.stderr || '').trim() };
}

sh(['rm', '-f', NOME]);
const run = sh(['run', '-d', '--name', NOME, '-e', 'POSTGRES_PASSWORD=pg', IMG]);
if (run.status !== 0) { console.error('Docker indisponível:', run.stderr); process.exit(2); }
for (let i = 0; i < 60; i++) {
  if (sh(['exec', NOME, 'pg_isready', '-U', 'postgres']).status === 0 && psql('select 1').ok) break;
  execFileSync(process.execPath, ['-e', 'setTimeout(()=>{},500)']);
}

const SHIM = `
create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;
create schema auth;
create table auth.users (id uuid primary key, email text, raw_user_meta_data jsonb default '{}'::jsonb);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
create function auth.role() returns text language sql stable as $$ select nullif(current_setting('request.jwt.claim.role', true), '') $$;
grant usage on schema auth to anon, authenticated, service_role;
grant execute on all functions in schema auth to anon, authenticated, service_role;
`;
let r = psql(SHIM);
if (!r.ok) { console.error('shim falhou', r.err); process.exit(1); }

for (const f of fs.readdirSync(MIG).filter((x) => x.endsWith('.sql')).sort()) {
  r = psql(fs.readFileSync(path.join(MIG, f), 'utf8'));
  if (!r.ok) { console.error(`migration ${f} falhou:\n${r.err}`); sh(['rm', '-f', NOME]); process.exit(1); }
  console.log('✓ migration', f);
}
psql(`grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on all tables in schema public to anon, authenticated, service_role;`);

const A = '00000000-0000-0000-0000-00000000000a';
const B = '00000000-0000-0000-0000-00000000000b';
const C = '00000000-0000-0000-0000-00000000000c';
const TA = '10000000-0000-0000-0000-0000000000a1';
const TB = '10000000-0000-0000-0000-0000000000b1';
psql(`insert into auth.users(id,email) values ('${A}','a@x'),('${B}','b@x'),('${C}','c@x');
insert into public.trips(id,user_id,titulo) values ('${TA}','${A}','Japão do A'),('${TB}','${B}','Itália do B');
insert into public.subscriptions(user_id,plan,status) values ('${A}','free','inactive');`);

// Executa SQL "como" um usuário (claims do JWT) dentro de uma transação.
const como = (uid, sql, role = 'authenticated') => psql(`begin;
set local role ${role};
select set_config('request.jwt.claim.sub', '${uid || ''}', true);
select set_config('request.jwt.claim.role', '${role}', true);
${sql}
commit;`);

const casos = [];
const caso = (nome, fn) => casos.push({ nome, fn });
const linhas = (res) => res.out.split('\n').filter((l) => l !== '' && l !== ' ');
const ultimo = (res) => linhas(res).at(-1);

caso('A lê a própria viagem', () => ultimo(como(A, `select count(*) from trips where id='${TA}';`)) === '1');
caso('IDOR: A NÃO lê a viagem de B', () => ultimo(como(A, `select count(*) from trips where id='${TB}';`)) === '0');
caso('IDOR: A NÃO altera a viagem de B', () => ultimo(como(A, `with u as (update trips set titulo='hack' where id='${TB}' returning 1) select count(*) from u;`)) === '0');
caso('anônimo não lê viagens', () => ultimo(como('', `select count(*) from trips;`, 'anon')) === '0');
caso('A NÃO insere viagem em nome de B', () => !como(A, `insert into trips(user_id,titulo) values ('${B}','fake');`).ok);
caso('A NÃO convida a si mesmo na viagem de B', () => !como(A, `insert into trip_members(trip_id,user_id,papel) values ('${TB}','${A}','editor');`).ok);
caso('B convida A como viewer', () => como(B, `insert into trip_members(trip_id,user_id,papel) values ('${TB}','${A}','viewer');`).ok);
caso('viewer A agora LÊ a viagem de B', () => ultimo(como(A, `select count(*) from trips where id='${TB}';`)) === '1');
caso('viewer A NÃO edita a viagem de B', () => ultimo(como(A, `with u as (update trips set titulo='x' where id='${TB}' returning 1) select count(*) from u;`)) === '0');
caso('viewer A NÃO cria item no itinerário de B', () => !como(A, `insert into itinerary_items(trip_id,titulo) values ('${TB}','x');`).ok);
caso('viewer A NÃO se promove a editor', () => ultimo(como(A, `with u as (update trip_members set papel='editor' where trip_id='${TB}' and user_id='${A}' returning 1) select count(*) from u;`)) === '0');
caso('ninguém cria segundo owner', () => !como(B, `insert into trip_members(trip_id,user_id,papel) values ('${TB}','${C}','owner');`).ok);
caso('B promove A a editor', () => ultimo(como(B, `with u as (update trip_members set papel='editor' where trip_id='${TB}' and user_id='${A}' returning 1) select count(*) from u;`)) === '1');
caso('editor A cria item no itinerário de B', () => como(A, `insert into itinerary_items(trip_id,titulo,local_start,time_zone) values ('${TB}','Coliseu','2026-11-02T09:00','Europe/Rome');`).ok);
caso('editor A NÃO troca o dono da viagem', () => !como(A, `update trips set user_id='${A}' where id='${TB}';`).ok);
caso('C (sem vínculo) não vê itinerário de B', () => ultimo(como(C, `select count(*) from itinerary_items where trip_id='${TB}';`)) === '0');
caso('cliente NÃO grava reserva CONFIRMED como provider_webhook', () => !como(A, `insert into reservations(trip_id,tipo,provider,status,confirmed_by) values ('${TA}','LODGING','Booking.com','CONFIRMED','provider_webhook');`).ok);
caso('reserva CONFIRMED sem fonte é rejeitada', () => !como(A, `insert into reservations(trip_id,tipo,provider,status) values ('${TA}','LODGING','Booking.com','CONFIRMED');`).ok);
caso('cliente pode declarar confirmação como import_manual', () => como(A, `insert into reservations(trip_id,tipo,provider,status,confirmed_by) values ('${TA}','LODGING','Booking.com','CONFIRMED','import_manual');`).ok);
caso('servidor grava confirmação verificada', () => como('', `insert into reservations(trip_id,tipo,provider,status,confirmed_by) values ('${TA}','EXPERIENCE','Viator','CONFIRMED','provider_webhook');`, 'service_role').ok);
caso('B não vê reservas de A', () => ultimo(como(B, `select count(*) from reservations where trip_id='${TA}';`)) === '0');
caso('documento privado não aparece para membro', () => {
  como(B, `insert into trip_documents(trip_id,tipo,titulo) values ('${TB}','PASSAPORTE','Passaporte do B');`);
  return ultimo(como(A, `select count(*) from trip_documents where trip_id='${TB}';`)) === '0';
});
caso('documento de outra viagem não pode ser criado por estranho', () => !como(C, `insert into trip_documents(trip_id,tipo,titulo) values ('${TB}','OUTRO','x');`).ok);
caso('usuário NÃO altera o próprio plano em profiles', () => {
  psql(`insert into public.profiles(id) values ('${A}') on conflict do nothing;`);
  return !como(A, `update profiles set plano='pro' where id='${A}';`).ok;
});
caso('usuário NÃO escreve a própria assinatura', () => ultimo(como(A, `with u as (update subscriptions set plan='pro', status='active' where user_id='${A}' returning 1) select count(*) from u;`)) === '0');
caso('usuário lê só a própria assinatura', () => ultimo(como(B, `select count(*) from subscriptions;`)) === '0');
caso('cliente não lê stripe_events nem ledger', () => ultimo(como(A, `select (select count(*) from stripe_events) + (select count(*) from commission_ledger) + (select count(*) from affiliate_clicks);`)) === '0');
caso('cliente não insere comissão', () => !como(A, `insert into commission_ledger(provider,status,valor_minor,currency) values ('x','PAID',100000,'USD');`).ok);
caso('anônimo não consome cota de IA', () => ultimo(como('', `select permitido from consumir_ia(5);`, 'anon')) !== 't');
caso('despesa negativa é rejeitada', () => !como(A, `insert into expenses(trip_id,valor_minor,currency) values ('${TA}',-100,'JPY');`).ok);
caso('moeda inválida é rejeitada', () => !como(A, `insert into expenses(trip_id,valor_minor,currency) values ('${TA}',100,'iene');`).ok);
caso('membro sai da viagem por conta própria', () => ultimo(como(A, `with d as (delete from trip_members where trip_id='${TB}' and user_id='${A}' returning 1) select count(*) from d;`)) === '1');
caso('após sair, A perde acesso', () => ultimo(como(A, `select count(*) from trips where id='${TB}';`)) === '0');
// ---------------- plataforma: B2B, white-label, API, marketplace, compras ----------------
const ORG = '20000000-0000-0000-0000-0000000000b1';
const TOK = '30000000-0000-0000-0000-0000000000b1';
caso('B cria a agência e vira owner automaticamente', () => como(B, `insert into organizations(id,slug,nome,owner_id,marca) values ('${ORG}','agencia-b','Agência B','${B}','{"corPrimaria":"#0A7D5A"}');`).ok
  && ultimo(psql(`select papel from org_members where org_id='${ORG}' and user_id='${B}';`)) === 'owner');
caso('A NÃO cria organização em nome de B', () => !como(A, `insert into organizations(slug,nome,owner_id) values ('fake-b','Fake','${B}');`).ok);
caso('IDOR: C não vê a agência de B', () => ultimo(como(C, `select count(*) from organizations where id='${ORG}';`)) === '0');
caso('C não se adiciona na agência de B', () => !como(C, `insert into org_members(org_id,user_id,papel) values ('${ORG}','${C}','agent');`).ok);
caso('ninguém cria segundo owner na agência', () => !como(B, `insert into org_members(org_id,user_id,papel) values ('${ORG}','${C}','owner');`).ok);
caso('B convida C como agente por e-mail', () => ultimo(como(B, `select convidar_para_org('${ORG}','c@x','agent');`)) === 't');
caso('agente C NÃO convida ninguém', () => !como(C, `select convidar_para_org('${ORG}','a@x','admin');`).ok);
caso('agente C cria proposta da agência', () => como(C, `insert into proposals(org_id,titulo,cliente_nome,cliente_email,destino_code,pessoas,custo_minor,margem_pct,status,token_publico,itens)
  values ('${ORG}','Lua de mel no Japão','Ana','ana@cliente.com','JP',2,1000000,15,'enviada','${TOK}','[{"titulo":"Hotel Quioto","dia":1,"tipo":"LODGING","custo_minor":600000}]');`).ok);
caso('preço da proposta = custo + margem (gerado no banco)', () => ultimo(psql(`select preco_minor from proposals where token_publico='${TOK}';`)) === '1150000');
caso('agente C NÃO apaga proposta (só admin)', () => ultimo(como(C, `with d as (delete from proposals where token_publico='${TOK}' returning 1) select count(*) from d;`)) === '0');
caso('IDOR: A não lê propostas da agência de B', () => ultimo(como(A, `select count(*) from proposals where org_id='${ORG}';`)) === '0');
caso('cliente final vê a proposta por token SEM custo, margem nem e-mail', () => {
  const r = ultimo(como('', `select proposta_publica('${TOK}')::text;`, 'anon')) || '';
  return r.includes('Lua de mel') && r.includes('1150000') && !r.includes('1000000') && !r.includes('margem') && !r.includes('custo') && !r.includes('ana@cliente.com');
});
caso('token inexistente não revela nada', () => (ultimo(como('', `select coalesce(proposta_publica('${A}')::text,'nulo');`, 'anon')) || '') === 'nulo');
caso('cliente final aceita a proposta uma única vez', () => ultimo(como('', `select responder_proposta('${TOK}', true);`, 'anon')) === 'aceita'
  && ultimo(como('', `select responder_proposta('${TOK}', false);`, 'anon')) === 'indisponivel');
caso('admin não troca o dono da agência', () => !como(B, `update organizations set owner_id='${C}' where id='${ORG}';`).ok);
caso('agente C NÃO altera a marca (white-label é de admin)', () => ultimo(como(C, `with u as (update organizations set marca='{"corPrimaria":"#FF0000"}' where id='${ORG}' returning 1) select count(*) from u;`)) === '0');

const H1 = 'a'.repeat(64);
caso('B cria chave de API (só o hash) e o limite é forçado', () => como(B, `insert into api_keys(nome,prefixo,hash,limite_min,escopos) values ('app B','msf_live_AbC123','${H1}',6000,'{admin}');`).ok
  && ultimo(psql(`select limite_min||'/'||array_to_string(escopos,',') from api_keys where hash='${H1}';`)) === '600/catalogo:ler');
caso('IDOR: C não vê a chave de B', () => ultimo(como(C, `select count(*) from api_keys;`)) === '0');
caso('anônimo valida chave pelo hash', () => ultimo(como('', `select count(*) from validar_api_key('${H1}');`, 'anon')) === '1');
caso('B NÃO troca o hash da chave', () => !como(B, `update api_keys set hash='${'b'.repeat(64)}' where hash='${H1}';`).ok);
caso('B revoga a chave e ela deixa de validar', () => como(B, `update api_keys set revogada_em=now() where hash='${H1}';`).ok
  && ultimo(como('', `select count(*) from validar_api_key('${H1}');`, 'anon')) === '0');
caso('chave revogada não é reativada', () => !como(B, `update api_keys set revogada_em=null where hash='${H1}';`).ok);
caso('anônimo não lê a tabela de chaves', () => ultimo(como('', `select count(*) from api_keys;`, 'anon')) === '0');

const R1 = '40000000-0000-0000-0000-0000000000c1';
caso('C vira criador/consultor; "verificado" é ignorado', () => como(C, `insert into creator_profiles(user_id,slug,nome_publico,tipos,verificado,consultoria_preco_minor) values ('${C}','cris-viaja','Cris Viaja','{criador,consultor}',true,25000);`).ok
  && ultimo(psql(`select verificado from creator_profiles where user_id='${C}';`)) === 'f');
caso('C NÃO se marca como verificado depois', () => !como(C, `update creator_profiles set verificado=true where user_id='${C}';`).ok);
caso('C publica roteiro pago com conteúdo', () => como(C, `insert into creator_itineraries(id,slug,titulo,destino_code,dias,resumo,preco_minor,status) values ('${R1}','japao-10-dias','Japão em 10 dias','JP',10,'Tóquio, Quioto e Osaka com trem-bala e dias de respiro.',4900,'publicado');
  insert into creator_itinerary_content(itinerary_id,dias) values ('${R1}','[{"dia":1,"itens":[{"titulo":"Shibuya"}]}]');`).ok);
caso('anônimo vê o roteiro publicado mas NÃO o conteúdo pago', () => ultimo(como('', `select (select count(*) from creator_itineraries where id='${R1}')||'/'||(select count(*) from creator_itinerary_content where itinerary_id='${R1}');`, 'anon')) === '1/0');
caso('B (sem compra) NÃO lê o conteúdo pago', () => ultimo(como(B, `select count(*) from creator_itinerary_content where itinerary_id='${R1}';`)) === '0');
caso('B NÃO registra compra por conta própria', () => !como(B, `insert into purchases(user_id,produto,produto_id,valor_minor,moeda,status) values ('${B}','roteiro','${R1}',4900,'BRL','pago');`).ok);
caso('após pagamento (servidor), B lê o conteúdo comprado', () => como('', `insert into purchases(user_id,produto,produto_id,vendedor_id,valor_minor,moeda,taxa_plataforma_minor,stripe_session_id,status,pago_em) values ('${B}','roteiro','${R1}','${C}',4900,'BRL',980,'cs_test_1','pago',now());`, 'service_role').ok
  && ultimo(como(B, `select count(*) from creator_itinerary_content where itinerary_id='${R1}';`)) === '1');
caso('vendedor C vê a venda; A não vê', () => ultimo(como(C, `select count(*) from purchases;`)) === '1' && ultimo(como(A, `select count(*) from purchases;`)) === '0');
caso('compra duplicada pela mesma sessão Stripe é rejeitada', () => !como('', `insert into purchases(user_id,produto,valor_minor,moeda,stripe_session_id,status) values ('${B}','trip_pass',4900,'BRL','cs_test_1','pago');`, 'service_role').ok);
caso('Trip Pass pago libera 30 dias', () => como('', `insert into purchases(user_id,produto,valor_minor,moeda,stripe_session_id,status,pago_em) values ('${B}','trip_pass',4900,'BRL','cs_test_2','pago',now());`, 'service_role').ok
  && ultimo(como(B, `select trip_pass_ativo_ate() > now() + interval '29 days';`)) === 't');

const Q1 = '50000000-0000-0000-0000-0000000000d1';
caso('B pede consultoria a C (nasce "nova", sem preço)', () => como(B, `insert into consult_requests(id,consultor_id,mensagem,destino_code) values ('${Q1}','${C}','Quero ajuda para montar 12 dias no Japão em novembro.','JP');`).ok);
caso('B NÃO pede consultoria já com preço/aceita', () => !como(B, `insert into consult_requests(consultor_id,mensagem,status,preco_minor) values ('${C}','Pedido que tenta pular etapas.','aceita',1);`).ok);
caso('cliente B NÃO se marca como pago', () => !como(B, `update consult_requests set status='paga' where id='${Q1}';`).ok);
caso('consultor C aceita com preço', () => como(C, `update consult_requests set status='aceita', preco_minor=25000 where id='${Q1}';`).ok);
caso('consultor C NÃO marca como paga (só o servidor)', () => !como(C, `update consult_requests set status='paga' where id='${Q1}';`).ok);
caso('A não vê a consultoria de B e C', () => ultimo(como(A, `select count(*) from consult_requests;`)) === '0');
caso('servidor marca paga e consultor conclui', () => como('', `update consult_requests set status='paga' where id='${Q1}';`, 'service_role').ok
  && como(C, `update consult_requests set status='concluida' where id='${Q1}';`).ok);
caso('pedir consultoria a quem não é consultor falha', () => !como(C, `insert into consult_requests(consultor_id,mensagem) values ('${B}','Pedido para quem não é consultor.');`).ok);

caso('LGPD: A exclui a própria conta (cascata)', () => como(A, `select excluir_minha_conta();`).ok && ultimo(psql(`select count(*) from trips where user_id='${A}';`)) === '0');

// Compatibilidade REAL do adaptador de sync (app/_lib/viagens/sync.js) com o schema:
// as linhas geradas por paraLinhas() são inseridas como o próprio usuário (RLS ativo).
const { paraLinhas } = await import(pathToFileURL(path.resolve('app/_lib/viagens/sync.js')).href);
const st = await import(pathToFileURL(path.resolve('app/_lib/viagens/store.js')).href);
const lit = (v) => (v === null || v === undefined ? 'null' : typeof v === 'number' || typeof v === 'boolean' ? String(v) : typeof v === 'object' ? `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb` : `'${String(v).replace(/'/g, "''")}'`);
const ins = (tabela, row) => `insert into ${tabela} (${Object.keys(row).join(',')}) values (${Object.values(row).map(lit).join(',')})`;
caso('adaptador de sync grava viagem completa no schema real (como o usuário)', () => {
  let e = st.adicionarViagem(st.estadoVazio(), st.novaViagem({ titulo: 'Sync JP', destinoCode: 'JP', destinoNome: 'Japão', inicio: '2026-11-01', fim: '2026-11-02', orcamento: 9000, timeZone: 'Asia/Tokyo' }));
  const vid = e.viagens[0].id;
  e = st.adicionarItem(e, vid, { dia: '2026-11-01', titulo: 'Fushimi', lat: 34.96, lng: 135.77, fixoInicio: '09:00' });
  e = st.adicionarReserva(e, vid, { tipo: 'LODGING', provider: 'Booking.com', preco: 800, moeda: 'BRL', confirmada: true, inicioLocal: '2026-11-01T15:00' });
  e = st.adicionarDespesa(e, vid, { valor: 3200, moeda: 'JPY', categoria: 'ALIMENTACAO', taxa: 0.0317, data: '2026-11-01' });
  e = st.adicionarDocumento(e, vid, { tipo: 'PASSAPORTE', titulo: 'Passaporte', validade: '2030-01-01' });
  const L = paraLinhas(e.viagens[0], B);
  const r = como(B, `${ins('trips', L.trip)};
    ${L.itens.map((x) => ins('itinerary_items', { ...x, trip_id: '__T__' })).join(';')};
    ${L.reservas.map((x) => ins('reservations', { ...x, trip_id: '__T__' })).join(';')};
    ${L.despesas.map((x) => ins('expenses', { ...x, trip_id: '__T__' })).join(';')};
    ${L.documentos.map((x) => ins('trip_documents', { ...x, trip_id: '__T__' })).join(';')};
    select (select count(*) from itinerary_items i join trips t on t.id=i.trip_id where t.local_id='${vid}')
         + (select count(*) from reservations r join trips t on t.id=r.trip_id where t.local_id='${vid}')
         + (select count(*) from expenses x join trips t on t.id=x.trip_id where t.local_id='${vid}')
         + (select count(*) from trip_documents d join trips t on t.id=d.trip_id where t.local_id='${vid}');`
    .replace(/'__T__'/g, `(select id from trips where local_id='${vid}')`));
  if (!r.ok) console.error(r.err.slice(0, 300));
  return r.ok && ultimo(r) === '4';
});

let falhas = 0;
for (const c of casos) {
  let ok = false;
  try { ok = c.fn(); } catch (e) { ok = false; }
  console.log(`${ok ? '✓' : '✗'} ${c.nome}`);
  if (!ok) falhas++;
}
sh(['rm', '-f', NOME]);
console.log(`\n${casos.length - falhas}/${casos.length} casos de RLS passaram`);
process.exit(falhas ? 1 : 0);
