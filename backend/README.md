# Tetebatu Tourism Backend

REST API for the Desa Tetebatu tourism directory.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   Copy `.env.example` to `.env` and fill in the required fields.

3. Database setup:
   ```bash
   npx prisma migrate dev
   npm run seed
   ```

## Development

Start the server in development mode:
```bash
npm run dev
```

## API Documentation
Documentation is available at `/api/docs` (Once implemented in Phase 10).

## Health Check
`GET /api/health`
