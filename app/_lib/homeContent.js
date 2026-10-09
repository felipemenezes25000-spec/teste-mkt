// Conteúdo editorial da Home por idioma. Separa do _lib/i18n.js (que tem strings
// curtas chave→valor) porque aqui são arrays/listas. Cada bloco tem o mesmo
// formato em pt/en/es/ja para o renderizador iterar sem branching de idioma.
//
// Para adicionar idioma novo: copie a chave pt, traduza valores. Faltando → cai pra pt.

export const HOME_PROBLEMAS = {
  pt: [
    { icon: '🗂️', txt: '17 abas abertas comparando Booking, Skyscanner, blog, YouTube e Reddit — e ainda na dúvida.' },
    { icon: '📉', txt: 'O preço da vitrine muda toda hora. Quando você reserva, já não é mais aquele.' },
    { icon: '🎬', txt: 'O vídeo do TikTok romantizou — mas escondeu chuva, distância e fila.' },
    { icon: '🛏️', txt: 'Hotel "bem localizado" fica 40 minutos do centro e vira taxa de Uber.' },
    { icon: '🛬', txt: 'Voo barato chega 03h40 da manhã. O primeiro dia já começou perdendo.' },
    { icon: '🗺️', txt: 'Roteiro de Pinterest tem 12 pontos por dia. Você consegue viver 4.' },
    { icon: '💸', txt: 'Custos invisíveis (eSIM, seguro, passeio, bagagem) aparecem só no balcão.' },
  ],
  en: [
    { icon: '🗂️', txt: '17 tabs open comparing Booking, Skyscanner, blog, YouTube and Reddit — and still unsure.' },
    { icon: '📉', txt: 'Sticker price changes constantly. By the time you book, it\'s not that price anymore.' },
    { icon: '🎬', txt: 'TikTok romanticized it — but hid the rain, the distance and the queue.' },
    { icon: '🛏️', txt: '"Well-located" hotel is 40 min from downtown and becomes an Uber tab.' },
    { icon: '🛬', txt: 'Cheap flight lands at 3:40 AM. Day one is already lost.' },
    { icon: '🗺️', txt: 'Pinterest itinerary has 12 stops a day. You can actually live 4.' },
    { icon: '💸', txt: 'Hidden costs (eSIM, insurance, tour, baggage) only show up at the counter.' },
  ],
  es: [
    { icon: '🗂️', txt: '17 pestañas abiertas comparando Booking, Skyscanner, blogs, YouTube y Reddit — y aún en duda.' },
    { icon: '📉', txt: 'El precio de vitrina cambia todo el tiempo. Cuando reservas, ya no es ese precio.' },
    { icon: '🎬', txt: 'El video de TikTok romantizó — pero escondió la lluvia, la distancia y la fila.' },
    { icon: '🛏️', txt: 'Hotel "bien ubicado" queda a 40 min del centro y se vuelve gasto de Uber.' },
    { icon: '🛬', txt: 'Vuelo barato llega 03:40 de la madrugada. El primer día ya empezó perdido.' },
    { icon: '🗺️', txt: 'Itinerario de Pinterest tiene 12 puntos por día. Tú vives 4.' },
    { icon: '💸', txt: 'Costes invisibles (eSIM, seguro, tour, equipaje) aparecen solo en el mostrador.' },
  ],
  ja: [
    { icon: '🗂️', txt: 'Booking、Skyscanner、ブログ、YouTube、Redditを比較するタブが17個 — それでも決まらない。' },
    { icon: '📉', txt: '表示価格は常に変わる。予約する頃にはその価格ではない。' },
    { icon: '🎬', txt: 'TikTokは美化した — 雨、距離、行列を隠した。' },
    { icon: '🛏️', txt: '「立地良好」のホテルは中心から40分。Uber代になる。' },
    { icon: '🛬', txt: '安いフライトは午前3時40分着。初日はすでに失敗している。' },
    { icon: '🗺️', txt: 'Pinterestの旅程は1日12スポット。実際にこなせるのは4つ。' },
    { icon: '💸', txt: '見えない費用（eSIM、保険、ツアー、荷物）はカウンターで初めて現れる。' },
  ],
};

export const HOME_FATORES = {
  pt: [
    { titulo: 'Custo real', txt: 'Voo, hotel, comida, transporte, seguro, eSIM, visto, passeios e contingência — não só voo+hotel.' },
    { titulo: 'Clima', txt: 'Cruza melhor época com o mês escolhido. Se não fecha, sugere janela alternativa.' },
    { titulo: 'Visto', txt: 'Passaporte brasileiro: dias permitidos, tipo de visto e fila. Sem surpresa no check-in.' },
    { titulo: 'Segurança', txt: 'Índice por país e cidade. Reduz score quando há alerta consular real.' },
    { titulo: 'Cansaço', txt: 'Voo longo + escala ruim + horário de chegada penalizam o primeiro dia.' },
    { titulo: 'Ritmo', txt: 'Você tem 7 dias ou 21? O ranking muda — Tailândia raramente vence em 6 dias.' },
    { titulo: 'Perfil', txt: 'Casal, família, mochilão, solo — pesos diferentes para conforto, segurança e cultura.' },
    { titulo: 'Orçamento', txt: 'O destino só entra no top 3 se o custo total cabe — não só o voo.' },
  ],
  en: [
    { titulo: 'Real cost', txt: 'Flight, hotel, food, transport, insurance, eSIM, visa, tours and contingency — not just flight+hotel.' },
    { titulo: 'Weather', txt: 'Crosses best season with your month. If it doesn\'t fit, suggests an alternative window.' },
    { titulo: 'Visa', txt: 'Brazilian passport: allowed days, visa type and queue. No surprises at check-in.' },
    { titulo: 'Safety', txt: 'Index per country and city. Reduces score when there\'s a real consular alert.' },
    { titulo: 'Fatigue', txt: 'Long flight + bad layover + arrival hour penalize day one.' },
    { titulo: 'Pace', txt: 'Got 7 days or 21? The ranking changes — Thailand rarely wins in 6 days.' },
    { titulo: 'Profile', titulo_alt: 'Profile', txt: 'Couple, family, backpack, solo — different weights for comfort, safety and culture.' },
    { titulo: 'Budget', txt: 'A destination only makes top 3 if the total cost fits — not just the flight.' },
  ],
  es: [
    { titulo: 'Coste real', txt: 'Vuelo, hotel, comida, transporte, seguro, eSIM, visa, tours y contingencia — no solo vuelo+hotel.' },
    { titulo: 'Clima', txt: 'Cruza mejor época con tu mes. Si no encaja, sugiere ventana alternativa.' },
    { titulo: 'Visa', txt: 'Pasaporte brasileño: días permitidos, tipo de visa y fila. Sin sorpresas en el check-in.' },
    { titulo: 'Seguridad', txt: 'Índice por país y ciudad. Reduce score cuando hay alerta consular real.' },
    { titulo: 'Cansancio', txt: 'Vuelo largo + escala mala + hora de llegada penalizan el primer día.' },
    { titulo: 'Ritmo', txt: '¿Tienes 7 días o 21? El ranking cambia — Tailandia rara vez gana en 6 días.' },
    { titulo: 'Perfil', txt: 'Pareja, familia, mochila, solo — pesos diferentes para confort, seguridad y cultura.' },
    { titulo: 'Presupuesto', txt: 'El destino solo entra al top 3 si el coste total cabe — no solo el vuelo.' },
  ],
  ja: [
    { titulo: '実費', txt: '航空券、ホテル、食事、交通、保険、eSIM、ビザ、ツアー、予備費 — 航空券+ホテルだけではない。' },
    { titulo: '気候', txt: 'ベストシーズンと選んだ月を照合。合わない場合は代替時期を提案。' },
    { titulo: 'ビザ', txt: 'ブラジルパスポート: 許可日数、ビザの種類、待ち行列。チェックインで驚かない。' },
    { titulo: '安全', txt: '国・都市別の指標。実際の領事館警告でスコアが下がる。' },
    { titulo: '疲労', txt: '長距離フライト + 悪い経由 + 到着時刻が初日を台無しにする。' },
    { titulo: 'ペース', txt: '7日か21日か? ランキングが変わる — タイは6日では滅多に勝てない。' },
    { titulo: 'プロフィール', txt: 'カップル、家族、バックパック、ソロ — 快適、安全、文化への重みが異なる。' },
    { titulo: '予算', txt: '目的地は総費用が収まる場合のみトップ3入り — 航空券だけではない。' },
  ],
};

export const HOME_COMPARACAO = {
  pt: [
    { rotulo: 'Booking', papel: 'Vende hospedagem.', frase: 'Te mostra 200 hotéis sem dizer se aquele destino faz sentido pra você.' },
    { rotulo: 'Airbnb', papel: 'Vende estadia.', frase: 'Te dá o quarto. Não te dá o roteiro nem o custo do dia.' },
    { rotulo: 'Expedia / Decolar', papel: 'Vende pacote.', frase: 'Otimiza margem do pacote. Não otimiza a sua viagem.' },
    { rotulo: 'Google Flights', papel: 'Mostra voo.', frase: 'É excelente em preço de voo. Não fala de chegada, conexão ou primeiro dia.' },
    { rotulo: 'Mundo Sem Fim', papel: 'Decide antes da compra.', frase: 'Não vende a reserva. Diz se vale comprar — e o quanto a viagem inteira custa.', destaque: true },
  ],
  en: [
    { rotulo: 'Booking', papel: 'Sells lodging.', frase: 'Shows you 200 hotels without telling you if that destination makes sense for you.' },
    { rotulo: 'Airbnb', papel: 'Sells stay.', frase: 'Gives you the room. Doesn\'t give you the itinerary or the daily cost.' },
    { rotulo: 'Expedia', papel: 'Sells package.', frase: 'Optimizes package margin. Doesn\'t optimize your trip.' },
    { rotulo: 'Google Flights', papel: 'Shows flights.', frase: 'Excellent at flight price. Doesn\'t talk about arrival, layover or day one.' },
    { rotulo: 'Mundo Sem Fim', papel: 'Decides before the purchase.', frase: 'Doesn\'t sell the booking. Tells you if buying is worth it — and what the whole trip costs.', destaque: true },
  ],
  es: [
    { rotulo: 'Booking', papel: 'Vende alojamiento.', frase: 'Te muestra 200 hoteles sin decirte si ese destino tiene sentido para ti.' },
    { rotulo: 'Airbnb', papel: 'Vende estancia.', frase: 'Te da el cuarto. No te da el itinerario ni el coste del día.' },
    { rotulo: 'Expedia', papel: 'Vende paquete.', frase: 'Optimiza margen del paquete. No optimiza tu viaje.' },
    { rotulo: 'Google Flights', papel: 'Muestra vuelo.', frase: 'Excelente en precio de vuelo. No habla de llegada, escala o primer día.' },
    { rotulo: 'Mundo Sem Fim', papel: 'Decide antes de comprar.', frase: 'No vende la reserva. Dice si vale comprar — y cuánto cuesta el viaje entero.', destaque: true },
  ],
  ja: [
    { rotulo: 'Booking', papel: '宿泊を売る。', frase: '200のホテルを見せるが、その目的地があなたに合うかは言わない。' },
    { rotulo: 'Airbnb', papel: '滞在を売る。', frase: '部屋は渡す。旅程も日々の費用も渡さない。' },
    { rotulo: 'Expedia', papel: 'パッケージを売る。', frase: 'パッケージの利益を最適化。あなたの旅は最適化しない。' },
    { rotulo: 'Google Flights', papel: 'フライトを見せる。', frase: 'フライト価格は優秀。到着、経由、初日については話さない。' },
    { rotulo: 'Mundo Sem Fim', papel: '購入前に決定する。', frase: '予約を売らない。買う価値があるか — 旅全体がいくらかかるかを伝える。', destaque: true },
  ],
};

export const HOME_FAQ = {
  pt: [
    { q: 'Isso substitui o Booking ou o Airbnb?', a: 'Não. O Mundo Sem Fim é a camada que vem antes. A gente decide se vale ir e quanto a viagem inteira custa. Depois você reserva onde quiser. Alguns links de parceiros podem nos pagar comissão — e ela nunca entra no ranking nem muda a recomendação.' },
    { q: 'Os preços são exatos?', a: 'Não. São estimativas calibradas por país, perfil e mês, a partir de pesquisa de referência (jun/2026), câmbio do dia com fonte e horário, e regras de visto compiladas — cada número mostra se é estimativa, histórico ou ao vivo. A função é evitar surpresa, não substituir o orçamento real da reserva.' },
    { q: 'Como vocês calculam o custo real?', a: 'Voo (estimativa por rota e mês — não é cotação) + hospedagem por perfil + alimentação por padrão (mochila/médio/conforto) + transporte local + seguro viagem + eSIM + visto + passeios médios + 10% de contingência. A página /custo-real mostra item por item.' },
    { q: 'Posso usar para viagem de casal, família ou mochilão?', a: 'Sim. O perfil muda os pesos do score: conforto pesa mais em família, custo pesa mais em mochilão, segurança pesa mais em solo. Você troca o perfil em /decisao a qualquer momento.' },
    { q: 'O que tem no plano grátis?', a: 'Descobrir destinos pelo perfil, comparar 3 favoritos, planejar rota com estação × visto × fôlego, câmbio ao vivo. Sem cartão.' },
    { q: 'Qual a diferença pro Premium?', a: 'Premium: testar quantas versões da viagem quiser, custo real completo, alertas de preço de voo, exportar PDF. Pro: rota multi-país com cansaço otimizado, colaboração e suporte prioritário.' },
    { q: 'Funciona para viagem internacional e mochilão?', a: 'Sim. 205 países no catálogo, com visto pra passaporte BR. Mochilão tem perfil dedicado (custo, conforto) e funciona melhor com 14+ dias.' },
    { q: 'Vocês vendem passagem?', a: 'Não. Por isso o conselho é neutro. Quando achamos que não vale comprar agora, a gente fala — uma OTA jamais diria isso.' },
  ],
  en: [
    { q: 'Does this replace Booking or Airbnb?', a: 'No. Mundo Sem Fim is the layer that comes before. We decide if it\'s worth going and how much the whole trip costs. Then you book wherever you want — some partner links may pay us a commission, which never affects the ranking.' },
    { q: 'Are the prices exact?', a: 'No. They are estimates calibrated by country, profile and month, with public sources (Brazilian Central Bank exchange, visa data, average daily cost). The function is to avoid surprises, not replace the real booking budget.' },
    { q: 'How do you calculate the real cost?', a: 'Flight (quoted per route and month) + lodging by profile + food by standard (backpack/medium/comfort) + local transport + travel insurance + eSIM + visa + average tours + 10% contingency. The /custo-real page shows item by item.' },
    { q: 'Can I use it for couple, family or backpacking trips?', a: 'Yes. The profile changes the score weights: comfort weighs more in family, cost weighs more in backpacking, safety weighs more solo. You change the profile in /decisao at any time.' },
    { q: 'What\'s in the free plan?', a: 'Discover destinations by profile, compare 3 favorites, plan a route with season × visa × budget, live exchange rate. No credit card.' },
    { q: 'What\'s different in Premium?', a: 'Premium: test as many trip versions as you want, full real cost, flight price alerts, export PDF. Pro: multi-country route with optimized fatigue, collaboration and priority support.' },
    { q: 'Does it work for international travel and backpacking?', a: 'Yes. 205 countries in the catalog, with visa info for Brazilian passport. Backpacking has a dedicated profile (cost, comfort) and works better with 14+ days.' },
    { q: 'Do you sell tickets?', a: 'No. That\'s why advice is neutral. When we think it\'s not worth buying now, we say it — an OTA would never say that.' },
  ],
  es: [
    { q: '¿Esto reemplaza a Booking o Airbnb?', a: 'No. Mundo Sem Fim es la capa que viene antes. Nosotros decidimos si vale la pena ir y cuánto cuesta el viaje entero. Después reservas donde quieras — algunos enlaces de socios pueden pagarnos comisión, que nunca cambia el ranking.' },
    { q: '¿Los precios son exactos?', a: 'No. Son estimaciones calibradas por país, perfil y mes, con fuentes públicas (tipo de cambio BCB, datos de visa, coste medio diario). La función es evitar sorpresas, no sustituir el presupuesto real de la reserva.' },
    { q: '¿Cómo calculan el coste real?', a: 'Vuelo (cotizado por ruta y mes) + alojamiento por perfil + comida por estándar (mochila/medio/confort) + transporte local + seguro de viaje + eSIM + visa + tours promedio + 10% contingencia. La página /custo-real muestra ítem por ítem.' },
    { q: '¿Puedo usarlo para viaje de pareja, familia o mochila?', a: 'Sí. El perfil cambia los pesos del score: confort pesa más en familia, coste pesa más en mochila, seguridad pesa más solo. Cambias el perfil en /decisao en cualquier momento.' },
    { q: '¿Qué tiene el plan gratis?', a: 'Descubrir destinos por perfil, comparar 3 favoritos, planificar ruta con estación × visa × dinero, tipo de cambio en vivo. Sin tarjeta.' },
    { q: '¿Cuál es la diferencia con Premium?', a: 'Premium: probar cuantas versiones del viaje quieras, coste real completo, alertas de precio de vuelo, exportar PDF. Pro: ruta multi-país con cansancio optimizado, colaboración y soporte prioritario.' },
    { q: '¿Funciona para viaje internacional y mochila?', a: 'Sí. 205 países en el catálogo, con visa para pasaporte BR. Mochila tiene perfil dedicado (coste, confort) y funciona mejor con 14+ días.' },
    { q: '¿Venden pasajes?', a: 'No. Por eso el consejo es neutral. Cuando creemos que no vale comprar ahora, lo decimos — una OTA jamás lo diría.' },
  ],
  ja: [
    { q: 'これは Booking や Airbnb の代替ですか?', a: 'いいえ。Mundo Sem Fim はその前に来るレイヤーです。行く価値があるか、旅全体の費用がいくらかを決めます。その後、好きな場所で予約してください — ホテルからの手数料はありません。' },
    { q: '価格は正確ですか?', a: 'いいえ。国、プロフィール、月ごとに調整された見積もりで、公開ソース（ブラジル中央銀行為替、ビザデータ、平均日額費用）を使用します。目的は予約の実際の予算の代わりではなく、驚きを避けることです。' },
    { q: '実費はどう計算しますか?', a: '航空券（ルートと月ごとに見積もり） + プロフィール別宿泊 + 標準的食事（バックパック/中/快適） + 現地交通 + 旅行保険 + eSIM + ビザ + 平均ツアー + 10%予備費。/custo-real ページで項目別に表示。' },
    { q: 'カップル、家族、バックパック旅行に使えますか?', a: 'はい。プロフィールでスコアの重みが変わります: 家族では快適、バックパックでは費用、ソロでは安全が重視されます。/decisao でいつでもプロフィールを変更できます。' },
    { q: '無料プランには何がありますか?', a: 'プロフィールでの目的地発見、お気に入り3つの比較、季節×ビザ×予算でのルート計画、リアルタイム為替。カード不要。' },
    { q: 'Premium との違いは?', a: 'Premium: 旅のバージョンを好きなだけテスト、完全な実費、フライト価格アラート、PDFエクスポート。Pro: 疲労最適化された多国ルート、コラボレーション、優先サポート。' },
    { q: '海外旅行とバックパッキングに使えますか?', a: 'はい。カタログに205か国、ブラジルパスポート向けビザ情報付き。バックパッキング専用プロフィール（費用、快適）あり、14日以上で最適。' },
    { q: 'チケットを販売しますか?', a: 'いいえ。だからアドバイスは中立です。今買う価値がないと考える時はそう言います — OTAなら絶対に言わないことです。' },
  ],
};
