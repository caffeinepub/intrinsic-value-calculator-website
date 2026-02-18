# Specification

## Summary
**Goal:** Make the app’s Draft URL easily accessible from the main UI and allow users to manage/save their Live URL locally.

**Planned changes:**
- Render the existing `LiveSiteSection` component within the main `App` page layout in a sensible location.
- Ensure the Draft URL is visible in that section and can be copied using the existing UI behavior (including success/error toasts).
- Keep the existing Live URL input/save/clear/copy/open behavior and persist the saved Live URL via `localStorage` across reloads.

**User-visible outcome:** Users can view and copy the Draft URL from the main page, and can save/manage a Live URL in the app (persisting between visits) using the existing controls.
