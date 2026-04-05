# Admin Panel Development Roles & Guidelines

This document outlines the standard development roles, practices, and architectural "laws" for the ZaaZ Admin Panel to maintain a clean and scalable frontend codebase.

---

## 1. Project Organization (Modular Architecture)

1.  **Strict Component Placement:**
    *   **Common Components (`src/components/`):** Generic, reusable UI elements (e.g., Buttons, Modals, Inputs).
    *   **Page-Specific Components:** Keep components private to a page inside `src/pages/[page-name]/components/`.
    *   **Layouts (`src/layouts/`):** Structural wrappers (e.g., AuthLayout, DashboardLayout).

2.  **State Management (Redux/RTK Query):**
    *   **Global State:** Use Redux Slices inside `src/redux/slices/`.
    *   **Data Fetching:** Prefer **RTK Query** (`src/services/`) over manual Axios calls where possible to ensure automatic caching and loading states.

---

## 2. Development Guidelines

*   **Atomic Design:** Build from small components up to full pages.
*   **Performance:** Use `React.memo`, `useCallback`, and `useMemo` specifically where performance bottlenecks are identified.
*   **Styling:** Use **Tailwind CSS** with **shadcn/ui** for consistent aesthetics. Avoid custom CSS unless absolute necessity.
*   **Clean Code:** Follow ESLint and Prettier configurations strictly.

---

## 3. Documentation & Planning Standards

1.  **Implementation Plans:** Create a subfolder in `documents/plans/[feature_name]/`.
    *   `plan.md`: UI/ux strategy, state requirements, and logic mapping.
    *   `tasks.md`: Phase-by-phase implementation (Phase 1: Styles, Phase 2: Logic, Phase 3: API).
2.  **Architechtural Memories:** Record core decisions in `documents/memories/` using ADR format (e.g., `001-redux-setup.md`).
3.  **Source of Truth:** Update `project_structure.md` and `project_specification.md` after every feature rollout.

---

## 4. Git & Workflow

*   **Prefixes:**
    *   `feat: [feature name]` — New functionality.
    *   `fix: [bug name]` — Correction of a problem.
    *   `refactor: [optimization]` — Improving code quality without changing behavior.
    *   `docs: [update]` — Documentation changes.
*   **Commits:** Ensure commit messages are clear and follow conventional standards.
