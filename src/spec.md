# Specification

## Summary
**Goal:** Remove the Industry Growth input and eliminate all related link encoding/decoding and output calculation/UI references.

**Planned changes:**
- Remove the “Industry Growth (%)” field/section from the Company Snapshot form, including any defaults/examples and any validation tied to it.
- Update shareable-link query parameter handling to stop generating `indGrowth` and to safely ignore `indGrowth` when present in older links.
- Update output calculations and results UI copy so “Actual Value” and “Actual Value Per Share” no longer reference or depend on Industry Growth, including any displayed formulas/descriptions.

**User-visible outcome:** Users can no longer view or edit Industry Growth, shareable links no longer include an industry growth parameter (and older links still load), and results/“Actual Value” outputs no longer mention or use Industry Growth.
