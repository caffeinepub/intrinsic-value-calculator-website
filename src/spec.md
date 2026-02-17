# Specification

## Summary
**Goal:** Remove the “View Formulas” UI so users can no longer access the formulas dialog.

**Planned changes:**
- Remove the “View Formulas” action/button from the action bar.
- Ensure the “All Formulas” dialog is not rendered and cannot be opened anywhere in the UI.
- Clean up any now-unused state, handlers, or props related to the removed formulas UI while keeping all other calculator actions working as-is.

**User-visible outcome:** The app no longer shows a “View Formulas” button and users cannot open the “All Formulas” dialog; all other existing actions continue to function normally.
