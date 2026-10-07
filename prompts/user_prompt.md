# User Prompt

Paste into the **User** message of the OpenAI node (Expression mode). n8n fills the `{{ }}` fields from the Apify data for each post.

```
Analyse this LinkedIn post and return a JSON qualification result.

POST DETAILS:
Author name: {{ $json.author.name }}
Author headline: {{ $json.author.info }}
Posted: {{ $json.postedAt.postedAgoText }}
Post content:
"""
{{ $json.content }}
"""

Return ONLY this exact JSON, no extra text:
{
  "qualified": true or false,
  "score": 1 to 10,
  "scoreReason": "one sentence explaining the score",
  "personName": "full name from post",
  "companyName": "company name or null",
  "serviceRequired": "one Pixel Pandas service or Unknown",
  "emailAddress": "email if in post or null",
  "contactMethod": "Email or LinkedIn DM or Comment",
  "outreachDraft": "3-4 sentence warm personalised message as Pixel Pandas referencing something specific from their post. null if not qualified."
}
```

## Why the URLs aren't in this prompt

Post URL, author profile URL, and matched keyword are attached in code, not by the model. LLMs shouldn't be trusted to copy identifiers verbatim, and it saves tokens.
