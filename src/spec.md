# Specification

## Summary
**Goal:** Roll back the latest pricing/formula change by restoring frontend-only calculation for Intrinsic Price and Actual Value, ensuring displayed results match the previously-correct behavior.

**Planned changes:**
- Update result rendering so “Intrinsic Price” always uses `calculateIntrinsicPrice(inputs)` and “Actual Value” always uses `calculateActualValue(inputs)`, ignoring any `backendResult` fields for displayed values.
- Remove the “✓ Calculated by backend” indicator from the results UI since backend-derived values will no longer be used for display.
- Update the developer verification (“Run Dev Check”) flow to compute AA/BB/CC/DD and Intrinsic/Actual values using the same frontend formula functions used in the UI (e.g., `calculateHiddenValues`, `calculateIntrinsicPrice`, `calculateActualValue`) rather than backend results.
- Adjust/disable backend-loading and backend-error UI states that would otherwise block or degrade the experience when calculating/displaying results, while keeping existing form/actions (Use Example, Reset, Copy Shareable Link) unchanged.

**User-visible outcome:** Clicking “Intrinsic Price” or “Actual Value” immediately shows values computed by the frontend formulas (no backend-calculated indicator or blocking backend loading), and the dev check validates the same restored frontend calculations without requiring backend results.
