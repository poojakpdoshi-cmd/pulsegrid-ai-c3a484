const plan = {
  "businessName": "“PulseGrid AI”",
  "websiteType": "portfolio",
  "tagline": "A distinctive digital experience created for “PulseGrid AI”",
  "pages": [
    "home",
    "work",
    "services",
    "about",
    "pricing",
    "contact"
  ],
  "features": [
    "responsive-design",
    "seo",
    "custom-branding",
    "smooth-animations",
    "contact-form",
    "product-catalogue",
    "booking",
    "testimonials",
    "faq",
    "pricing",
    "map",
    "admin-panel"
  ],
  "theme": {
    "style": "cyberpunk immersive",
    "primary": "#7c3aed",
    "secondary": "#06b6d4",
    "background": "#090b16",
    "text": "#f8f9ff"
  },
  "sections": [
    {
      "title": "Selected work with a point of view",
      "body": "Give “PulseGrid AI” a bold opening statement that feels personal, confident and memorable."
    },
    {
      "title": "Featured projects",
      "body": "Showcase a curated body of work with context, outcomes and visual rhythm."
    },
    {
      "title": "Process behind the work",
      "body": "Explain discovery, thinking, execution and collaboration in a clear way."
    },
    {
      "title": "Capabilities",
      "body": "Present services and strengths without turning the site into a generic list."
    },
    {
      "title": "Start a project",
      "body": "Invite relevant enquiries with a focused contact experience."
    }
  ],
  "contact": {}
};
const design = {
  "key": "glass",
  "label": "Immersive glass",
  "displayFont": "Inter, ui-sans-serif, system-ui, sans-serif",
  "bodyFont": "Inter, ui-sans-serif, system-ui, sans-serif",
  "radius": 30,
  "maxWidth": 1340,
  "density": "balanced",
  "seed": 2059559727
};
const FORM_URL = "https://website-maker-ai-api.poojakpdoshi.workers.dev/public/forms/9227a10d01333b591448a9fb14e29f559f0ae0dc431027c9/submit";
const featureCopy = {
  "responsive-design": "A fluid interface engineered for phones, tablets and wide desktop screens.",
  "seo": "Clean semantic structure, meaningful metadata and fast-loading content foundations.",
  "custom-branding": "A distinctive visual language shaped around the product, audience and market.",
  "smooth-animations": "Purposeful motion that guides attention without slowing down the experience.",
  "contact-form": "A focused lead form with clear states, validation and conversion-first copy.",
  "product-catalogue": "Structured product discovery with category-led navigation and strong calls to action.",
  "booking": "A clear path from interest to appointment, demo or consultation.",
  "testimonials": "Trust-building customer stories arranged for quick scanning and credibility.",
  "faq": "Accessible answers that remove hesitation before a visitor takes action.",
  "pricing": "Clear packages, confident comparisons and direct upgrade paths.",
  "map": "A production-ready map experience designed specifically for a portfolio audience.",
  "admin-panel": "A production-ready admin panel experience designed specifically for a portfolio audience."
};

import { useEffect, useMemo, useState } from 'react';
import './styles.css';

function slug(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'page';
}

function title(value) {
  return String(value || '').replace(/[-_]+/g, ' ').replace(/\b\w/g, function (char) { return char.toUpperCase(); });
}

function pagesForPlan() {
  var requested = Array.isArray(plan.pages) ? plan.pages.map(slug).filter(Boolean) : [];
  var pages = ['home'].concat(requested.filter(function (page) { return page !== 'home'; }));
  var source = (plan.websiteType + ' ' + plan.features.join(' ')).toLowerCase();
  var candidates = /saas|software|technology|ai|startup/.test(source)
    ? ['product', 'solutions', 'templates', 'pricing', 'about', 'contact']
    : /shop|store|commerce|product/.test(source)
      ? ['shop', 'collections', 'why-us', 'reviews', 'about', 'contact']
      : ['services', 'process', 'results', 'about', 'faq', 'contact'];
  candidates.forEach(function (candidate) {
    if (pages.indexOf(candidate) === -1 && pages.length < 8) pages.push(candidate);
  });
  if (pages.indexOf('contact') === -1) pages.push('contact');
  return pages.slice(0, 8);
}

function useRoute(pages) {
  var initial = slug(window.location.hash.replace(/^#\/?/, '') || 'home');
  var state = useState(pages.indexOf(initial) >= 0 ? initial : 'home');
  var route = state[0];
  var setRoute = state[1];
  useEffect(function () {
    function change() {
      var next = slug(window.location.hash.replace(/^#\/?/, '') || 'home');
      setRoute(pages.indexOf(next) >= 0 ? next : 'home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.addEventListener('hashchange', change);
    return function () { window.removeEventListener('hashchange', change); };
  }, [pages.join('|')]);
  return route;
}

function go(page) {
  window.location.hash = '#/' + slug(page);
}

function Reveal() {
  useEffect(function () {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: .12 });
    document.querySelectorAll('[data-reveal]').forEach(function (element) { observer.observe(element); });
    return function () { observer.disconnect(); };
  });
  return null;
}

function ContactForm() {
  var statusState = useState('');
  var status = statusState[0];
  var setStatus = statusState[1];
  var busyState = useState(false);
  var busy = busyState[0];
  var setBusy = busyState[1];

  async function submit(event) {
    event.preventDefault();
    if (!FORM_URL) {
      setStatus('Your enquiry is ready. Connect a form endpoint to receive submissions.');
      return;
    }
    setBusy(true);
    setStatus('');
    try {
      var response = await fetch(FORM_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget).entries()))
      });
      var data = await response.json().catch(function () { return {}; });
      if (!response.ok) throw new Error(data.error || 'Could not send your message.');
      event.currentTarget.reset();
      setStatus('Message sent successfully.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not send your message.');
    } finally {
      setBusy(false);
    }
  }

  return <form className="lead-form" onSubmit={submit}>
    <div><label htmlFor="name">Name</label><input id="name" name="name" required maxLength="100" placeholder="Your name" /></div>
    <div><label htmlFor="email">Email</label><input id="email" name="email" type="email" required maxLength="160" placeholder="you@example.com" /></div>
    <div className="full"><label htmlFor="company">Company</label><input id="company" name="company" maxLength="160" placeholder="Company or project" /></div>
    <div className="full"><label htmlFor="message">What are you building?</label><textarea id="message" name="message" required maxLength="2400" rows="5" placeholder="Tell us about the outcome you need" /></div>
    <button className="primary-button" disabled={busy}>{busy ? 'Sending…' : 'Start the conversation'}</button>
    {status && <p className="form-status" role="status">{status}</p>}
  </form>;
}

function VisualConsole() {
  return <div className="visual-console" aria-label="Animated product preview">
    <div className="console-top"><span></span><span></span><span></span><strong>LIVE PRODUCT SIGNAL</strong></div>
    <div className="console-grid">
      <aside>
        <span className="active">Overview</span>
        <span>Automations</span>
        <span>Analytics</span>
        <span>Customers</span>
      </aside>
      <div className="console-main">
        <div className="signal-row"><div><small>Growth velocity</small><strong>+48.2%</strong></div><span className="live-dot">Live</span></div>
        <div className="chart">
          <i style={{ height: '38%' }}></i><i style={{ height: '52%' }}></i><i style={{ height: '46%' }}></i><i style={{ height: '71%' }}></i><i style={{ height: '64%' }}></i><i style={{ height: '88%' }}></i><i style={{ height: '96%' }}></i>
        </div>
        <div className="console-cards">
          <article><small>Active flows</small><strong>1,284</strong><span>↑ 18%</span></article>
          <article><small>Response time</small><strong>84ms</strong><span>Global</span></article>
          <article><small>Conversion</small><strong>24.8%</strong><span>Optimised</span></article>
        </div>
      </div>
    </div>
    <div className="floating-chip chip-a">AI workflow ready</div>
    <div className="floating-chip chip-b">99.99% uptime</div>
  </div>;
}

function LogoCloud() {
  return <section className="logo-cloud" data-reveal>
    <span>Trusted by teams building the next category</span>
    <div><b>ARC</b><b>VELOCITY</b><b>ORBIT</b><b>NORTHSTAR</b><b>PULSE</b><b>FORMA</b></div>
  </section>;
}

function FeatureBento() {
  var features = plan.features.length ? plan.features : ['responsive-design', 'custom-branding', 'smooth-animations', 'seo', 'analytics', 'automation'];
  return <section className="section-shell" data-reveal>
    <div className="section-heading">
      <span className="eyebrow">Product advantage</span>
      <h2>Everything important, arranged with intention.</h2>
      <p>Clear hierarchy, useful interaction and high-quality motion turn a long feature list into a product story people can understand.</p>
    </div>
    <div className="bento-grid">
      {features.slice(0, 6).map(function (feature, index) {
        return <article key={feature} className={'bento-card bento-' + index}>
          <span className="card-number">{String(index + 1).padStart(2, '0')}</span>
          <div className="mini-visual"><i></i><i></i><i></i></div>
          <h3>{title(feature)}</h3>
          <p>{featureCopy[feature] || 'A polished, production-ready capability designed around the visitor journey.'}</p>
        </article>;
      })}
    </div>
  </section>;
}

function ProcessSection() {
  var steps = [
    ['01', 'Understand the outcome', 'Start with the audience, problem, desired action and proof needed to earn trust.'],
    ['02', 'Shape the experience', 'Turn the strategy into pages, content hierarchy, interaction and a distinct visual system.'],
    ['03', 'Launch with confidence', 'Validate mobile behavior, accessibility, performance and conversion paths before release.']
  ];
  return <section className="process-section section-shell" data-reveal>
    <div className="section-heading compact"><span className="eyebrow">How it works</span><h2>From idea to a product people remember.</h2></div>
    <div className="process-grid">{steps.map(function (step) {
      return <article key={step[0]}><span>{step[0]}</span><h3>{step[1]}</h3><p>{step[2]}</p></article>;
    })}</div>
  </section>;
}

function StorySection() {
  var first = plan.sections[0] || { title: 'Built around a real outcome', body: plan.tagline };
  var second = plan.sections[1] || { title: 'Clarity at every step', body: 'A focused experience that gives visitors the information and confidence they need.' };
  return <section className="story-section section-shell" data-reveal>
    <div className="story-art">
      <div className="orbit orbit-one"></div><div className="orbit orbit-two"></div>
      <div className="story-metric"><small>Signal quality</small><strong>98.6</strong><span>↑ category leading</span></div>
      <div className="story-stack"><i></i><i></i><i></i><i></i></div>
    </div>
    <div className="story-copy"><span className="eyebrow">Why it matters</span><h2>{first.title}</h2><p>{first.body}</p><div className="story-note"><b>{second.title}</b><span>{second.body}</span></div><button className="text-button" onClick={function () { go('about'); }}>Read the full story →</button></div>
  </section>;
}

function Testimonials() {
  var quotes = [
    ['“The product finally feels as strong as the idea behind it.”', 'Aarav Mehta', 'Founder, Northstar'],
    ['“Clearer story, better conversion and a much more premium experience.”', 'Mira Shah', 'Growth Lead, Forma'],
    ['“The new flow helped customers understand our value in minutes.”', 'Kabir Rao', 'Product Director, Orbit']
  ];
  return <section className="section-shell testimonials" data-reveal>
    <div className="section-heading compact"><span className="eyebrow">Customer signal</span><h2>Trusted because the experience does the explaining.</h2></div>
    <div className="quote-grid">{quotes.map(function (quote, index) {
      return <article key={quote[1]}><span>{'★★★★★'.slice(0, 5 - (index % 2))}</span><blockquote>{quote[0]}</blockquote><div><i>{quote[1].charAt(0)}</i><p><b>{quote[1]}</b><small>{quote[2]}</small></p></div></article>;
    })}</div>
  </section>;
}

function Pricing() {
  var yearlyState = useState(true);
  var yearly = yearlyState[0];
  var setYearly = yearlyState[1];
  var plans = [
    ['Launch', yearly ? '₹999' : '₹1,299', ['Core product pages', 'Responsive experience', 'Contact capture', 'SEO foundation']],
    ['Scale', yearly ? '₹2,499' : '₹2,999', ['Everything in Launch', 'Advanced sections', 'Integrations', 'Priority optimisation']],
    ['Custom', 'Let’s talk', ['Tailored architecture', 'Custom workflows', 'Migration support', 'Dedicated partnership']]
  ];
  return <section className="section-shell pricing-section" data-reveal>
    <div className="section-heading pricing-heading"><div><span className="eyebrow">Simple pricing</span><h2>Choose the level that matches the ambition.</h2></div><button className="billing-toggle" onClick={function () { setYearly(!yearly); }}><span className={yearly ? 'active' : ''}>Yearly</span><span className={!yearly ? 'active' : ''}>Monthly</span></button></div>
    <div className="pricing-grid">{plans.map(function (item, index) {
      return <article key={item[0]} className={index === 1 ? 'featured' : ''}><span className="plan-label">{item[0]}</span><strong>{item[1]}</strong><small>{item[1].charAt(0) === '₹' ? '/ month' : 'Built around your needs'}</small><ul>{item[2].map(function (feature) { return <li key={feature}>{feature}</li>; })}</ul><button className={index === 1 ? 'primary-button' : 'secondary-button'} onClick={function () { go('contact'); }}>{index === 2 ? 'Contact sales' : 'Start now'}</button></article>;
    })}</div>
  </section>;
}

function FAQ() {
  var items = [
    ['How quickly can we get started?', 'A focused first version can be shaped quickly once the audience, offer and primary conversion goal are clear.'],
    ['Will it work properly on mobile?', 'Yes. Mobile hierarchy, navigation, spacing, touch targets and loading behavior are treated as core requirements.'],
    ['Can the pages and content be customised?', 'Every page, section, message and call to action can be adjusted around your exact product and market.'],
    ['Does it include working interactions?', 'Navigation, pricing controls, accordions, lead forms and responsive states are built as functional interface elements.']
  ];
  var openState = useState(0);
  var open = openState[0];
  var setOpen = openState[1];
  return <section className="faq-section section-shell" data-reveal>
    <div className="section-heading compact"><span className="eyebrow">Questions answered</span><h2>Everything needed to move forward confidently.</h2></div>
    <div className="faq-list">{items.map(function (item, index) {
      return <article key={item[0]} className={open === index ? 'open' : ''}><button onClick={function () { setOpen(open === index ? -1 : index); }}><span>{item[0]}</span><i>+</i></button><p>{item[1]}</p></article>;
    })}</div>
  </section>;
}

function CTA() {
  return <section className="final-cta section-shell" data-reveal>
    <div><span className="eyebrow">Ready when you are</span><h2>Turn the next idea into a product people want to explore.</h2></div>
    <button className="light-button" onClick={function () { go('contact'); }}>Start a project <span>↗</span></button>
  </section>;
}

function HomePage() {
  return <main>
    <header className="hero section-shell">
      <div className="hero-copy">
        <div className="announcement"><span>NEW</span><p>{design.label} for ambitious {plan.websiteType} teams</p></div>
        <span className="eyebrow">Made for the next category</span>
        <h1><span>{plan.businessName}</span><em>{plan.tagline}</em></h1>
        <p className="hero-description">{(plan.sections[0] && plan.sections[0].body) || 'A premium digital experience that turns complex value into a clear, compelling and memorable product story.'}</p>
        <div className="hero-actions"><button className="primary-button" onClick={function () { go(pages[1] || 'product'); }}>Explore the product</button><button className="secondary-button" onClick={function () { go('contact'); }}>Book a demo <span>↗</span></button></div>
        <div className="proof-row"><div className="avatars"><i>A</i><i>M</i><i>K</i><i>+</i></div><p><b>4.9/5</b><span>from product-focused teams</span></p></div>
      </div>
      <VisualConsole />
    </header>
    <LogoCloud />
    <FeatureBento />
    <ProcessSection />
    <StorySection />
    <Testimonials />
    <Pricing />
    <FAQ />
    <CTA />
  </main>;
}

function PageVisual(props) {
  var index = props.index;
  return <div className={'page-visual visual-variant-' + (index % 4)}>
    <div className="visual-ring"></div><div className="visual-core"></div>
    <div className="data-card data-one"><small>Active signal</small><strong>{92 + (design.seed % 7)}%</strong></div>
    <div className="data-card data-two"><small>Momentum</small><strong>+{34 + (index * 7)}%</strong></div>
  </div>;
}

function GenericPage(props) {
  var page = props.page;
  var index = props.index;
  var sourceSection = plan.sections[index % Math.max(1, plan.sections.length)] || { title: title(page), body: plan.tagline };
  var nextSection = plan.sections[(index + 1) % Math.max(1, plan.sections.length)] || sourceSection;
  var kind = slug(page);

  if (kind === 'pricing') return <main className="page-main"><div className="page-intro section-shell"><span className="eyebrow">Plans that scale</span><h1>Pricing built for momentum, not confusion.</h1><p>Start with the essentials and expand when the product, team or audience grows.</p></div><Pricing /><FAQ /><CTA /></main>;
  if (kind === 'contact') return <main className="page-main"><div className="contact-page section-shell"><div><span className="eyebrow">Start a conversation</span><h1>Tell us what the next version needs to achieve.</h1><p>Share the product, audience and desired outcome. The right experience starts with a clear problem.</p><div className="contact-points"><span>✓ Response within one business day</span><span>✓ Clear scope before work begins</span><span>✓ No generic one-size-fits-all process</span></div></div><ContactForm /></div></main>;
  if (kind === 'faq') return <main className="page-main"><div className="page-intro section-shell"><span className="eyebrow">Help centre</span><h1>Clear answers before the next step.</h1><p>Everything visitors usually need to know about the product, process and support.</p></div><FAQ /><CTA /></main>;

  return <main className="page-main">
    <header className="page-hero section-shell">
      <div><span className="eyebrow">{String(index + 1).padStart(2, '0')} · {title(page)}</span><h1>{sourceSection.title}</h1><p>{sourceSection.body}</p><button className="primary-button" onClick={function () { go('contact'); }}>Discuss your use case</button></div>
      <PageVisual index={index} />
    </header>
    <section className={'page-layout layout-' + (index % 4) + ' section-shell'} data-reveal>
      <div className="page-copy"><span className="eyebrow">Built with purpose</span><h2>{nextSection.title}</h2><p>{nextSection.body}</p></div>
      <div className="page-card-grid">
        {plan.features.slice(0, 6).map(function (feature, featureIndex) {
          return <article key={feature}><span>{String(featureIndex + 1).padStart(2, '0')}</span><h3>{title(feature)}</h3><p>{featureCopy[feature] || 'A focused capability designed to improve clarity, trust and action.'}</p></article>;
        })}
      </div>
    </section>
    <ProcessSection />
    {index % 2 === 0 ? <Testimonials /> : <StorySection />}
    <CTA />
  </main>;
}

function Navigation(props) {
  var pages = props.pages;
  var route = props.route;
  var menuState = useState(false);
  var menu = menuState[0];
  var setMenu = menuState[1];
  return <nav className="navigation">
    <button className="brand" onClick={function () { go('home'); }}><img src="/logo.svg" alt="" /><span>{plan.businessName}</span></button>
    <div className={'nav-links ' + (menu ? 'open' : '')}>{pages.map(function (page) {
      return <button key={page} className={route === page ? 'active' : ''} onClick={function () { setMenu(false); go(page); }}>{title(page)}</button>;
    })}</div>
    <button className="nav-cta" onClick={function () { go('contact'); }}>Get started <span>↗</span></button>
    <button className="menu-button" aria-label="Toggle menu" onClick={function () { setMenu(!menu); }}><i></i><i></i></button>
  </nav>;
}

function App() {
  var pages = useMemo(pagesForPlan, []);
  var route = useRoute(pages);
  var index = Math.max(0, pages.indexOf(route));
  return <div className={'site profile-' + design.key}>
    <Reveal />
    <div className="ambient ambient-one"></div><div className="ambient ambient-two"></div><div className="grid-overlay"></div>
    <Navigation pages={pages} route={route} />
    <div key={route} className="route-enter">{route === 'home' ? <HomePage /> : <GenericPage page={route} index={index} />}</div>
    <footer className="footer section-shell"><div><button className="brand footer-brand" onClick={function () { go('home'); }}><img src="/logo.svg" alt="" /><span>{plan.businessName}</span></button><p>{plan.tagline}</p></div><div className="footer-pages">{pages.map(function (page) { return <button key={page} onClick={function () { go(page); }}>{title(page)}</button>; })}</div><small>© {new Date().getFullYear()} {plan.businessName} · Made by Poojak Doshi</small></footer>
  </div>;
}

export default App;
