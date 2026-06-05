import { iconResponse } from '../_lib/appIcon.jsx';

// /icon-512.png — ícone PWA 512×512 (any + maskable no manifest). Gerado por next/og.
export const runtime = 'edge';
export function GET() {
  return iconResponse(512);
}
