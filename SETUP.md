# Harvest Config Setup

Run this when setting up for the first time, or when your Harvest projects have changed.

Trigger: user says "run setup" or "regenerate config"

## Steps

### 1. Load credentials
- Read `.env` from current directory
- Extract `HARVEST_ACCESS_TOKEN` and `HARVEST_ACCOUNT_ID`
- If either is missing, stop and tell the user what's missing

### 2. Fetch projects from Harvest
- **Important:** The `/v2/projects` endpoint requires admin access and will return "Not authorized!" for regular members. Use the user's project assignments endpoint instead.
- GET https://api.harvestapp.com/v2/users/me/project_assignments?is_active=true
  - Header: `Authorization: Bearer {HARVEST_ACCESS_TOKEN}`
  - Header: `Harvest-Account-Id: {HARVEST_ACCOUNT_ID}`
  - Header: `User-Agent: Claude Timesheet Filler`
- This returns all projects assigned to the user, along with their task assignments inline (no separate task fetch needed)
- Build a map of: project name → project_id → list of (task name → task_id) from the response

### 3. Show the user what was found
- Print a clean summary of all projects and their tasks found
- Example:
  "Found 3 projects:
   - Client Alpha (id: 12345): Development, Meetings, Code Review
   - Internal (id: 12346): Meetings, Admin
   - Project Beta (id: 12347): Design, QA"
- Ask: "Does this look right? Type yes to continue or tell me what to adjust."

### 4. Ask for defaults
- "What is your default working hours per day?" (suggest 8 but be ready to accept decimal values like 7.5)
- Wait for answer

### 5. Write config.json
- Generate and write `config.json` in the current directory using this structure:

{
  "default_hours_per_day": <answered above>,
  "harvest": {
    "projects": {
      "<project name>": {
        "project_id": "<id>",
        "tasks": {
          "<task name lowercase>": "<task_id>",
          ...
        }
      }
    }
  },
  "calendar_meeting_keywords": {}
}

- Confirm: "config.json has been written. You can add calendar keyword mappings
  manually in config.json, or ask me to suggest some based on your meeting history."

### 6. Google Calendar setup
- Ask: "Would you like to set up Google Calendar integration now? (This lets me read your meetings automatically)"
- If yes, follow the steps in `GOOGLE_CALENDAR_SETUP.md`
- If no, skip — the user can say "setup google calendar" later

### 7. Done
- Tell the user they can now use CLAUDE.md workflow to fill timesheets
- Remind them: if projects change, just say "run setup" again to regenerate