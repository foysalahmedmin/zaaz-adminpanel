# Admin Panel ↔ Backend Alignment Plan

## Overview

The admin panel was built partially against a different API contract. Several API paths,
field names, and features do not match what the backend actually provides. This document
describes every misalignment found and the implementation plan to fix them.

---

## Misalignments Found

### 1. "Plan" → "Interval" (CRITICAL — all broken)

The backend calls billing periods **Interval** (module: `interval`, path: `/api/intervals`).
The admin panel calls them **Plan** everywhere.

| Layer | Frontend (wrong) | Backend (correct) |
|-------|-----------------|-------------------|
| API path | `/api/plans/*` | `/api/intervals/*` |
| API path | `/api/package-plans/*` | `/api/package-prices/*` |
| Field in `TPaymentTransaction` | `.plan` | `.interval` |
| Field in `TCreditsTransaction` | `.plan` | `.interval` |
| Field in `TPackagePlanItem` (inside `TPackage.plans`) | `.plan` | `.interval` |
| Field in `TPackagePlan` | `.plan` | `.interval` |
| Payload key in `initiatePayment()` | `plan: string` | `interval: string` |

Affected service files:
- `services/plan.service.ts` — all 6 endpoints point to `/api/plans`
- `services/package-plan.service.ts` — all 5 endpoints point to `/api/package-plans`

Affected type files:
- `types/plan.type.ts` → `TPlan` (shape is fine, name stays but routes change)
- `types/package-plan.type.ts` → `TPackagePlan.plan` must be renamed to `.interval`
- `types/package.type.ts` → `TPackagePlanItem.plan` must be renamed to `.interval`
- `types/payment-transaction.type.ts` → `TPaymentTransaction.plan` → `.interval`
- `types/credits-transaction.type.ts` → `TCreditsTransaction.plan` → `.interval`

Affected pages/components that read `.plan`:
- `pages/(common)/PaymentTransactionsDetailsPage` — reads `currentTransaction.plan`
- `pages/(common)/CreditsTransactionsDetailsPage` — reads `currentTransaction.plan`
- `pages/(common)/UserWalletsDetailsPage` — reads `currentWallet.plan`, `transaction.plan`
- `pages/(common)/UserDetailsPage` — reads `transaction.plan`
- `pages/(user)/ProfilePage` — reads `transaction.plan`
- `pages/(client)/CheckoutSuccessPage` — reads `pp.plan`
- `pages/(common)/PackagesDetailsPage` — reads `pp.plan`, const `plan = pp.plan`
- `components/(common)/packages-page/PackagesDataTableSection` — reads `plan.plan?.name`
- `components/modals/AssignPackageModal` — reads `pp.plan`
- `components/modals/PackageHistoryViewModal` — reads `pp.plan.name`

---

### 2. Payment Initiate/Verify Wrong Endpoint (CRITICAL)

The checkout flow sends payment requests to the wrong module.

| Operation | Frontend calls (wrong) | Backend route (correct) |
|-----------|----------------------|------------------------|
| Initiate payment | `POST /api/payment-transactions/initiate` | `POST /api/payments/initiate` |
| Verify payment | `POST /api/payment-transactions/:id/verify` | `POST /api/payments/:id/verify` |
| Admin direct create | `POST /api/payment-transactions` | `POST /api/payments` |
| Admin update status | `PATCH /api/payment-transactions/:id` | `PATCH /api/payments/:id` |

Affected: `services/payment-transaction.service.ts` lines 65-87.

---

### 3. Missing Admin Payment Actions (HIGH)

Two admin endpoints built in the backend have no UI:

| Endpoint | Purpose | Where to add in UI |
|----------|---------|-------------------|
| `POST /api/payments/:id/refund` | Hard refund (revokes credits, calls gateway) | `PaymentTransactionsDetailsPage` — button visible only when `status === 'success'` |
| `POST /api/payments/reconcile` | Manually trigger reconciliation of pending transactions | `PaymentTransactionsPage` — admin action button |

---

### 4. RecycleBin Missing Tabs (MEDIUM)

Backend has full soft-delete + restore for these modules, but the RecycleBin page has no tab for them:

| Module | Backend restore endpoint | Currently in RecycleBin? |
|--------|------------------------|--------------------------|
| `interval` (plans) | `POST /api/intervals/:id/restore` | No |
| `payment-method` | `POST /api/payment-methods/:id/restore` | No |
| `payment-transaction` | `POST /api/payment-transactions/:id/restore` | No |
| `billing-setting` | `POST /api/billing-settings/:id/restore` | No |

Currently present: feature, feature-endpoint, package, credits-profit, user, package-transaction, ai-model.

Note: Coupons have **no soft delete** in the backend (hard delete only) — no tab needed.

---

### 5. PackagePlansPage Not in Route Menu (MEDIUM)

`pages/(common)/PackagePlansPage/index.tsx` exists and is fully built but is **not registered**
in `assets/data/route-menu-items.tsx`. Users cannot navigate to it.

Fix: Add it as a sub-route under **Packages** (alongside the details route).

---

### 6. User Wallet Type Mismatch (LOW — cosmetic)

The frontend `TUserWallet` has `package`, `plan`, `type`, `expires_at` fields that the
backend wallet document does not store. These fields always render as "N/A" in the UI.
This is a non-breaking mismatch — the wallet details page is informational only.

No fix required in this cycle unless the backend is extended to populate these fields.

---

## Implementation Phases

### Phase 1 — API Endpoint Fixes (services only, no UI changes)

1. `services/plan.service.ts` — change `/api/plans` → `/api/intervals` in all 6 calls
2. `services/package-plan.service.ts` — change `/api/package-plans` → `/api/package-prices` in all 5 calls
3. `services/payment-transaction.service.ts`:
   - `initiatePayment`: path → `/api/payments/initiate`, payload key `plan` → `interval`
   - `verifyPayment`: path → `/api/payments/:id/verify`
   - `createPaymentTransaction`: path → `/api/payments`
   - `updatePaymentTransaction`: path → `/api/payments/:id`

**Commit:** `fix(services): correct api endpoint paths for intervals, package-prices, and payments`

---

### Phase 2 — Type Field Renames (`plan` → `interval`)

1. `types/package-plan.type.ts` — `TPackagePlan.plan` → `.interval`
2. `types/package.type.ts` — `TPackagePlanItem.plan` → `.interval`
3. `types/payment-transaction.type.ts` — `TPaymentTransaction.plan` → `.interval`
4. `types/credits-transaction.type.ts` — `TCreditsTransaction.plan` → `.interval`
5. Fix all pages/components that access `.plan` on these types

**Commit:** `fix(types): rename plan→interval field across payment, credits, and package types`

---

### Phase 3 — New Payment Admin Features

1. Add `initiateRefund(id, adminNote?)` service function to `payment-transaction.service.ts`
   calling `POST /api/payments/:id/refund`
2. Add `reconcilePayments()` service function calling `POST /api/payments/reconcile`
3. `PaymentTransactionsDetailsPage` — add Refund button (visible when `status === 'success'`)
4. `PaymentTransactionsPage` — add Reconcile button in page header

**Commit:** `feat(payment): add refund and reconcile admin actions to payment pages`

---

### Phase 4 — RecycleBin Additional Tabs

Add 4 new tabs: `interval`, `payment-method`, `payment-transaction`, `billing-setting`.
Each tab: fetches deleted items, shows a data table, supports single restore (bulk restore optional).

**Commit:** `feat(recycle-bin): add interval, payment-method, payment-transaction, billing-setting tabs`

---

### Phase 5 — PackagePlansPage Route Registration

Add `PackagePlansPage` to `route-menu-items.tsx` as a child of the packages layout route,
accessible at `/packages/plans`.

**Commit:** `feat(routing): add package-plans page to route menu under packages`

---

## Files Changed Summary

| File | Change Type | Phase |
|------|------------|-------|
| `services/plan.service.ts` | API paths | 1 |
| `services/package-plan.service.ts` | API paths | 1 |
| `services/payment-transaction.service.ts` | API paths + payload key | 1 |
| `types/package-plan.type.ts` | Field rename | 2 |
| `types/package.type.ts` | Field rename | 2 |
| `types/payment-transaction.type.ts` | Field rename | 2 |
| `types/credits-transaction.type.ts` | Field rename | 2 |
| `pages/(common)/PaymentTransactionsDetailsPage` | Field + refund button | 2, 3 |
| `pages/(common)/PaymentTransactionsPage` | Reconcile button | 3 |
| `pages/(common)/CreditsTransactionsDetailsPage` | Field rename | 2 |
| `pages/(common)/UserWalletsDetailsPage` | Field rename | 2 |
| `pages/(common)/UserDetailsPage` | Field rename | 2 |
| `pages/(user)/ProfilePage` | Field rename | 2 |
| `pages/(client)/CheckoutSuccessPage` | Field rename | 2 |
| `pages/(common)/PackagesDetailsPage` | Field rename | 2 |
| `components/(common)/packages-page/PackagesDataTableSection` | Field rename | 2 |
| `components/modals/AssignPackageModal` | Field rename | 2 |
| `components/modals/PackageHistoryViewModal` | Field rename | 2 |
| `pages/(common)/RecycleBinPage` | New tabs | 4 |
| `assets/data/route-menu-items.tsx` | Add PackagePlansPage | 5 |
