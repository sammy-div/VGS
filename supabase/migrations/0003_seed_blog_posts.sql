-- Seed the blog with the site's 12 posts.
-- The three flagship posts link to their static article pages (path);
-- the rest render from `body` via the dynamic reader (blog/post.html).
insert into public.blog_posts (slug,title,category,excerpt,author,read_minutes,path,status,body,created_at) values
('manual-handoffs','The hidden cost of manual handoffs','automation','Why data re-entry is the tax nobody budgets for — and a practical way to remove it.','Sam Ayodele',6,'blog/article-1.html','published',null, now() - interval '1 days'),
('trustworthy-ai','Deploying AI you can actually trust','ai','A framework for grounding, guardrails and human review that keeps AI honest.','Sam Ayodele',8,'blog/article-2.html','published',null, now() - interval '4 days'),
('buy-vs-build','Buying vs building internal tools','strategy','A clear-eyed way to decide where custom software genuinely pays off.','Sam Ayodele',7,'blog/article-3.html','published',null, now() - interval '7 days'),
('map-before-automate','Mapping workflows before you automate','automation','Automating a broken process just makes bad outcomes arrive faster.','Vatous Team',5,null,'published',
$b$<p>The temptation, once you decide to automate, is to move fast. But automation is an amplifier: point it at a clean process and you get speed; point it at a broken one and you get broken outcomes, faster and at scale.</p>
<h2>Draw the process first</h2>
<p>Before writing a single rule, map how work actually flows today — the steps, the waits, the handoffs, the exceptions people quietly handle. You will almost always find redundant approvals and rework that should be removed, not encoded.</p>
<h2>Then automate what remains</h2>
<p>Once the process is lean, automate the repetitive, high-volume parts and leave judgment to people. The result is faster and more reliable, because you automated the right thing rather than the first thing.</p>$b$, now() - interval '10 days'),
('data-hygiene','What good data hygiene looks like','strategy','Small habits that keep your systems trustworthy as you scale.','Vatous Team',6,null,'published',
$b$<p>Data quality rarely fails all at once. It erodes — a duplicate here, an inconsistent format there — until reports can no longer be trusted and every decision comes with a caveat.</p>
<h2>Own the basics</h2>
<p>Agree on one source of truth for each important entity, validate data at the point of entry, and give fields consistent formats and clear owners. These unglamorous habits prevent most quality problems before they start.</p>
<h2>Make it visible</h2>
<p>Track a few simple quality metrics and review them regularly. When people can see the health of the data they depend on, they take care of it — and trust in your systems compounds.</p>$b$, now() - interval '13 days'),
('grounding-ai','Grounding AI in your own documents','ai','How retrieval keeps assistants accurate and reduces hallucination.','Vatous Team',7,null,'published',
$b$<p>A general model knows a lot about the world and almost nothing about your organization. Ask it a specific operational question and it may answer confidently — and wrongly.</p>
<h2>Retrieve, then answer</h2>
<p>Grounding fixes this by fetching the relevant passage from your own documents before the model responds, so answers are anchored to sources you can verify and cite. The assistant stops guessing and starts referencing.</p>
<h2>Keep sources current</h2>
<p>Grounding is only as good as the material behind it. Keep the underlying documents accurate and up to date, and the assistant stays accurate too — a system you can actually rely on.</p>$b$, now() - interval '16 days'),
('roi-internal-platforms','The real ROI of internal platforms','strategy','Measuring value beyond the licence fee line item.','Sam Ayodele',6,null,'published',
$b$<p>Internal platforms are often judged on cost alone, which misses the point. Their value shows up elsewhere — in time saved, errors avoided, and decisions made faster.</p>
<h2>Count the full picture</h2>
<p>Look at hours reclaimed from manual work, the cost of mistakes that no longer happen, and revenue from moving quicker than competitors. Set that against build and maintenance cost, and the real return becomes clear.</p>
<h2>Invest where it compounds</h2>
<p>The best platforms pay back repeatedly, quietly, every day. Judge them as infrastructure that compounds, not as a one-off expense.</p>$b$, now() - interval '19 days'),
('african-connectivity','Designing for African connectivity','engineering','Building software that stays usable when the network is not perfect.','Vatous Team',5,null,'published',
$b$<p>Software designed for perfect connectivity fails exactly when it matters most. Across many African markets, resilience is not a nice-to-have — it is the baseline requirement.</p>
<h2>Assume the network will drop</h2>
<p>Build for intermittent connections: cache sensibly, queue actions to sync later, and keep payloads small so the app stays responsive on slow links. Users should never lose work to a dropped signal.</p>
<h2>Respect the device and the data plan</h2>
<p>Optimise for mid-range phones and metered data. Lean, fast software is not just good engineering here — it is the difference between a tool people use and one they abandon.</p>$b$, now() - interval '22 days'),
('pragmatic-cloud','A pragmatic path to cloud','engineering','Moving to the cloud without the runaway bills and lock-in.','Vatous Team',7,null,'published',
$b$<p>The cloud can cut cost and add flexibility — or quietly drain budget through over-provisioning and services you never needed. The difference is in how you approach it.</p>
<h2>Move deliberately</h2>
<p>Start with workloads that clearly benefit, right-size from the outset, and put cost monitoring in place before the first bill, not after. Migrate in stages so you can learn and adjust.</p>
<h2>Guard against lock-in</h2>
<p>Favour portable foundations where it is practical, so you keep leverage and choice. Cloud should expand your options, not quietly remove them.</p>$b$, now() - interval '25 days'),
('change-management','Change management that sticks','strategy','Why adoption, not deployment, decides whether a system succeeds.','Vatous Team',6,null,'published',
$b$<p>A system that launches on time and under budget can still fail — if nobody uses it. Deployment is the easy part; adoption is where value is actually won or lost.</p>
<h2>Bring people along</h2>
<p>Involve the people who will use the system early, address their real concerns, and train them on their actual workflows. Ownership built during the project is what carries a tool into daily use.</p>
<h2>Support the transition</h2>
<p>Expect a dip while people adjust, and support them through it with clear help and quick fixes. Systems succeed when the humans around them are set up to succeed too.</p>$b$, now() - interval '28 days'),
('sme-security-basics','Security basics every SME should own','engineering','Practical, affordable steps that close the biggest risks first.','Vatous Team',5,null,'published',
$b$<p>Small and mid-sized businesses often assume serious security is out of reach. In reality, a handful of affordable basics close the majority of real-world risk.</p>
<h2>Start with the essentials</h2>
<p>Turn on multi-factor authentication everywhere, keep software patched, back up important data and test that you can restore it, and give people only the access they need. These steps cost little and stop most attacks.</p>
<h2>Make it a habit</h2>
<p>Security is not a one-off project. Brief your team on the common scams, review access regularly, and treat these basics as routine — the way you lock the office at night.</p>$b$, now() - interval '31 days'),
('spreadsheets-to-truth','From spreadsheets to a single source of truth','automation','How to graduate from heroic spreadsheets without the pain.','Vatous Team',6,null,'published',
$b$<p>Spreadsheets are where good operations begin and, eventually, where they get stuck. When one file becomes the fragile heart of the business, it is time to graduate.</p>
<h2>Move without the drama</h2>
<p>Start from the spreadsheet you already trust: understand what it really does, migrate it to a proper shared system in stages, and run both in parallel until the new one has earned confidence.</p>
<h2>Keep what worked</h2>
<p>The goal is not to abandon the flexibility people loved, but to keep it while adding reliability, access control and a single version of the truth everyone can depend on.</p>$b$, now() - interval '34 days')
on conflict (slug) do nothing;
