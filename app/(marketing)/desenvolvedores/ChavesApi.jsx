'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase, supabaseConfigurado, usuarioAtual } from '../../_engine/supabase.js';
import { gerarChave, prefixoDe, hashChave } from '../../_lib/plataforma/apiKeys.js';
import { useIdioma } from '../../_lib/i18n.js';
import { Icon } from '../../_ui/Icon.jsx';

// Gestão de chaves: a chave é gerada NO NAVEGADOR e só o hash SHA-256 vai ao
// banco. Ela aparece uma única vez — depois, só o prefixo.
export function ChavesApi() {
  const { t, locale } = useIdioma();
  const [user, setUser] = useState(undefined);
  const [chaves, setChaves] = useState([]);
  const [nova, setNova] = useState('');
  const [msg, setMsg] = useState('');

  const carregar = useCallback(async () => {
    if (!supabase) { setUser(null); return; }
    const u = await usuarioAtual().catch(() => null);
    setUser(u);
    if (!u) return;
    const { data } = await supabase.from('api_keys').select('id,nome,prefixo,criado_em,ultimo_uso,revogada_em,limite_min').order('criado_em', { ascending: false });
    setChaves(data || []);
  }, []);
  useEffect(() => { carregar(); }, [carregar]);

  async function criar(e) {
    e.preventDefault();
    const nome = String(new FormData(e.currentTarget).get('nome') || '').trim() || 'Minha chave';
    const chave = gerarChave('live');
    const { error } = await supabase.from('api_keys').insert({ nome, prefixo: prefixoDe(chave), hash: await hashChave(chave) });
    if (error) { setMsg(error.message); return; }
    setNova(chave); setMsg('');
    carregar();
  }
  async function revogar(id) {
    const { error } = await supabase.from('api_keys').update({ revogada_em: new Date().toISOString() }).eq('id', id);
    setMsg(error ? error.message : t('plat.revogada'));
    carregar();
  }

  return (
    <div className="rounded-2xl border border-line bg-card p-4 space-y-3">
      <h2 className="eyebrow">{t('plat.suasChaves')}</h2>
      {!supabaseConfigurado ? <p className="text-sm text-inksoft">{t('plat.chavesSemServidor')}</p>
        : user === undefined ? <p className="text-sm text-inksoft">{t('plat.carregando')}</p>
        : !user ? <p className="text-sm text-inksoft">{t('plat.entrarChaves')} <Link href="/conta" className="text-pine underline">{t('ws.entrar')}</Link></p>
        : (
          <>
            <form onSubmit={criar} className="flex gap-2">
              <label className="sr-only" htmlFor="nome-chave">{t('plat.nomeChave')}</label>
              <input id="nome-chave" name="nome" maxLength={80} placeholder={t('plat.nomeChave')} className="flex-1 h-10 px-3 rounded-lg border border-line bg-input text-ink text-sm focusring" />
              <button type="submit" className="h-10 px-3 rounded-lg bg-pine text-onpine text-sm font-semibold focusring"><Icon name="plus" size={16} /><span className="sr-only">{t('plat.criarChave')}</span></button>
            </form>
            {nova && (
              <div role="status" className="rounded-lg border border-warn-bd bg-warn-bg p-3 text-sm">
                <p className="text-warn font-semibold">{t('plat.copieAgora')}</p>
                <code className="mt-1 block break-all font-mono text-xs text-ink">{nova}</code>
                <button type="button" onClick={() => navigator.clipboard.writeText(nova).catch(() => {})} className="mt-2 text-xs text-pine underline focusring rounded">{t('plat.copiar')}</button>
              </div>
            )}
            {msg && <p role="status" className="text-sm text-inksoft">{msg}</p>}
            <ul className="divide-y divide-line text-sm">
              {chaves.map((c) => (
                <li key={c.id} className="py-2 flex items-center justify-between gap-2">
                  <span><span className="text-ink">{c.nome}</span><span className="block font-mono text-[11px] text-inksoft">{c.prefixo}… · {c.limite_min}/min{c.ultimo_uso ? ` · ${new Date(c.ultimo_uso).toLocaleDateString(locale)}` : ''}</span></span>
                  {c.revogada_em ? <span className="text-xs text-inksoft">{t('plat.revogada')}</span>
                    : <button type="button" onClick={() => revogar(c.id)} className="text-xs text-danger hover:underline focusring rounded">{t('plat.revogar')}</button>}
                </li>
              ))}
            </ul>
          </>
        )}
    </div>
  );
}
