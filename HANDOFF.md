# HANDOFF — Proaxis Solutions Build Session
**Written:** 2026-06-10 | **For:** Next Claude session | **Assume zero prior memory**

---

## QUICK STATUS SNAPSHOT

| Metric | Value |
|--------|-------|
| Tasks completed | 33 |
| Overall build progress | 65% |
| Clients won | 0 |
| Revenue | R0 |
| Website | Live at proaxissolutions.co.za |
| GBP | Registered — pending 24hr verification |
| CSD | Registered — approval status unconfirmed |
| Last git push | feat: CRM dashboard + onboarding rebuild + flip cards fixed |
| Unpushed changes | `leads-admin.html` (rebuilt this session, NOT yet pushed) |

---

## NEXT 30 MINUTES — PRIORITY ORDER

Do these in order. Time estimates are real.

### #1 — Run git-push.bat (2 minutes) 🔴 DO FIRST
- `leads-admin.html` was fully rebuilt this session but NOT pushed to GitHub
- Double-click `git-push.bat` in File Explorer (it's in the project root)
- Verify it says "DONE! All changes pushed." before closing

### #2 — Rebuild demo-hause-of-lace.html (20–25 minutes) 🔴 HIGHEST VISIBILITY
- This is the featured card on the homepage — shown open in the screenshot
- Current state: 163 lines, static HTML, no loader, no animation, nothing interactive
- What it needs: animated braiding/scissors CSS loader + interactive booking calendar + animated stats + floating WhatsApp button
- Start the next session with: "Rebuild demo-hause-of-lace.html with animated hair loader and interactive booking features"
- See Section 4A for full spec of what all 6 demos need

### #3 — Tell Claude what "the other thing you want to build" is (1 minute)
- Bongumusa mentioned this at the end of the session — never got to it
- Mention it at the start of the next session so it can be planned

### #4 — Confirm GBP verification (2 minutes)
- Search "Proaxis Solutions" on Google Maps
- If listed: add description, logo photo, cover photo, services (see Section 4D)
- If not listed yet: wait and check again tomorrow

---

## CRITICAL GAPS — IN ORDER OF URGENCY

These are the things blocking the business from making money:

1. **No clients + no outbound engine** — The website is passive. No cold outreach sequence, no LinkedIn profile, no niche targeting exists. This is the #1 business risk. Nothing else matters until this starts.

2. **No proposal template** — When a lead says "send me a quote" there is nothing ready to send. Need a .docx with scope, pricing tiers, deliverables, payment terms, and bank details.

3. **No invoicing or payment setup** — FNB business account status unconfirmed. No invoicing tool configured. Winning a client right now = no professional way to collect payment. Fix: confirm FNB account, set up Wave (waveapps.com) free invoicing.

4. **CSD supplier status unconfirmed** — Registered but approval takes time. Manual check required at `ocpo.treasury.gov.za` — needed before chasing any government contracts.

5. **Google Search Console not set up** — Sitemap at `proaxissolutions.co.za/sitemap.xml` is built but not submitted. Google won't fully index pages until submitted via `search.google.com/search-console`.

6. **6 demo pages not rebuilt** — Currently static with no animation or interactivity. Should be stunning mini-apps showcasing capability. See Section 4A for full spec.

---

## 1. PROJECT GOAL & CURRENT STATUS

**What this is:** Building Proaxis Solutions (Pty) Ltd entirely from scratch — South African B-BBEE Level 1 tech company. Budget = R0. Only tool = Claude Pro (Cowork mode). No employees, no clients yet.

**Where the company is right now:**
- Company registered: 2025/542019/07 (CIPC)
- Website: live at `https://proaxissolutions.co.za` (GitHub Pages via `baxmthembu/proaxissolutions`)
- Business email: `info@proaxissolutions.co.za` (forwarded to `bmthembu2002@gmail.com` via Cloudflare Email Routing)
- Google Business Profile: registered, **pending 24-hour verification** (as of 2026-06-10)
- Google Search Console: NOT yet set up (sitemap.xml built, not yet submitted)
- CSD registration: submitted, **status unconfirmed** — needs manual check at `ocpo.treasury.gov.za`
- First client: none yet

**Overall build progress: ~65% complete**

---

## 2. EVERY FILE — PATH AND PURPOSE

### Root website files
| File | Purpose |
|------|---------|
| `index.html` | Homepage — hero, 6 business card flip demos, services overview, contact CTA. 60,805 bytes. |
| `about.html` | About page — story, team-less positioning, values. Has WOW flip loader. 34,558 bytes. |
| `services.html` | Full services page — 7 service cards with detail. 60,225 bytes. |
| `contact.html` | Contact form — Web3Forms wired, POPIA consent, localStorage lead capture. 46,501 bytes. |
| `onboarding.html` | 5-question client onboarding — Web3Forms wired, localStorage lead capture. 31,743 bytes. |
| `leads-admin.html` | Internal CRM dashboard — reads from localStorage, pipeline stages, notes, CSV export. 18,026 bytes. |
| `sitemap.xml` | XML sitemap for Google. Covers 5 main pages. |
| `robots.txt` | Allows all crawlers, references sitemap. |

### Demo pages (portfolio of capability — shown via flip cards on homepage)
| File | Business | Status |
|------|---------|--------|
| `demo-hause-of-lace.html` | Hair salon — Durban | **NEEDS REBUILD** (163 lines, static, no loader, no animation) |
| `demo-kasi-fresh-market.html` | Retail/Spaza shop | **NEEDS REBUILD** (186 lines, static) |
| `demo-larriecooks.html` | Food & Catering | **NEEDS REBUILD** (207 lines, static) |
| `demo-fixpro-sa.html` | Trades & Services | **NEEDS REBUILD** (190 lines, static) |
| `demo-primecare-clinic.html` | Healthcare/Clinic | **NEEDS REBUILD** (200 lines, static) |
| `demo-ndlovu-associates.html` | Professional/Law firm | **NEEDS REBUILD** (222 lines, static) |
| `demo-bakery.html` | Bakery demo (extra) | Already built, ~417 lines |
| `demo-cologne.html` | Cologne brand (extra) | Already built, ~519 lines |
| `demo-restaurant.html` | Restaurant (extra) | Already built, ~389 lines |
| `demo-salon.html` | Salon (extra) | Already built, ~446 lines |
| `prototype.html` | Earlier prototype page | Legacy, not linked from main nav |
| `mockup.html` | Earlier mockup page | Legacy, not linked from main nav |

### Brand folder (`brand/`)
| File | Purpose |
|------|---------|
| `favicon.svg` | SVG favicon used across all pages |
| `favicon.ico` | ICO favicon fallback |
| `favicon-16.png`, `favicon-32.png` | PNG favicons |
| `logo-full.svg` | Full logo (icon box + "Proaxis" wordmark + "SOLUTIONS") — dark bg |
| `logo-full-light.svg` | Same logo — light bg variant |
| `logo-icon.svg` | Icon mark only (no wordmark) |
| `logo-full-310.png`, `logo-full-620.png`, `logo-full-1200.png` | Rasterised logo at 3 sizes |
| `logo-full-light-1200.png` | Light variant PNG |
| `logo-icon-192.png`, `logo-icon-512.png` | Icon-only PNGs |
| `gbp-cover-photo-1080x608.png` | Google Business Profile cover photo (just the logo mark centred on navy) |
| `brand-sheet.html` | Brand style guide HTML doc |
| `google-business-profile-setup.html` | Step-by-step GBP setup guide |

### Compliance documents (`COMPLIANCE_DOCUMENTS/`)
All docs exist in both `.docx` and `.pdf` formats. Structure:
```
COMPLIANCE_DOCUMENTS/
├── ACTION_PLANS/
│   ├── PROAXIS_SOLUTIONS_BUSINESS_EMAIL_IMPLEMENTATION_PLAN.{docx,pdf}
│   ├── PROAXIS_SOLUTIONS_CSD_OPTIMISATION_PLAN.{docx,pdf}
│   └── PROAXIS_SOLUTIONS_TCS_PIN_ACTION_PLAN.{docx,pdf}
├── COMPANY_GOVERNANCE/
│   ├── PROAXIS_SOLUTIONS_CAPABILITY_STATEMENT.{docx,pdf}
│   ├── PROAXIS_SOLUTIONS_COMPANY_PROFILE.{docx,pdf}
│   └── PROAXIS_SOLUTIONS_INFORMATION_OFFICER_COMPLIANCE_PACK.{docx,pdf}
├── PAIA/
│   ├── PROAXIS_SOLUTIONS_PAIA_ANNUAL_REPORT_2025_2026.{docx,pdf,md}
│   └── PROAXIS_SOLUTIONS_PAIA_MANUAL.{docx,pdf}
├── POPIA/
│   ├── PROAXIS_SOLUTIONS_COOKIE_POLICY.{docx,pdf}
│   ├── PROAXIS_SOLUTIONS_POPIA_POLICY.{docx,pdf}
│   ├── PROAXIS_SOLUTIONS_PRIVACY_NOTICE.{docx,pdf}
│   └── PROAXIS_SOLUTIONS_TERMS_OF_USE.{docx,pdf}
├── SUPPLIER_DOCUMENTS/
│   └── PROAXIS_SOLUTIONS_SUPPLIER_ONBOARDING_PACK.{docx,pdf}
└── TENDER_READINESS/
    └── PROAXIS_SOLUTIONS_TENDER_COMPLIANCE_CHECKLIST.{docx,pdf}
```

### Root markdown documents (informational, not served on site)
| File | Purpose |
|------|---------|
| `PROAXIS_SOLUTIONS_COMPLIANCE_AUDIT.md` | Phase 1 audit — all compliance gaps assessed |
| `PROAXIS_SOLUTIONS_EVIDENCE_REGISTER.md` | Phase 2 — evidence register for all compliance items |
| `PROAXIS_SOLUTIONS_REGULATORY_READINESS_MATRIX.md` | Phase 3 — readiness matrix |
| `PROAXIS_SOLUTIONS_POPIA_POLICY.md` | POPIA policy source |
| `PROAXIS_SOLUTIONS_PAIA_MANUAL.md` | PAIA manual source |
| `PROAXIS_SOLUTIONS_PRIVACY_NOTICE.md` | Privacy notice source |
| `PROAXIS_SOLUTIONS_COOKIE_POLICY.md` | Cookie policy source |
| `PROAXIS_SOLUTIONS_TERMS_OF_USE.md` | Terms of use source |
| `PROAXIS_SOLUTIONS_COMPANY_PROFILE.md` | Company profile source |
| `PROAXIS_SOLUTIONS_CAPABILITY_STATEMENT.md` | Capability statement source |
| `PROAXIS_SOLUTIONS_INFORMATION_OFFICER_COMPLIANCE_PACK.md` | Info officer pack source |
| `PROAXIS_SOLUTIONS_SUPPLIER_ONBOARDING_PACK.md` | Supplier pack source |
| `PROAXIS_SOLUTIONS_TENDER_COMPLIANCE_CHECKLIST.md` | Tender checklist source |
| `PROAXIS_SOLUTIONS_TCS_PIN_ACTION_PLAN.md` | TCS PIN action plan source |
| `PROAXIS_SOLUTIONS_CSD_OPTIMISATION_PLAN.md` | CSD optimisation plan source |
| `PROAXIS_SOLUTIONS_BUSINESS_EMAIL_IMPLEMENTATION_PLAN.md` | Email setup plan source |
| `Proaxis_Solutions_Presentation.pptx` | Company slide deck (202KB) |
| `REDESIGN_PLAN.md` | Early-session site redesign plan |

### Utility files
| File | Purpose |
|------|---------|
| `git-push.bat` | One-click git add → commit → push to GitHub. Run from Windows to deploy. |
| `.gitignore` | Standard gitignore |
| `README.md` | Minimal readme |

---

## 3. KEY DECISIONS AND WHY

### WOW Flip Loader (all main pages)
- **What:** A custom CSS loader that flips a logo box `rotateY(90deg → -8deg → 0deg)` with a `cubic-bezier(0.34,1.56,0.64,1)` spring bounce, plus a pulse ring animation (`ldrPulse`).
- **Why:** Replaces a basic progress bar. Branding differentiator — looks premium.
- **Structure:** `<div id="page-loader"><div class="ldr-wrap"><div class="ldr-icon-stage"><div class="ldr-pulse"></div><div class="ldr-icon-box">SVG...</div></div><div class="ldr-name">Proaxis</div><div class="ldr-sub">Solutions</div><div class="ldr-bar-wrap"><div class="ldr-bar-fill"></div></div></div></div>`
- **Hide logic:** `window.addEventListener('load', () => { setTimeout(() => { document.getElementById('page-loader').classList.add('hidden'); }, 400); });`
- **CSS key classes:** `ldr-wrap`, `ldr-icon-stage`, `ldr-icon-box`, `ldr-pulse`, `ldr-name`, `ldr-sub`, `ldr-bar-wrap`, `ldr-bar-fill`
- The loader in `about.html` is a good reference for the full CSS block.

### Web3Forms for email delivery
- **Key:** `1070ddd8-174a-4202-8fad-b6ad40cb5322`
- **Recipient:** `info@proaxissolutions.co.za` → forwards to `bmthembu2002@gmail.com`
- **Why Web3Forms:** Free (250 submissions/month), no backend needed, API-only.
- **Guard condition:** `if (WEB3FORMS_KEY)` — NOT `if (WEB3FORMS_KEY !== 'YOUR_ACCESS_KEY_HERE')`. The self-referential check was a bug we fixed; keep it as just `if (WEB3FORMS_KEY)`.
- Used in: `contact.html` and `onboarding.html`

### localStorage lead capture
- Contact form → saves to `localStorage['proaxis_contact_leads']` (array of objects)
- Onboarding → saves to `localStorage['proaxis_onboarding_leads']`
- CRM metadata (stage, notes) → `localStorage['proaxis_crm_meta']` (object keyed by `_id`)
- `leads-admin.html` reads all three and merges them into one CRM view.

### Onboarding: 5 questions (was 13)
- Rebuilt from 13 questions to 5 to reduce abandonment
- Slides: Welcome → [Name+Phone+Business] → [Sector] → [Services] → [Timeline+Budget] → [Notes optional] → Review → Success
- `const TOTAL = 5` controls the progress bar; never change this without updating slide count

### Flip cards on homepage (`index.html`)
- CSS class: `.biz-flip-card` with `.biz-card-inner` that rotates on `.flipped`
- Toggle function: `flipCard(el)` — `el.classList.toggle('flipped')`
- Close function: `unflipCard(id)` — `document.getElementById(id).classList.remove('flipped')`
- Both functions MUST exist in the script block. They were missing and caused the "flip cards don't work" bug.
- Each card back has a `<a class="demo-preview-link" href="demo-X.html" target="_blank">` preview + `<div class="view-demo-bar">Tap to open live demo ↗</div>`

### Python re.sub + write truncation bug (FIXED, do not repeat)
- **Never** use Python `re.sub` on large HTML files and write the whole result back in one call — it silently truncates at ~56KB.
- **Always** use Claude's Edit tool (targeted string replacement) or Python `append mode` for adding content.
- **After any large file edit:** verify `</body>` and `</html>` are present at end of file.

### Colour palette and typography (all pages consistent)
```
--navy:   #0F172A  (page background)
--navy2:  #1E293B  (card/nav background)
--teal:   #14B8A6  (primary accent)
--blue:   #0284C7  (secondary accent)
--slate:  #64748B  (muted text)
--white:  #F8FAFC  (body text)
--muted:  #94A3B8  (lighter muted text)
--green:  #10B981
--amber:  #F59E0B
--red:    #EF4444
--purple: #8B5CF6
Font: Inter (via rsms.me/inter/inter.css CDN)
```

### Mobile responsiveness convention
Every page has a `/* ── MOBILE GLOBAL ── */` block in `<style>` with:
- `@media (max-width:768px)` — tablet adjustments
- `@media (max-width:480px)` — phone adjustments
- `overflow-x:hidden` on `body`
- Font size adjustments using `clamp()` where relevant

### GitHub deployment
- Remote: `https://github.com/baxmthembu/proaxissolutions.git` (main branch → GitHub Pages)
- Also has upstream: `https://github.com/DND7777/proaxissolutions.git` (ignore — old fork)
- Deploy: run `git-push.bat` from Windows Explorer. It does `git add -A && git commit -m "..." && git push origin main`
- Live URL: `https://proaxissolutions.co.za`

---

## 4. WHAT IS STILL IN PROGRESS / NOT YET DONE

### IMMEDIATE — must be done first session

**A. Rebuild all 6 demo pages (Task #33 — in_progress, nothing written yet)**

The user explicitly requested this at the end of the last session. They showed a screenshot of the homepage and said the demos are "as good as nothing — no movements or inability to display possible features." They want each demo to be a stunning, interactive, futuristic mini-app that acts as a portfolio of Proaxis's capability.

The 6 demos to rebuild (all are currently ~160–222 lines of static HTML with no loader):

| File | Business | Industry | Loader theme |
|------|---------|---------|-------------|
| `demo-hause-of-lace.html` | Hause of Lace | Hair salon | ✂️ Braiding/scissors animation |
| `demo-larriecooks.html` | LarrieCooks | Food & Catering | 🔥 Fire flames with sparks |
| `demo-kasi-fresh-market.html` | Kasi Fresh Market | Retail/Spaza | 🛒 Bouncing cart/coins |
| `demo-fixpro-sa.html` | FixPro SA | Trades & Services | ⚙️ Spinning gear/wrench |
| `demo-primecare-clinic.html` | PrimeCare Clinic | Healthcare | 💓 ECG heartbeat line |
| `demo-ndlovu-associates.html` | Ndlovu & Associates | Law/Professional | ⚖️ Scales of justice |

**Each rebuilt demo MUST have:**
1. **Industry-specific animated loader** — 2.5–3s, CSS/SVG, beautiful, unique to that industry
2. **Animated hero section** — floating particles, glowing elements, or movement
3. **At least one interactive core feature** that actually responds to clicks:
   - Hair: clickable booking calendar + time slots
   - Food: add-to-cart menu with live cart total
   - Market: product catalog with cart counter
   - Trades: instant quote calculator (select service → price shown)
   - Clinic: doctor selector + appointment booking flow
   - Law: practice area selector + consultation form
4. **Animated stat counters** (count up from 0 on load)
5. **At least 2 scrollable content sections** below the fold
6. **Floating WhatsApp button** (bottom-right, links to `https://wa.me/27XXXXXXXXXX`)
7. **"Powered by Proaxis Solutions" footer** linking back to `https://proaxissolutions.co.za`
8. **Mobile-first design** (max-width ~430px effective, like an app)
9. **Smooth animations throughout** (CSS transitions, keyframe animations on key elements)

**B. Push `leads-admin.html` to GitHub**
- `leads-admin.html` was fully rebuilt in this session (18,026 bytes) but `git-push.bat` has NOT been run since.
- Ask Bongumusa to run `git-push.bat` or push via VS Code.

### SHORT TERM (next 1–2 sessions)

**C. Google Search Console setup**
- Sitemap is at `https://proaxissolutions.co.za/sitemap.xml`
- Steps: Go to `search.google.com/search-console` → Add property → Domain → Verify via DNS TXT record in Cloudflare → Submit sitemap URL
- **Do not do this via computer use — give Bongumusa exact steps**

**D. GBP completion (after 24hr verification)**
- Add business description (copy from capability statement)
- Add services listing (website dev, software dev, AI automation, IT support, project management, digital consulting)
- Add logo photo (use `brand/logo-icon-512.png`)
- Add cover photo (already created: `brand/gbp-cover-photo-1080x608.png`)
- Add secondary categories: "Software Company", "IT Support"

**E. Outbound sales engine (Phase 7 — most critical business gap)**
- No clients yet. Website is live but passive.
- Need: cold outreach sequences per niche (SME, healthcare, professional firms), LinkedIn profile, and first 10 outreach targets
- POPIA-compliant B2B cold outreach is allowed for legitimate business purposes

**F. Proposal & quote template**
- When a lead comes in, Bongumusa needs to send a professional proposal within 24hrs
- Build: a reusable `.docx` proposal template with scope, pricing tiers, deliverables, T&Cs

**G. Invoicing setup**
- FNB business account: status unknown — Bongumusa needs to confirm account number
- Free invoicing: Wave (waveapps.com) or Zoho Invoice free tier
- Without this, winning a client = no way to get paid professionally

**H. CSD registration status check**
- Bongumusa registered on CSD but approval status is unknown
- Manual check: `https://ocpo.treasury.gov.za` → log in → check supplier status
- Need CSD supplier number confirmed before chasing government contracts

---

## 5. EXACT NEXT STEPS TO PICK UP

### Step 1 — Rebuild the 6 demo pages (biggest open task)

Work through them in this order (most visible first):
1. `demo-hause-of-lace.html` (shown open in the homepage screenshot)
2. `demo-larriecooks.html`
3. `demo-kasi-fresh-market.html`
4. `demo-fixpro-sa.html`
5. `demo-primecare-clinic.html`
6. `demo-ndlovu-associates.html`

For each file:
- Always **Read** the existing file first (even briefly) before **Write** — the Write tool requires a prior Read
- Each file will be 400–600 lines of HTML+CSS+JS — Write tool handles this in one call
- After writing, verify the file was not truncated by checking `</body></html>` at end

### Step 2 — Run git-push.bat
After demos are rebuilt, ask Bongumusa to run `git-push.bat` from File Explorer (double-click it).

### Step 3 — "Another thing I want to build"
Bongumusa mentioned this at the end of the session and we never found out what it is. Ask at start of next session.

### Step 4 — Answer the open strategic gaps
Bongumusa asked "what's missing?" and the answer was given verbally. The actual work hasn't started:
- Outbound sales engine
- Proposal template (.docx)
- Invoicing setup guidance

---

## 6. CONVENTIONS & CUSTOM SETUP — MUST FOLLOW

### Naming conventions
- Demo pages: `demo-[kebab-case-business-name].html` (e.g. `demo-hause-of-lace.html`)
- Compliance docs: `PROAXIS_SOLUTIONS_[SCREAMING_SNAKE_CASE].[ext]`
- Brand assets: `logo-[variant]-[size].[ext]`

### The WOW flip loader — copy this for any new page
```html
<!-- In <style>: -->
#page-loader{position:fixed;inset:0;background:#0F172A;z-index:9999;display:flex;align-items:center;justify-content:center;transition:opacity .5s ease,visibility .5s ease}
#page-loader.hidden{opacity:0;visibility:hidden}
.ldr-wrap{display:flex;flex-direction:column;align-items:center;gap:.75rem}
.ldr-icon-stage{position:relative;width:72px;height:72px;display:flex;align-items:center;justify-content:center}
.ldr-icon-box{width:56px;height:56px;background:linear-gradient(135deg,#1E293B,#0F172A);border:1.5px solid rgba(20,184,166,0.3);border-radius:14px;display:flex;align-items:center;justify-content:center;animation:ldrFlip 1s cubic-bezier(0.34,1.56,0.64,1) .1s both}
@keyframes ldrFlip{0%{transform:rotateY(90deg)}80%{transform:rotateY(-8deg)}100%{transform:rotateY(0)}}
.ldr-pulse{position:absolute;width:72px;height:72px;border-radius:16px;border:1.5px solid rgba(20,184,166,0.5);opacity:0;animation:ldrPulse 1s ease .65s infinite}
@keyframes ldrPulse{0%{opacity:.6;transform:scale(1)}100%{opacity:0;transform:scale(1.55)}}
.ldr-name{font-size:1.1rem;font-weight:900;letter-spacing:-.02em;color:#F8FAFC}
.ldr-sub{font-size:.65rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#64748B;margin-top:-.5rem}
.ldr-bar-wrap{width:80px;height:2px;background:rgba(255,255,255,.08);border-radius:2px;overflow:hidden;margin-top:.25rem}
.ldr-bar-fill{height:100%;background:linear-gradient(90deg,#14B8A6,#0284C7);border-radius:2px;animation:ldrBarFill 1.8s ease forwards}
@keyframes ldrBarFill{0%{width:0}100%{width:100%}}

<!-- In <body>, first child: -->
<div id="page-loader">
  <div class="ldr-wrap">
    <div class="ldr-icon-stage">
      <div class="ldr-pulse"></div>
      <div class="ldr-icon-box">
        <!-- REPLACE WITH INDUSTRY SVG FOR DEMO PAGES -->
        <svg viewBox="0 0 44 44" width="38" height="38" xmlns="http://www.w3.org/2000/svg">
          <!-- Proaxis arrow icon -->
          <line x1="22" y1="32" x2="22" y2="10" stroke="#14B8A6" stroke-width="2.5" stroke-linecap="round"/>
          <path d="M16 17 L22 10 L28 17" fill="none" stroke="#14B8A6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="8" y1="32" x2="36" y2="32" stroke="white" stroke-width="2" stroke-linecap="round" stroke-opacity="0.35"/>
          <path d="M30 26 L36 32 L30 38" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.35"/>
          <circle cx="22" cy="32" r="2.5" fill="#14B8A6"/>
        </svg>
      </div>
    </div>
    <div class="ldr-name">Proaxis</div>
    <div class="ldr-sub">Solutions</div>
    <div class="ldr-bar-wrap"><div class="ldr-bar-fill"></div></div>
  </div>
</div>

<!-- In <script> at end of body: -->
window.addEventListener('load', () => {
  setTimeout(() => { document.getElementById('page-loader').classList.add('hidden'); }, 400);
});
```

### Demo page loaders — industry-specific SVGs to use inside `.ldr-icon-box`
Replace the Proaxis arrow SVG with one of these for each demo page:

**Hair (Hause of Lace):** Animate scissors — SVG scissors that open/close via CSS `@keyframes`
```css
@keyframes scissorCut { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(-25deg)} }
```

**Food (LarrieCooks):** CSS flame — layered `border-radius` divs with `@keyframes flicker`
```css
.flame{width:20px;height:30px;background:linear-gradient(#fcd34d,#ea580c);border-radius:50% 50% 30% 30%;animation:flicker .6s ease-in-out infinite alternate}
@keyframes flicker{0%{transform:scaleX(1) scaleY(1)}100%{transform:scaleX(.85) scaleY(1.1)}}
```

**Market (Kasi Fresh Market):** Bouncing cart — `@keyframes bounce` on a cart SVG
**Trades (FixPro SA):** Spinning gear — `@keyframes spin { to{transform:rotate(360deg)} }` on a gear SVG
**Clinic (PrimeCare):** ECG line — SVG `<path>` with `stroke-dasharray` + `stroke-dashoffset` animation
**Law (Ndlovu):** Scales tipping — two `<line>` SVG elements alternating tilt via `@keyframes tip`

### Critical security constraints (do not violate)
- **SA ID `0206255189089`** — only request if generating a document that legally requires it (e.g. B-BBEE EME Affidavit). Never store or display it globally.
- **FNB account number** — NEVER guess. Only use it if Bongumusa provides it. It must be obtained from FNB directly.
- **Interim email `willsonjohnny430@gmail.com`** — fallback only, never in public-facing documents
- **Never invent** employees, clients, partners, awards, certifications, revenue, locations, or approvals. All company facts must come from the skills or be confirmed by Bongumusa.
- **Passwords, card numbers, IDs** — prepare everything, give exact steps, Bongumusa executes the action himself.

### Verified company facts
```
Company name:    Proaxis Solutions (Pty) Ltd
Reg number:      2025/542019/07
SARS reference:  OBTAIN FROM SARS — not stored here
Info Officer:    Bongumusa Thembu
Public email:    info@proaxissolutions.co.za
Website:         https://proaxissolutions.co.za
B-BBEE:          Level 1 EME (sworn affidavit — renew annually)
Location:        KwaZulu-Natal, South Africa (exact address not stored)
Services:        Website development, software development, AI automation,
                 business process automation, IT support, project management,
                 digital consulting
```

### Bootstrap version
Bootstrap 5.3 is used in `index.html` and other main pages via CDN:
```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
```

### Web3Forms usage pattern
```javascript
const WEB3FORMS_KEY = '1070ddd8-174a-4202-8fad-b6ad40cb5322';
// ...
if (WEB3FORMS_KEY) {   // <-- SIMPLE check, not !== 'placeholder'
  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: {'Content-Type':'application/json','Accept':'application/json'},
    body: JSON.stringify({ access_key: WEB3FORMS_KEY, ...formData })
  });
}
```

### localStorage schema
```javascript
// Contact form leads
localStorage['proaxis_contact_leads'] = JSON.stringify([
  { _id, name, email, phone, service, message, ts }
]);
// Onboarding leads
localStorage['proaxis_onboarding_leads'] = JSON.stringify([
  { _id, name, email, phone, company, sector, services, budget, timeline, notes, ts }
]);
// CRM metadata (stage + notes per lead)
localStorage['proaxis_crm_meta'] = JSON.stringify({
  'lead_id': { stage: 'new|contacted|discovery|proposal|won|lost', notes: '' }
});
```

---

## 7. SKILLS AVAILABLE (use these for Proaxis work)

The following custom skills are installed and MUST be used when doing Proaxis work:
- `proaxis-knowledge-base` — verified company facts, always load before drafting any document
- `proaxis-brand-guidelines` — voice, tone, messaging, what NOT to say
- `proaxis-service-catalogue` — official service list with scope and pricing
- `proaxis-executive-advisor` — strategic framing, truth policy, startup-appropriate recommendations
- `proaxis-acmd-master` — compliance, tenders, B-BBEE, POPIA, PAIA reference
- `proaxis-tender-playbook` — CSD, TCS PIN, bid/no-bid decisions
- `proaxis-sales-playbook` — BANT+ qualification, objection handling, sector strategies
- `proaxis-website-content` — authoritative website copy
- `docx`, `pdf`, `pptx`, `xlsx` — document creation skills

---

*End of HANDOFF.md — next session: start with demo rebuild (Task #33) then ask about "the other thing I want to build"*
