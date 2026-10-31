# Deploy note

Last deploy trigger: 2026-10-31T13:55:56.439055+00:00

## Quote workflow (live)

When admin sends a quote (web or mobile):

1. Amount + notes saved on booking
2. Status → \`quoted\`
3. Customer SMS + email use Hail Lions estimate template with:
   - Customer name
   - Quoted amount
   - Vehicle (if known)
   - ACCEPT link → /quote/HL-XXXX

No separate step — this is automatic on every quote send.
