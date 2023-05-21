## Estimation Party

You can learn more about my journey to creating this "Planning Poker" web app at my blog [here](https://groff.dev/blog/creating-a-live-estimation-app-with-chatgpt).

## Running the app locally
Create a `.env.local` file in the root directory of the project and add the following environment variables:
```bash
# Server
SUPABASE_URL=
SUPABASE_ANON_KEY=

# Client
NEXT_APP_SUPABASE_URL=
NEXT_APP_SUPABASE_READONLY_KEY=

```

Then run the following commands:

```bash
npm install
npm run dev
```