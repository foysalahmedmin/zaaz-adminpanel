# Admin Panel Project Structure

This document defines the standardized directory structure for the ZaaZ Admin Panel (Vite + React + TypeScript + Redux) to ensure architectural consistency across the project.

---

## 🏗️ Directory Hierarchy

```plaintext
zaaz-adminpanel/
├─ documents/                # Project documentation (ADRs, Plans, Specs)
│  ├─ memories/              # History and Architectural Decisions (ADR)
│  ├─ plans/                 # Detailed UI/UX implementation roadmaps
│  ├─ project_roles.md       # Development Rules and Guidelines
│  ├─ project_structure.md   # This file (Source of truth)
│  └─ project_specification.md # UI/UX Functional requirements
├─ public/                   # Static public assets
├─ src/                      # Source code
│  ├─ assets/                # Images, fonts, and global assets
│  ├─ builder/               # Visual UI generator core
│  ├─ components/            # Reusable UI components (shadcn/ui, etc.)
│  ├─ config/                # Environment and app configuration
│  ├─ hooks/                 # Custom React hooks
│  ├─ layouts/               # Page wrapper layouts
│  ├─ lib/                   # Third-party library wrappers (axios, utils)
│  ├─ pages/                 # Full screen page components (Routes)
│  ├─ redux/                 # State management (Slices, Store)
│  ├─ services/              # API interaction layer (RTK Query / Axios)
│  ├─ types/                 # Global TypeScript interfaces
│  ├─ utils/                 # Helper functions
│  ├─ App.tsx                # Main App entry point
│  ├─ main.tsx               # Root DOM mounting
│  └─ index.css              # Global Tailwind/CSS styles
├─ package.json              # Dependency management
├─ tsconfig.json             # TypeScript configuration
└─ vite.config.ts            # Vite configuration
```

---

## 📂 Documentation Directory Details

-   **`memories/`**: Contains numbered ADR files (e.g., `001-state-management.md`).
-   **`plans/`**: Contains subfolders for specific feature implementions (e.g., `dashboard-widgets/`).
-   **`project_roles.md`**: Defines the "laws" of development for this repository.
