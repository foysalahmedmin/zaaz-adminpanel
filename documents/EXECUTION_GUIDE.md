# ✅ **Project Integration Instructions for Cursor**

This project’s **entire backend** is already completed.
An initial **admin panel frontend** project is also set up with:

- Proper folder structure
- Layout system
- Authentication fully implemented
- Backend-aligned architecture already prepared

Now Cursor’s job is to **analyze the full project**, understand the structure, and integrate all backend modules into the admin panel in a clean, scalable way.

---

# 🔍 **What Cursor Must Do**

## **1. Analyze the Entire Existing Admin Panel**

Cursor must carefully review:

- Current folder structure
- Existing pages
- Layouts
- Hooks, services, components
- Design system & execution style

Special attention should be given to:

- `events` pages
- `users` page
- `user-details` page

These existing pages must be used as **design + execution references** for all new pages.

---

## **2. Create Service Files for Backend APIs**

For every backend module, Cursor must:

- Create a dedicated **service file**
- Add all required **API functions**
- Structure them cleanly inside `/services/<module>/`
- Add TypeScript types inside `/types/<module>/`

Each module should have:

```
services/
  feature.service.ts
  featureEndpoint.service.ts
  package.service.ts
  paymentTransaction.service.ts
  tokenTransaction.service.ts
  tokenProfit.service.ts
  userWallet.service.ts
  ...
types/
  feature.type.ts
  featureEndpoint.type.ts
  ...
```

Everything must follow the existing code style.

---

## **3. Implement All Required Admin Pages**

All pages must follow the **existing layout** structure.

Cursor must introduce the following modules:

### **Feature Module**

- `features-page`
- `features-details-page`
  - Includes feature endpoints in a **data table**
  - Has **add / edit / view** functionality using modals

---

### **Package Module**

- `packages-page`
- `packages-details-page`
  - Includes **package histories** (read-only)
  - History view via modal

---

### **Payment Transactions Module**

- `payment-transactions-page`
- `payment-transactions-details-page`

---

### **Token Transactions Module**

- `token-transactions-page`
- `token-transactions-details-page`

---

### **Token Profit Module**

- `token-profits-page`
- `token-profits-details-page`
  - Includes **profit histories** (read-only)
  - View via modal

---

### **User Wallet Module**

- `user-wallets-page`
- `user-wallets-details-page`

---

## **4. Update Existing User Profile Page**

The current user-details/profile page must be enhanced.

### **New Requirements**

The page must show:

1. **User information** (existing area)
2. **User wallet details**
3. **Tabs for:**
   - Payment Transactions (list)
   - Token Transactions (list)

From these lists, the user must be able to open:

- Payment Transaction Details
- Token Transaction Details

---

## **5. Access Control**

Except for:

- Dashboard page
- User profile page

**All other pages should only be accessible to:**

- `super-admin`
- `admin`

---

## **6. Backend Updates (If Needed)**

Cursor is allowed to propose and apply small backend adjustments **if required to complete the integration properly**.

---

# ✅ Additional Execution Rules (Must Follow)

### **📄 1. Root-Level Pages Are Document Views**

Root-level module pages (e.g., Features, Packages, Payment Transactions, Token Transactions, Token Profits, User Wallets) primarily work as **document listing pages**.

Each of these root pages must support:

- **View documents** (default table view)
- **Create document** (via modal)
- **Edit document** (via modal)
- **Delete document** (button or option inside row actions)
- **Top-right “Add Document” button** (where applicable)

No add/edit pages should be separate; everything must be done using **modals**, following existing admin panel UX conventions.

---

### **🗂️ 2. Modal-Based Create & Update**

All modules that allow mutation must follow:

- **Add → Modal form**
- **Edit → Modal form**
- **View → Modal (read-only)** when needed
  (e.g., package history, token profit history, payment transaction details, token transaction details, etc.)

Design must follow existing component system exactly.

---

### **🧠 3. State Management Must Use Redux**

You must use **Redux** for all the modules, following the same structure as existing pages:

- Redux slice per module
- Async thunks for API requests
- Consistent naming conventions
- Page state separation (list, details, modal state, filters, etc.)

Your Redux implementation must match the existing project patterns exactly to avoid breaking the architecture.

---

### **🎯 4. Perfect Execution Required**

Cursor must ensure:

- Architecture consistency
- Naming consistency
- TypeScript strictness
- UI/UX consistency
- API usage accuracy
- Proper error handling
- Clean modular folder structure
- Reusable components where possible

Nothing should be improvised or guessed—follow existing patterns from the project.

---

### **🛠 5. Backend Updates Allowed**

If the frontend requires backend adjustments such as:

- New endpoints
- Pagination improvements
- Filters
- Missing fields
- Minor model changes
- Bug fixes

Cursor is allowed to propose and implement the backend updates as long as they keep the architecture aligned.

---

# 📌 Summary for Cursor

1. Study the existing structure
2. Add services + types for all backend modules
3. Implement all admin pages listed above
4. Update the user-details page with wallet + transaction tabs
5. Enforce admin/super-admin access rules
6. Apply backend fixes if necessary

All implementations must follow the project's existing design, component usage, and architectural patterns.
