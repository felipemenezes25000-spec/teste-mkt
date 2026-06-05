// Injeta um bloco JSON-LD (schema.org) no HTML. Server Component → sai no SSR/SSG,
// que é exatamente o que os crawlers leem. `data` é um objeto puro (ver _lib/seo.js).
// Escapa "<" pra blindar contra quebra de </script> em nomes de dados.
export function JsonLd({ data }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
