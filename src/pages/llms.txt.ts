// The site's own copy as one markdown file, built from the English locales. The chat widget's assistant answers from
// it (and nothing else), and it doubles as an llms.txt for AI crawlers. Rebuilt on every deploy, so it never drifts
// from the pages.
import type { APIRoute } from 'astro';
import site from '../locales/en/site.json';
import home from '../locales/en/index.json';
import academy from '../locales/en/bonsai-academy.json';

const strip = (s: string) => s.replace(/<br\s*\/?>/g, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

export const GET: APIRoute = () => {
  const out: string[] = [];
  const h = (level: number, text: string) => out.push('', `${'#'.repeat(level)} ${strip(text)}`, '');
  const p = (text: string) => out.push(strip(text));
  const li = (text: string) => out.push(`- ${strip(text)}`);

  out.push('# Despacho Bonsai', '', `> ${strip(site.hire_cred)}`, '');
  p('Despacho Bonsai is the product practice of Daniel Vásquez, based in Mexico City. Site: https://despachobonsai.com');

  h(2, `Home: ${home.hero_title}`);
  p(home.hero_subhead);
  p(`Example of the clarity we produce: ${home.hero_magic_text}`);
  h(3, home.pain_eyebrow);
  li(`${home.pain_1_h} ${home.pain_1_p}`);
  li(`${home.pain_2_h} ${home.pain_2_p}`);
  li(`${site.home_pain_3_h} ${site.home_pain_3_p}`);
  h(3, `${home.method_h2}: ${home.method_subtitle}`);
  li(`${home.method_1_h}: ${home.method_1_p}`);
  li(`${home.method_2_h}: ${home.method_2_p}`);
  li(`${home.method_3_h}: ${home.method_3_p}`);

  h(2, `Hire (https://despachobonsai.com/hire): ${site.hire_h1}`);
  p(site.hire_lede);
  h(3, site.how_title);
  site.how_steps.forEach(s => li(`${s.h}: ${s.p}`));
  h(3, site.who_title);
  site.who.forEach(s => li(`${s.h}: ${s.p}`));
  h(3, site.engagements_title);
  p(site.engagements_note);
  site.offers.forEach(o => {
    h(4, o.title);
    p(o.oneliner);
    p(o.body);
    Object.entries(o).forEach(([k, v]) => {
      if (typeof v === 'string' && !['id', 'title', 'oneliner', 'body', 'button', 'action'].includes(k)) li(`${k}: ${v}`);
    });
  });
  h(3, site.includes_title);
  site.includes.forEach(li);
  h(3, site.fit_yes_title);
  site.fit_yes.forEach(li);
  h(3, site.fit_no_title);
  site.fit_no.forEach(li);
  h(3, site.faq_title);
  site.faq.forEach(f => li(`${f.q} ${f.a}`));

  h(2, `Work (https://despachobonsai.com/work): ${site.work_h1}`);
  p(site.work_lede);
  site.proof_stats.forEach(s => li(`${s.figure}: ${s.label}`));
  site.projects.forEach(pr => {
    h(3, `${pr.name} (${pr.dates}), ${pr.role}`);
    p(pr.tagline);
    pr.points.forEach(li);
  });
  h(3, site.career_title);
  site.career.forEach(c => li(`${c.company} (${c.dates}), ${c.title}: ${c.p}`));

  h(2, `Bonsai Academy (https://despachobonsai.com/academy): ${academy.hero_title}`);
  p(academy.hero_subhead);
  li(`${academy.method_1_h}: ${academy.method_1_p}`);
  li(`${academy.method_2_h}: ${academy.method_2_p}`);
  li(`${academy.method_3_h}: ${academy.method_3_p}`);
  li(`${academy.os_1_h}: ${academy.os_1_p}`);
  li(`${academy.os_2_h}: ${academy.os_2_p}`);
  li(`${academy.os_3_h}: ${academy.os_3_p}`);
  p(site.notready_p);

  return new Response(out.join('\n').replace(/\n{3,}/g, '\n\n') + '\n', {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
