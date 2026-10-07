# Jeevasurendar Muthukrishnan — Portfolio

Personal portfolio of a Senior Backend Engineer (Node.js, AWS Serverless, Distributed Systems).
Static site: semantic HTML, CSS and vanilla JavaScript. No build step, no dependencies, no trackers.

Live: https://blue-disk-69ea.jeevasurendar02.workers.dev/

## Run locally

```bash
python -m http.server 8080
```

Open `http://localhost:8080/`.

## Structure

- `index.html` — single-page portfolio (hero, highlights, interactive architecture, AI workflow, experience, skills, contact)
- `css/style.css` — design tokens (dark/light), components, motion
- `css/responsive.css` — breakpoints
- `js/theme.js` — theme toggle (initial theme is set inline in `<head>` to avoid a flash)
- `js/main.js` — nav, tabs, architecture diagram details, scroll reveal, copy email
- `assets/images/` — profile photo (420/720px) and Open Graph image
- `assets/resume/` — resume PDF
- `*.html` (other than index) — legacy URLs that redirect to sections of `index.html`

## Content rule

All content is taken from the resume. When the resume changes, update `index.html`
and the `DETAILS` map in `js/main.js` (the text shown when a diagram node is selected).
