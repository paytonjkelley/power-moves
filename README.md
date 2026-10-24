# Power Moves — Website

Static homepage for **Power Moves** (Sections 01–04: Hero, More Than a Charge, How It Works, Explore Experiences, plus the site footer).
Plain HTML, CSS and JavaScript with no build step, ready for GitHub Pages.

## Files

```
index.html              Homepage (all four sections)
assets/css/styles.css   Brand tokens + all styles (colors and fonts at the top)
assets/js/main.js       Menus, dropdowns, filters, carousel, "coming soon" messages
assets/img/             Logo monogram, favicons, hero/lifestyle photo
.nojekyll               Tells GitHub Pages to serve files as-is
```

## Publish on GitHub Pages

1. Create a repository (for example `powermoves-site`) and upload **everything in this folder** to the root of the `main` branch. Keep the folder structure exactly as is.
2. In the repo go to **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then **Save**.
4. After a minute the site is live at `https://<your-username>.github.io/<repo-name>/`.

### Using www.powermoveshub.com (when you're ready to switch)

1. In **Settings → Pages → Custom domain**, enter `www.powermoveshub.com` and save (GitHub adds a `CNAME` file for you).
2. At your domain registrar, add a **CNAME** record: `www` → `<your-username>.github.io`.
3. For the bare domain `powermoveshub.com`, add **A** records pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
4. Once DNS connects, tick **Enforce HTTPS**.

Don't do this until you're ready to replace the current site, because it moves the domain over.

## Placeholder links (pages not built yet)

Any link with a `data-soon="…"` attribute shows a small "coming soon" message instead of going anywhere.
When a page launches, set its real `href` and delete the `data-soon` attribute. Search `index.html` for `data-soon` to find them all:

- **Find a Station** (header, mobile menu, hero, How It Works) → station map
- **About**, **Our purpose**, **Up Next · Our Story** → About / mission pages
- **Contact & Partnerships** menu items and mobile chips → contact forms
- **Explore All Experiences** and each experience tile → Experiences Hub
- **Footer** links (About, Contact Us, Host a Station, Support, Privacy Policy, Terms of Use, Accessibility) → their future pages
- **Play** button in Section 02 → motion feature (swap the blurred image for a `<video muted playsinline poster="…">`)

These already work: **Home**, **How It Works**, **Experiences** and **Explore Experiences** scroll to their sections.

## Swapping in real imagery

- **Experience tiles (Section 04):** replace a tile's `<div class="tile-art art-…">` with
  `<img class="tile-photo" src="assets/img/your-photo.jpg" alt="">` and change its tag text from `PHOTO PLACEHOLDER`.
- **How It Works mockups (Section 03):** each `.stage` is a drawn concept. Replace a whole `<div class="stage">…</div>` with an `<img>` of official product photography and remove the `CONCEPT MOCKUP` tag.
- **Concert photo:** it looks like stock imagery. Confirm you have a license before launch.
