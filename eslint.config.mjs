import next from 'eslint-config-next/core-web-vitals';

export default [
  ...next,
  { ignores: ['.next/**', 'node_modules/**', 'docs/**', 'public/**'] },
  {
    rules: {
      '@next/next/no-img-element': 'off',
      // regras novas do React Compiler: avisam, não bloqueiam (código legado em migração)
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/static-components': 'warn',
      'react-hooks/preserve-manual-memoization': 'warn',
    },
  },
];
