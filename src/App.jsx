import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

const images = {
  hero: 'https://image.jimcdn.com/app/cms/image/transf/dimension=1920x400:format=jpg/path/s557e8fa3392987d1/image/i801c49eabf80e4c4/version/1602759628/image.jpg',
  training: 'https://image.jimcdn.com/app/cms/image/transf/dimension=820x10000:format=jpg/path/s557e8fa3392987d1/image/id28fca43b63cf47e/version/1602755953/image.jpg',
  certificate: 'https://image.jimcdn.com/app/cms/image/transf/dimension=307x10000:format=jpg/path/s557e8fa3392987d1/image/i930ed9d854299603/version/1559045701/image.jpg',
  truck: 'https://image.jimcdn.com/app/cms/image/transf/dimension=334x10000:format=jpg/path/s557e8fa3392987d1/image/i3bfccd57fce2dc3c/version/1602750421/image.jpg',
  location: 'https://image.jimcdn.com/app/cms/image/transf/none/path/s557e8fa3392987d1/image/if183056c7a45fe33/version/1569421108/image.jpg',
  portrait: 'https://image.jimcdn.com/app/cms/image/transf/dimension=233x10000:format=jpg/path/s557e8fa3392987d1/image/i3a923c4c4fbfb3b0/version/1653038848/image.jpg'
};

const navItems = [
  ['Startseite', 'startseite'],
  ['Führerschein (alle Klassen)', 'fuehrerschein'],
  ['Berufskraftfahrer (Weiterbildung)', 'weiterbildung'],
  ['LKW‑Vermietung', 'fuhrpark'],
  ['Agentur für Arbeit / AZAV', 'azav'],
  ['Über uns', 'geschaeftsfuehrung'],
  ['Standorte', 'standorte'],
  ['Galerie', 'ausbildung'],
  ['Downloads', 'foerderung'],
  ['Kontakt', 'kontakt']
];

const reveal = {
  hidden: { opacity: 0, y: 28, scale: 0.985 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.58, ease: [0.16, 1, 0.3, 1] } }
};

const reducedReveal = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: 'linear' } }
};

function ExternalImage({ src, alt, className = '', eager = false }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`image-shell ${className} ${failed ? 'image-failed' : ''}`}>
      <div className="image-fallback" aria-hidden="true"><i className="bi bi-truck" /></div>
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding={eager ? 'sync' : 'async'}
        fetchPriority={eager ? 'high' : 'auto'}
        onError={(event) => {
          event.currentTarget.style.display = 'none';
          setFailed(true);
        }}
      />
    </div>
  );
}

function Header() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (reduce) setVisible(true);
      else if (y > 120) setVisible(y < lastY.current);
      else setVisible(true);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [reduce]);

  return (
    <motion.header
      className={`site-header ${scrolled ? 'is-scrolled' : ''}`}
      initial={{ opacity: 0, y: reduce ? 0 : -18 }}
      animate={{ opacity: 1, y: visible ? 0 : '-100%' }}
      transition={{ duration: reduce ? 0.2 : 0.5, ease: reduce ? 'linear' : [0.16, 1, 0.3, 1] }}
    >
      <div className="header-inner">
        <a className="brand" href="#startseite" aria-label="KAS Startseite">
          <span className="brand-mark"><i className="bi bi-truck" /></span>
          <span><strong>KAS</strong><small>Kraftfahrerausbildungsstätte</small></span>
        </a>
        <nav className="desktop-nav" aria-label="Hauptnavigation">
          {navItems.slice(0, 7).map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}
        </nav>
        <a className="header-cta" href="#kontakt">Kontakt</a>
        <button className="menu-button" type="button" aria-label="Menü öffnen" aria-expanded={open} onClick={() => setOpen(true)}>
          <i className="bi bi-list" />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <>
            <motion.button className="menu-backdrop" aria-label="Menü schließen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
            <motion.aside className="mobile-panel" initial={{ x: reduce ? 0 : '100%', opacity: reduce ? 0 : 1 }} animate={{ x: 0, opacity: 1 }} exit={{ x: reduce ? 0 : '100%', opacity: reduce ? 0 : 1 }} transition={{ duration: reduce ? 0.2 : 0.38, ease: [0.16, 1, 0.3, 1] }}>
              <button className="menu-close" type="button" aria-label="Menü schließen" onClick={() => setOpen(false)}><i className="bi bi-x-lg" /></button>
              <nav aria-label="Mobile Navigation">
                {navItems.map(([label, id], index) => (
                  <motion.a key={id} href={`#${id}`} onClick={() => setOpen(false)} initial={{ opacity: 0, x: reduce ? 0 : 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: reduce ? 0 : index * 0.035 }}>{label}</motion.a>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function SectionHeading({ eyebrow, title, text }) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
    </div>
  );
}

function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 0.4], [0, reduce ? 0 : -24]);
  const laneOpacity = useTransform(scrollYProgress, [0, 0.4], [reduce ? 0.8 : 1, reduce ? 0.8 : 0.6]);
  const contentY = useTransform(scrollYProgress, [0, 0.4], [0, reduce ? 0 : 12]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, reduce ? 1 : 0.88]);
  const words = 'Immer mehr können als alle anderen!'.split(' ');

  return (
    <section className="hero" id="startseite" ref={ref}>
      <motion.div className="hero-image" style={{ y: imageY }} initial={{ opacity: 0, scale: reduce ? 1 : 1.06 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduce ? 0.2 : 0.7, ease: reduce ? 'linear' : [0.16, 1, 0.3, 1] }}>
        <ExternalImage src={images.hero} alt="KAS Ausbildungsfahrzeug auf dem Betriebsgelände" eager />
      </motion.div>
      <div className="hero-overlay" />
      <motion.div className="hero-lane" style={{ opacity: laneOpacity }} initial={{ x: reduce ? 0 : 120, opacity: 0 }} animate={{ x: 0, opacity: reduce ? 0.8 : 1 }} transition={{ duration: reduce ? 0.2 : 0.6, delay: reduce ? 0 : 0.15, ease: reduce ? 'linear' : [0.16, 1, 0.3, 1] }}><span /><span /><span /><span /></motion.div>
      <div className="hero-glow" />
      <motion.div className="hero-content container" style={{ y: contentY, opacity: contentOpacity }}>
        <motion.span className="eyebrow" initial={{ opacity: 0, y: reduce ? 0 : 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduce ? 0 : 0.16 }}>Fahrschule für alle Klassen in NRW</motion.span>
        <h1 aria-label="Immer mehr können als alle anderen!">
          {words.map((word, index) => <motion.span aria-hidden="true" key={`${word}-${index}`} initial={{ opacity: 0, y: reduce ? 0 : 18, rotate: reduce ? 0 : 1 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: reduce ? 0.2 : 0.48, delay: reduce ? 0 : 0.18 + index * 0.055, ease: reduce ? 'linear' : [0.16, 1, 0.3, 1] }}>{word}&nbsp;</motion.span>)}
        </h1>
        <motion.p initial={{ opacity: 0, y: reduce ? 0 : 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduce ? 0 : 0.4 }}>Ausbildung und Weiterbildung für Fahrer aller Klassen – mit einem umfassenden Basiswissen für Prüfung und sicheren Straßenverkehr.</motion.p>
        <motion.div className="trust-row" initial={{ opacity: 0, y: reduce ? 0 : 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduce ? 0 : 0.48 }}>
          <span className="trust-chip"><i className="bi bi-speedometer2" /> Alle Klassen</span>
          <span className="trust-chip"><i className="bi bi-truck" /> Ausbildung & Weiterbildung</span>
        </motion.div>
        <motion.div className="hero-actions" initial={{ opacity: 0, y: reduce ? 0 : 22 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduce ? 0 : 0.56 }}>
          <motion.a className="button button-orange" href="#fuehrerschein" whileHover={reduce ? undefined : { scale: 1.04, y: -3 }} whileTap={reduce ? undefined : { scale: 0.97 }}>Führerschein starten <i className="bi bi-arrow-right" /></motion.a>
          <motion.a className="button button-secondary" href="#foerderung" whileHover={reduce ? undefined : { scale: 1.03, y: -3 }} whileTap={reduce ? undefined : { scale: 0.97 }}>Förderung bis 100%</motion.a>
        </motion.div>
      </motion.div>
      <motion.a className="scroll-cue" href="#klassen" aria-label="Zu den Führerscheinklassen" animate={reduce ? undefined : { y: [0, 7, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}><i className="bi bi-chevron-down" /></motion.a>
    </section>
  );
}

function LicenseLane() {
  const reduce = useReducedMotion();
  const licenses = ['B', 'BE', 'C1', 'C1E', 'C', 'CE', 'ADR', 'Stapler', 'Baumaschine', 'Verladekran'];
  return (
    <section className="section lane-section" id="klassen">
      <div className="container narrow">
        <SectionHeading eyebrow="Ihr Weg" title="Welche Fahrspur passt zu Ihnen?" text="Von der Führerscheinklasse B bis zur Gefahrgutfahrerschulung – wer fahren möchte, ist hier richtig." />
        <motion.div className="license-layout" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={reduce ? reducedReveal : { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}>
          <motion.div className="road-sign" variants={reduce ? reducedReveal : { hidden: { opacity: 0, x: -30, rotate: -2 }, visible: { opacity: 1, x: 0, rotate: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } } }}><i className="bi bi-signpost-2" /><strong>Alle Klassen</strong><span>Spur auswählen</span></motion.div>
          <div className="license-track">
            {licenses.map((license) => (
              <motion.a key={license} href="#kontakt" className="license-pill" variants={reduce ? reducedReveal : { hidden: { opacity: 0, x: 28 }, visible: { opacity: 1, x: 0, transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] } } }} whileHover={reduce ? undefined : { y: -5, scale: 1.025 }} whileTap={reduce ? undefined : { scale: 0.92 }}>
                <i className="bi bi-check2-circle" /><strong>{license}</strong><span><i className="bi bi-arrow-right" /></span>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Funding() {
  const reduce = useReducedMotion();
  return (
    <section className="section funding-section" id="foerderung">
      <motion.div className="funding-band container compact" variants={reduce ? reducedReveal : reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} whileHover={reduce ? undefined : { y: -5 }}>
        <div className="funding-copy">
          <span className="eyebrow"><i className="bi bi-cash-coin" /> Beschäftigtenqualifizierung</span>
          <h2>Bis zu <span className="funding-value">100%</span> Förderung</h2>
          <p>Am 01.04.2024 wurden die Richtlinien zur Beschäftigtenqualifizierung geändert. Unternehmen können bis zu 100% der Schulungskosten über die Agentur für Arbeit gefördert bekommen.</p>
          <p><strong>Verschenken Sie kein Geld. Wir helfen Ihnen.</strong></p>
          <motion.a className="button button-orange" href="https://www.kas-fahrschule.de/app/download/12482325960/Besch%C3%A4ftigtenf%C3%B6rderung.pdf?t=1721291354" whileHover={reduce ? undefined : { y: -3, scale: 1.035 }} whileTap={reduce ? undefined : { scale: 0.96 }}><i className="bi bi-file-earmark-pdf" /> Förderhöhe als PDF</motion.a>
        </div>
        <motion.div className="certificate-wrap" initial={{ opacity: 0, x: reduce ? 0 : 18, clipPath: reduce ? 'inset(0)' : 'inset(0 100% 0 0)' }} whileInView={{ opacity: 1, x: 0, clipPath: 'inset(0 0% 0 0)' }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: reduce ? 0.2 : 0.55, ease: reduce ? 'linear' : [0.16, 1, 0.3, 1] }} whileHover={reduce ? undefined : { scale: 1.06, rotate: 1 }}><ExternalImage src={images.certificate} alt="Nachweis zur Anerkennung als Bildungsträger" /></motion.div>
      </motion.div>
    </section>
  );
}

const features = [
  { icon: 'bi-person-check', title: 'Führerschein', text: 'Sie möchten einen Führerschein machen? Bei der KAS sind Sie richtig: Wir sind die Fahrschule für alle Klassen.', items: ['Klasse B und BE', 'Klasse C1 und C1E', 'Klasse C und CE'] },
  { icon: 'bi-briefcase', title: 'Aus- & Weiterbildung', text: 'Eine gute Ausbildung bildet das Fundament. Regelmäßige Weiterbildung bringt das Wissen auf den neuesten Stand.', items: ['Weiterbildung nach BKrFQG', 'ADR Gefahrgutschulung', 'Ladungssicherung'] }
];

function TrainingOverview() {
  const reduce = useReducedMotion();
  return (
    <section className="section training-section" id="ausbildung">
      <div className="blob blob-teal" /><div className="blob blob-orange" />
      <div className="container narrow">
        <motion.div variants={reduce ? reducedReveal : reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }}><SectionHeading eyebrow="Kompetenz auf jeder Strecke" title="Ausbildung & Weiterbildung" text="Professionelle Ausbildung und Weiterbildung für Kraftfahrer und Fahrschüler aller Klassen." /></motion.div>
        <div className="training-grid">
          {features.map((feature, index) => (
            <motion.article className="feature-card" key={feature.title} initial={{ opacity: 0, y: reduce ? 0 : 34, rotate: reduce ? 0 : 1.5, scale: reduce ? 1 : 0.975 }} whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: reduce ? 0.2 : 0.62, delay: reduce ? 0 : index * 0.11, ease: reduce ? 'linear' : [0.16, 1, 0.3, 1] }} whileHover={reduce ? undefined : { y: -8, scale: 1.012 }}>
              <div className="feature-image"><ExternalImage src={images.training} alt="Ausbildung bei der KAS Kraftfahrerausbildungsstätte" /></div>
              <div className="feature-body"><span className="icon-tile"><i className={`bi ${feature.icon}`} /></span><h3>{feature.title}</h3><p>{feature.text}</p><ul>{feature.items.map((item) => <li key={item}><i className="bi bi-check2-circle" /> {item}</li>)}</ul><a className="card-link" href="#kontakt">Beratung anfragen <i className="bi bi-arrow-right" /></a></div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Fleet() {
  const reduce = useReducedMotion();
  return (
    <section className="section fleet-section" id="fuhrpark">
      <div className="container narrow fleet-grid">
        <motion.div className="vehicle-card" initial={{ opacity: 0, x: reduce ? 0 : -34, rotate: reduce ? 0 : -1.5 }} whileInView={{ opacity: 1, x: 0, rotate: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: reduce ? 0.2 : 0.62, ease: reduce ? 'linear' : [0.16, 1, 0.3, 1] }} whileHover={reduce ? undefined : { y: -7, scale: 1.025 }}>
          <div className="road-stripe" />
          <motion.div className="fleet-image" initial={{ clipPath: reduce ? 'inset(0)' : 'inset(0 18% 0 18% round 28px)', scale: reduce ? 1 : 1.08 }} whileInView={{ clipPath: 'inset(0 0% 0 0% round 28px)', scale: 1 }} viewport={{ once: true }} transition={{ duration: reduce ? 0.2 : 0.7 }}><ExternalImage src={images.truck} alt="Fahrschul-LKW aus dem KAS Fuhrpark" /></motion.div>
          <div className="class-badges">{['C1', 'C1E', 'C', 'CE'].map((item) => <span key={item}>{item}</span>)}</div>
        </motion.div>
        <motion.div className="fleet-copy" initial={{ opacity: 0, x: reduce ? 0 : 34 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: reduce ? 0.2 : 0.56, delay: reduce ? 0 : 0.08 }}>
          <span className="eyebrow"><i className="bi bi-truck" /> Fuhrpark</span><h2>Trainieren oder mieten</h2><p>Wir bilden nicht nur selber aus, sondern bieten in unserem Fuhrpark auch Fahrzeuge zur Vermietung an.</p><p>Egal ob Klasse C1, C1E, C oder CE: Wir bieten verschiedene Kombinationen zu fairen Preisen.</p>
          <motion.a className="button button-teal" href="#kontakt" whileHover={reduce ? undefined : { scale: 1.04, y: -3 }} whileTap={reduce ? undefined : { scale: 0.96 }}><i className="bi bi-gear" /> LKW-Vermietung anfragen <i className="bi bi-arrow-right" /></motion.a>
        </motion.div>
      </div>
    </section>
  );
}

function Locations() {
  const reduce = useReducedMotion();
  const locations = [
    { title: 'Standort Kleve', badge: 'Hauptstandort', lines: ['Verwaltung', 'Fahrschule', 'Aus- und Weiterbildung nach BKrFQG'] },
    { title: 'Schulungsort Krefeld', badge: 'Kompetenzcenter', lines: ['Herbrand Fichtenhain GmbH & Co. KG', 'Europark Fichtenhain B1', '47807 Krefeld', 'Schulungen nach BKrFQG (5 Module)'] }
  ];
  return (
    <section className="section locations-section" id="standorte">
      <div className="container narrow"><SectionHeading eyebrow="Vor Ort" title="Unsere Standorte" text="Ausbildung und Weiterbildung in Kleve und am Schulungsort Krefeld." />
        <div className="location-grid">{locations.map((location, index) => (
          <motion.article className="location-card" key={location.title} initial={{ opacity: 0, y: reduce ? 0 : 28, scale: reduce ? 1 : 0.98 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: reduce ? 0.2 : 0.56, delay: reduce ? 0 : index * 0.1 }} whileHover={reduce ? undefined : { y: -7, scale: 1.015 }}>
            <div className="location-image"><ExternalImage src={images.location} alt={`${location.title} der KAS`} /></div>
            <div className="location-body"><span className="location-badge"><i className="bi bi-geo-alt" /> {location.badge}</span><h3>{location.title}</h3>{location.lines.map((line) => <p key={line}><i className="bi bi-building" /> {line}</p>)}<a className="outline-button" href="#kontakt">Kontakt aufnehmen <i className="bi bi-arrow-right" /></a></div>
          </motion.article>
        ))}</div>
      </div>
    </section>
  );
}

function Quality() {
  const reduce = useReducedMotion();
  return (
    <section className="section quality-section" id="azav">
      <motion.div className="quality-strip container narrow" variants={reduce ? reducedReveal : reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} whileHover={reduce ? undefined : { y: -4 }}>
        <div className="quality-copy"><span className="eyebrow light"><i className="bi bi-award" /> AZAV</span><h2>Qualität für Jobcenter & Unternehmen</h2><p>Unser Qualitätsniveau wird durch die Anerkennung als Bildungsträger gemäß Anerkennungs- und Zulassungsverordnung Weiterbildung (AZAV) gewährleistet.</p><ul><li><i className="bi bi-shield-check" /> Anerkannter Bildungsträger</li><li><i className="bi bi-check2-circle" /> Wir suchen und bilden für unsere Kunden EU-Kraftfahrer aus.</li></ul><a className="quality-link" href="https://www.kas-fahrschule.de/agentur-f%C3%BCr-arbeit-jobcenter/">Agentur für Arbeit / Jobcenter <i className="bi bi-arrow-right" /></a></div>
        <motion.div className="quality-certificate" whileHover={reduce ? undefined : { scale: 1.06, rotate: 1 }}><ExternalImage src={images.certificate} alt="AZAV-Nachweis der KAS" /></motion.div>
      </motion.div>
    </section>
  );
}

function Leadership() {
  const reduce = useReducedMotion();
  const people = [
    { name: 'Ralf van Wickeren', role: 'Inhaber, Gründer und Geschäftsführer', lines: ['Fahrlehrer der Klassen A / BE / CE', 'Ausbildungsfahrlehrer', 'Ausbilder nach BKrFQG', 'Gabelstapler Trainer'] },
    { name: 'Janek van Wickeren', role: 'Geschäftsführer und verantwortlicher Leiter', lines: ['Im Unternehmen seit 2015', 'Fahrlehrer aller Klassen', 'Ausbilder nach BKrFQG', 'Ausbilder Ladungssicherung', 'Gabelstapler Trainer', 'Baumaschinen Trainer'] }
  ];
  return (
    <section className="section leadership-section" id="geschaeftsfuehrung">
      <div className="container compact"><SectionHeading eyebrow="Die Geschäftsführung" title="Ralf & Janek van Wickeren" text="Professionelle Ausbildung, Weiterbildung und Qualität stehen im Mittelpunkt." />
        <div className="people-grid">{people.map((person, index) => (
          <motion.article className="person-card" key={person.name} initial={{ opacity: 0, y: reduce ? 0 : 32, rotate: reduce ? 0 : 1, scale: reduce ? 1 : 0.975 }} whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: reduce ? 0.2 : 0.6, delay: reduce ? 0 : index * 0.12 }} whileHover={reduce ? undefined : { y: -8, scale: 1.015 }}>
            <div className="portrait"><ExternalImage src={images.portrait} alt={person.name} /></div><div className="person-body"><span className="role-badge"><i className="bi bi-person-check" /> {person.role}</span><h3>{person.name}</h3><ul>{person.lines.map((line) => <li key={line}>{line}</li>)}</ul><a className="person-link" href="mailto:info@kas-fahrschule.de"><i className="bi bi-envelope" /> info@kas-fahrschule.de</a></div>
          </motion.article>
        ))}</div>
      </div>
    </section>
  );
}

function LicenseAccordion() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState('B');
  const classes = ['B', 'BE', 'C1', 'C1E', 'C', 'CE'];
  return (
    <section className="section accordion-section" id="fuehrerschein">
      <div className="container accordion-layout">
        <div><SectionHeading eyebrow="Klassen-Navigator" title="Von B / BE bis CE" text="Wählen Sie Ihre Führerscheinklasse, ohne den Überblick zu verlieren." />
          <motion.div className="accordion-list" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={reduce ? reducedReveal : { hidden: {}, visible: { transition: { staggerChildren: 0.065 } } }}>
            {classes.map((item) => {
              const isOpen = active === item;
              return <motion.div className={`accordion-item ${isOpen ? 'active' : ''}`} key={item} variants={reduce ? reducedReveal : { hidden: { opacity: 0, y: 20, scale: 0.99 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.42 } } }}>
                <button type="button" aria-expanded={isOpen} onClick={() => setActive(isOpen ? '' : item)}><span className="lane-badge">{item}</span><span>Führerscheinklasse {item}</span><motion.i className="bi bi-chevron-down" animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: reduce ? 0 : 0.28 }} /></button>
                <AnimatePresence initial={false}>{isOpen && <motion.div className="accordion-panel" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reduce ? 0.2 : 0.34, ease: [0.16, 1, 0.3, 1] }}><p>Umfangreiches Basiswissen für die Prüfung und für einen sicheren Straßenverkehr.</p><a href="#kontakt">Beratung zu Klasse {item} <i className="bi bi-arrow-right" /></a></motion.div>}</AnimatePresence>
              </motion.div>;
            })}
          </motion.div>
        </div>
        <motion.div className="accordion-image" initial={{ opacity: 0, clipPath: reduce ? 'inset(0)' : 'inset(0 0 100% 0 round 28px)', scale: reduce ? 1 : 1.07 }} whileInView={{ opacity: 1, clipPath: 'inset(0 0 0% 0 round 28px)', scale: 1 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: reduce ? 0.2 : 0.7 }} whileHover={reduce ? undefined : { scale: 1.065, y: -4 }}><ExternalImage src={images.training} alt="Führerscheinausbildung bei KAS" /></motion.div>
      </div>
    </section>
  );
}

function ProfessionalTraining() {
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState('Modul 1');
  const modules = ['Modul 1', 'Modul 2', 'Modul 3', 'Modul 4', 'Modul 5'];
  return (
    <section className="section modules-section" id="weiterbildung">
      <div className="container narrow"><SectionHeading eyebrow="Berufskraftfahrer" title="BKrFQG – 5 Module" text="Regelmäßige Weiterbildungen bringen das Wissen auf den neuesten Stand." />
        <div className="module-counter"><strong>5</strong><span>Module</span></div>
        <div className="modules-grid">{modules.map((item, index) => (
          <motion.button type="button" className={`module-card ${selected === item ? 'selected' : ''}`} key={item} onClick={() => setSelected(item)} initial={{ opacity: 0, y: reduce ? 0 : 30, rotate: reduce ? 0 : 1.5, scale: reduce ? 1 : 0.96 }} whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: reduce ? 0.2 : 0.52, delay: reduce ? 0 : index * 0.09 }} whileHover={reduce ? undefined : { y: -7, scale: 1.025 }}><i className="bi bi-check2-circle" /><span>{item}</span><small>Weiterbildung nach BKrFQG</small><span className="module-progress" /></motion.button>
        ))}</div>
        <motion.a className="button button-orange modules-cta" href="#kontakt" whileHover={reduce ? undefined : { y: -3, scale: 1.04 }} whileTap={reduce ? undefined : { scale: 0.96 }}>Beratungstermin vereinbaren <i className="bi bi-arrow-right" /></motion.a>
      </div>
    </section>
  );
}

function Contact() {
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState('');
  const copy = (value) => {
    if (navigator.clipboard) navigator.clipboard.writeText(value).catch(() => {});
    setCopied(value);
    window.setTimeout(() => setCopied(''), 1600);
  };
  return (
    <section className="section contact-section" id="kontakt">
      <motion.div className="contact-card container compact" variants={reduce ? reducedReveal : reveal} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
        <div className="contact-copy"><span className="eyebrow light">Direkter Kontakt</span><h2>Sprechen Sie mit uns</h2><p>Nutzen Sie Ihre Chance und vereinbaren Sie einen Beratungstermin mit uns.</p></div>
        <div className="contact-actions">
          <button type="button" className="contact-row" onClick={() => copy('+49 2821 79079 80')}><i className="bi bi-telephone" /><span><small>Telefon</small><strong>+49 2821 79079 80</strong></span>{copied === '+49 2821 79079 80' ? <em>Nummer kopiert</em> : null}</button>
          <button type="button" className="contact-row" onClick={() => copy('info@kas-fahrschule.de')}><i className="bi bi-envelope" /><span><small>E-Mail</small><strong>info@kas-fahrschule.de</strong></span>{copied === 'info@kas-fahrschule.de' ? <em>Adresse kopiert</em> : null}</button>
          <motion.a className="button button-orange contact-cta" href="mailto:info@kas-fahrschule.de" whileHover={reduce ? undefined : { scale: 1.04, y: -3 }} whileTap={reduce ? undefined : { scale: 0.96 }}>Jetzt Kontakt aufnehmen <i className="bi bi-arrow-right" /></motion.a>
        </div>
      </motion.div>
    </section>
  );
}

function Footer() {
  return <footer><div className="container footer-inner"><div className="brand footer-brand"><span className="brand-mark"><i className="bi bi-truck" /></span><span><strong>KAS</strong><small>Kraftfahrerausbildungsstätte GmbH</small></span></div><p>Ausbildung und Weiterbildung für Fahrer aller Klassen in NRW.</p><a href="#startseite">Nach oben <i className="bi bi-arrow-up" /></a></div></footer>;
}

export default function App() {
  return <><Header /><main><Hero /><LicenseLane /><Funding /><TrainingOverview /><Fleet /><Locations /><Quality /><Leadership /><LicenseAccordion /><ProfessionalTraining /><Contact /></main><Footer /></>;
}
