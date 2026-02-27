# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kids Learning Hub is a zero-dependency, client-side educational web app for children (Pre-K through 6th grade) covering Math, English, and General Knowledge. Live at **smartandlearn.com** via GitHub Pages.

## Running Locally

No build step — open `index.html` directly or serve with:

```bash
python3 -m http.server 8000
# Visit http://localhost:8000
```

## Architecture

Single-page application using vanilla HTML/CSS/JS. All navigation is DOM show/hide — no router.

**Key files:**
- `index.html` — single HTML shell; all views are divs toggled visible/hidden
- `app.js` — all app logic: state management, UI navigation, reward system, answer checking, canvas scratch pad (~2,350 lines)
- `math.js` — algorithmic math question generation per topic/grade/difficulty
- `english.js` — English question loader; reads from `questions-english.json` for most topics
- `gk.js` — GK question loader; reads from `questions-gk.json` with grade-based filtering
- `styles.css` — all styling including CSS custom properties and animations

**State:** Global JS variables in `app.js` (no state container). Persisted to `localStorage`:
- `rewardState` — XP, level, coins, gems, chests
- `collectibles` — unlocked mystery buddies
- `feedbackVoiceEnabled` — voice toggle preference

**Question data format** (JSON files):
```json
{ "topic": [{ "q": "question text", "opts": ["A", "B", "C", "D"], "a": "correct answer" }] }
```

Math questions are generated algorithmically — no JSON needed.

## Grade / Difficulty System

- 4 grade bands: Pre-K–1st, 2nd–3rd, 4th–5th, 6th+
- 3 difficulty levels: easy, medium, hard
- Grade affects digit ranges and question complexity; difficulty fine-tunes within grade

## Deployment

Push to `main` branch → GitHub Pages auto-deploys to smartandlearn.com. No CI/CD configured.
