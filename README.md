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


## Deploying a Strategy

For detailed instructions on deploying a validated strategy to a production server, please see our [**Strategy Deployment Guide (DEPLOYMENT.md)**](./DEPLOYMENT.md).

## Development 

First how much you wanted to run the timestamp and the idea my man!!

 date -d '2025-07-25' +%s &  date -d '2025-08-05' +%s 

 run this put values in between then paste on the command my man.

## Download data for given timestamp ok

```
docker compose run --rm freqtrade backtesting --config user_data/config.json --strategy HybridBreakoutTrend --timerange 20250628-20250728 --cache none
```


## Important command to check and work for my entire things 

```
docker compose run --rm freqtrade backtesting --config user_data/config.json --strategy HybridBreakoutTrend --timerange $(date -d "365 days ago" +%Y%m%d)- --cache none
```

Install data for days if you wish
```
 docker compose run --rm freqtrade download-data --exchange binance --timeframes 1h --days 365 --erase
```