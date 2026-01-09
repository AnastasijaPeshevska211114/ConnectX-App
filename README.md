# ConnectX - Twitter Clone

## Overview
ConnectX is a social media app inspired by Twitter, built with Next.js, React, TailwindCSS, Clerk, and MongoDB.

## Technologies
- Next.js 14
- React
- TailwindCSS
- Typescript
- Clerk (for authentication)
- MongoDB (database)


It is available at the following link: https://connect-x-9g3z.vercel.app/
## How to run locally
1. Clone the repo
2. Run `npm install`
3. Set environment variables as in `.env.example`
4. Run `npm run dev`

Architecture of the app:
app/ – Handles routing and pages

(auth) – Authentication flow (login, register, onboarding)

(root) – Core application features (tweets, profiles, groups, search, notifications)

api/ – Backend API routes (Clerk webhooks)

components/ – Reusable UI components organized by purpose

cards, forms, shared, ui

lib/ – Business logic layer

actions – Server actions

models – MongoDB (Mongoose) models

validations – Input validation

mongoose.ts – Database connection

public/assets/ – Static assets (images, icons)

Clerk – Authentication and user management






