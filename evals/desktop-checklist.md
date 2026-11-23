# Desktop app checklist

The simulated tests run in Claude Code. Most people will use a desktop or web app, where installing, saving files and scheduling all work differently. Walk through this by hand in each app before a release that changes how the kit starts, saves or delivers files.

Use a made-up person. The personas in [`personas/`](personas) have a resume and writing samples you can paste. Start from a clean state: a new project or folder, and no memory of you.

## Install

- [ ] **Claude, paid plan:** Customize, Plugins, Add, Add marketplace, Add from a repository, `tjj9020/agentic-job-search-kit`. The plugin appears and installs.
- [ ] **Claude, upload path:** the download link in the README works, and each of the six ZIPs uploads under Customize, Skills.
- [ ] **ChatGPT:** each of the six ZIPs uploads under Skills.
- [ ] The README's menu names match what is on screen. Note any that differ.

## First conversation

- [ ] "help me with my job search" starts the kit. So does "i need a new job".
- [ ] It says where it will keep things, in one plain line, before saving anything.
- [ ] If it asks to use a folder, the request is in plain words and saying yes works.
- [ ] It accepts a resume dragged in as a Word or PDF file, and as pasted text.
- [ ] After the resume it asks four questions, one at a time, each with an example.
- [ ] It never shows a file name, a command, or the word "skill".

## Coming back

- [ ] Close the app. Open it again in the same project or folder and say "whats next". It knows where you left off without being told.
- [ ] In an app that cannot keep files: it gave you a file at the end, and attaching that file to a new chat picks up where you left off.
- [ ] Take-home file has a dated name. A second one the same day ends in -2, also in a new chat when you attach a file dated today.
- [ ] With two attached, the newest is used and it says which copy, by its date.
- [ ] An undated my-job-search.md attached with dated ones is treated as the oldest.
- [ ] After a tailored resume, or job report feedback like "skip sales jobs", by the time you say you're done for today, you have the updated take-home file under today's date.

## Daily job report

- [ ] "whats new today" produces a report, or says plainly that this app cannot search the web.
- [ ] It says where it will look, and the report ends with "Where I looked".
- [ ] Asked to send it every morning, it either sets that up or says this app cannot and tells you what to say instead.
- [ ] After you say "i applied to that one", the next report leaves that job out.

## Resume and interview

- [ ] "tailor my resume to this job" with a pasted posting shows what matches and what is missing, then waits.
- [ ] The finished resume arrives as a Word document, or as clean text with instructions to paste into Word. Never as a Markdown file.
- [ ] Resume is named `<Name>-Resume-<company>-<role>.docx` (or `.pdf`): first and last name only, a short company and role in letters and numbers only, words joined by hyphens. Try a posting title with a "/" or comma.
- [ ] Interview brief is named `<Name>-Brief-<company>-<role>.docx` (or `.pdf`) the same way.
- [ ] Asked to exaggerate, it declines and offers a true alternative.
- [ ] "i have an interview thursday" produces a one-page brief you could print.

## LinkedIn

- [ ] "fix up my linkedin" starts by saying whether it can open a browser here.
- [ ] With a browser: it asks before using it, waits for a yes on each change, and never asks for a password.
- [ ] Without one: it says so and gives text to paste.

## Record what you find

Open an issue for anything that fails, with the app name and version, what you said, and what happened.
