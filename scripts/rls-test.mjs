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
