# Forward-deployed product: paste-ready copy

Companion to `index.html`. Everything here is plain text for pasting into ad managers and email tools.
`{braces}` are merge fields. Tiles marked "example" in `ads/png/` use illustrative numbers. Keep them labeled.

## Lines under test (same audience, only the headline changes)
- **A, Forward-deployed:** Forward-deployed product managers.
- **B, Commit access:** Product management, with commit access.
- **C, Fractional:** Fractional PMs who ship.
- **Descriptor (constant):** Despacho Bonsai · forward-deployed product
- **Spine (constant):** Design. Deploy. Analyze. Report.

## Google responsive search ads (all lengths checked: headlines ≤30, descriptions ≤90)
**Headlines**
Fractional PMs Who Ship · Product Managers Who Ship · PMs With Commit Access · Design. Deploy. Analyze. · Live in Production by Friday · Senior PMs, Fully Agentic · Start Shipping This Week · Every Metric, Grounded · Hiring a PM? Ship Meanwhile · Forward-Deployed PMs · Book a 30-Min Scoping Call · Decide It. Ship It. Prove It. · Your PM Opens Pull Requests · 2-Week Ship Sprint, Fixed Fee · Covered While You Hire

**Descriptions**
1. Senior product managers who design, build, deploy and measure. Inside your repo and Slack.
2. Agentic product management: decisions, real builds, metrics and reports. Every week.
3. Hiring a PM? Ours starts Monday, then trains your hire to work the same way.
4. Every number links to its query. Reports at any level, any moment, always grounded.
5. Engineers got 10x faster. We fix the part that didn't: deciding, shipping and proving it.

**Ad groups (phrase match)**
- Fractional: fractional product manager · fractional head of product · fractional cpo · interim product manager · contract product manager
- Hiring: hire ai product manager · hire a product manager for startup · founding product manager
- Forward-deployed: forward deployed engineer company · forward deployed engineering services · ai product development partner
- Negatives: jobs, salary, course, certification, interview, resume, internship, how to become, remote job, template

## LinkedIn intro text (Thought Leader Ads, founder profile)
- **A1 tickets:** My first prompt was a Jira ticket. So was yours. Given / When / Then was always an instruction set. Now the system can read it directly.
- **A2 bottleneck:** Andrew Ng says the engineer-to-PM ratio is heading to 1:1. Most startups I talk to are at 8:1, with the founder doing PM at 11pm.
- **A3 pull request:** Unpopular in PM circles: if your product manager can't open a PR in 2026, you're paying for a translator.
- **A4 grounded report:** "Can you pull the numbers for the board?" shouldn't take a week, and it shouldn't come back without a source.
- **A5 FDE stat:** Read 20 FDE job posts. The fastest-growing requirement isn't a framework. It's "requirements discovery." That's product management with a different badge.
- **A6 hire while you hire:** If you've had a PM req open for a month, your roadmap has been on hold for a month. It doesn't have to be.
- **A7 four verbs:** The job description for a product manager in the agentic era, in four words.
- **A8 one week:** What we did last week for a client, minus the 40-page PRD. *(Use only once a real week exists.)*

## Outbound: job-posting trigger sequence
**Email 1 · Day 0** · Subject: your {title} req
> Hi {first},
>
> Saw {company} is hiring a {title}. The line "{quote from the posting}" stood out.
>
> Filling that seat usually takes a while, and the roadmap doesn't pause while you search.
>
> We're a small studio of senior product managers who work agentically. We make the product call, build it into your repo, instrument it and report on it. Think forward-deployed engineer, but for product.
>
> Two ways teams use us while they hire:
> 1. A 2-week Ship Sprint on one thing that's been stuck ({guess from the posting}).
> 2. Cover the seat month to month. When your hire lands, we onboard them into the same workflow.
>
> Worth 20 minutes this week?
>
> {Daniel}

**Email 2 · Day 3** · Subject: re: your {title} req
> {first}, here's what a week with us looks like, in one screen: {link to a real, anonymized ship log}
>
> Monday decision memo, Wednesday PR merged behind a flag, Friday 10% rollout, Monday readout with the query attached.
>
> If {the thing from the posting} is the priority, I can sketch what week one would look like for it. No call needed.
>
> {Daniel}

**Email 3 · Day 8** · Subject: a take-home for your PM candidates
> {first}, last note from me.
>
> Whoever you hire, the 2026 version of this role should be able to ship. We use a 3-hour take-home that tests exactly that: a real decision, a working prototype, an instrumented metric and a one-paragraph readout.
>
> Here it is, free to use: {link: The Full-Stack PM Take-Home}
>
> If you'd rather have someone shipping while you interview, I'm here.
>
> {Daniel}

**LinkedIn connection note (≤300 chars)**
> Hi {first}, saw the {title} opening at {company}. I run a studio of PMs who ship (PRs, instrumentation, reporting) and we often cover the seat while teams hire. Happy to share the take-home we use to test PM candidates for this. Useful either way.

## Partner email (studios / FDE boutiques)
> Subject: the product half of your FDE engagements
>
> Hi {first},
>
> Most FDE job descriptions now ask for "requirements discovery" and "stakeholder management." That's product management, and it's usually the part that decides whether an engagement renews.
>
> We're senior product managers who work agentically: decision memos, PRs, instrumentation, board-level reporting. We plug into your client engagements white-label or co-branded, and you keep the account.
>
> Open to a 20-minute call to see if there's a client where this would have helped last quarter?
>
> {Daniel}

## Founder posts
The three full drafts ("Tickets were prompts", "The FDE gap", "The ratio") are in `index.html` → section 12.

## Call script: price probe (ask on every call, rotate X)
"If this cost ${12K | 18K | 25K} a month, would that be a no-brainer, a stretch, or a no?"
Log the answer with the line (A/B/C) and channel that brought them in.
