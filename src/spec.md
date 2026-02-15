# Specification

## Summary
**Goal:** Update Company Snapshot UI labels and formatting to use INR (₹) for currency fields, add percent handling for specific fields, and correct a timeframe label.

**Planned changes:**
- Replace all visible "$" currency symbols with "₹" for Company Snapshot currency field labels/help text and any frontend currency-formatting helpers.
- Update "Promoter Pledge Quantity" to behave and display as a percentage field, including a "(%)" label and 0–100 validation.
- Rename the user-facing label "Result Updated Since 6 Years" to "Result Updated Since 6 Months" everywhere it appears while keeping existing state/link keys intact.
- Update "Net NPA (NBFC)" to behave and display as a percentage field, including a "(%)" label and 0–100 validation while preserving existing shareable link parameter behavior.

**User-visible outcome:** Company Snapshot shows rupee symbols for currency fields, percentage signs and proper validation for Promoter Pledge Quantity and Net NPA (NBFC), and the corrected "Result Updated Since 6 Months" label without breaking existing shared links.
