# KDU Dev Community — Stage 02: Build Your Portfolio

The follow-along guide used in **Stage 02 — Development & GitHub**, the second
workshop of the KDU Global Developer Community series *Design. Develop. Deploy.*

Students open this page on their own machine and build a personal portfolio one
step at a time. Every step shows the **whole file** with the **new lines
highlighted in green**, next to a **live preview** of the result — so anyone who
looks up after thirty seconds can see exactly what to type.

**Live:** https://kdu-stage02.netlify.app *(replace with your address)*

---

## What's in it

**Part 1 — The header (steps 1–12)**
Built together during the workshop. Project setup, the HTML skeleton, the
navigation bar, the hero section, Flexbox, a responsive media query, and a
working dark-mode toggle.

**Part 2 — The full page (steps 13–20)**
Finished at home. About, Skills, Projects, Contact, the footer, dark mode for
the whole page, and pushing the result to GitHub.

## Features

- Cumulative code view — the full file at every step, not a fragment
- New lines highlighted, with a dot on the tab that changed
- Live preview with a **Desktop / Phone** toggle, so the responsive step
  demonstrates itself
- Copy-file button, arrow-key navigation, and a URL hash (`#step-7`) so you can
  link straight to a step from a slide or a chat message
- No build step, no dependencies, no network calls — it works offline, which
  matters in a computer lab

---

## Running it

It is a static site. Nothing to install.

```bash
git clone https://github.com/YOURNAME/kdu-stage02-guide.git
cd kdu-stage02-guide
```

Then open `index.html` in a browser, or serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

In VS Code, the **Live Server** extension does the same thing with a right-click.

## Deploying

**Netlify** — drag the project folder onto [netlify.com/drop](https://app.netlify.com/drop).
Live in about ten seconds. For automatic updates, connect the repository instead:
no build command, publish directory `.`.

**GitHub Pages** — Settings → Pages → Deploy from branch → `main` → `/ (root)`.

---

## Project structure

```
kdu-stage02-guide/
├── index.html        the page shell — markup only
├── css/
│   └── style.css     how the guide looks
├── js/
│   ├── steps.js      THE CONTENT — all 20 steps live here
│   └── app.js        the machinery — rendering, preview, navigation
└── README.md
```

The split is deliberate and it is the same lesson the workshop teaches:
structure, appearance and behaviour each get their own file.

## Editing the workshop content

Everything a facilitator needs to change is in **`js/steps.js`**. Each step is
one object:

```js
{
  part: 1,                          // 1 = built live, 2 = homework
  title: 'CSS: style the hero',
  blurb: 'One short line under the title.',
  why:   'The teaching note. HTML allowed.',
  changed: 'What the student should now see on screen.',
  extra: '<div class="term">optional extra block</div>',   // optional
  adds: {
    head: ['lines added inside <head>'],
    body: ['lines added inside <body>'],
    css:  ['lines appended to style.css'],
    js:   ['lines appended to script.js']
  }
}
```

Add a step by copying an object into the right position in the `STEPS` array.
Numbering, the sidebar, the progress bar and the file rebuild all follow
automatically — there is no index to keep in sync.

Two special keys exist, both already used and neither normally needed again:
`scaffold: true` marks the step that creates the HTML document skeleton, and
`removeHello: true` deletes the placeholder `Hello, World!` line.

## Changing the example portfolio

The portfolio colours are set inside the step content in `js/steps.js`
(`#6D4AFF` purple, `#111827` navy, `#EEE9FF` lavender). Changing them there
changes what students type and what the preview shows, together.

The guide's own appearance is separate, in `css/style.css`.

---

## Workshop series

| Stage | Topic | Date |
|---|---|---|
| 01 | UI / UX Design | 11 November 2026 |
| 02 | Development & GitHub | 18 November 2026 |
| 03 | Deployment | 25 November 2026 |

Wednesdays, 3:00–4:30 PM · Woodang Computer Lab, Room 1321 · Kyungdong University

## Licence

MIT — use it, fork it, run it at your own university.
