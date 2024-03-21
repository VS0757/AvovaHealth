This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## To Run Locally

In the backend folder, run 'node src/server.js' and then in a separate terminal in the frontend folder, run 'npm run dev' and then go to the local host website, http://localhost:3000

To test the backend, go to http://localhost:3001

## Backend .env file - create this under the backend folder

PORT=3001
OPEN_AI_SECRET_KEY= Text me (Ved) and I'll give it to you since it's attached with a personal account that Anthony's card is on
AWS_BUCKET_NAME=bloodworkdatastorage
AWS_REGION=us-east-1
AWS_SECRET_ACCESS_KEY= Text me (Ved) and I'll give it to you, it's not visible in AWS
AWS_ACCESS_KEY_ID=In AWS console, go to IAM->Users->avovahealth->Access key 1 in Summary

## Frontend .env file - should be in Vercel, but otherwise under frontend folder