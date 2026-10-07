# Setup Guide

Rebuild the pipeline from scratch in about 30 minutes.

## Prerequisites

- n8n (cloud or self-hosted)
- Apify account
- OpenAI API key
- Google account

## 1. Apify

1. Open the actor `harvestapi/linkedin-post-search` (LinkedIn Post Search Scraper, No Cookies)
2. Input:
   ```json
   {
     "queries": [
       "looking for a freelance designer",
       "need a web designer",
       "recommend a design agency",
       "need a logo designer",
       "hiring a UX designer",
       "website redesign",
       "branding agency",
       "app development agency",
       "need brand identity",
       "social media creatives"
     ],
     "maxPostsPerQuery": 10,
     "postedLimit": "week",
     "sortBy": "date"
   }
   ```
   `postedLimit` accepts: any, 1h, 24h, week, month, 3months, 6months, year. (`day` is invalid.)
3. Copy your API token: Settings > Integrations

## 2. Google Sheet

1. Upload `templates/lead_tracker_template.xlsx` to Drive
2. **File > Save as Google Sheets.** n8n cannot append to an uploaded `.xlsx`
3. Copy the native sheet's URL

## 3. n8n workflow

Import `workflow/lead-hunter.n8n.json`, or build it node by node:

| # | Node | Key settings |
|---|---|---|
| 1 | Schedule Trigger | Days, every 1, 8 AM, Asia/Kolkata |
| 2 | HTTP Request | GET `https://api.apify.com/v2/acts/harvestapi~linkedin-post-search/runs/last/dataset/items?token=YOUR_APIFY_TOKEN&clean=true` |
| 3 | Edit Fields | Include Other Input Fields ON. Add `savedPostUrl` = `{{ $json.linkedinUrl }}`, `savedLinkedinUrl` = `{{ $json.author.linkedinUrl }}`, `savedKeyword` = `{{ $json.query.search }}` |
| 4 | OpenAI: Message a Model | Model gpt-4o-mini. Message 1 System (`prompts/system_prompt.md`), Message 2 User (`prompts/user_prompt.md`). **Simplify Output OFF** |
| 5 | Code | Paste `code/parse_llm_output.js` |
| 6 | IF | `{{ $json.score }}` Number > is greater than or equal to > `7`. Convert types ON |
| 7 | Google Sheets | Append Row, sheet `Leads`, Map Each Column Manually (table below). Connect to the **true** branch |

### Column mapping

| Column | Value |
|---|---|
| Date Found | `{{ $now.format('yyyy-MM-dd') }}` |
| Status | `New` |
| score | `{{ $json.score }}` |
| personName | `{{ $json.personName }}` |
| companyName | `{{ $json.companyName }}` |
| LinkedIn URL | `{{ $json.linkedinUrl }}` |
| Post URL | `{{ $json.postUrl }}` |
| serviceRequired | `{{ $json.serviceRequired }}` |
| emailAddress | `{{ $json.emailAddress }}` |
| contactMethod | `{{ $json.contactMethod }}` |
| scoreReason | `{{ $json.scoreReason }}` |
| outreachDraft | `{{ $json.outreachDraft }}` |
| keywordMatched | `{{ $json.keywordMatched }}` |

Leave Edited Outreach, Reviewer Notes, and Date Sent empty for the team.

## 4. Daily routine

1. Run the Apify actor (or let it run on schedule if your plan allows API runs)
2. n8n fetches the latest dataset at 8 AM
3. Team reviews the sheet, edits drafts, marks rows Approved
4. Approved emails go out via YAMM. LinkedIn DMs are sent manually

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| HTTP Request returns 0 items | Apify run empty or not finished | Check the run's output in Apify, rerun |
| API runs succeed with 0 results | Free plan limited permissions | Run from the Apify web UI, or upgrade |
| OpenAI 403 | Key stored with stray characters | Re-paste the key in n8n credentials |
| Code node outputs nothing | Simplify Output ON in OpenAI node | Turn it OFF |
| URLs blank in sheet | Edit Fields node missing | Add node 3 before the OpenAI node |
| "Must not be an Office file" | Sheet is still `.xlsx` | Save as Google Sheets, use the new URL |
| Too many weak leads | Threshold too low | Keep IF at 7 |

## Duplicate check

Conditional formatting on the Post URL column highlights repeats:
`=COUNTIF($G$2:$G2,G2)>1`
