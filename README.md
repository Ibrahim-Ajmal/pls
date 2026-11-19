# BONIT AI

A responsive Next.js starter website for BONIT AI with a dark graphite / cosmic silver visual direction and a Gemini-powered chat page.

## Included
- Home page
- AI chat page (`/chat`)
- Conversation history (`/history`) stored in this browser
- Plans (`/plans`) showing the four proposed price points: $75, $150, $220 and $330
- Account placeholder (`/account`)
- Settings (`/settings`)
- Privacy, Terms, Cookies and Refund policy draft pages
- Server-side Gemini API route (`/api/chat`)

## Run locally
1. Install Node.js 20.9+ (or a compatible current LTS).
2. Extract the ZIP and open the folder in VS Code.
3. Run `npm install`.
4. Copy `.env.example` to `.env.local`.
5. Add a **new** Gemini API key to `.env.local`:
   ```env
   GEMINI_API_KEY=your_new_key_here
   GEMINI_MODEL=gemini-2.5-flash
   ```
6. Run `npm run dev` and open http://localhost:3000.

## Security
- The Gemini key is read only by the server route. Never add it to client code or use a `NEXT_PUBLIC_` prefix.
- The key previously pasted into chat should be revoked and replaced.
- `.env.local` is ignored by Git.
- Add production rate limiting, abuse controls, monitoring and authentication before public launch.

## Important launch limitations
This is a working starter, not a fully launched SaaS:
- No user authentication or cloud database is connected.
- Chat history is local to the browser/device.
- The pricing page is informational; Stripe or another payment provider is not connected.
- Legal pages are draft placeholders and require review.
- The contact address and company/legal details must be replaced with verified information.
- Review the configured Gemini model name against the models available to your API key.

## Project structure
```text
app/
  api/chat/route.ts
  chat/
  history/
  plans/
  account/
  settings/
  privacy/
  terms/
  cookies/
  refunds/
components/site-shell.tsx
.env.example
```
