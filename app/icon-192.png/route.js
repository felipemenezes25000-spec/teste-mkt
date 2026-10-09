import { iconResponse } from '../_lib/appIcon.jsx';

// /icon-192.png — ícone PWA 192×192 (referenciado no manifest). Gerado por next/og.
export const runtime = 'nodejs';
export function GET() {
  return iconResponse(192);
}
