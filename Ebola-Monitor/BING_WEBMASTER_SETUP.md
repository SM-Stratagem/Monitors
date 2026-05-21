# Bing Webmaster Tools Setup Guide

## Why Bing Matters for Your Ranking

**CRITICAL:** ChatGPT, Copilot, and other AI-powered search tools use **Bing's index**, not Google's directly. Your ranking on Bing has a DIRECT impact on whether you appear in ChatGPT/Copilot responses.

This makes Bing verification one of the highest-impact SEO tasks for LLM visibility.

## Setup Steps

### Step 1: Go to Bing Webmaster Tools
1. Navigate to: https://www.bing.com/webmaster/about
2. Click "Sign in" and use your Microsoft account (create one if needed)

### Step 2: Add Your Site
1. Click "Add a site"
2. Enter: `https://www.ebolamonitorapp.com`
3. Choose your verification method

### Step 3: Verify Your Site (Choose One Method)

#### Option A: Meta Tag (Easiest)
1. Bing will give you a meta tag like:
   ```html
   <meta name="msvalidate.01" content="ABC123DEF456" />
   ```
2. Copy the verification code (the long string)
3. Update `/src/app/layout.tsx` line ~216:
   ```tsx
   <meta name="msvalidate.01" content="YOUR_CODE_HERE" />
   ```
4. Deploy the changes
5. Return to Bing and click "Verify"

#### Option B: XML File Upload
1. Download the XML file from Bing
2. Upload it to `/public/` directory
3. Bing will automatically verify after crawling

#### Option C: CNAME Record
Only use if you have access to your domain's DNS settings.

### Step 4: Submit Your Sitemap
1. Once verified, go to "Sitemaps" in Bing Webmaster Tools
2. Submit: `https://www.ebolamonitorapp.com/sitemap.xml`
3. Bing will crawl it within 24-48 hours

### Step 5: Monitor Performance
- **Search queries**: See what users search for that lead to your site
- **Crawl stats**: Monitor how often Bing crawls your site
- **Index status**: Check how many pages are indexed
- **Keyword insights**: Find ranking opportunities

## What to Monitor

### Regular Checks (Weekly)
- ✓ Site health status (green light)
- ✓ Crawl errors (should be 0)
- ✓ Index coverage (all public pages indexed)

### Performance Metrics (Monthly)
- Traffic from Bing
- Top ranking keywords
- Click-through rate (CTR)
- Average position

## Advanced Features to Enable

### 1. Search Appearance Settings
- Enable **Rich snippets** (we already have schema.org markup)
- Enable **Sitelinks** (manual configuration)

### 2. Intelligence & Reports
- Turn on **Search queries** reporting
- Monitor **Device performance** (mobile vs desktop)

### 3. Crawl Control
- Set crawl speed: **Normal** (we update every 12 hours)
- Disallow crawling of: `/private`, `/.next`
- Set preferred domain: `https://www.ebolamonitorapp.com/`

## Timeline Expectations

| Milestone | Timeline |
|-----------|----------|
| Verification | 1-2 hours |
| First crawl | 24-48 hours |
| Index appearance | 3-7 days |
| Search visibility | 1-4 weeks |
| ChatGPT cites you | 2-8 weeks |

## ChatGPT Integration Impact

Once your site is indexed in Bing:
- ✅ ChatGPT can cite your content
- ✅ Copilot can include your data in responses
- ✅ Claude will have access to your information
- ✅ Perplexity can reference your content

**This is how you get from "ranked nowhere" to "cited in AI responses."**

## Verification Status

Current status: **PENDING MANUAL VERIFICATION**

You must:
1. Go to Bing Webmaster Tools: https://www.bing.com/webmaster/
2. Add domain: `ebolamonitorapp.com`
3. Choose verification method
4. Complete verification
5. Submit sitemap

**After verification, you'll see Bing crawl traffic in your analytics within 2-3 days.**

## Cloudflare Integration (If Using)

If your domain is on Cloudflare:
1. Cloudflare may hide your real IP from Bing crawlers
2. Solution: Add Bing's IP ranges to Cloudflare whitelist
3. Bing crawler IPs: https://www.bing.com/webmaster/help/crawling-information-3e8c55f

## Questions?

- Bing Webmaster Help: https://www.bing.com/webmaster/help/
- Official documentation: https://docs.microsoft.com/en-us/bingwebmaster/
- Our llms.txt file explains what content to prioritize: `/public/llms.txt`

---

**Remember:** Bing verification is NOT optional for ChatGPT/Copilot ranking. It's the single most important technical SEO task for LLM visibility.
