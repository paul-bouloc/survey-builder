This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Prérequis

- Node.js et pnpm installés
- Docker et Docker Compose installés

### Configuration de la base de données

1. Créez un fichier `.env` à la racine du projet :

```env
# MongoDB Configuration
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=admin123
MONGO_DATABASE=classeo

# MongoDB Connection String
MONGODB_URI=mongodb://admin:admin123@localhost:27017/classeo?authSource=admin

# Mongo Express (Web UI)
MONGO_EXPRESS_USERNAME=admin
MONGO_EXPRESS_PASSWORD=admin123
```

2. Démarrez MongoDB avec Docker :

```bash
npm run docker:up
# ou
npm run db:start
```

3. Accédez à Mongo Express (interface web) : http://localhost:8081

Pour plus de détails, consultez [DOCKER.md](./DOCKER.md).

### Démarrage de l'application

```bash
# Installer les dépendances
pnpm install

# Démarrer le serveur de développement
pnpm dev
# ou
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
