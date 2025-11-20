# Payment System Admin Panel

A modern, feature-rich admin panel for managing the Payment System platform. Built with React 19, TypeScript, and modern web technologies. This admin panel provides complete management capabilities for all payment system modules including features, packages, transactions, wallets, and more.

## 🚀 Features

### 📊 Dashboard

- Dashboard page with customizable content area
- Quick access to key metrics and insights
- Real-time data visualization capabilities

### 👥 User Management

- Role-based access control (Super Admin, Admin, User)
- User profile management
- Status tracking (in-progress, blocked)
- Email verification system
- User statistics and analytics
- Enhanced user profile with wallet details and transaction history

### 🎯 Features Management

- **Features Page**: List, create, edit, and delete system features
- **Features Details Page**: View feature details and manage associated endpoints
- **Feature Endpoints Management**: Create, edit, and delete API endpoints with token requirements
- **Parent-Child Relationships**: Organize features hierarchically
- **Status Control**: Activate/deactivate features and endpoints

### 📦 Package Management

- **Packages Page**: Complete CRUD operations for token packages
- **Packages Details Page**: View package details and history
- **Rich Text Editor**: BlockNote integration for HTML content editing
- **Feature Association**: Link packages to multiple features
- **Pricing**: Set USD and BDT prices
- **Token Allocation**: Configure token amounts per package
- **Package History**: View complete change history via modal

### 💳 Payment Transaction Management

- **Payment Transactions Page**: View and filter all payment transactions
- **Payment Transactions Details Page**: Detailed view of individual transactions
- **Status Tracking**: Monitor payment status (pending, completed, failed, etc.)
- **Gateway Integration**: View payment gateway details (Stripe/SSL Commerz)
- **Filtering & Search**: Advanced filtering by status, gateway, user, date range
- **Transaction Details**: View complete transaction information via modal

### 🪙 Token Transaction Management

- **Token Transactions Page**: Track all token movements
- **Token Transactions Details Page**: Detailed view of token transactions
- **Transaction Types**: View increases (payments, bonuses) and decreases (feature usage)
- **User Filtering**: Filter transactions by user
- **Real-time Updates**: Live token balance updates via Socket.io

### 💰 Token Profit Management

- **Token Profits Page**: Configure profit percentages
- **Token Profits Details Page**: View profit configuration and history
- **Profit History**: Complete history of profit setting changes via modal
- **Percentage Configuration**: Set profit percentage for token sales

### 💼 User Wallet Management

- **User Wallets Page**: Manage all user wallets
- **User Wallets Details Page**: Detailed wallet information
- **Balance Tracking**: View current token balances
- **Transaction History**: Access wallet transaction history
- **User Filtering**: Filter wallets by user

### 🗑️ Recycle Bin

- **Soft-Deleted Items Management**: View all soft-deleted items
- **Multi-Module Support**: Manage deleted items from Features, Feature Endpoints, Packages, Token Profits, and Users
- **Restore Functionality**: Restore deleted items with one click
- **Permanent Delete**: Permanently delete items from the system
- **Statistics**: View counts of deleted items per module
- **Tabbed Interface**: Easy navigation between different module types

### 🔔 Real-time Features

- **Real-time Notifications**: Live notification system with Socket.io integration
- **Live Updates**: Real-time data synchronization across all connected clients
- **Notification Management**: Custom notification center with read/unread status
- **Token Balance Updates**: Real-time wallet balance updates
- **Payment Status Updates**: Live payment transaction status changes

### 🔧 Advanced Features

- **Real-time Updates**: Socket.io integration for live updates
- **Search & Filtering**: Advanced search and filtering capabilities
- **Data Tables**: Sortable, searchable, and paginated data tables
- **Responsive Design**: Mobile-first, fully responsive interface
- **Modal-based UX**: All create/edit/view operations via modals
- **Role-based Access Control**: Strict access control for admin-only features
- **Rich Text Editing**: BlockNote editor for HTML content

## 🛠️ Technology Stack

### Core Framework

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server

### Styling & UI

- **Tailwind CSS 4** - Utility-first CSS framework
- **Custom Component Library** - **Most components are custom-built** with minimal third-party dependencies
- **Lucide React** - Icon library (only major UI dependency)
- **BlockNote** - Rich text editor for HTML content

### State Management

- **Redux Toolkit** - Predictable state management
- **React Query (TanStack Query)** - Server state management and caching

### Routing & Navigation

- **React Router 7** - Client-side routing
- **Custom RouteMenu Class** - Dynamic route generation with role-based access control

### Form Management

- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation
- **Hookform Resolvers** - Validation integration

### Data Visualization

- **Recharts** - Charts and data visualization

### Additional Libraries

- **Axios** - HTTP client for API requests
- **Socket.io Client** - Real-time communication
- **React Toastify** - Toast notifications
- **Date-fns** - Date manipulation utilities
- **Class Variance Authority** - Component variant management
- **Embla Carousel** - Touch-friendly carousel component

## 📁 Project Structure

```
src/
├── assets/            # Static assets and data
│   ├── data/         # Route menu items configuration
│   └── styles/       # Global styles and CSS files
├── builder/          # Builder classes (RouteMenu, ObjectFormData)
├── components/       # Reusable UI components
│   ├── (auth)/      # Authentication components
│   ├── (common)/    # Common page components
│   │   ├── features-page/
│   │   ├── packages-page/
│   │   ├── payment-transactions-page/
│   │   ├── token-transactions-page/
│   │   ├── token-profits-page/
│   │   ├── user-wallets-page/
│   │   ├── users-page/
│   │   └── recycle-bin-page/
│   ├── appliers/    # State appliers and providers
│   ├── cards/       # Card components
│   ├── modals/      # Modal dialogs
│   │   ├── FeatureAddModal/
│   │   ├── FeatureEditModal/
│   │   ├── FeatureEndpointAddModal/
│   │   ├── FeatureEndpointEditModal/
│   │   ├── PackageAddModal/
│   │   ├── PackageEditModal/
│   │   ├── PackageHistoryViewModal/
│   │   ├── PaymentTransactionViewModal/
│   │   ├── TokenProfitAddModal/
│   │   ├── TokenProfitEditModal/
│   │   ├── TokenProfitHistoryViewModal/
│   │   ├── TokenTransactionViewModal/
│   │   ├── UserEditModal/
│   │   └── UserWalletViewModal/
│   ├── partials/    # Layout partials (Header, Sidebar, etc.)
│   ├── sections/    # Page sections
│   ├── ui/          # Base UI components
│   │   ├── BlockNoteEditor/  # Rich text editor
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── DataTable/
│   │   ├── FormControl/
│   │   ├── Modal/
│   │   └── ...
│   └── wrappers/    # Component wrappers
├── config/          # Configuration files
│   ├── constants/   # App constants
│   ├── env/         # Environment variables
│   ├── project/     # Project metadata
│   ├── seo/         # SEO configuration
│   └── urls/        # URL configuration
├── hooks/           # Custom React hooks
│   ├── observers/   # Intersection and mutation observers
│   ├── states/      # State management hooks
│   ├── ui/          # UI-related hooks
│   └── utils/       # Utility hooks
├── layouts/         # Page layouts
├── lib/             # Library utilities (API, utils)
├── pages/           # Page components
│   ├── (auth)/     # Authentication pages
│   ├── (common)/    # Common pages
│   │   ├── Dashboard/
│   │   ├── FeaturesPage/
│   │   ├── FeaturesDetailsPage/
│   │   ├── PackagesPage/
│   │   ├── PackagesDetailsPage/
│   │   ├── PaymentTransactionsPage/
│   │   ├── PaymentTransactionsDetailsPage/
│   │   ├── TokenTransactionsPage/
│   │   ├── TokenTransactionsDetailsPage/
│   │   ├── TokenProfitsPage/
│   │   ├── TokenProfitsDetailsPage/
│   │   ├── UserWalletsPage/
│   │   ├── UserWalletsDetailsPage/
│   │   ├── UsersPage/
│   │   └── RecycleBinPage/
│   ├── (partial)/   # Partial pages (Error, 404, etc.)
│   └── (user)/      # User-specific pages
│       └── ProfilePage/
├── redux/           # Redux store and slices
│   ├── slices/      # Redux slices for each page/module
│   └── store.ts     # Redux store configuration
├── services/        # API service functions
│   ├── auth.service.ts
│   ├── feature.service.ts
│   ├── feature-endpoint.service.ts
│   ├── package.service.ts
│   ├── package-history.service.ts
│   ├── payment-transaction.service.ts
│   ├── token-transaction.service.ts
│   ├── token-profit.service.ts
│   ├── token-profit-history.service.ts
│   ├── user-wallet.service.ts
│   └── user.service.ts
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## 🎯 Custom Architecture & Key Features

### Custom-Built Components

This project emphasizes **custom-built components** with minimal third-party dependencies. Most UI components, including data tables, forms, modals, and layout components, are built from scratch to ensure:

- **Performance optimization** tailored to specific use cases
- **Consistent design system** across the application
- **Full control** over component behavior and styling
- **Reduced bundle size** by avoiding unnecessary third-party code

### Major Third-Party Packages

The project uses only essential third-party packages:

- **React 19** - Core framework
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling framework
- **Redux Toolkit** - State management
- **React Query** - Server state management
- **React Hook Form + Zod** - Form handling and validation
- **Axios** - HTTP client
- **Socket.io Client** - Real-time communication
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **BlockNote** - Rich text editor

### RouteMenu Class

The **RouteMenu class** is a custom routing solution that provides:

- **Dynamic route generation** based on user roles and permissions
- **Role-based access control** for different user types
- **Nested routing structure** with automatic layout application
- **Menu integration** with route definitions
- **Type-safe routing** with TypeScript support

This custom routing system allows for flexible navigation management and ensures that users only see routes they have permission to access.

### Redux State Management

The application uses Redux Toolkit for managing UI state:

- **Page-specific slices**: Each major page has its own Redux slice
- **Modal state management**: Centralized modal open/close state
- **Selected item tracking**: Track selected items for edit/view operations
- **Pagination state**: Manage page numbers and limits
- **Search and filter state**: Store search queries and filter values

### React Query Integration

React Query (TanStack Query) is used for:

- **Server state management**: All API calls use React Query
- **Automatic caching**: Intelligent data caching
- **Background refetching**: Keep data fresh automatically
- **Optimistic updates**: Update UI before server confirmation
- **Error handling**: Centralized error handling

## ⚡ Real-time Features & Socket.io Integration

### Live Notification System

The admin panel features a comprehensive **real-time notification system** powered by Socket.io:

- **Instant Notifications**: Real-time alerts for system events
- **Live Data Updates**: Automatic synchronization of data across all connected clients
- **User Activity Tracking**: Real-time monitoring of user actions and system events
- **Notification Management**: Custom notification center with read/unread status

### Socket.io Implementation

- **Bidirectional Communication**: Real-time data flow between client and server
- **Event-driven Architecture**: Custom event handlers for different notification types
- **Connection Management**: Automatic reconnection and connection state handling
- **Room-based Notifications**: Targeted notifications based on user roles and permissions
- **Performance Optimized**: Efficient event handling and minimal data transfer

### Real-time Features Include:

- **Live Dashboard Updates**: Statistics and metrics update in real-time
- **Live Data Synchronization**: Real-time data updates across all connected clients
- **System Status Updates**: Live system health and performance monitoring
- **User Presence**: See which users are currently active
- **Token Balance Updates**: Real-time wallet balance updates
- **Payment Status Updates**: Live payment transaction status changes

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (recommended) or npm
- **Git**

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd payment-system
   cd payment-system-adminpanel
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   VITE_API_URL=http://localhost:5000
   VITE_APP_URL=http://localhost:8080
   ```

4. **Start development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080`

### Build for Production

```bash
pnpm build
# or
npm run build
```

### Preview Production Build

```bash
pnpm preview
# or
npm run preview
```

## 🔧 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint errors automatically

## 🎨 Custom UI Components

The project features a **comprehensive custom-built component library** with minimal third-party dependencies:

- **DataTable** - Advanced custom data table with sorting, filtering, and pagination
- **Form Controls** - Custom input, select, textarea, and other form elements
- **Modals** - Custom modal dialogs for various use cases
- **Cards** - Custom content cards and statistic cards
- **Charts** - Data visualization components (using Recharts)
- **Navigation** - Custom breadcrumbs, pagination, and navigation elements
- **Feedback** - Custom loading states, alerts, and notifications
- **Layout Components** - Custom header, sidebar, and layout wrappers
- **Utility Components** - Custom badges, buttons, dropdowns, and more
- **BlockNoteEditor** - Rich text editor component for HTML content

All components are built with **TypeScript**, **Tailwind CSS**, and follow consistent design patterns for optimal performance and maintainability.

## 🔐 Authentication & Authorization

The admin panel implements a robust role-based access control system:

- **Super Admin**: Full system access to all features
- **Admin**: Access to all payment system management features
- **User**: Basic user access (profile, own wallet, own transactions)

### Protected Routes

All payment system management pages (Features, Packages, Transactions, Wallets, etc.) are restricted to **super-admin** and **admin** roles only. Regular users can only access:

- Dashboard
- User Profile (own profile)
- Own wallet details
- Own transaction history

## 📡 API Integration

The application integrates with a RESTful API for:

- User authentication and management
- Features and Feature Endpoints CRUD operations
- Package management with rich text content
- Payment transaction tracking
- Token transaction management
- Token profit configuration
- User wallet management
- Package and profit history tracking
- Soft-deleted items management (restore/permanent delete)
- Notifications and real-time updates

### API Service Structure

Each module has a dedicated service file:

- `auth.service.ts` - Authentication endpoints
- `feature.service.ts` - Feature management
- `feature-endpoint.service.ts` - Feature endpoint management
- `package.service.ts` - Package management
- `package-history.service.ts` - Package history
- `payment-transaction.service.ts` - Payment transactions
- `token-transaction.service.ts` - Token transactions
- `token-profit.service.ts` - Token profit management
- `token-profit-history.service.ts` - Profit history
- `user-wallet.service.ts` - User wallet management
- `user.service.ts` - User management

## 🎯 Key Features in Detail

### Features Management

- **Feature CRUD**: Create, read, update, and delete features
- **Hierarchical Structure**: Parent-child feature relationships
- **Feature Endpoints**: Associate API endpoints with token requirements
- **Status Control**: Activate/deactivate features and endpoints
- **Soft Delete**: Features can be soft-deleted and restored

### Package Management

- **Package CRUD**: Create, read, update, and delete packages
- **Rich Text Content**: BlockNote editor for HTML content
- **Feature Association**: Link packages to multiple features
- **Pricing**: Set USD and BDT prices
- **Token Allocation**: Configure token amounts per package
- **Duration**: Optional package duration in days
- **Package History**: Complete change history tracking

### Transaction Management

- **Payment Transactions**: Complete payment history with gateway integration
- **Token Transactions**: Track all token increases and decreases
- **Status Tracking**: Monitor transaction statuses in real-time
- **Filtering**: Advanced filtering by user, status, date range
- **Details View**: Comprehensive transaction details via modals

### User Experience

- **Responsive Design**: Works seamlessly on all device sizes
- **Real-time Updates**: Live notifications, data synchronization, and instant updates via Socket.io
- **Intuitive Navigation**: Clean, organized interface with custom routing
- **Modal-based UX**: All create/edit/view operations handled via modals
- **Accessibility**: Built with accessibility best practices

### Performance

- **Code Splitting**: Optimized bundle loading
- **Caching**: Intelligent data caching with React Query
- **Lazy Loading**: Components loaded on demand
- **Optimized Images**: Efficient image handling and optimization
- **Redux Optimization**: Efficient state management with Redux Toolkit

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ using React 19, TypeScript, Tailwind CSS, and Redux Toolkit**
