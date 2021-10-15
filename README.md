# Food Self Reviews

An application which allows users to track places they've visited, and opinions on individual items at those places.

Currently implemented:
- clientside/IndexedDB storage of visited restaurants, and location suggestions
- Azure maps API-powered location suggestions biased to the user's current location
- Azure NLP API-powered opinion mining in order to automatically extract relevant content from reviews

Hope to implement soon:
- Automatic ML-powered tagging of opinion items
  - Goal is to have a multi-class text classifier trained offline on each user's set of visits with tensorflow.js or similar
  - Would have pre-trained list of tags
- Searching across all restaurants for things that I liked the most, e.g. "show me my favorite places for burgers"

Stack:
- Node.js + TypeScript + Koa for backend server
- React for frontend app

## Setup

One-time setup:
1. Clone repo
2. `npm i` in client + server
4. Add a `.env` file in `server` (or wherever the working directory you'll be running it from is), containing environment variables specified by the `Environment` class.

Build & Run:
1. `npx tsc` in `server`
2. `npm run build` in `client`
3. `node dist/main.js` in `server`