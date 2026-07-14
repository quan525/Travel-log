# Travel Log

A Nuxt travel journal backed by a Turso Cloud database through Drizzle ORM.

## Setup

Install dependencies:

```bash
pnpm install
```

Copy `.env.example` to `.env` and configure the application:

```dotenv
TURSO_DATABASE_URL=libsql://your-database-your-org.turso.io
TURSO_AUTH_TOKEN=your-database-token
BETTER_AUTH_SECRET=your-random-secret
GITHUB_CLIENT_ID=your-github-oauth-client-id
GITHUB_CLIENT_SECRET=your-github-oauth-client-secret
```

Create the Turso values with the Turso CLI:

```bash
turso db create travel-log
turso db show travel-log --url
turso db tokens create travel-log
```

Apply the committed Drizzle migrations to Turso:

```bash
pnpm db:migrate
```

Use `pnpm db:generate` after changing a schema file, then run `pnpm db:migrate` again to publish the new migration.

## Development

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Set the same environment variables in the deployment platform before starting the production build. Preview it locally with:

```bash
pnpm preview
```
