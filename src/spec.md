# Specification

## Summary
**Goal:** Remove the formulas section and industry growth percentage field from the DCF calculator.

**Planned changes:**
- Remove the "View formulas" button and FormulasDialog component from the calculator interface
- Remove the "Industry Growth Percentage" input field from the DCF inputs form
- Remove the industryGrowthPercent field from the DcfInputs interface and all preset configurations
- Update backend DcfInput type to remove industryGrowthPercent field
- Remove all references to industryGrowthPercent from formulas and calculation logic

**User-visible outcome:** The calculator no longer displays the formulas dialog button or the industry growth percentage input field, resulting in a simplified interface.
