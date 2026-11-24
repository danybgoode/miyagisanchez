// Single source of truth for what Despacho Bonsai sells. The homepage (estimator, FAQ), the JSON-LD, and
// /llms.txt (which the chat assistant answers from) all read this file, so they can't drift apart.
// Strategy + rationale: gtm/agentic-pm/index.html.

export const ORG = {
  name: 'Despacho Bonsai',
  url: 'https://despachobonsai.com',
  descriptor: 'Forward-deployed product',
  oneLiner: 'Forward-deployed product managers: senior, fully agentic PMs who design, deploy, analyze and report, inside your repo, analytics and Slack.',
  email: 'hola@despachobonsai.com',
  location: 'Mexico City, Mexico',
  serves: 'US software teams, from seed to Series C and beyond',
  booking: 'https://cal.com/despachobonsai/bonsaidiscovery',
  founder: { name: 'Daniel Vásquez', linkedin: 'https://www.linkedin.com/in/danielvasquezparedes' },
} as const;

export const VERBS = [
  { n: '01', h: 'Design', p: 'The business case and the interface. A one-page decision memo, flows in your design system. Not a 40-page PRD.' },
  { n: '02', h: 'Deploy', p: 'Real builds to production. Pull requests in your repo, tests, flags, staged rollouts. Your engineers review.' },
  { n: '03', h: 'Analyze', p: "Full-stack product metrics. If it isn't instrumented, we instrument it, whatever the stack is or needs to be." },
  { n: '04', h: 'Report', p: 'At any level, at any moment, from standup to board deck. Every number links to the query behind it.' },
] as const;

export type Plan = { name: string; weeks: number; lo: number; hi: number; monthly?: boolean; for: string; steps: [string, string][] };

/** Price ranges in thousands of USD, before the team-size adjustment the estimator applies. Final number after a call. */
export const PLANS: Record<string, Plan> = {
  feature:   { name: 'Ship Sprint', weeks: 2, lo: 12, hi: 18, for: 'Ship one feature to production, instrumented and measured.',
    steps: [['D2', 'Decision memo: scope, metric, risks'], ['D4', 'Flows in your design system'], ['D8', 'PR merged behind a feature flag'], ['D10', 'Events instrumented · 10% rollout'], ['D14', 'Readout with linked queries']] },
  ai:        { name: 'AI Ship Sprint', weeks: 3, lo: 18, hi: 28, for: 'Put an AI agent or AI feature into production, with evals, guardrails and cost tracking.',
    steps: [['D3', 'Decision memo + success criteria'], ['D6', 'Eval set from your real data'], ['D12', 'Agent in production behind a flag'], ['D15', 'Guardrails, cost per run, monitoring'], ['D21', 'Readout: quality, cost, impact']] },
  prototype: { name: 'Production Sprint', weeks: 3, lo: 18, hi: 26, for: 'Turn a prototype or vibe-coded app into a real product that holds up at real traffic.',
    steps: [['D2', 'Audit: what breaks at real traffic'], ['D7', 'Hardened, tested, in your CI'], ['D12', 'Analytics + error tracking wired'], ['D15', 'Staged rollout to real users'], ['D21', 'Readout + next-bet memo']] },
  metrics:   { name: 'Instrumentation Sprint', weeks: 2, lo: 10, hi: 16, for: 'Fix product metrics and reporting, on whatever analytics stack you have or need.',
    steps: [['D2', 'Metric tree: what the board asks'], ['D5', 'Tracking plan, any stack'], ['D9', 'Events shipped + validated'], ['D11', 'Dashboards with linked queries'], ['D14', 'First grounded report, any altitude']] },
  discovery: { name: 'Decision Sprint', weeks: 1, lo: 6, hi: 9, for: 'Decide what to build next, with evidence and a prototype of the top bet.',
    steps: [['D1', 'Evidence pull: usage, revenue, support'], ['D2', 'Opportunities sized'], ['D3', 'Ranked roadmap with reasoning'], ['D4', 'Prototype of the top bet'], ['D5', 'Decision memo + Monday plan']] },
  seat:      { name: 'Forward-Deployed PM', weeks: 0, lo: 15, hi: 22, monthly: true, for: 'A senior PM embedded month to month, including while you hire your own PM, whom we then onboard.',
    steps: [['W1', 'Embedded: repo, analytics, Slack'], ['W1', 'First thing shipped'], ['W2', 'Roadmap you can defend'], ['WEEKLY', 'Ship log + grounded report'], ['HIRE', 'We onboard your new PM']] },
};

export const WEEK = [
  ['MON', 'Decision memo signed', 'memo.md'],
  ['TUE', 'Flows in your design system', 'figma'],
  ['WED', 'Built, tested, merged behind a flag', 'PR #482'],
  ['THU', 'Events instrumented, dashboard up', 'analytics'],
  ['FRI', 'Rolled out to 10% of users', 'live · readout Monday'],
] as const;

/** Written as the questions buyers type into Google and AI assistants. Rendered on the page and as FAQPage JSON-LD. */
export const FAQ = [
  { q: 'What is a forward-deployed product manager?',
    a: 'A senior product manager who works inside your team the way a forward-deployed engineer does, but owns the product decision as well as the delivery. They decide what to build, design it, ship it to production in your repo, instrument it, and report the results. With AI agents doing the legwork, one person covers what used to take a PM, a designer, an analyst and part of an engineer.' },
  { q: 'How is this different from a fractional product manager?',
    a: 'Fractional PMs advise: roadmaps, PRDs, meetings. We advise and ship. Our product managers open pull requests, run the rollout, wire the analytics and bring back the numbers. Fractional PMs typically bill $150–250 an hour for the advice alone.' },
  { q: 'How is it different from hiring forward-deployed engineers or a dev agency?',
    a: 'Engineers and agencies build what they are told. The hardest part of AI-era product work is deciding what is worth building and proving that it worked. We own that decision, then build it with your engineers reviewing, and measure it.' },
  { q: 'How much does it cost?',
    a: 'Fixed-scope sprints range from about $6K for a one-week Decision Sprint to about $28K for a three-week AI Ship Sprint. A forward-deployed PM month to month is roughly $15–22K. The estimator on this page gives a range for your situation in seconds; the final number comes after a 20-minute call.' },
  { q: 'Will you replace our engineers or our PM?',
    a: 'No. Your engineers review every pull request, and we add hands rather than take turf. If you are hiring a PM, we cover the seat until they start, then onboard them into the same way of working.' },
  { q: 'What does "fully agentic" mean here?',
    a: 'AI agents do the legwork: drafting specs, writing code and tests, building queries and dashboards. A senior human makes every decision, reviews every change, and is accountable for the outcome. You get the speed of agents with the judgment of an experienced product manager.' },
  { q: 'Which stacks and tools do you work with?',
    a: 'Whatever you run: any web or mobile stack, GitHub or GitLab, and analytics such as PostHog, Amplitude, Mixpanel, GA4 or SQL on your warehouse. If something isn’t instrumented, we instrument it.' },
  { q: 'Where are you based, and do you work US hours?',
    a: 'Mexico City (UTC−6 all year), so our working day overlaps with every US time zone, from Eastern to Pacific.' },
] as const;
