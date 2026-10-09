// Poema concreto: palavras em League Spartan 900 cujas letras ondulam em sequência.
// `linhas` = [[['mundo', 'ms-fraco'|'text-cobalto'|''], ...], ...]. O texto completo vai
// no aria-label (leitor de tela não soletra letra por letra).
export function Poema({ linhas, className = '', as: Tag = 'h1', style }) {
  let n = 0;
  const texto = linhas.map((l) => l.map((w) => w[0]).join(' ')).join(' ');
  return (
    <Tag className={`ms-poema ${className}`} style={style} aria-label={texto}>
      {linhas.map((l, li) => (
        <span key={li} className="l" aria-hidden="true">
          {l.map(([palavra, classe], wi) => (
            <span key={wi} className={classe === undefined ? 'ms-fraco' : classe}>
              {Array.from(palavra).map((ch, ci) => <i key={ci} style={{ '--n': n++ }}>{ch}</i>)}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
