# Family Contacts

This project is a simple, dark‑themed single‑page web application for
displaying a list of family members along with their phone numbers. It
features smooth CSS animations, an elegant layout and responsive
design, and uses modern vanilla JavaScript with no frameworks. Each
contact appears as a card in a grid on a black background; clicking
the card initiates a phone call (`tel:` link) and marks that contact
as *called* using data persisted in your browser’s `localStorage`.

## Project structure

```
.
├── index.html        # Main HTML page with header, grid and footer
├── styles.css        # Dark‑themed styling and responsive layout
├── app.js            # JavaScript to fetch data and manage state
├── data/
│   ├── contacts.json # JSON file containing names, phone numbers and image paths
│   └── contacts.js   # Fallback JS file with the same data for file:// use
├── assets/
│   └── avatar.png    # Default avatar used for contacts
└── README.md         # This file
```

### Customising contacts

Modify either `data/contacts.json` **or** `data/contacts.js` to reflect
your actual contact names, phone numbers and avatar images. Each entry
should be an object with at least `name` and `phone` properties. You
can optionally specify an `image` property pointing to a file in the
`assets` folder. For example:

```json
[
  { "name": "Your Name", "phone": "+880123456789", "image": "assets/avatar.png" },
  { "name": "Another Person", "phone": "+880987654321" }
]
```

## Running locally

You can run the site in two ways, depending on whether you are
serving files over HTTP or opening them directly from your file
system.

### Opening via `file://`

If you double‑click `index.html` to open it directly (the URL will
start with `file://`), most browsers block `fetch()` calls to JSON
files due to security policies. To circumvent this, the project
includes `data/contacts.js`, which defines a global `contactsData`
array. When you open the site from the file system, `app.js` will use
this JavaScript file to populate the contacts grid. Just remember to
edit both `data/contacts.json` and `data/contacts.js` whenever you
change your contacts.

### Serving via HTTP

Alternatively, run a simple static server and view the site over HTTP.
In this mode `app.js` will fetch `data/contacts.json` directly. For
example, using Python 3 from the project directory:

```bash
python -m http.server
```

Then navigate to `http://localhost:8000` in your browser. This
approach avoids any cross‑origin issues and doesn’t require the
fallback JavaScript file.

## Deploying to GitHub Pages

GitHub Pages makes it straightforward to host a static website. Follow
these steps to publish this project:

1. Create a new repository on GitHub (e.g. `family-contacts`). Leave
   it public or private as you prefer.
2. Clone your new repository locally and copy the files from this
   project into it. Commit and push the changes to GitHub:

   ```bash
   git clone https://github.com/<your-username>/family-contacts.git
   cd family-contacts
   # Copy or create the project files here
   git add .
   git commit -m "Initial commit of family contacts site"
   git push origin main
   ```

3. In your repository on GitHub, go to **Settings → Pages**. Under
   **Source**, choose the **main** branch and set the folder to
   `/ (root)`. Save your settings. GitHub will build and deploy
   your site.

4. After a minute or two, you should see a link to your site,
   typically `https://<your-username>.github.io/family-contacts/`. Click
   the link to view your deployed contacts page.

That’s it! Any time you make changes locally, commit and push them
again. GitHub Pages will update your site automatically.

## Accessibility notes

The markup uses semantic elements (`header`, `main`, `footer`) and
provides ARIA labels for the contact links. Colour contrast has been
considered for readability on a dark background, and animations are
disabled for users who prefer reduced motion.

## Icons

SVG icons are embedded directly within the markup. The telephone
icon, check mark and x symbol are based on the open source
Bootstrap Icons set【337561843379532†L74-L78】【786246716682328†L74-L79】【90892004577163†L73-L79】.