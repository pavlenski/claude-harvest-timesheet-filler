# Timesheet Automation

## What this does
Reads my Google Calendar for meetings and fills my Harvest timesheet.
Run this daily, at end of day.

## How to run
Activate by saying something like:
"Fill my timesheet. Today I worked on Client Alpha API and did some code review."
or like:
"Fill my timesheets for last week's friday. I worked on refactoring & cleaning up project Sigma"
or like:
"Fill my timesheets for the whole past week."

## Behaviour rules
- Load env from `.env` in this directory
- Load project mappings from `config.json`
- Fetch today's calendar events from Google Calendar (skip all-day events)
- Map meeting titles to Harvest projects using `calendar_meeting_keywords` in config
- All meetings that last for 15 should be logged as 30 minutes in Harvest instead
- Allocate remaining hours across projects I describe in natural language
- Hours must add up to `default_hours_per_day` - ask me if unclear
- Round time entries to nearest 0.25h
- If the user asks to log timesheets for a whole week, ask him what on each, and follow regular rules for daily inputs
- If the user asks to log timesheets for a whole wee, also allow him an option to skip a day
- For this specific user always make sure that 7.5 hours have been logged for each work day (7hours 30 minutes total)
- Before submitting, show me a summary and ask for confirmation
- Use Harvest API v2: https://help.getharvest.com/api-v2/

## Auth
- Harvest: Bearer token from .env
- Google Calendar: OAuth via credentials/google-calendar.json