# Payment System Admin Panel

A modern, feature-rich admin panel for managing events, users, and content for the Payment System platform. Built with React, TypeScript, and modern web technologies.

## 🚀 Features

### 📊 Dashboard

- Dashboard page with customizable content area
- Quick access to key metrics and insights
- Real-time data visualization capabilities

### 📅 Events Management

- **Event Management**: Create, edit, and manage events
- **Media Support**: Upload and manage event icons and thumbnails
- **Status Management**: Active and inactive states
- **Content Layouts**: Multiple layout options (default, standard, featured, minimal)
- **Featured Events**: Mark events as featured
- **Bulk Operations**: Mass update, delete, and restore events
- **Publishing Control**: Set publish and expiration dates

### 👥 User Management

- Role-based access control (Super Admin, Admin, User)
- User profile management
- Status tracking (in-progress, blocked)
- Email verification system
- User statistics and analytics

### 🔔 Real-time Features

- **Real-time Notifications**: Live notification system with Socket.io integration
- **Live Updates**: Real-time data synchronization across all connected clients
- **Notification Management**: Custom notification center with read/unread status

### 🔧 Advanced Features

- **Real-time Updates**: Socket.io integration for live updates
- **File Management**: Upload and manage various file types
- **Search & Filtering**: Advanced search and filtering capabilities
- **Data Tables**: Sortable, searchable, and paginated data tables
- **Responsive Design**: Mobile-first, fully responsive interface
- **Dark/Light Theme**: Theme switching capability

## 🛠️ Technology Stack

### Core Framework

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server

### Styling & UI

- **Tailwind CSS 4** - Utility-first CSS framework
- **Custom Component Library** - **Most components are custom-built** with minimal third-party dependencies
- **Lucide React** - Icon library (only major UI dependency)

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
│   ├── appliers/    # State appliers and providers
│   ├── cards/       # Card components
│   ├── modals/      # Modal dialogs
│   ├── partials/    # Layout partials (Header, Sidebar, etc.)
│   ├── sections/    # Page sections
│   ├── ui/          # Base UI components
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
│   ├── (partial)/   # Partial pages (Error, 404, etc.)
│   └── (user)/      # User-specific pages
├── redux/           # Redux store and slices
├── services/        # API service functions
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

### RouteMenu Class

The **RouteMenu class** is a custom routing solution that provides:

- **Dynamic route generation** based on user roles and permissions
- **Role-based access control** for different user types
- **Nested routing structure** with automatic layout application
- **Menu integration** with route definitions
- **Type-safe routing** with TypeScript support

This custom routing system allows for flexible navigation management and ensures that users only see routes they have permission to access.

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

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (recommended) or npm
- **Git**

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd dainikeidin-adminpanel-main
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

All components are built with **TypeScript**, **Tailwind CSS**, and follow consistent design patterns for optimal performance and maintainability.

## 🔐 Authentication & Authorization

The admin panel implements a robust role-based access control system:

- **Super Admin**: Full system access
- **Admin**: User and content management
- **User**: Basic user access

## 📡 API Integration

The application integrates with a RESTful API for:

- User authentication and management
- Event CRUD operations
- File uploads and media management
- Notifications and real-time updates

## 🎯 Key Features in Detail

### Event Management

- **Event CRUD**: Create, read, update, and delete events
- **Media Handling**: Support for event icons and thumbnails
- **Status Control**: Active/inactive status management
- **Featured Events**: Mark events as featured
- **Publishing Control**: Set publish and expiration dates
- **Bulk Operations**: Mass actions for efficiency
- **Layout Options**: Multiple layout types (default, standard, featured, minimal)

### User Experience

- **Responsive Design**: Works seamlessly on all device sizes
- **Real-time Updates**: Live notifications, data synchronization, and instant updates via Socket.io
- **Intuitive Navigation**: Clean, organized interface with custom routing
- **Accessibility**: Built with accessibility best practices

### Performance

- **Code Splitting**: Optimized bundle loading
- **Caching**: Intelligent data caching with React Query
- **Lazy Loading**: Components loaded on demand
- **Optimized Images**: Efficient image handling and optimization

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

---
