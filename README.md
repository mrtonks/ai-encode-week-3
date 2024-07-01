# AI Paintings description assistant
## Overview
This project is part of third weekend assignment. The goal is to create an application using Next.js and OpenAI's API that allows users to get detailed descriptions of paintings based on short descriptions they provide.

## Team members (Group 8)
1. Jesús Vera - 2vJSPK 
2. Aleksandar Brayanov - 4bwGEs 
3. Sofía Orellano - tJ5Mon

## Project features
- **Theme Selection**: users can select painting themes from a list.
- **Description generation**: the assistant generates detailed descriptions of paintings based on user-provided inputs, including elements, style, details, and colors.
- **Stream description response**: responses are streamed in real-time, providing immediate feedback and enhancing user interaction.
- **Display of user input in chat mode**: user inputs and AI responses are displayed in a chat-like interface, mimicking a conversation for better user experience.
- **Animation loading**: an animation is shown while the AI assistant processes the user's request, indicating that the system is working (aligning with Norman's feedback principle).
- **Display real-time assistant name**: the AI assistant name is displayed in real-time, personalizing the interaction and making it more engaging for the user.

## Getting Started
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Pre-requisites
Install dependencies:
```bash
npm install
# or
yarn install
```

## Running the Development Server
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
