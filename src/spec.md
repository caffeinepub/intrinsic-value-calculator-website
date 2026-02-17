# Specification

## Summary
**Goal:** Default the “Result Updated Since 6 Months” field to “Yes” while ensuring URL query values for `res6y` still override the default when explicitly provided.

**Planned changes:**
- Update the app’s default inputs so the “Result Updated Since 6 Months” radio field is `Yes` when the app loads with no URL parameters.
- Ensure any “Reset” behavior that restores default inputs also restores this field to `Yes`.
- Adjust URL query parsing/encoding for `res6y` so explicit `res6y=false` is respected (and `res6y=true` remains supported), while keeping the parameter name `res6y` unchanged for backward compatibility.

**User-visible outcome:** On a fresh load, the “Result Updated Since 6 Months” option is preselected as “Yes”; shared links using `res6y=true/false` correctly reflect and restore the selected value.
