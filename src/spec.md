# Specification

## Summary
**Goal:** Remove the previously added “Capital Return (CR)” output section so Output Values only shows Buy and Target price results.

**Planned changes:**
- Remove the Capital Return (CR) results card/section from the Output Values / ResultsSection UI.
- Remove CR-specific state, calculation/formula extraction, and any related imports so calculation runs cleanly without TypeScript/runtime errors.

**User-visible outcome:** After clicking “Calculate Buy & Target price,” users see only the Buy and Target price cards; no Capital Return (CR) section is shown.
