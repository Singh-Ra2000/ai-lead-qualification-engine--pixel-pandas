# Lead Scoring Framework

## The core test

> Is this person or company trying to pay someone externally to do design or development work for them right now?

Anything short of a definite yes scores 1.

## Score bands

| Score | Meaning | Action |
|---|---|---|
| 9-10 | Hiring intent + budget + contact info | Review within 2 hours |
| 7-8 | Hiring intent + clear project, no budget | Review same day |
| 4-6 | Not used. Model is told to decide | |
| 1-3 | Disqualified | Dropped by IF node |

Only scores of **7 or above** reach the sheet.

## Hard disqualifiers

| Signal | Example |
|---|---|
| Author is a designer/developer | "My DMs are open for freelance work" |
| Thought leadership | "5 lessons on UX hiring" |
| Company culture | "Meet our team member of the month" |
| In-house full-time hire | "Hiring a UX Designer, full-time, onsite" |
| Mentions design, no ask | "Design is the future of AI" |
| Agency self-promotion | "We help startups build brands" |

## Contact method

| In the post | contactMethod |
|---|---|
| Email address | Email |
| "Comment below" | Comment |
| "DM me" or nothing stated | LinkedIn DM |

## Service mapping

Exactly one of: UI/UX Design, Web Development, App Development, Branding, Logo Design, Social Media Creatives, Unknown.
