Demo Pizza application server based on GraphQL and Prisma.

Install Prisma: https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-cli/installation

Install dependencies:

```bash
npm install
# or
yarn
```

Generate schema:

```bash
prisma generate
```

Deploy:

```bash
PRISMA_ENDPOINT=your_prisma_endpoint PRISMA_SECRET=your_prisma_secret prisma deploy
```

Run:

```bash
PRISMA_ENDPOINT=your_prisma_endpoint PRISMA_SECRET=your_prisma_secret APP_SECRET=your_app_secret npm run start
# or
PRISMA_ENDPOINT=your_prisma_endpoint PRISMA_SECRET=your_prisma_secret APP_SECRET=your_app_secret yarn start
```

