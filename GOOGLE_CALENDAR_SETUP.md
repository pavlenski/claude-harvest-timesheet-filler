# Google Calendar Setup

Run this after Harvest setup is complete, or when Google Calendar tokens need to be refreshed.

Trigger: user says "setup google calendar" or after Harvest setup, ask "Would you like to set up Google Calendar integration now?"

## Prerequisites
- A Google Cloud project with a configured OAuth 2.0 Client ID (Desktop app)
- The OAuth credentials file saved at `credentials/google-calendar.json`
- **The Google Calendar API must be enabled** on the Google Cloud project.
  If not enabled, visit: `https://console.developers.google.com/apis/api/calendar-json.googleapis.com/overview?project=<PROJECT_NUMBER>`
  (The project number can be found in `credentials/google-calendar.json` under `client_id`, before the dash)

## Steps

### 1. Check for existing token
- Look for `credentials/google-calendar-token.json`
- If it exists with a `refresh_token`, try refreshing it (see step 4 below). If refresh works, skip to step 5
- If it doesn't exist or refresh fails, continue to step 2

### 2. Run the auth script
- Run `node google-auth.js` — this opens the browser, catches the OAuth redirect on a local server, exchanges the code, and saves tokens to `credentials/google-calendar-token.json` automatically
- The redirect_uri used by the script is `http://localhost:3847` — this must be added as an authorized redirect URI in the Google Cloud Console if not already present

### 4. Refreshing an expired access token
- Access tokens expire after 1 hour. Before any Calendar API call, refresh if needed:
  ```
  curl -s -X POST https://oauth2.googleapis.com/token \
    -d "refresh_token={REFRESH_TOKEN}" \
    -d "client_id={CLIENT_ID}" \
    -d "client_secret={CLIENT_SECRET}" \
    -d "grant_type=refresh_token"
  ```
- Update the `access_token` in `credentials/google-calendar-token.json` with the new value

### 5. Test the connection
- Fetch today's events to verify everything works:
  ```
  curl -s -H "Authorization: Bearer {ACCESS_TOKEN}" \
    "https://www.googleapis.com/calendar/v3/calendars/{CALENDAR_ID}/events?timeMin={TODAY}T00:00:00Z&timeMax={TODAY}T23:59:59Z&singleEvents=true&orderBy=startTime"
  ```
- `CALENDAR_ID` comes from `GOOGLE_CALENDAR_ID` in `.env`
- If you get a 403 "SERVICE_DISABLED" error, the Google Calendar API is not enabled — direct the user to enable it (see Prerequisites)
- Skip all-day events (events where `start` has a `date` field instead of `dateTime`)

### 6. Done
- Confirm: "Google Calendar is connected! I can now read your meetings when filling timesheets."
