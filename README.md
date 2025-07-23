# Project Orca

A Next.js monorepo project with modern tooling and workspace configuration.

## Structure

```
project-orca/
├── apps/
│   └── web/          # Main Next.js application
├── packages/         # Shared packages and libraries
├── package.json      # Root workspace configuration
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm 8+

### Installation

```bash
# Install dependencies for all workspaces
npm install

# Or use the convenience script
npm run install:all
```

### Development

```bash
# Start the development server
npm run dev

# Build the application
npm run build

# Start the production server
npm run start

# Run linting
npm run lint

# Clean all node_modules
npm run clean
```

### Working with Workspaces

```bash
# Run commands in specific workspaces
npm run dev --workspace=apps/web
npm run build --workspace=apps/web

# Install dependencies to specific workspace
npm install <package-name> --workspace=apps/web

# Install dev dependencies
npm install <package-name> --workspace=apps/web --save-dev
```

## Applications

### Web (`apps/web`)

The main Next.js application with:
- TypeScript
- Tailwind CSS
- ESLint
- App Router
- Source directory structure

## Packages

The `packages/` directory is ready for shared libraries and utilities that can be used across multiple applications.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run clean` - Clean all node_modules
- `npm run install:all` - Install all dependencies

## Deployment of the stragies.
scp strategies/binance_strategy.py project-orca:~/ft_userdata/user_data/strategies/