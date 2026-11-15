# Power Moves — Website

Static website for **Power Moves**: the homepage (Sections 01–05: Hero, More Than a Charge, How It Works, Explore Experiences, Built on Purpose), the About page and the Contact & Partnerships page, with a shared header and footer.
Plain HTML, CSS and JavaScript with no build step, ready for GitHub Pages.

## Files

```
index.html              Homepage (Sections 01–05)
about.html              About / Our Purpose page
contact.html            Contact & Partnerships page (contact form + prayer requests)
assets/css/styles.css   Brand tokens + all styles (colors and fonts at the top)
assets/js/main.js       Menus, dropdowns, filters, carousel, "coming soon" messages
assets/js/contact.js    Contact + prayer forms: validation, counters, submission (inbox addresses set here)
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
- **Explore All Experiences** and each experience tile → Experiences Hub
- **Footer** links Privacy Policy, Terms of Use, Accessibility → their future pages (also the Privacy Policy links inside both contact forms)
- **Play** button in Section 02 → motion feature (swap the blurred image for a `<video muted playsinline poster="…">`)

These already work: **Home**, **How It Works**, **Experiences** and **Explore Experiences** scroll to their sections, and **About**, **Our purpose**, **Discover Our Story** and **Up Next · Our Story** go to the About page or Section 05. Every contact link (header menu, mobile chips, footer, About page buttons) goes to `contact.html` with its reason preselected.

## Connecting the contact forms (required before launch)

The forms use **FormSubmit** (formsubmit.co), which emails each submission straight to your inbox. There's no account to create. GitHub Pages can't send email by itself, so FormSubmit acts as the relay.

Until a form is connected it shows "This form isn't connected yet, so nothing was sent" and keeps what the visitor typed. It never shows a fake confirmation.

**1. Inboxes (already set).** Both forms currently send to `info@powermoveshub.com`. They're set in the two lines at the top of `assets/js/contact.js`:
```js
var CONTACT_INBOX = 'info@powermoveshub.com';
var PRAYER_INBOX  = 'info@powermoveshub.com';
```
Prayer requests arrive with the subject "Power Moves — Prayer request", so an inbox rule can file them into their own folder. To give prayer requests their own address later, change only `PRAYER_INBOX` and activate it once (step 3).

**3. Activate each form (one time).** Publish the site, then submit a test from the contact form and a test prayer request.
- FormSubmit emails each inbox an **Activate Form** link. Click it.
- Before activation, the site shows "This form is waiting to be activated" and nothing is delivered.
- After activating, send another test from each form and confirm it arrives.

**4. Hide your email address.** After activation, FormSubmit gives you a random string for each inbox. Replace each email address in `contact.js` with its string, for example `var CONTACT_INBOX = 'a1b2c3d4e5...';`. Your real addresses then no longer appear in the site's code, where spam bots could find them.

**If you move to www.powermoveshub.com later,** send a fresh test from each form. If FormSubmit asks you to activate again, click the link.

**What arrives in your inbox**
- **Contact:** the subject reads "Power Moves — [reason]", for example "Power Moves — Host a Station". You can set up inbox rules to sort by reason, and pressing Reply goes straight to the visitor.
- **Prayer:** the subject reads "Power Moves — Prayer request". The email includes the name (if given), the request, and whether follow-up was requested. Email and phone are included **only** when follow-up was requested.
- Both forms include a hidden honeypot field (`_honey`) that FormSubmit uses to silently drop spam bots.

**Handling prayer requests with care**
- Keep that inbox limited to the people who actually respond.
- Don't forward requests into marketing tools or mailing lists. The form promises they won't be used for marketing.
- Delete requests once they've been handled.
- Requests pass through FormSubmit on their way to your inbox. If you'd rather they never touch a third party, a Google Apps Script relay to your own Gmail is the alternative.
- Your Privacy Policy should describe both forms before launch.

**Confirmation timing:** the contact confirmation says "A member of our team will contact you within 24 hours." Only keep that promise on the page if your team can meet it.

## Previewing form states (for design review)

These URLs show each state without sending anything. Each one is labeled "Design preview":

- `contact.html?preview=errors`: validation errors
- `contact.html?preview=sent`: contact confirmation
- `contact.html?preview=prayer`: prayer form open with follow-up checked
- `contact.html?preview=prayer-sent`: prayer confirmation

Routing links: `contact.html?reason=customer-support`, `rental-payment`, `host-a-station`, `partner-support`, `partnerships`, `events-sponsors`, `general-inquiry`. `contact.html#share-prayer` opens the prayer form directly.

## Before launch: fill in the About page

Search `about.html` for `[` to find every placeholder:

- `[Founder 1 Name]` / `[Founder 2 Name]` and each bio in brackets (remove the `placeholder-text` class once real text is in).
- The story copy under **How It Started** is a draft built from your brief. Edit it so it sounds like you.

## Swapping in real imagery

- **Founder photos (homepage Section 05, About hero, founder cards):** inside each `.founder-photo` / `.ph-photo`, replace the `fp-art`, `fp-mark` and `fp-tag` elements with
  `<img class="founder-img" src="assets/img/founders.jpg" alt="[Founder names], founders of Power Moves">`.

- **Experience tiles (Section 04):** replace a tile's `<div class="tile-art art-…">` with
  `<img class="tile-photo" src="assets/img/your-photo.jpg" alt="">` and change its tag text from `PHOTO PLACEHOLDER`.
- **How It Works mockups (Section 03):** each `.stage` is a drawn concept. Replace a whole `<div class="stage">…</div>` with an `<img>` of official product photography and remove the `CONCEPT MOCKUP` tag.
- **Concert photo:** it looks like stock imagery. Confirm you have a license before launch.
