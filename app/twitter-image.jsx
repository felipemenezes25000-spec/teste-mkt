// Twitter/X usa a MESMA arte do Open Graph. Reaproveita o gerador do
// opengraph-image.jsx (DRY na renderização); os metadados da rota são literais
// aqui porque o Next precisa analisá-los estaticamente.
import OgImage from './opengraph-image';

export const runtime = 'edge';
export const alt = 'Mundo Sem Fim — monte sua volta ao mundo na ordem que não te quebra';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default OgImage;
