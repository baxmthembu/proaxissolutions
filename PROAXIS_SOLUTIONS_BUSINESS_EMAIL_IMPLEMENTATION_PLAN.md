# BUSINESS EMAIL IMPLEMENTATION PLAN

## Proaxis Solutions (Pty) Ltd

---

**Version:** 1.0  
**Date:** June 2026  
**Priority:** 🟠 HIGH — Required to upgrade from Gmail to professional business email  
**Domain:** proaxissolutions.co.za  
**Registrar / DNS:** Woza Domains / TrueHost  

---

> ⚠️ **AI-GENERATED DOCUMENT** — This plan was prepared with AI assistance. DNS and email configuration steps must be verified against the current TrueHost / Woza Domains control panel interface, which may differ from general descriptions below. [VERIFY each step against the actual control panel before executing.]

---

## OBJECTIVE

Configure professional email addresses on the proaxissolutions.co.za domain that forward all incoming email to the current Gmail address (willsonjohnny430@gmail.com) as an interim solution. This allows the company to present professional contact details in all compliance documents, tender submissions, and client communications — without the cost of Google Workspace or Microsoft 365 at this stage.

---

## EMAIL ADDRESSES TO CREATE

| Email Address | Purpose |
|---|---|
| info@proaxissolutions.co.za | Primary business contact — general enquiries and client communication |
| privacy@proaxissolutions.co.za | Information Officer and POPIA/PAIA correspondence |
| tenders@proaxissolutions.co.za | Government and corporate procurement correspondence |

**All three addresses will forward to:** willsonjohnny430@gmail.com (interim)

---

## IMPLEMENTATION OPTIONS

### Option A — Cloudflare Email Routing (Recommended — Free)

Cloudflare offers free email routing, which creates forwarding-only email addresses on your domain. No email is stored by Cloudflare — it simply routes incoming mail to the Gmail address.

**Suitability:** Ideal for startup phase. Free. Professional email addresses. No storage. Replies must be sent from Gmail with a "Send As" alias configured.

**Requirement:** DNS must be managed by Cloudflare (or DNS records must be accessible to add Cloudflare MX records). If the domain DNS is currently managed via TrueHost, you can either add the required MX records manually or move DNS management to Cloudflare's free plan.

**Steps:**
1. Create a free Cloudflare account at www.cloudflare.com.
2. Add the domain proaxissolutions.co.za to Cloudflare.
3. Follow Cloudflare's instructions to update the nameservers at TrueHost/Woza Domains to Cloudflare's nameservers. [VERIFY: TrueHost nameserver update process in the registrar control panel.]
4. In Cloudflare dashboard: navigate to **Email > Email Routing**.
5. Enable Email Routing for the domain.
6. Create three forwarding rules:
   - info@proaxissolutions.co.za → willsonjohnny430@gmail.com
   - privacy@proaxissolutions.co.za → willsonjohnny430@gmail.com
   - tenders@proaxissolutions.co.za → willsonjohnny430@gmail.com
7. Cloudflare will add the required MX and SPF records automatically.
8. Verify by sending a test email to each address.

---

### Option B — TrueHost / Woza Domains Email Forwarding (If Available)

Many domain registrars offer basic email forwarding as a free or low-cost feature in the domain management control panel.

**Steps:**
1. Log into the Woza Domains / TrueHost control panel.
2. Navigate to **Email Management** or **Email Forwarding** for proaxissolutions.co.za.
3. Create forwarding rules for each email address as listed above.
4. Save and test by sending a test email to each address.

[VERIFY: Whether TrueHost/Woza Domains offers free or paid email forwarding for this domain. Check the control panel directly.]

---

### Option C — Zoho Mail Free Plan (Includes Sending Capability)

Zoho Mail offers a free plan for one domain with up to 5 user accounts. Unlike forwarding-only options, Zoho allows you to send emails FROM the business address (not just receive and forward).

**Suitability:** Slightly more complex setup, but enables the company to send from info@proaxissolutions.co.za immediately — more professional than using Gmail "Send As."

**Steps:**
1. Go to: www.zoho.com/mail and sign up for the free plan.
2. Add the domain proaxissolutions.co.za.
3. Follow Zoho's DNS verification instructions (add TXT verification record to DNS via TrueHost/Woza Domains or Cloudflare).
4. Create the three email accounts (info, privacy, tenders).
5. Add MX records to DNS as instructed by Zoho.
6. Test by sending and receiving emails.

[VERIFY: current Zoho Mail free plan terms, limitations, and availability at www.zoho.com/mail/zohomail-pricing.html]

---

## GMAIL "SEND AS" CONFIGURATION (FOR FORWARDING-ONLY OPTIONS)

If using Option A or Option B, all replies will be sent from Gmail. To send FROM the business addresses using Gmail:

1. In Gmail, go to **Settings > Accounts and Import > Send mail as**.
2. Click **Add another email address**.
3. Enter "Proaxis Solutions" as the name and info@proaxissolutions.co.za as the email address.
4. Gmail will send a verification code to info@proaxissolutions.co.za — it will be forwarded to the Gmail inbox.
5. Enter the verification code.
6. Repeat for privacy@ and tenders@ addresses.
7. Set info@proaxissolutions.co.za as the default "Send As" address for general correspondence.

**Result:** Emails sent from Gmail will appear to recipients as coming from info@proaxissolutions.co.za. Incoming replies will arrive in the Gmail inbox.

---

## DNS RECORDS REQUIRED

When configuring email forwarding, the following DNS records are typically required [VERIFY with the chosen provider]:

| Record Type | Name / Host | Value | Purpose |
|---|---|---|---|
| MX | @ (or proaxissolutions.co.za) | As specified by chosen provider | Routes incoming email |
| TXT | @ | v=spf1 [as specified by provider] ~all | SPF record — prevents email spoofing |
| TXT (optional) | _dmarc | v=DMARC1; p=none; rua=mailto:info@proaxissolutions.co.za | DMARC — additional email authentication |

**DNS access:** DNS management is available via Woza Domains / TrueHost. Log in to update DNS records.

---

## POST-SETUP ACTIONS

Once email is configured and tested, update the following immediately:

| Document / System | Update Required |
|---|---|
| PAIA Manual | Replace willsonjohnny430@gmail.com with info@proaxissolutions.co.za (and privacy@ for IO contact) |
| POPIA Policy | Replace Gmail with privacy@proaxissolutions.co.za |
| Privacy Notice | Replace Gmail with privacy@proaxissolutions.co.za |
| Cookie Policy | Replace Gmail with privacy@proaxissolutions.co.za |
| Terms of Use | Replace Gmail with info@proaxissolutions.co.za |
| IO Compliance Pack | Update IO contact email to privacy@proaxissolutions.co.za |
| Company Profile | Update to info@proaxissolutions.co.za |
| Capability Statement | Update to info@proaxissolutions.co.za |
| Supplier Onboarding Pack | Update to info@proaxissolutions.co.za |
| CSD Profile | Update contact email to info@proaxissolutions.co.za |
| Information Regulator records | Update IO email to privacy@proaxissolutions.co.za |
| Website contact page | Confirm info@proaxissolutions.co.za is correctly configured |
| SARS eFiling | Update contact email if needed |

---

## IMPLEMENTATION TRACKER

| Step | Date Completed | Notes |
|---|---|---|
| Option chosen (A / B / C) | | |
| DNS management access confirmed | | |
| Email forwarding configured | | |
| Test emails sent and received | | |
| Gmail "Send As" configured (if applicable) | | |
| All compliance documents updated | | |
| CSD profile updated | | |
| Information Regulator records updated | | |

---

## FUTURE UPGRADE PATH

When Proaxis Solutions is ready to upgrade to a full business email platform:

| Option | Cost | Capability |
|---|---|---|
| **Google Workspace Starter** | ~R85/user/month (SA pricing — VERIFY) | Full Gmail, Drive, Calendar, Meet — professional Google ecosystem |
| **Microsoft 365 Business Basic** | ~R75/user/month (SA pricing — VERIFY) | Outlook, Teams, SharePoint, OneDrive |
| **Zoho One** | Paid upgrade from free plan | Full office suite at lower cost than Google/Microsoft |

**Recommendation:** Upgrade to Google Workspace or Microsoft 365 when the company engages its first regular client or when revenue permits — whichever comes first. A professional email platform improves credibility with enterprise and government clients and enables collaboration tools for project delivery.

---

*Proaxis Solutions (Pty) Ltd | Reg: 2025/542019/07*  
*proaxissolutions.co.za | Technology. Intelligence. Transformation.*
