// Ícones de domínio MERIDIANO (OMEGA V4 §7/§10: nada de emoji como iconografia).
// Glifos de linha próprios num grid 24×24, traço 1.75, pontas arredondadas.
// <Icon name="plane" />  ou, para dados legados que carregam emoji, <Icon emoji="✈️" />.
// Sempre decorativo (aria-hidden) — o texto ao lado carrega o significado.

const P = {
  // transporte
  plane: 'M2.5 13.5 21 6.2c.9-.4 1.6.7.9 1.4L9.6 19.2l-1.2-5L2.5 13.5Zm5.9.7 12.6-7.4M8.4 14.2 11 17',
  'plane-up': 'M3 20h18M4.5 14.5 19 8.3c.8-.3 1.4.6.8 1.2L11 16.8 4.5 14.5Zm2-4 3 1.5 4-2-4.5-3.5-2.5 1Z',
  'plane-down': 'M3 20h18M5 7l13.8 5.9c.8.3.7 1.5-.2 1.6L9 15.8 5 7Zm2.2 6.8L6 9.7',
  train: 'M7 3h10a2 2 0 0 1 2 2v9a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V5a2 2 0 0 1 2-2Zm-2 8h14M9 14h.01M15 14h.01M8 17l-2 4m10-4 2 4',
  metro: 'M12 3a8 8 0 0 1 8 8v4a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-4a8 8 0 0 1 8-8Zm-8 8h16M9 15h.01M15 15h.01M8 18l-2 3m10-3 2 3',
  bus: 'M5 4h14a1 1 0 0 1 1 1v12H4V5a1 1 0 0 1 1-1Zm-1 7h16M7.5 17v2.5m9-2.5v2.5M8 14h.01M16 14h.01',
  car: 'M4 16v-4l2-5a2 2 0 0 1 1.9-1.3h8.2A2 2 0 0 1 18 7l2 5v4H4Zm0-4h16M7 19v-3m10 3v-3M7.5 13.5h.01m9 0h.01',
  taxi: 'M9 3h6l1 3M4 16v-4l2-5a2 2 0 0 1 1.9-1.3h8.2A2 2 0 0 1 18 7l2 5v4H4Zm0-4h16M7 19v-3m10 3v-3',
  ship: 'M3 17c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0M5 14l-1-4h16l-1 4M8 10V6h8v4M12 3v3',
  walk: 'M13 4.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM10 21l2-6-2-3 1-5 3 3 3 1M10 12 7 13l-1 3m6-1 3 6',
  bike: 'M5.5 18a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm13 0a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM5.5 14.5 9 8h6l3.5 6.5M9 8 12 14.5h-6.5M14 5h2',
  fuel: 'M4 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M3 21h12M4 10h10M14 8l3 2v7a1.5 1.5 0 0 0 3 0V8l-3-3',
  route: 'M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm12-10a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM8 17h7.5a3.5 3.5 0 0 0 0-7h-7a3.5 3.5 0 0 1 0-7H16',
  // lugares
  pin: 'M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 1 1 13 0c0 5.4-6.5 11-6.5 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  map: 'M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20V6.5Zm6-2.5v13.5m6-11v13.5',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-18c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9ZM3.5 9h17M3.5 15h17',
  compass: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm3.5-12.5-2 5-5 2 2-5 5-2Z',
  hotel: 'M3 20V8l9-4 9 4v12M3 20h18M8 20v-5h8v5M8 10h.01M12 10h.01M16 10h.01',
  bed: 'M3 19V6m0 8h18v5M3 11h7a2 2 0 0 1 2 2v1M21 14v-2a3 3 0 0 0-3-3h-6M6.5 10.5h.01',
  home: 'M4 11 12 4l8 7v9H4v-9Zm6 9v-6h4v6',
  landmark: 'M3 21h18M5 21V10m14 11V10M9 21V10m6 11V10M3 10h18L12 3 3 10Z',
  museum: 'M3 21h18M4 9h16L12 4 4 9Zm2 0v9m4-9v9m4-9v9m4-9v9M4 18h16',
  temple: 'M3 8h18L12 3 3 8Zm2 0v2h14V8M6 10v9m12-9v9M3 19h18M10 19v-5h4v5',
  mountain: 'm3 19 6.5-11 3.5 6 2.5-4L21 19H3Zm6.5-11 2 3.5',
  beach: 'M3 19c2 1 4 1 6 0s4-1 6 0 4 1 6 0M12 15 7 5m0 0c3-2 7-1 9 2M7 5C5 8 5 11 6.5 13M7 5c3 0 5.5 2 6.5 5',
  nature: 'M12 21v-6m0 0c-4 0-7-3-7-7 4 0 7 3 7 7Zm0 0c4 0 7-3 7-7-4 0-7 3-7 7Zm0-6V3',
  park: 'M12 21v-5M8 16h8l-4-6 3 .5L12 5 9 10.5l3-.5-4 6Zm-5 5h18',
  city: 'M3 21h18M5 21V9l5-3v15m0 0V4h6v17m0-11h3v11',
  water: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z',
  volcano: 'm3 20 5-9h8l5 9H3Zm5-9 1-3m7 3-1-3m-3-4v4',
  // comida e bebida
  food: 'M7 3v8m-3-8v5a3 3 0 0 0 6 0V3M7 11v10M17 21V3c-2 1-3 3.5-3 7h3',
  coffee: 'M4 9h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Zm13 1h1.5a2.5 2.5 0 0 1 0 5H17M8 3v3m4-3v3',
  wine: 'M8 3h8v5a4 4 0 0 1-8 0V3Zm4 9v9m-4 0h8',
  beer: 'M6 7h10v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7Zm10 3h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2M6 7a3 3 0 0 1 5-2.5A3 3 0 0 1 16 7M9.5 11v6m3-6v6',
  // dinheiro
  money: 'M3 7h18v10H3V7Zm9 7.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM6 10v.01M18 14v.01',
  card: 'M3 6h18v12H3V6Zm0 4h18M7 15h3',
  coins: 'M9 10c3.3 0 6-1.1 6-2.5S12.3 5 9 5 3 6.1 3 7.5 5.7 10 9 10Zm-6-2.5v4C3 12.9 5.7 14 9 14s6-1.1 6-2.5M15 11c3.3 0 6 1.1 6 2.5S18.3 16 15 16m-12-4.5v4C3 16.9 5.7 18 9 18c1.2 0 2.3-.1 3.2-.4M21 13.5v4c0 1.4-2.7 2.5-6 2.5-1.2 0-2.3-.1-3.2-.4',
  exchange: 'M4 8h13l-3.5-3.5M20 16H7l3.5 3.5',
  receipt: 'M6 3h12v18l-3-2-3 2-3-2-3 2V3Zm3 5h6m-6 4h6m-6 4h3',
  wallet: 'M4 7h15a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7Zm0 0 12-3v3m-1 7.5h.01',
  tag: 'M3 12V4h8l10 10-8 8L3 12Zm5-4.5h.01',
  savings: 'M5 11a7 6 0 0 1 12-3h2v3l2 1v3h-2l-1.5 3H15v2h-3v-2H9v2H6v-3.5A6 6 0 0 1 5 11Zm9-1h.01',
  // documentos e segurança
  passport: 'M6 3h11a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6V3Zm6 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-3 3.5h6',
  visa: 'M4 5h16v14H4V5Zm3 4h5m-5 3h3m4.5 4L19 12m-3 0h3v3',
  document: 'M7 3h7l4 4v14H7V3Zm7 0v4h4M10 12h5m-5 4h5',
  ticket: 'M3 8V6h18v2a2 2 0 0 0 0 4v2a2 2 0 0 0 0 4v0H3v-2a2 2 0 0 0 0-4V8Zm11-2v12',
  shield: 'M12 21s7-3 7-9V5l-7-2-7 2v7c0 6 7 9 7 9Zm-3-9 2 2 4-4',
  health: 'M12 20s-7-4.3-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.7-7 10-7 10Zm-3-9h2V9h2v2h2v2h-2v2h-2v-2H9v-2Z',
  syringe: 'm17 3 4 4m-2-2-9.5 9.5m3-7.5 4 4M8 13l3 3-4 4-3-3 4-4Zm-4 7-1 1',
  lock: 'M6 11h12v9H6v-9Zm2 0V8a4 4 0 0 1 8 0v3m-4 4v2',
  key: 'M8 15a4 4 0 1 1 3.5-6H21v3h-2v2h-3v-2h-4.5A4 4 0 0 1 8 15Zm-1-4h.01',
  // tempo e clima
  sun: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0-13v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4',
  moon: 'M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z',
  cloud: 'M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 9a4.5 4.5 0 0 0 1 9Z',
  rain: 'M7 14h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 5a4.5 4.5 0 0 0 1 9Zm1 3-1 3m5-3-1 3m5-3-1 3',
  snow: 'M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5 12 6l2.5-1.5M9.5 19.5 12 18l2.5 1.5',
  wind: 'M3 9h11a3 3 0 1 0-3-3M3 15h15a3 3 0 1 1-3 3M3 12h8',
  thermometer: 'M10 13.5V5a2 2 0 0 1 4 0v8.5a4 4 0 1 1-4 0ZM12 17v-6',
  calendar: 'M4 6h16v14H4V6Zm0 4h16M8 3v4m8-4v4M8 14h.01M12 14h.01M16 14h.01',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v4l3 2',
  season: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-18v18M3 12h18',
  // pessoas
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0',
  users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6 9a6 6 0 0 1 12 0m1-9a3 3 0 1 0-1-5.8M18 20a5 5 0 0 0-3-4.6',
  family: 'M8 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm8 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM4 21v-7a4 4 0 0 1 8 0m0 0v7m0-7a4 4 0 0 1 8 0v7m-8-3a2 2 0 1 0 0-4',
  heart: 'M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z',
  // ações e estados
  check: 'm5 12.5 4.5 4.5L19 7.5',
  'check-circle': 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-4-9 3 3 5-6',
  x: 'M6 6l12 12M18 6 6 18',
  'x-circle': 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-3-12 6 6m0-6-6 6',
  alert: 'M12 4 2.5 20h19L12 4Zm0 6v4m0 3h.01',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-10v6m0-9h.01',
  help: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-2.5-11.5A2.5 2.5 0 1 1 13 12c-.6.3-1 .8-1 1.5M12 17h.01',
  star: 'm12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5Z',
  spark: 'M12 3v4m0 10v4M3 12h4m10 0h4M7 7l1.5 1.5m7 7L17 17M7 17l1.5-1.5m7-7L17 7',
  brain: 'M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 3 3h1V4H9Zm6 0a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-3 3h-1V4h1Z',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-4a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-4a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  scale: 'M12 4v16m-7 0h14M5 8h14M5 8l-2.5 6a3 3 0 0 0 5 0L5 8Zm14 0-2.5 6a3 3 0 0 0 5 0L19 8Z',
  search: 'M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Zm5.3-2.2L21 21',
  menu: 'M4 7h16M4 12h16M4 17h16',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  'arrow-right': 'M5 12h14m-5-5 5 5-5 5',
  'arrow-left': 'M19 12H5m5-5-5 5 5 5',
  'arrow-up': 'M12 19V5m-5 5 5-5 5 5',
  external: 'M14 4h6v6m0-6-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5',
  link: 'M10 14a4 4 0 0 0 6 .5l3-3a4 4 0 0 0-5.7-5.7l-1.3 1.3M14 10a4 4 0 0 0-6-.5l-3 3a4 4 0 0 0 5.7 5.7l1.3-1.3',
  share: 'M12 15V3m-4 4 4-4 4 4M5 12v8h14v-8',
  download: 'M12 3v12m-4-4 4 4 4-4M5 20h14',
  save: 'M5 3h11l3 3v15H5V3Zm3 0v5h7V3M8 21v-7h8v7',
  refresh: 'M20 11a8 8 0 0 0-14.5-4.5L4 8m0-5v5h5M4 13a8 8 0 0 0 14.5 4.5L20 16m0 5v-5h-5',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7.4-1.5 1.6 1-2 3.5-1.8-.6a7 7 0 0 1-2.2 1.3L14.5 21h-5l-.5-2.3A7 7 0 0 1 6.8 17.4l-1.8.6-2-3.5 1.6-1a7 7 0 0 1 0-2.9L3 9.5 5 6l1.8.6A7 7 0 0 1 9 5.3L9.5 3h5l.5 2.3a7 7 0 0 1 2.2 1.3L19 6l2 3.5-1.6 1a7 7 0 0 1 0 3Z',
  filter: 'M4 5h16l-6 8v6l-4-2v-4L4 5Z',
  sliders: 'M4 6h10m4 0h2M4 12h4m4 0h8M4 18h12m4 0h0M14 4v4M8 10v4m8 2v4',
  list: 'M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01',
  grid: 'M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z',
  layers: 'm12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5',
  bell: 'M6 16V11a6 6 0 0 1 12 0v5l2 2H4l2-2Zm4 4a2 2 0 0 0 4 0',
  wifi: 'M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.5 16a5 5 0 0 1 7 0M12 19.5h.01',
  'wifi-off': 'M3 3l18 18M8.5 16a5 5 0 0 1 7 0M5.5 12.5a9.4 9.4 0 0 1 4-2.2m5 0a9.4 9.4 0 0 1 4 2.2M2.5 9a14 14 0 0 1 4.4-2.8m4.1-.7A14 14 0 0 1 21.5 9M12 19.5h.01',
  phone: 'M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm3 15h2',
  camera: 'M4 8h3l2-3h6l2 3h3v11H4V8Zm8 8.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z',
  backpack: 'M8 6V5a4 4 0 0 1 8 0v1M6 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12H6V8Zm3 6h6v6M9 10h6',
  suitcase: 'M5 7h14v13H5V7Zm4 0V4h6v3M9 7v13m6-13v13',
  shopping: 'M5 8h14l-1 13H6L5 8Zm4 2V6a3 3 0 0 1 6 0v4',
  gift: 'M4 9h16v4H4V9Zm1 4h14v8H5v-8Zm7-4v12M12 9s-1-5-4-5a2 2 0 0 0 0 4c2 0 4 1 4 1Zm0 0s1-5 4-5a2 2 0 0 1 0 4c-2 0-4 1-4 1Z',
  chat: 'M4 5h16v11H9l-5 4V5Zm4 5h.01M12 10h.01M16 10h.01',
  mail: 'M3 6h18v12H3V6Zm0 0 9 7 9-7',
  eye: 'M2.5 12S6 5 12 5s9.5 7 9.5 7S18 19 12 19 2.5 12 2.5 12Zm9.5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  trash: 'M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3',
  edit: 'M4 20h4L19 9l-4-4L4 16v4Zm9-13 4 4',
  copy: 'M8 8h12v12H8V8Zm-4 8V4h12',
  chevron: 'm9 6 6 6-6 6',
  'chevron-down': 'm6 9 6 6 6-6',
  dot: 'M12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
  flag: 'M5 21V4m0 0h11l-2 4 2 4H5',
  signal: 'M4 20v-3m5 3v-7m5 7V9m5 11V4',
  animal: 'M7 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM4.5 14a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Zm15 0a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6ZM12 12c-3 0-5 4-5 6a2 2 0 0 0 2 2c1 0 2-.5 3-.5s2 .5 3 .5a2 2 0 0 0 2-2c0-2-2-6-5-6Z',
  music: 'M9 18V5l11-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm11-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  theater: 'M4 4h9v7a4.5 4.5 0 0 1-9 0V4Zm7 9.5V9h9v7a4.5 4.5 0 0 1-9 .5ZM7 8h.01M10 8h.01M14 13h.01m3 0h.01',
  sport: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM5.5 6c3 2 4 5 4 6s-1 4-4 6m13-12c-3 2-4 5-4 6s1 4 4 6',
  smoke: 'M3 15h14v3H3v-3Zm17 0v3m-3-9a3 3 0 0 0-3-3m6 3a6 6 0 0 0-6-6',
  sos: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-5a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-6.4 2.4 3.6-3.6m5.6 0 3.6 3.6m0-12.8-3.6 3.6m-5.6 0L5.6 5.6',
  upload: 'M12 21V9m-4 4 4-4 4 4M5 4h14',
};

// Emoji legado → nome do glifo. Cobre os ~250 emojis usados nos dados existentes.
const E = {
  '✈': 'plane', '🛫': 'plane-up', '🛬': 'plane-down', '🚆': 'train', '🚄': 'train', '🚂': 'train', '🚊': 'train', '🚇': 'metro',
  '🚌': 'bus', '🚍': 'bus', '🚐': 'bus', '🚏': 'bus', '🚗': 'car', '🚙': 'car', '🛣': 'route', '🚕': 'taxi', '🚖': 'taxi', '🛺': 'taxi', '🛵': 'bike', '🚲': 'bike',
  '🚢': 'ship', '⛴': 'ship', '🛳': 'ship', '🛶': 'ship', '🚶': 'walk', '🧗': 'mountain', '⛽': 'fuel', '🧭': 'compass', '🗺': 'map', '📍': 'pin',
  '🌍': 'globe', '🌎': 'globe', '🌏': 'globe', '🏨': 'hotel', '🛏': 'bed', '🏠': 'home', '🏘': 'home', '🏛': 'landmark', '🏺': 'museum', '🗿': 'museum',
  '⛪': 'temple', '🕌': 'temple', '☪': 'temple', '🏯': 'temple', '🏰': 'landmark', '🗼': 'landmark', '🕯': 'temple',
  '🏔': 'mountain', '⛰': 'mountain', '🏞': 'park', '🌋': 'volcano', '🏜': 'sun', '🏝': 'beach', '🏖': 'beach', '🌊': 'water', '💧': 'water', '🤿': 'water', '🏄': 'water',
  '🌳': 'park', '🌲': 'park', '🌴': 'beach', '🌿': 'nature', '🌸': 'nature', '🌷': 'nature', '🏙': 'city', '🌃': 'city', '🌉': 'city', '🌆': 'city',
  '🍴': 'food', '🍽': 'food', '🥘': 'food', '🍲': 'food', '🍜': 'food', '🍝': 'food', '🍣': 'food', '🍤': 'food', '🥟': 'food', '🥩': 'food', '🍔': 'food', '🍟': 'food',
  '🌭': 'food', '🥖': 'food', '🍞': 'food', '🍰': 'food', '🍫': 'food', '🍯': 'food', '🍇': 'food', '🥥': 'food', '🥢': 'food', '🥤': 'coffee', '☕': 'coffee',
  '🍷': 'wine', '🍹': 'wine', '🥃': 'wine', '🍺': 'beer', '🍻': 'beer',
  '💵': 'money', '💴': 'money', '💷': 'money', '💸': 'money', '💰': 'coins', '🪙': 'coins', '💳': 'card', '💱': 'exchange', '🧾': 'receipt', '🏷': 'tag',
  '🛂': 'passport', '📋': 'document', '📝': 'document', '📄': 'document', '🎫': 'ticket', '🎟': 'ticket', '🛡': 'shield', '🏥': 'health', '💊': 'health', '🦠': 'health',
  '💉': 'syringe', '🔒': 'lock', '🔑': 'key', '☀': 'sun', '🌤': 'sun', '⛅': 'cloud', '🌅': 'sun', '🌙': 'moon', '☾': 'moon', '🌌': 'moon', '🌧': 'rain', '☔': 'rain',
  '❄': 'snow', '⛷': 'snow', '🌬': 'wind', '🌪': 'wind', '🔥': 'thermometer', '♨': 'thermometer', '📅': 'calendar', '⏰': 'clock', '⌚': 'clock',
  '👤': 'user', '👥': 'users', '👨': 'user', '👩': 'user', '👧': 'user', '💞': 'heart', '♥': 'heart', '♡': 'heart', '❤': 'heart', '🤝': 'users',
  '✅': 'check-circle', '✓': 'check', '✔': 'check', '✕': 'x', '❌': 'x-circle', '⛔': 'x-circle', '⚠': 'alert', '🟡': 'alert', '🚨': 'alert', 'ℹ': 'info', '💡': 'info', '🤔': 'help',
  '⭐': 'star', '★': 'star', '✨': 'spark', '🧠': 'brain', '🎯': 'target', '⚖': 'scale', '🔍': 'search', '🔎': 'search', '☰': 'menu', '➕': 'plus',
  '➡': 'arrow-right', '→': 'arrow-right', '⬆': 'arrow-up', '↗': 'external', '🔗': 'link', '📤': 'share', '💾': 'save', '🔄': 'refresh', '↻': 'refresh', '⚙': 'settings',
  '🔔': 'bell', '📶': 'wifi', '📵': 'wifi-off', '📱': 'phone', '📸': 'camera', '🎒': 'backpack', '🧳': 'suitcase', '🛍': 'shopping', '👜': 'shopping', '👗': 'shopping',
  '👔': 'shopping', '🧥': 'shopping', '🎁': 'gift', '💬': 'chat', '✉': 'mail', '👀': 'eye', '🤫': 'eye', '👍': 'check', '👏': 'star', '🛋': 'home', '😌': 'heart',
  '🎭': 'theater', '🎵': 'music', '🎼': 'music', '🎡': 'park', '🎢': 'park', '🎰': 'spark', '🎈': 'spark', '🎅': 'gift', '🏏': 'sport', '🪂': 'mountain',
  '🦁': 'animal', '🦍': 'animal', '🦌': 'animal', '🐢': 'animal', '🐘': 'animal', '🐎': 'animal', '🦥': 'animal', '🦘': 'animal', '🦓': 'animal', '🦒': 'animal',
  '🦏': 'animal', '🐺': 'animal', '🐷': 'animal', '🐟': 'animal', '🐒': 'animal', '🚭': 'smoke', '🛟': 'sos', '🛁': 'bed', '🌐': 'globe', '🏁': 'flag', '📊': 'signal',
};

const limpa = (e) => String(e || '').replace(/[️‍]/g, '').trim();

/** Resolve o nome do glifo para um emoji legado (ou null). */
export function iconeDoEmoji(emoji) {
  const e = limpa(emoji);
  if (!e) return null;
  if (E[e]) return E[e];
  const primeiro = Array.from(e)[0];
  return E[primeiro] || null;
}

/** Remove emojis (pictográficos) de um texto vindo de dados legados. */
export function semEmoji(texto) {
  return String(texto ?? '')
    .replace(/[\p{Extended_Pictographic}️‍]/gu, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function Icon({ name, emoji, size = 18, className = '', strokeWidth = 1.75, title }) {
  const nome = name || iconeDoEmoji(emoji) || 'dot';
  const d = P[nome] || P.dot;
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      className={`inline-block shrink-0 align-[-0.15em] ${className}`}
      aria-hidden={title ? undefined : true} role={title ? 'img' : undefined}
    >
      {title && <title>{title}</title>}
      <path d={d} />
    </svg>
  );
}

export const ICONES = Object.keys(P);
