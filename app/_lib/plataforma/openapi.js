// Especificação OpenAPI 3.1 da API pública v1 — fonte única para o JSON
// servido em /api/v1/openapi.json e para o portal /desenvolvedores.
const erro = { type: 'object', properties: { error: { type: 'object', properties: { code: { type: 'string' }, message: { type: 'string' } } } } };
const meta = { type: 'object', properties: { api: { type: 'string' }, freshness: { type: 'string', enum: ['LIVE', 'RECENT', 'ESTIMATE', 'HISTORICAL', 'UNVERIFIED'] }, source: { type: 'string' }, methodology: { type: 'string' } } };
const respostas = (schemaData) => ({
  200: { description: 'OK', content: { 'application/json': { schema: { type: 'object', properties: { data: schemaData, meta } } } } },
  400: { description: 'Parâmetro inválido', content: { 'application/json': { schema: erro } } },
  401: { description: 'Chave inválida ou revogada', content: { 'application/json': { schema: erro } } },
  404: { description: 'Não encontrado', content: { 'application/json': { schema: erro } } },
  429: { description: 'Limite de requisições (veja Retry-After)', content: { 'application/json': { schema: erro } } },
});

const Destino = {
  type: 'object',
  properties: {
    code: { type: 'string', example: 'JP' }, name_pt: { type: 'string', example: 'Japão' }, slug: { type: 'string' }, region: { type: 'string' },
    currency: { type: 'string', example: 'JPY' }, cost_per_day_usd: { type: 'number', example: 90 }, best_months: { type: 'array', items: { type: 'integer' } },
    capital_or_main_city: { type: 'string' }, coordinates: { type: 'object', properties: { lng: { type: 'number' }, lat: { type: 'number' } } }, url: { type: 'string' },
  },
};

export const OPENAPI = {
  openapi: '3.1.0',
  info: {
    title: 'Mundo Sem Fim — API pública',
    version: '1.0.0',
    description: 'Catálogo de 205 destinos com custo de referência, melhor época e regra de visto para passaporte brasileiro. Somente leitura. Sem chave: 30 req/min por IP. Com chave (header x-api-key): 600 req/min. Todo dado traz `meta.freshness` e `meta.source` — custos são referência, não cotação.',
    license: { name: 'Uso conforme os termos do Mundo Sem Fim; atribuição obrigatória' },
  },
  servers: [{ url: '/api/v1' }],
  components: {
    securitySchemes: { chave: { type: 'apiKey', in: 'header', name: 'x-api-key' } },
  },
  security: [{}, { chave: [] }],
  paths: {
    '/destinos': {
      get: {
        summary: 'Lista destinos', operationId: 'listarDestinos',
        parameters: [
          { name: 'region', in: 'query', schema: { type: 'string' }, description: 'Região exata (ex.: "Leste Asiático")' },
          { name: 'max_cost', in: 'query', schema: { type: 'number' }, description: 'Custo máximo por dia em USD' },
          { name: 'month', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 12 }, description: 'Só destinos com boa época neste mês' },
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 250, default: 50 } },
          { name: 'offset', in: 'query', schema: { type: 'integer', minimum: 0, default: 0 } },
        ],
        responses: respostas({ type: 'array', items: Destino }),
      },
    },
    '/destinos/{code}': {
      get: {
        summary: 'Detalhe de um destino', operationId: 'detalheDestino',
        parameters: [{ name: 'code', in: 'path', required: true, schema: { type: 'string', pattern: '^[A-Za-z]{2}$' }, example: 'JP' }],
        responses: respostas({ ...Destino, properties: { ...Destino.properties, cities: { type: 'array', items: { type: 'string' } }, cost_tiers_usd_per_day: { type: 'object' }, visa_brazilian_passport: { type: 'object' } } }),
      },
    },
    '/custo': {
      get: {
        summary: 'Estimativa de custo da viagem (sem voo)', operationId: 'custoViagem',
        parameters: [
          { name: 'code', in: 'query', required: true, schema: { type: 'string' }, example: 'JP' },
          { name: 'days', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 120, default: 7 } },
          { name: 'style', in: 'query', schema: { type: 'string', enum: ['mochila', 'medio', 'conforto'], default: 'medio' } },
          { name: 'travelers', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 20, default: 1 } },
        ],
        responses: respostas({ type: 'object', properties: { per_day_per_person_usd: { type: 'number' }, total_per_person_usd: { type: 'number' }, total_group_usd: { type: 'number' }, excludes: { type: 'array', items: { type: 'string' } } } }),
      },
    },
    '/visto': {
      get: {
        summary: 'Regra de visto de referência', operationId: 'visto',
        parameters: [
          { name: 'code', in: 'query', required: true, schema: { type: 'string' }, example: 'JP' },
          { name: 'passport', in: 'query', schema: { type: 'string', default: 'BR' }, description: 'Só BR tem regras verificadas; outros retornam "consultar".' },
        ],
        responses: respostas({ type: 'object', properties: { type: { type: 'string' }, days: { type: ['integer', 'null'] }, verified: { type: 'boolean' }, warning: { type: 'string' } } }),
      },
    },
  },
};
