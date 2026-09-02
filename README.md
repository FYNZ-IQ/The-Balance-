# The Balance Organization — website

Static, multi-page website for The Balance Organization, an Ethiopian non-profit in Addis Ababa
providing free integrated legal aid and psychological care.

**Tagline:** Minds Matter, So Do Rights  
**Positioning line:** Where the law meets psychology

## Pages

| File | Page |
| --- | --- |
| `index.html` | Home |
| `who-we-are.html` | Who We Are (vision, mission, objectives, principles) |
| `what-we-do.html` | What We Do (legal column, integrated model, psychological column) |
| `who-we-serve.html` | Who We Serve (six situation-based entry points with anchors) |
| `get-help.html` | Get Help (client intake: steps, cost, eligibility, confidentiality, four contact routes, form) |
| `volunteer.html` | Volunteer (separate paths for lawyers and psychologists, one application form) |
| `donate.html` | Donate (monthly default and one-time side by side, four designated funds, transparency) |
| `impact.html` | Impact & Reports |
| `advocacy.html` | Advocacy & Documentation |
| `contact.html` | Contact |

Shared assets live in `assets/`: one stylesheet (`assets/css/style.css`), one small script
(`assets/js/main.js`), and SVG illustrations (`assets/img/`). There is no build step and no
external dependency. Every page works without JavaScript.

## Running locally

Open any `.html` file in a browser, or serve the folder:

```
python3 -m http.server 8000
```

## Deployment

The site deploys automatically to GitHub Pages through `.github/workflows/pages.yml` on every
push to `main` or to `claude/balance-organization-website-bp71xy`. There is no build step: the
repository root is published as-is, and `.nojekyll` stops Pages from running Jekyll over the
HTML. The live address is shown on each run under the repository's Actions tab, and will be
`https://fynz-iq.github.io/The-Balance-/`.

The first run fails until GitHub Pages is switched on for the repository, which only a
repository admin can do:

1. The repository is private. GitHub Pages on a private repository needs a paid GitHub plan.
   Either make the repository public (Settings → General → Danger zone → Change visibility)
   or keep it private on a Team or Enterprise plan.
2. Settings → Pages → Build and deployment → Source: **GitHub Actions**.
3. Actions → "Deploy to GitHub Pages" → Run workflow. Every later push deploys automatically.

### Custom domain: thebalanceorg.com

At the domain registrar, in DNS records, add these six records. Use `@` as the name for the
root domain. Leave TTL on Auto (or 600). Do not add any other A, AAAA, or CNAME records for
the same names.

| Type | Name | Content |
| --- | --- | --- |
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `fynz-iq.github.io` |
| TXT | `_github-pages-challenge-fynz-iq` | value shown by GitHub when verifying the domain (optional but recommended) |

Then on GitHub: Settings → Pages → Custom domain → enter `thebalanceorg.com` → Save. Wait for the
DNS check to pass (minutes to a few hours), then tick **Enforce HTTPS**. Because the site is
published by the workflow, the custom domain is set here in Settings, not with a CNAME file in
the repository. All links in the site are relative, so it works at the root of the domain
without changes.

The folder can also be uploaded to any other static host (Netlify, Cloudflare Pages, or a plain
web server) without changes.

## Before launch: things to replace

Contact details on the site are **placeholders**. Search and replace these strings across all
`.html` files:

| Placeholder | Where it appears |
| --- | --- |
| `+251 11 000 0000` and `tel:+251110000000` | Office phone |
| `+251 90 000 0000` and `tel:+251900000000` | Hotline for people outside Addis Ababa |
| `help@thebalance-ethiopia.org` | Email |
| `Addis Ababa, Ethiopia` | Office address (the site deliberately gives directions on booking, for client privacy) |
| `Monday to Friday, 8:30 am to 5:00 pm` | Office hours |
| "To be confirmed" on `donate.html` | Bank account and Telebirr details |

Also review:

- The response-time wording on Get Help ("usually within two working days") and Volunteer
  ("reply within a week"). Change these if they do not match how the team works.
- The volunteer commitments (8 to 12 hours a month, two-day training, twelve-month minimum,
  supervision every two weeks). These were written to the brief and should be confirmed.
- Reports on `impact.html` and publications on `advocacy.html` are listed as "Coming soon".
  Replace each with a link to the PDF when it exists.

## Forms

The three forms (Get Help, Volunteer, Contact) and the donation form post to `action="#"`.
With that value the script shows a confirmation message on the page and sends nothing.
To connect a backend, set each form's `action` to your endpoint (for example a Formspree URL,
or add the `netlify` attribute on Netlify). The script then lets the browser submit normally.

For the Get Help form in particular, choose a backend that stores submissions securely and
restricts who can read them. The form asks whether it is safe to call the number given;
make sure whoever handles intake sees that answer before calling.

## Amharic / English toggle

The header has an EN / አማ toggle. Amharic pages do not exist yet, so choosing አማ shows a short
bilingual notice with the phone number. When Amharic pages are ready:

1. Create them under an `am/` folder with the same file names.
2. Change the toggle buttons in each page's header into links to the matching page.
3. Set `<html lang="am">` on the Amharic pages. The font stacks already include
   Noto Sans Ethiopic and Abyssinica SIL as fallbacks.

## Logo

The logo is a vector recreation of the supplied artwork, in `assets/img/logo.svg` (full lockup,
used on Who We Are) and `assets/img/mark.svg` (emblem only, used in the header, footer, and as
`favicon.svg`). To use the original raster artwork instead, save it as `assets/img/logo.png` and
point the `<img>` on `who-we-are.html` at it.

## Design rules encoded in the site

- **Get Help** is the primary action on every page (solid teal button in the header and in a
  closing band on most pages). **Donate** is secondary and never sits in the same block.
- Colours: deep teal `#0F4C5C`, warm sand `#F4EFE6`, muted gold `#C58B2E` (accent only; it does
  not pass contrast as text on sand), charcoal `#2A2A2A`.
- Serif headings, system sans-serif body, 48px minimum tap targets, mobile-first layout.
- Illustrations are calm line art (doorway, sky, hands, window, path). No photographs of clients.
- Confidentiality statements appear on Get Help and Contact. The footer states on every page
  that services are free and that the organisation is not an emergency service.
- No pricing language, testimonials, client stories, countdowns, urgency banners, outcome
  claims, or success rates.
