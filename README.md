# Isaac Waithaka, crane bay portfolio

Live at **https://waithakar.github.io**

The site is a night machine shop with an overhead crane. Every project or section is a machine on the shop floor (a "station") and a section on the page. Visitors drive the crane with the yellow pendant, the arrow keys, or by tapping a machine, or they can just scroll.

## The one file you edit

**`content.js`** holds every word on the site. You never need to open the other files to change content.

| File | What it is | Edit it? |
|---|---|---|
| `content.js` | All your text, numbers, links, and figures | Yes |
| `assets/` | Images and your resume PDF | Add files here |
| `index.html` | Page frame and the pendant | Rarely |
| `css/site.css` | Colors, fonts, layout | Only for design changes |
| `js/scene.js` | The crane and machine drawings | Only to add a new machine drawing |
| `js/app.js` | Builds the page and runs the crane | No |

To preview on your computer, double click `index.html`. It opens in your browser with no setup.

## Add a project

1. Open `content.js` and find the block for a project that looks like what you want (for example the `gearbox` block).
2. Copy the whole block, from its `{` to its closing `},`.
3. Paste it where you want the new station to sit. The crane visits stations in the order they appear.
4. Change `id` to a new short name with letters and numbers only, for example `turbine`.
5. Change the words. Delete any field you do not need.
6. Save and refresh the page.

## Add a new section

Same steps as a project. Give it a new `group` name, for example `group: "Research"`, and the header rail gets a new label automatically.

## Add photos

1. Put the image in the `assets` folder. Keep it under about 400 KB (export JPG at around 1600 px wide).
2. In the station block, add it to `figures`:

```js
figures: [
  { src: "assets/gearbox-printed.jpg", alt: "Printed PLA planetary stages on the bench", caption: "Stage 2 and 3 after the tolerance study." }
]
```

Add `half: true` to put two images side by side. Use `images: [...]` inside one figure for a row of small pictures (see the `hook` block). When the photos arrive, delete the `placeholder` line from that station.

## Add your resume button

Put the PDF in `assets`, then set `resume: "assets/Isaac_Waithaka_Resume.pdf",` near the top of `content.js`.

## Every field a station can use

| Field | Example | What it does |
|---|---|---|
| `id` | `"gearbox"` | Link name for the section, letters and numbers only |
| `group` | `"Projects"` | Label on the header rail; stations in a row with the same group share one label |
| `station` | `"Gearbox"` | Short name under the machine and on the pendant |
| `machine` | `"gearbox"` | Which drawing to use (list below) |
| `tag` | `"TME 342"` | Course number or small label |
| `status` | `"In progress"` | Yellow badge |
| `title` | `"Planetary gearbox..."` | Section heading |
| `meta` | `"Mechanical Design II, team of 9"` | Line under the heading |
| `tiles` | `[["80:1", "reduction over 3 stages"]]` | Big numbers row, number first then label |
| `text` | `["Paragraph one.", "Paragraph two."]` | Paragraphs |
| `listTitle` | `"My part so far"` | Small heading above the list |
| `list` | `["Point one.", "Point two."]` | Bullet list |
| `note` | `"Model goes up in 2027."` | Highlighted note |
| `specs` | `[["Reduction", "80:1"]]` | Two column spec table |
| `figures` | see above | Images with captions |
| `placeholder` | `"Photos are coming."` | Dashed empty frame for photos you will add later |
| `scope` | `true` | Shows the interactive scope (built for the acoustic project) |
| `cards` | `[{ tag, title, text, status }]` | Grid of small project cards |
| `entries` | `[{ when, title, org, text, list }]` | Dated rows for education or jobs |
| `groups` | `[{ title, text }]` | Two column skill grid |
| `contact` | `true` | Big email link and buttons |

## Machine drawings

`gantry`, `hook`, `gearbox`, `mill`, `printer`, `flume`, `bench`, `desk`, `toolboard`, `locker`, `door`, `crate`

Any other name falls back to `crate`. New drawings go in `js/scene.js`; ask Claude to draw one (for example a wind turbine nacelle or an electrolyzer stack).

## Publish changes

GitHub Pages serves this repo directly, so any change on the main branch is live within a minute or two.

1. On github.com, open the repo and click **Add file**, then **Upload files**.
2. Drag in the changed files, keeping the same folders (`content.js` at the top, images inside `assets`).
3. Click **Commit changes**.

## Notes

1. Hyphens appear only inside standard names and file names (AGMA 2001-D04, 3/8-16 UNC), where removing them would make them wrong.
2. Fonts are Barlow, Barlow Condensed, and B612 Mono, stored in `assets/fonts` under the SIL Open Font License.
3. The pendant Stop button turns all animation off. The site also follows the visitor's reduced motion setting.
4. The scope in the acoustic project is an illustration of the finding, labeled as such, not the raw recording.
