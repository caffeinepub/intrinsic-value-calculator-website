# Intri - User Profile Feature

## Current State
App has Internet Identity login gate. Backend already has saveCallerUserProfile, getCallerUserProfile, getAllUserProfiles APIs with UserProfile type (firstName, lastName, mobileNumber). AdminMessages component shows contact messages to admins.

## Requested Changes (Diff)

### Add
- After successful login, check if user has a saved profile. If not, show a profile form asking for First Name, Last Name, and Mobile Number before showing the main app.
- New AdminUsers component (or tab inside admin) to show all registered user profiles (firstName, lastName, mobileNumber, principalId) as a table - admin only.

### Modify
- Admin area: add a tab or button to switch between Contact Messages and User Profiles views.

### Remove
- Nothing

## Implementation Plan
1. Create a ProfileForm component that calls getCallerUserProfile on mount. If null, shows a form with firstName, lastName, mobileNumber fields. On submit calls saveCallerUserProfile. On success, proceeds to main app.
2. In App.tsx, after login check, load profile. Show ProfileForm if profile is missing.
3. Create AdminUsers component that calls getAllUserProfiles and displays results in a table.
4. Update AdminMessages (or create an AdminPanel wrapper) to include tabs: "Contact Messages" and "User Profiles".
