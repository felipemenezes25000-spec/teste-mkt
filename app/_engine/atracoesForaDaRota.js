// "Fora da rota" — pontos turísticos que NÃO são o óbvio do guia (Torre Eiffel,
// Coliseu, Machu Picchu). Bairros periféricos, museus secundários, parques
// menos divulgados, vilarejos próximos, comunidades autênticas. A ideia é dar
// ao viajante o que ele NÃO encontra no Tripadvisor da primeira página.
//
// Formato: { nome, wiki, cidade, fora: true } — `fora` marca pra UI mostrar
// um chip "Fora da rota" diferenciando do mainstream.
//
// Cada um tem `wiki` válido em pt OU en — o resumoClient cai automaticamente
// pra en, então sempre vai trazer história.
//
// Curadoria: top 30 destinos brasileiros + locais menos óbvios mas marcantes.

export const FORA_DA_ROTA = {
  // ─── ITÁLIA ───
  IT: [
    { nome: 'Matera (Sassi)', wiki: 'Matera', cidade: 'Basilicata', fora: true },
    { nome: 'Alberobello (trulli)', wiki: 'Alberobello', cidade: 'Apúlia', fora: true },
    { nome: 'Civita di Bagnoregio', wiki: 'Civita di Bagnoregio', cidade: 'Viterbo', fora: true },
    { nome: 'Costiera Amalfitana fora de Positano', wiki: 'Costa Amalfitana', cidade: 'Salerno', fora: true },
    { nome: 'Bairro Trastevere', wiki: 'Trastevere', cidade: 'Roma', fora: true },
    { nome: 'Bairro Oltrarno', wiki: 'Oltrarno', cidade: 'Florença', fora: true },
    { nome: 'Ilha de Procida', wiki: 'Prócida', cidade: 'Nápoles', fora: true },
  ],
  // ─── FRANÇA ───
  FR: [
    { nome: 'Bairro Le Marais (judeu+queer)', wiki: 'Le Marais', cidade: 'Paris', fora: true },
    { nome: 'Bairro Belleville', wiki: 'Belleville (Paris)', cidade: 'Paris', fora: true },
    { nome: 'Canal Saint-Martin', wiki: 'Canal Saint-Martin', cidade: 'Paris', fora: true },
    { nome: 'Vilarejo de Eguisheim (Alsácia)', wiki: 'Eguisheim', cidade: 'Alsácia', fora: true },
    { nome: 'Gargantas do Verdon', wiki: 'Gargantas do Verdon', cidade: 'Provença', fora: true },
    { nome: 'Calanques de Marselha', wiki: 'Parque Nacional dos Calanques', cidade: 'Marselha', fora: true },
    { nome: 'Vilarejo de Rocamadour', wiki: 'Rocamadour', cidade: 'Lot', fora: true },
  ],
  // ─── ESPANHA ───
  ES: [
    { nome: 'Bairro El Albayzín (Granada)', wiki: 'Albaicín', cidade: 'Granada', fora: true },
    { nome: 'Cabo de Gata-Níjar', wiki: 'Cabo de Gata-Níjar', cidade: 'Almería', fora: true },
    { nome: 'Bairro Triana (Sevilha)', wiki: 'Triana (Sevilha)', cidade: 'Sevilha', fora: true },
    { nome: 'Vilarejo de Ronda', wiki: 'Ronda (Espanha)', cidade: 'Málaga', fora: true },
    { nome: 'Ilhas Cíes (Galícia)', wiki: 'Ilhas Cíes', cidade: 'Vigo', fora: true },
    { nome: 'Bairro Gràcia (Barcelona)', wiki: 'Gràcia', cidade: 'Barcelona', fora: true },
  ],
  // ─── PORTUGAL ───
  PT: [
    { nome: 'Aldeia do Piódão', wiki: 'Piódão', cidade: 'Beira Litoral', fora: true },
    { nome: 'Vale do Côa (arte rupestre)', wiki: 'Sítio Arqueológico do Vale do Côa', cidade: 'Guarda', fora: true },
    { nome: 'Costa Vicentina', wiki: 'Costa Vicentina', cidade: 'Alentejo', fora: true },
    { nome: 'Ilha do Pico (Açores)', wiki: 'Ilha do Pico', cidade: 'Açores', fora: true },
    { nome: 'Bairro da Mouraria (Lisboa)', wiki: 'Mouraria', cidade: 'Lisboa', fora: true },
    { nome: 'Aldeias do Xisto', wiki: 'Aldeias do Xisto', cidade: 'Centro de Portugal', fora: true },
  ],
  // ─── PERU ───
  PE: [
    { nome: 'Vale Sagrado fora de Ollantaytambo', wiki: 'Vale Sagrado dos Incas', cidade: 'Cusco', fora: true },
    { nome: 'Choquequirao (alternativa ao MP)', wiki: 'Choquequirao', cidade: 'Apurímac', fora: true },
    { nome: 'Huacachina (oásis no deserto)', wiki: 'Huacachina', cidade: 'Ica', fora: true },
    { nome: 'Caral (cidade pré-Inca)', wiki: 'Caral', cidade: 'Lima', fora: true },
    { nome: 'Floresta de Pedras de Marcahuasi', wiki: 'Marcahuasi', cidade: 'Lima', fora: true },
    { nome: 'Bairro Barranco (Lima)', wiki: 'Barranco', cidade: 'Lima', fora: true },
  ],
  // ─── MÉXICO ───
  MX: [
    { nome: 'Bairro Coyoacán (CDMX)', wiki: 'Coyoacán', cidade: 'Cidade do México', fora: true },
    { nome: 'Bairro Roma Norte (CDMX)', wiki: 'Colônia Roma', cidade: 'Cidade do México', fora: true },
    { nome: 'Hierve el Agua', wiki: 'Hierve el Agua', cidade: 'Oaxaca', fora: true },
    { nome: 'Sierra Norte (Pueblos Mancomunados)', wiki: 'Pueblos Mancomunados', cidade: 'Oaxaca', fora: true },
    { nome: 'Bacalar (lagoa 7 cores)', wiki: 'Bacalar', cidade: 'Quintana Roo', fora: true },
    { nome: 'Real de Catorce', wiki: 'Real de Catorce', cidade: 'San Luis Potosí', fora: true },
  ],
  // ─── ARGENTINA ───
  AR: [
    { nome: 'Quebrada de Humahuaca', wiki: 'Quebrada de Humahuaca', cidade: 'Jujuy', fora: true },
    { nome: 'Bairro San Telmo (BA)', wiki: 'San Telmo', cidade: 'Buenos Aires', fora: true },
    { nome: 'Esteros del Iberá', wiki: 'Esteros del Iberá', cidade: 'Corrientes', fora: true },
    { nome: 'Cafayate (vinhos de altitude)', wiki: 'Cafayate', cidade: 'Salta', fora: true },
    { nome: 'Bairro La Boca alternativo', wiki: 'La Boca', cidade: 'Buenos Aires', fora: true },
    { nome: 'Trekking Fitz Roy (El Chaltén)', wiki: 'El Chaltén', cidade: 'Santa Cruz', fora: true },
  ],
  // ─── CHILE ───
  CL: [
    { nome: 'Pucón e Vulcão Villarrica', wiki: 'Pucón', cidade: 'Araucanía', fora: true },
    { nome: 'Bairro Yungay (Santiago)', wiki: 'Yungay (Santiago)', cidade: 'Santiago', fora: true },
    { nome: 'Cajón del Maipo', wiki: 'Cajón del Maipo', cidade: 'Santiago', fora: true },
    { nome: 'Ilha Chiloé', wiki: 'Chiloé', cidade: 'Los Lagos', fora: true },
    { nome: 'Vale do Elqui', wiki: 'Vale do Elqui', cidade: 'Coquimbo', fora: true },
  ],
  // ─── COLÔMBIA ───
  CO: [
    { nome: 'Comuna 13 (Medellín)', wiki: 'Comuna 13', cidade: 'Medellín', fora: true },
    { nome: 'Salento e Vale do Cocora', wiki: 'Salento (Colômbia)', cidade: 'Quindío', fora: true },
    { nome: 'Tatacoa Desert', wiki: 'Deserto da Tatacoa', cidade: 'Huila', fora: true },
    { nome: 'Caño Cristales', wiki: 'Caño Cristales', cidade: 'Meta', fora: true },
    { nome: 'Bairro Getsemaní (Cartagena)', wiki: 'Getsemaní (Cartagena)', cidade: 'Cartagena', fora: true },
  ],
  // ─── EUA ───
  US: [
    { nome: 'Bairro Mission (SF)', wiki: 'Mission District', cidade: 'San Francisco', fora: true },
    { nome: 'Bairro Brooklyn (NY)', wiki: 'Brooklyn', cidade: 'Nova York', fora: true },
    { nome: 'Antelope Canyon', wiki: 'Antelope Canyon', cidade: 'Arizona', fora: true },
    { nome: 'Marfa (Texas, arte)', wiki: 'Marfa (Texas)', cidade: 'Texas', fora: true },
    { nome: 'Vale dos Mortos (Death Valley)', wiki: 'Vale da Morte', cidade: 'Califórnia', fora: true },
    { nome: 'Bairro French Quarter (NOLA)', wiki: 'Bairro Francês', cidade: 'Nova Orleans', fora: true },
    { nome: 'Joshua Tree National Park', wiki: 'Parque Nacional Joshua Tree', cidade: 'Califórnia', fora: true },
  ],
  // ─── JAPÃO ───
  JP: [
    { nome: 'Vilarejo Shirakawa-go', wiki: 'Shirakawa-gō', cidade: 'Gifu', fora: true },
    { nome: 'Naoshima (ilha de arte)', wiki: 'Naoshima', cidade: 'Kagawa', fora: true },
    { nome: 'Bairro Yanaka (Tóquio)', wiki: 'Yanaka', cidade: 'Tóquio', fora: true },
    { nome: 'Trilha Kumano Kodo', wiki: 'Kumano Kodō', cidade: 'Wakayama', fora: true },
    { nome: 'Ilha de Yakushima', wiki: 'Yakushima', cidade: 'Kagoshima', fora: true },
    { nome: 'Bairro Higashiyama (Quioto)', wiki: 'Higashiyama-ku (Quioto)', cidade: 'Quioto', fora: true },
    { nome: 'Cidade de Onomichi', wiki: 'Onomichi', cidade: 'Hiroshima', fora: true },
  ],
  // ─── COREIA DO SUL ───
  KR: [
    { nome: 'Bairro Bukchon Hanok (Seul)', wiki: 'Bukchon Hanok', cidade: 'Seul', fora: true },
    { nome: 'Ilha de Jeju (off Jeju City)', wiki: 'Jeju', cidade: 'Jeju', fora: true },
    { nome: 'Andong (vila tradicional Hahoe)', wiki: 'Hahoe Folk Village', cidade: 'Andong', fora: true },
    { nome: 'Templo Beomeosa (Busan)', wiki: 'Beomeosa', cidade: 'Busan', fora: true },
    { nome: 'Boseong (campos de chá)', wiki: 'Boseong', cidade: 'Jeolla do Sul', fora: true },
  ],
  // ─── TAILÂNDIA ───
  TH: [
    { nome: 'Pai (norte hippie)', wiki: 'Pai (Tailândia)', cidade: 'Mae Hong Son', fora: true },
    { nome: 'Koh Lanta (alternativa a Phi Phi)', wiki: 'Koh Lanta', cidade: 'Krabi', fora: true },
    { nome: 'Sukhothai (capital antiga)', wiki: 'Sukhothai', cidade: 'Sukhothai', fora: true },
    { nome: 'Erawan Falls', wiki: 'Cataratas de Erawan', cidade: 'Kanchanaburi', fora: true },
    { nome: 'Ko Chang', wiki: 'Ko Chang (província de Trat)', cidade: 'Trat', fora: true },
    { nome: 'Khao Sok (selva)', wiki: 'Parque Nacional de Khao Sok', cidade: 'Surat Thani', fora: true },
  ],
  // ─── VIETNÃ ───
  VN: [
    { nome: 'Hà Giang Loop (moto)', wiki: 'Província de Hà Giang', cidade: 'Hà Giang', fora: true },
    { nome: 'Ninh Binh (Halong em terra)', wiki: 'Ninh Binh', cidade: 'Ninh Binh', fora: true },
    { nome: 'Phong Nha-Ke Bang (cavernas)', wiki: 'Parque Nacional de Phong Nha-Ke Bang', cidade: 'Quảng Bình', fora: true },
    { nome: 'Mui Ne (dunas)', wiki: 'Mui Ne', cidade: 'Bình Thuận', fora: true },
    { nome: 'Cantho (Delta do Mekong)', wiki: 'Can Tho', cidade: 'Delta do Mekong', fora: true },
  ],
  // ─── INDONÉSIA ───
  ID: [
    { nome: 'Nusa Penida', wiki: 'Nusa Penida', cidade: 'Bali', fora: true },
    { nome: 'Sidemen (Bali rural)', wiki: 'Sidemen', cidade: 'Bali', fora: true },
    { nome: 'Ilhas Gili Meno e Gili Air', wiki: 'Ilhas Gili', cidade: 'Lombok', fora: true },
    { nome: 'Vulcão Bromo (Java)', wiki: 'Monte Bromo', cidade: 'Java Oriental', fora: true },
    { nome: 'Ilha Komodo', wiki: 'Komodo', cidade: 'Nusa Tenggara Oriental', fora: true },
    { nome: 'Yogyakarta (cultura)', wiki: 'Yogyakarta', cidade: 'Java', fora: true },
  ],
  // ─── ÍNDIA ───
  IN: [
    { nome: 'Hampi (ruínas)', wiki: 'Hampi', cidade: 'Karnataka', fora: true },
    { nome: 'Pushkar', wiki: 'Pushkar', cidade: 'Rajastão', fora: true },
    { nome: 'Bairro Old Delhi (Chandni Chowk)', wiki: 'Chandni Chowk', cidade: 'Délhi', fora: true },
    { nome: 'Backwaters de Kerala', wiki: 'Backwaters de Querala', cidade: 'Querala', fora: true },
    { nome: 'Vale de Spiti', wiki: 'Vale Spiti', cidade: 'Himachal Pradesh', fora: true },
    { nome: 'Cidade Azul de Jodhpur', wiki: 'Jodhpur', cidade: 'Rajastão', fora: true },
  ],
  // ─── TURQUIA ───
  TR: [
    { nome: 'Pamukkale e Hierápolis', wiki: 'Pamukkale', cidade: 'Denizli', fora: true },
    { nome: 'Bairro Kadıköy (Istambul, lado asiático)', wiki: 'Kadıköy', cidade: 'Istambul', fora: true },
    { nome: 'Capadócia além de Göreme (Ihlara)', wiki: 'Vale de Ihlara', cidade: 'Aksaray', fora: true },
    { nome: 'Mardin (cidade de pedra)', wiki: 'Mardin', cidade: 'Mardin', fora: true },
    { nome: 'Antalya old town (Kaleiçi)', wiki: 'Kaleiçi', cidade: 'Antalya', fora: true },
    { nome: 'Bairro Balat (Istambul)', wiki: 'Balat (Istambul)', cidade: 'Istambul', fora: true },
  ],
  // ─── MARROCOS ───
  MA: [
    { nome: 'Vilarejo Azul de Chefchaouen', wiki: 'Chefchaouen', cidade: 'Tánger-Tetuão', fora: true },
    { nome: 'Vale do Ourika', wiki: 'Vale do Ourika', cidade: 'Marraquexe', fora: true },
    { nome: 'Vale do Drâa', wiki: 'Vale do Draa', cidade: 'Sul', fora: true },
    { nome: 'Volubilis (ruínas romanas)', wiki: 'Volubilis', cidade: 'Meknès', fora: true },
    { nome: 'Bairro Habous (Casablanca)', wiki: 'Habous', cidade: 'Casablanca', fora: true },
  ],
  // ─── EGITO ───
  EG: [
    { nome: 'Siwa Oasis', wiki: 'Oásis de Siwa', cidade: 'Matruh', fora: true },
    { nome: 'Vale Branco (Deserto Branco)', wiki: 'Deserto Branco', cidade: 'Farafra', fora: true },
    { nome: 'Marsa Alam (mergulho menos turístico)', wiki: 'Marsa Alam', cidade: 'Mar Vermelho', fora: true },
    { nome: 'Templo de Abu Simbel', wiki: 'Abu Simbel', cidade: 'Aswan', fora: true },
    { nome: 'Coptic Cairo (Cairo cristão)', wiki: 'Cairo Copta', cidade: 'Cairo', fora: true },
  ],
  // ─── ÁFRICA DO SUL ───
  ZA: [
    { nome: 'Bairro Bo-Kaap (Cape Town)', wiki: 'Bo-Kaap', cidade: 'Cape Town', fora: true },
    { nome: 'Hermanus (baleias)', wiki: 'Hermanus', cidade: 'Cabo Ocidental', fora: true },
    { nome: 'Drakensberg', wiki: 'Drakensberg', cidade: 'KwaZulu-Natal', fora: true },
    { nome: 'Cidade de Knysna (Garden Route)', wiki: 'Knysna', cidade: 'Cabo Ocidental', fora: true },
    { nome: 'Soweto (township)', wiki: 'Soweto', cidade: 'Joanesburgo', fora: true },
  ],
  // ─── INGLATERRA / REINO UNIDO ───
  GB: [
    { nome: 'Bairro Shoreditch (Londres)', wiki: 'Shoreditch', cidade: 'Londres', fora: true },
    { nome: 'Lake District', wiki: 'Lake District', cidade: 'Cumbria', fora: true },
    { nome: 'Bath (cidade romana)', wiki: 'Bath', cidade: 'Somerset', fora: true },
    { nome: 'Isle of Skye (Escócia)', wiki: 'Ilha de Skye', cidade: 'Escócia', fora: true },
    { nome: 'Costa da Cornualha (St Ives)', wiki: 'St Ives (Cornualha)', cidade: 'Cornualha', fora: true },
    { nome: 'Edimburgo (Old Town fora do Royal Mile)', wiki: 'Edimburgo', cidade: 'Edimburgo', fora: true },
  ],
  // ─── ALEMANHA ───
  DE: [
    { nome: 'Bairro Kreuzberg (Berlim)', wiki: 'Kreuzberg', cidade: 'Berlim', fora: true },
    { nome: 'Rota Romântica (vilarejos)', wiki: 'Rota Romântica', cidade: 'Baviera', fora: true },
    { nome: 'Saxônia Suíça (Sächsische Schweiz)', wiki: 'Suíça Saxônica', cidade: 'Saxônia', fora: true },
    { nome: 'Quedebourg (cidade medieval)', wiki: 'Quedlinburg', cidade: 'Saxônia-Anhalt', fora: true },
    { nome: 'Bairro Schanzenviertel (Hamburgo)', wiki: 'Sternschanze', cidade: 'Hamburgo', fora: true },
  ],
  // ─── HOLANDA ───
  NL: [
    { nome: 'Vila histórica de Giethoorn (sem ruas)', wiki: 'Giethoorn', cidade: 'Overijssel', fora: true },
    { nome: 'Bairro Jordaan (Amsterdam)', wiki: 'Jordaan', cidade: 'Amsterdam', fora: true },
    { nome: 'Roterdã arquitetura moderna', wiki: 'Roterdão', cidade: 'Holanda do Sul', fora: true },
    { nome: 'Zaanse Schans (moinhos)', wiki: 'Zaanse Schans', cidade: 'Holanda do Norte', fora: true },
    { nome: 'Cidade de Utrecht', wiki: 'Utrecht', cidade: 'Utrecht', fora: true },
  ],
  // ─── GRÉCIA ───
  GR: [
    { nome: 'Ilha de Naxos', wiki: 'Naxos', cidade: 'Cíclades', fora: true },
    { nome: 'Ilha de Milos', wiki: 'Milos', cidade: 'Cíclades', fora: true },
    { nome: 'Meteora (mosteiros)', wiki: 'Metéora', cidade: 'Tessália', fora: true },
    { nome: 'Bairro Anafiotika (Atenas)', wiki: 'Anafiótika', cidade: 'Atenas', fora: true },
    { nome: 'Ilha de Folegandros', wiki: 'Folegandros', cidade: 'Cíclades', fora: true },
  ],
  // ─── CROÁCIA ───
  HR: [
    { nome: 'Parque Nacional Krka (cataratas)', wiki: 'Parque Nacional Krka', cidade: 'Šibenik', fora: true },
    { nome: 'Ilha de Hvar', wiki: 'Hvar', cidade: 'Dalmácia', fora: true },
    { nome: 'Ilha de Vis', wiki: 'Vis (Croácia)', cidade: 'Dalmácia', fora: true },
    { nome: 'Rovinj (Ístria)', wiki: 'Rovinj', cidade: 'Ístria', fora: true },
    { nome: 'Zagreb (Capital fora dos circuitos)', wiki: 'Zagreb', cidade: 'Zagreb', fora: true },
  ],
  // ─── REPÚBLICA TCHECA ───
  CZ: [
    { nome: 'Český Krumlov', wiki: 'Český Krumlov', cidade: 'Boêmia do Sul', fora: true },
    { nome: 'Kutná Hora (Ossuário de Sedlec)', wiki: 'Ossuário de Sedlec', cidade: 'Boêmia Central', fora: true },
    { nome: 'Bairro Žižkov (Praga)', wiki: 'Žižkov', cidade: 'Praga', fora: true },
    { nome: 'Karlovy Vary (águas termais)', wiki: 'Karlovy Vary', cidade: 'Karlovy Vary', fora: true },
    { nome: 'Brno', wiki: 'Brno', cidade: 'Morávia do Sul', fora: true },
  ],
  // ─── ISRAEL ───
  IL: [
    { nome: 'Bairro Florentin (Tel Aviv)', wiki: 'Florentin', cidade: 'Tel Aviv', fora: true },
    { nome: 'Nazaré', wiki: 'Nazaré', cidade: 'Galileia', fora: true },
    { nome: 'Cratera Ramon (deserto)', wiki: 'Maktesh Ramon', cidade: 'Néguev', fora: true },
    { nome: 'Akko (cidade cruzada)', wiki: 'Acre (Israel)', cidade: 'Norte', fora: true },
    { nome: 'Massada', wiki: 'Massada', cidade: 'Mar Morto', fora: true },
  ],
  // ─── EMIRADOS ÁRABES ───
  AE: [
    { nome: 'Bairro Al Fahidi (Dubai antigo)', wiki: 'Bastakiya', cidade: 'Dubai', fora: true },
    { nome: 'Hatta (montanhas)', wiki: 'Hatta', cidade: 'Dubai', fora: true },
    { nome: 'Al Ain (oásis)', wiki: 'Al Ain', cidade: 'Abu Dhabi', fora: true },
    { nome: 'Fujairah (costa leste)', wiki: 'Fujaira (emirado)', cidade: 'Fujaira', fora: true },
    { nome: 'Sir Bani Yas Island', wiki: 'Sir Bani Yas', cidade: 'Abu Dhabi', fora: true },
  ],
  // ─── AUSTRÁLIA ───
  AU: [
    { nome: 'Tasmânia (selvagem)', wiki: 'Tasmânia', cidade: 'Tasmânia', fora: true },
    { nome: 'Kangaroo Island', wiki: 'Ilha Cangurus', cidade: 'Austrália Meridional', fora: true },
    { nome: 'Margaret River (vinhos)', wiki: 'Margaret River', cidade: 'Austrália Ocidental', fora: true },
    { nome: 'Bairro Newtown (Sydney)', wiki: 'Newtown (Sydney)', cidade: 'Sydney', fora: true },
    { nome: 'Blue Mountains', wiki: 'Montanhas Azuis (Austrália)', cidade: 'New South Wales', fora: true },
    { nome: 'Daintree Rainforest', wiki: 'Floresta de Daintree', cidade: 'Queensland', fora: true },
  ],
  // ─── ÍNDIA — Sri Lanka ───
  LK: [
    { nome: 'Bairro Galle Fort', wiki: 'Forte de Galle', cidade: 'Galle', fora: true },
    { nome: 'Adam\'s Peak (Sri Pada)', wiki: 'Pico de Adão', cidade: 'Sri Pada', fora: true },
    { nome: 'Ella (cidade montanhosa)', wiki: 'Ella (Sri Lanka)', cidade: 'Província Uva', fora: true },
    { nome: 'Trincomalee', wiki: 'Trincomalee', cidade: 'Província Oriental', fora: true },
    { nome: 'Mirissa (baleias)', wiki: 'Mirissa', cidade: 'Província do Sul', fora: true },
  ],
  // ─── NEPAL ───
  NP: [
    { nome: 'Vila de Bandipur', wiki: 'Bandipur', cidade: 'Tanahu', fora: true },
    { nome: 'Lago Phewa (Pokhara)', wiki: 'Lago Phewa', cidade: 'Pokhara', fora: true },
    { nome: 'Bhaktapur (cidade medieval)', wiki: 'Bhaktapur', cidade: 'Vale de Catmandu', fora: true },
    { nome: 'Lumbini (nascimento de Buda)', wiki: 'Lumbini', cidade: 'Rupandehi', fora: true },
    { nome: 'Mustang Superior', wiki: 'Reino do Mustang', cidade: 'Mustang', fora: true },
  ],
  // ─── COSTA RICA ───
  CR: [
    { nome: 'Península Nicoya (azul-zona)', wiki: 'Península de Nicoya', cidade: 'Guanacaste', fora: true },
    { nome: 'Tortuguero (tartarugas)', wiki: 'Tortuguero', cidade: 'Limón', fora: true },
    { nome: 'Vulcão Tenorio (Rio Celeste)', wiki: 'Parque Nacional Vulcão Tenorio', cidade: 'Guanacaste', fora: true },
    { nome: 'Drake Bay (Corcovado)', wiki: 'Drake Bay', cidade: 'Osa', fora: true },
    { nome: 'Bairro Barrio Escalante (San José)', wiki: 'San José (Costa Rica)', cidade: 'San José', fora: true },
  ],
  // ─── CANADÁ ───
  CA: [
    { nome: 'Cidade de Quebec (Old Town)', wiki: 'Cidade de Quebec', cidade: 'Quebec', fora: true },
    { nome: 'Tofino (BC, surfe)', wiki: 'Tofino', cidade: 'British Columbia', fora: true },
    { nome: 'Bairro Plateau Mont-Royal (Montreal)', wiki: 'Plateau Mont-Royal', cidade: 'Montreal', fora: true },
    { nome: 'Cabot Trail (Nova Escócia)', wiki: 'Cabot Trail', cidade: 'Nova Escócia', fora: true },
    { nome: 'Parque Nacional Gros Morne', wiki: 'Parque Nacional Gros Morne', cidade: 'Terra Nova', fora: true },
  ],
  // ─── CUBA ───
  CU: [
    { nome: 'Bairro Habana Vieja (caminho menos turístico)', wiki: 'Havana Velha', cidade: 'Havana', fora: true },
    { nome: 'Trinidad (cidade colonial)', wiki: 'Trinidad (Cuba)', cidade: 'Sancti Spíritus', fora: true },
    { nome: 'Vale de Viñales', wiki: 'Vale de Viñales', cidade: 'Pinar del Río', fora: true },
    { nome: 'Baracoa (cidade-fim do mundo)', wiki: 'Baracoa', cidade: 'Guantánamo', fora: true },
  ],
};
