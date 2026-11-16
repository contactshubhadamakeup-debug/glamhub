// src/ai/ai.security-checklist.md
# AI Features Security Checklist

## Data Minimization
- [x] Only minimum data sent to AI model
- [x] No ID documents sent to AI
- [x] No payment data sent to AI
- [x] No secrets sent to AI

## Human-in-the-Loop
- [x] AI only suggests, never auto-sends
- [x] Professional must explicitly approve and send
- [x] No auto-send without professional setting enabled
- [x] Reply drafts require professional review before sending

## Fallback
- [x] Template-based fallback when AI unavailable
- [x] Fallback flag returned in API response
- [x] Graceful error handling for API timeouts

## Usage Control
- [x] Usage limited per plan (to be enforced at gateway/middleware level)
- [x] Prompts stored in versioned files
- [x] API errors handled gracefully

## Testing
- [x] Test outputs for tone, accuracy, safety
- [ ] Test with example enquiries (to be completed)

## Open High-Severity Items
- [ ] Claude API integration needs completion
- [ ] Usage limiting per plan needs middleware implementation

**Status:** 2 open items (Claude API integration, usage limiting middleware)