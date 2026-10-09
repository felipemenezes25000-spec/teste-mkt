# Booking state machine

> Código: `app/_domain/booking.js` (testes em `app/_domain/domain.test.js`, `app/_lib/viagens/store.test.js`).
> Banco: `public.reservations` + trigger `reserva_fonte_guard` (migration `20261009000000_trip_workspace.sql`), testado em `scripts/rls-test.mjs`.

## Modos de reserva (V4 §30)

| Modo | Significado | Hoje |
|---|---|---|
| `VIEW_ONLY` | Só informação | catálogo |
| `DEEPLINK` | Usuário sai para o parceiro (avisado, `rel="sponsored"`, `/api/out`) | **em uso** |
| `EMBEDDED` | Checkout do parceiro embutido | não implementado (contrato) |
| `NATIVE_TRANSACTION` | Venda pela plataforma | não implementado (licença/merchant) |

## Estados e transições

```
DRAFT → PRICE_CHECK_REQUIRED | AWAITING_PAYMENT | PENDING_PROVIDER | FAILED | CANCELLED
PRICE_CHECK_REQUIRED → AWAITING_PAYMENT | PENDING_PROVIDER | FAILED | CANCELLED
AWAITING_PAYMENT → PENDING_PROVIDER | FAILED | CANCELLED | PRICE_CHECK_REQUIRED
PENDING_PROVIDER → CONFIRMED | FAILED | CANCELLED | UNKNOWN
CONFIRMED → MODIFIED | CANCELLATION_PENDING | CANCELLED
MODIFIED → MODIFIED | CANCELLATION_PENDING | CANCELLED
CANCELLATION_PENDING → CANCELLED | CONFIRMED | REFUND_PENDING
CANCELLED → REFUND_PENDING
REFUND_PENDING → REFUNDED | FAILED
FAILED → DRAFT
UNKNOWN → CONFIRMED | FAILED | CANCELLED | PENDING_PROVIDER
```

## Invariantes

1. `CONFIRMED`/`REFUNDED` exigem fonte: `provider_webhook`, `reconciliation`, `import_verified` (servidor) ou `import_manual` (usuário, **rotulado “informado por você”**). Clique e “return URL success” nunca confirmam.
2. No banco, `confirmed_by` verificado só pode ser gravado pelo `service_role` (trigger); `CONFIRMED` sem `confirmed_by` é rejeitado por `CHECK`.
3. Idempotência por `eventId`: o mesmo evento aplicado duas vezes não altera o histórico.
4. Todo passo grava `{from, to, at, source, eventId?}` em `history`.
5. Suporte: em `DEEPLINK`, pagamento/alteração/reembolso são do parceiro — a UI diz isso (`explicarStatus`).
