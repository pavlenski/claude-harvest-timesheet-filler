# Claude Timesheet Filler

Reads your Google Calendar and fills your Harvest timesheet via Claude Code.

---

## Prerequisites

- [Claude Code](https://claude.ai/code) installed
- A Harvest account with an active access token
- A Google Cloud project with OAuth 2.0 credentials

---

## Setup

### 1. Harvest credentials

Add your Harvest credentials to a `.env` file in this directory:

```
HARVEST_ACCOUNT_ID=your_account_id
HARVEST_ACCESS_TOKEN=your_access_token
GOOGLE_CALENDAR_ID=your.email@example.com
```

Get your token at: **Harvest → Settings → Developers → Personal Access Tokens**

> Note: `/v2/projects` requires admin access. This tool uses `/v2/users/me/project_assignments` instead, which works for regular members.

---

### 2. Generate config.json

In Claude Code, run:

```
run setup
```

This will:
- Fetch your assigned projects and tasks from Harvest
- Ask for your default hours per day
- Write `config.json` with your project/task mappings

---

### 3. Google Calendar auth

**Prerequisites:**
- OAuth 2.0 credentials file saved at `credentials/google-calendar.json` (type: Desktop app)
- Google Calendar API enabled on your Google Cloud project
  - Enable at: `https://console.developers.google.com/apis/api/calendar-json.googleapis.com/overview?project=YOUR_PROJECT_NUMBER`
  - Project number is the digits before the `-` in your `client_id`

**Run the auth script:**

```bash
node google-auth.js
```

The script will print an authorization URL. Open it in your browser, authorize access, and the token will be saved to `credentials/google-calendar-token.json` automatically.

> Access tokens expire after 1 hour. The refresh token is saved and Claude will refresh it automatically when needed.

---

## Usage

Tell Claude Code what you worked on:

```
Fill my timesheet. Today I worked on Client Alpha API and did some code review.
```

```
Fill my timesheets for last week's Friday. I worked on refactoring project Sigma.
```

```
Fill my timesheets for the whole past week.
```

Claude will:
1. Fetch your calendar events for the day(s)
2. Map meetings to Harvest projects using `calendar_meeting_keywords` in `config.json`
3. Log meetings that are 15 min as 30 min
4. Allocate remaining hours across projects you describe
5. Show a summary and ask for confirmation before submitting

---

## Files

| File | Description |
|---|---|
| `.env` | Harvest + Google Calendar credentials (not committed) |
| `config.json` | Project/task mappings and default hours per day |
| `google-auth.js` | One-time OAuth flow for Google Calendar |
| `credentials/google-calendar.json` | Google OAuth client credentials (not committed) |
| `credentials/google-calendar-token.json` | Google OAuth tokens (not committed) |
| `CLAUDE.md` | Behaviour rules for Claude Code |
| `SETUP.md` | Detailed Harvest setup instructions for Claude |
| `GOOGLE_CALENDAR_SETUP.md` | Detailed Google Calendar setup instructions for Claude |

---

## Re-running setup

If your Harvest projects change:

```
run setup
```

If your Google token stops working:

```bash
node google-auth.js
```
