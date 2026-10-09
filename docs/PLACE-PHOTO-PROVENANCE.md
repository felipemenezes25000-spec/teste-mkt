# Place photo provenance

> V4 §11-13 / §28. Código: `app/_lib/media.js` (servidor), `app/_lib/wikiThumb.js` (puro), `app/_ui/Foto.jsx` (UI).

## Pipeline

1. **Descoberta** — verbete do lugar (pt→en) → galeria do artigo → Openverse (CC comercial) → busca no Commons → **piso do país**.
2. **Identidade** — nome do arquivo Commons (`commons:{arquivo}`).
3. **Licença e autoria** — `imageinfo` + `extmetadata` (Artist, LicenseShortName, LicenseUrl) em lotes de 50, cache 7 dias. `rightsStatus`: `VERIFIED` (CC/PD/GFDL/FAL), `RESTRICTED` (outra licença), `PENDING` (sem metadado).
4. **Tamanho seguro** — largura padrão do Wikimedia (120/250/330/500/960/1280/1920) **≤ largura do original**; URL de thumbnail por md5 do nome (regra do MediaWiki). Nunca hotlink do original “unscaled”.
5. **Match ao lugar** — foto vinda do **piso do país** ou override reaproveitado em várias atrações é marcada `ilustrativa` → rótulo “FOTO ILUSTRATIVA · {país}”.
6. **Exibição** — `<Foto>` com botão © (autor · licença · link da página do arquivo); `onError` → placeholder editorial honesto.

## Modelo (V4 §12 `ImageAsset`)

`{ id, provider: 'wikimedia-commons', providerAssetId, url, width, height, originalWidth, mimeType, attribution, photographer, license, licenseUrl, pageUrl, rightsStatus, fetchedAt }`

## Proibições observadas

- Foto de outro lugar apresentada como o lugar: bloqueado pelo rótulo ilustrativo.
- Imagem gerada/fotorrealista como foto: não usada.
- Armazenamento indefinido: só URL + metadados; cache HTTP com revalidação.
