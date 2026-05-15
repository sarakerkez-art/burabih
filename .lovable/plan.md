## Plan

Replace the Anthropic model ID in `src/lib/advice.functions.ts`:

- **Find**: `claude-3-5-sonnet-20241022`
- **Replace**: `claude-haiku-4-5-20251001`

This is the only file in the codebase referencing the model string (verified previously). After the edit, trigger advice generation and check server logs to confirm the 404 is gone and a real response comes through.