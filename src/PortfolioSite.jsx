import React, { useEffect, useRef, useState } from "react";

/**
 * Sai Pratheesh — Portfolio
 * Design system pulled from SPLIT (the training tracker): dark, premium,
 * data-forward. CSS custom properties as design tokens, exactly like SPLIT's
 * token-based approach. No animation library — scroll reveals run on
 * IntersectionObserver + CSS transitions so this renders anywhere, no
 * dependency install required.
 */

// ---------------------------------------------------------------------------
// Config — edit before deploying
// ---------------------------------------------------------------------------
const EMAIL = "saipratheesh15@gmail.com";
const PHONE = "+918618012764";
const PHONE_DISPLAY = "+91 86180 12764";
const LINKEDIN_URL = "https://www.linkedin.com/in/sai-pratheesh-0b854a343";
const GITHUB_URL = "https://github.com/saipratheesh07";
const RESUME_URL = "/Sai_Pratheesh_Resume.pdf"; // hosted resume — matches the file provided alongside this component

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

const TERMINAL_LINES = [
  "86% retrieval precision — RAG Notes Q&A eval harness",
  "8/8 tests green on every push — GitHub Actions CI",
  "2 live-data defects caught and fixed — ChurnLens",
  "0 API keys needed to reproduce — clone and run",
];

const PROJECTS = [
  {
    tag: "Retrieval · Evals",
    title: "RAG Notes Q&A",
    description:
      "Question-answering service that answers strictly from an indexed document corpus, and refuses when the corpus doesn't cover the question.",
    stack: ["Python", "FastAPI", "ChromaDB", "Docker", "GitHub Actions"],
    metric: "86%",
    metricLabel: "retrieval precision",
    kind: "Personal project",
    link: "https://github.com/saipratheesh07/rag-notes-qa",
    problem:
      "Most RAG demos get built once and never measured again — precision is assumed, not proven. I wanted to know if my retrieval was actually good, and prove it with a repeatable number.",
    approach: [
      "Built the evaluation harness before optimising the retriever: 14 answerable questions, a negative test for questions the corpus doesn't cover, and LLM-as-judge faithfulness scoring on generated answers.",
      "Kept retrieval scoring, ingestion, and the full test suite runnable with no API key, so anyone who clones the repo can reproduce the results.",
      "Shipped it as a single-command Docker deployment with the index built at image build time.",
    ],
    outcome: [
      "86% retrieval precision (12 of 14) across the answerable questions.",
      "Refuses off-topic questions, verified by the negative test in the eval set.",
      "8 automated tests green on every push via CI.",
    ],
  },
  {
    tag: "Data pipeline",
    title: "ChurnLens",
    description:
      "Turns public customer reviews into a ranked churn report, comparing a target company against its competitors on the same complaint themes.",
    stack: ["Python", "SQLAlchemy", "Claude API", "Apple RSS"],
    metric: "2",
    metricLabel: "live-data defects fixed",
    kind: "In progress",
    problem:
      "Customers say why they leave in public reviews, but a complaint only means something next to the competition. I wanted a pipeline that compares a company against its competitors on the same themes, and that's cheap and safe to re-run as the prompts change.",
    approach: [
      "Designed a three-layer schema: immutable raw payloads, normalised reviews, and model output keyed by model version, so a prompt change re-runs classification only and never re-fetches.",
      "Made ingestion idempotent at the database level with a uniqueness constraint on source, entity, and content hash, so scheduled collection is safe to run unsupervised.",
      "Built a cost-aware classification cascade: every review goes to a cheap model first, and only low-confidence cases escalate to a stronger one.",
    ],
    outcome: [
      "Escalation rate and cost per 1,000 reviews are reported, not guessed.",
      "Running it on a live App Store corpus surfaced 2 real defects: a source adapter that silently returned zero rows, and a theme taxonomy that was hardcoded despite being documented as configurable. Both fixed.",
    ],
  },
  {
    tag: "Multi-agent",
    title: "Befit Multi-Agent SEO Content Pipeline",
    description:
      "Multi-agent pipeline handling keyword research, drafting, editing, and publishing to WordPress for a D2C fitness client.",
    stack: ["Python", "Claude API", "WordPress"],
    metric: "4",
    metricLabel: "pipeline stages",
    kind: "Client project",
    problem:
      "Befit, a D2C fitness brand, needed a steady flow of SEO content with no in-house content team — and one-off articles wouldn't solve that.",
    approach: [
      "Split the work across a multi-agent pipeline: keyword research, drafting, editing, and publishing straight to WordPress.",
      "Enforced the brand's voice rules at the editing stage, so every draft is checked against them before it goes live.",
    ],
    outcome: [
      "Delivered as a repeatable content system rather than one-off output.",
      "Set up so the client could run it without my ongoing involvement.",
    ],
  },
];

const SKILLS = [
  { category: "Languages", items: ["Python", "TypeScript", "SQL", "C++"] },
  { category: "Backend & Infra", items: ["FastAPI", "Docker", "GitHub Actions CI", "MongoDB", "SQLAlchemy", "SQLite"] },
  { category: "AI & Data", items: ["Claude API", "LangChain", "MCP", "ChromaDB", "Retrieval pipelines", "LLM-as-judge evaluation"] },
  { category: "Frontend", items: ["React", "TypeScript"] },
  { category: "Practices", items: ["Idempotent ingestion", "Schema design", "Eval harness design", "Cost-aware model routing"] },
];

const SPOKEN_LANGUAGES = ["English", "Tamil", "Hindi", "Kannada"];

const EXPERIENCE = [
  {
    period: "2026",
    role: "Freelance Engineer",
    org: "Innova Marketing Group · Bengaluru",
    description:
      "Building an internal stock and inventory tool against the client's real operational workflow, scoped and delivered directly with the client rather than through a spec.",
  },
  {
    period: "Expected 2027",
    role: "B.E. Information Science and Engineering",
    org: "Nitte Meenakshi Institute of Technology, Bengaluru",
  },
];

// ---------------------------------------------------------------------------
// Design tokens — same approach SPLIT uses: CSS custom properties, one place
// ---------------------------------------------------------------------------
const TOKENS = `
  :root {
    --bg: #0B0F14;
    --surface: #12171F;
    --surface-2: #171D27;
    --border: #232B37;
    --text: #ECEFF3;
    --muted: #8891A0;
    --dim: #545E6E;
    --accent: #5EEAD4;
    --accent-dim: #2E7D6E;
    --font-display: 'Space Grotesk', system-ui, sans-serif;
    --font-body: 'Inter', system-ui, sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
  }
  html { scroll-behavior: smooth; background: var(--bg); }
  @keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
  @keyframes reveal {
    from { opacity: 0; transform: translateY(22px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .reveal { opacity: 0; }
  .reveal.in { animation: reveal 0.7s cubic-bezier(0.22,1,0.36,1) forwards; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes modalIn {
    from { opacity: 0; transform: translateY(16px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
`;

function useGoogleFonts() {
  useEffect(() => {
    if (document.getElementById("portfolio-fonts")) return;
    const link = document.createElement("link");
    link.id = "portfolio-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);
  }, []);
}

// ---------------------------------------------------------------------------
// Scroll reveal — IntersectionObserver instead of a motion library
// ---------------------------------------------------------------------------
function Reveal({ children, delay = 0, className = "", as: Tag = "div" }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Safety net: if IntersectionObserver never fires (iframe/embed quirks,
    // an element already in the viewport on some browsers, etc.), force the
    // reveal after a short delay so content can never get stuck invisible.
    const fallback = setTimeout(() => setInView(true), 900);

    if (typeof IntersectionObserver === "undefined") {
      return () => clearTimeout(fallback);
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          clearTimeout(fallback);
          obs.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? "in" : ""} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

function SectionLabel({ children }) {
  return (
    <span
      style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}
      className="text-[11px] tracking-[0.2em] uppercase"
    >
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Case study modal
// ---------------------------------------------------------------------------
function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-0 sm:p-6"
      style={{ animation: "fadeIn 0.2s ease-out" }}
    >
      <div
        className="absolute inset-0"
        style={{ background: "rgba(6,8,11,0.72)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        style={{ background: "var(--surface)", borderColor: "var(--border)", animation: "modalIn 0.3s cubic-bezier(0.22,1,0.36,1)" }}
        className="relative w-full sm:max-w-2xl sm:rounded-2xl border-t sm:border max-h-[92vh] overflow-y-auto"
      >
        <div
          className="sticky top-0 flex items-start justify-between gap-4 px-6 md:px-8 pt-6 pb-4 z-10"
          style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}
        >
          <div>
            <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }} className="text-[10px] tracking-[0.14em] uppercase">
              {project.tag} · {project.kind}
            </span>
            <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)" }} className="mt-2 text-[22px] md:text-[26px] font-semibold">
              {project.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ color: "var(--muted)", borderColor: "var(--border)" }}
            className="shrink-0 w-9 h-9 rounded-full border flex items-center justify-center hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
          >
            <span style={{ fontFamily: "var(--font-mono)" }} className="text-[16px]">×</span>
          </button>
        </div>

        <div className="px-6 md:px-8 py-6 space-y-8">
          <div className="flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <span
                key={s}
                style={{ fontFamily: "var(--font-mono)", color: "var(--muted)", borderColor: "var(--border)" }}
                className="text-[10.5px] px-2.5 py-1 rounded-md border"
              >
                {s}
              </span>
            ))}
          </div>

          <div>
            <span style={{ fontFamily: "var(--font-mono)", color: "var(--dim)" }} className="text-[11px] tracking-[0.1em] uppercase">
              The problem
            </span>
            <p style={{ fontFamily: "var(--font-body)", color: "var(--muted)" }} className="mt-3 text-[14.5px] leading-relaxed">
              {project.problem}
            </p>
          </div>

          <div>
            <span style={{ fontFamily: "var(--font-mono)", color: "var(--dim)" }} className="text-[11px] tracking-[0.1em] uppercase">
              Approach
            </span>
            <ul className="mt-3 space-y-2.5">
              {project.approach.map((line, i) => (
                <li key={i} className="flex gap-3">
                  <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }} className="text-[13px] mt-[1px]">→</span>
                  <span style={{ fontFamily: "var(--font-body)", color: "var(--muted)" }} className="text-[14.5px] leading-relaxed">
                    {line}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span style={{ fontFamily: "var(--font-mono)", color: "var(--dim)" }} className="text-[11px] tracking-[0.1em] uppercase">
              Outcome
            </span>
            <ul className="mt-3 space-y-2.5">
              {project.outcome.map((line, i) => (
                <li key={i} className="flex gap-3">
                  <span style={{ color: "var(--accent)", fontFamily: "var(--font-mono)" }} className="text-[13px] mt-[1px]">✓</span>
                  <span style={{ fontFamily: "var(--font-body)", color: "var(--text)" }} className="text-[14.5px] leading-relaxed">
                    {line}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-3.5"
            style={{ background: "var(--surface-2)", borderColor: "var(--border)" }}
          >
            <div className="flex items-baseline gap-2">
              <span style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }} className="text-[22px] font-semibold">
                {project.metric}
              </span>
              <span style={{ fontFamily: "var(--font-mono)", color: "var(--dim)" }} className="text-[11px] uppercase tracking-[0.06em]">
                {project.metricLabel}
              </span>
            </div>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                style={{ fontFamily: "var(--font-mono)", color: "var(--accent)", borderColor: "rgba(94,234,212,0.35)" }}
                className="text-[12px] px-4 py-2 rounded-full border hover:bg-[rgba(94,234,212,0.08)] transition-colors"
              >
                View on GitHub ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Nav
// ---------------------------------------------------------------------------
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (e, href) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
      style={{
        background: scrolled ? "rgba(11,15,20,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <a
          href="#top"
          onClick={(e) => handleClick(e, "#top")}
          style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
          className="font-semibold text-[15px] tracking-tight"
        >
          Sai Pratheesh
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              style={{ fontFamily: "var(--font-body)", color: "var(--muted)" }}
              className="text-[13px] hover:opacity-100 opacity-80 transition-opacity"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href={`mailto:${EMAIL}`}
          style={{ fontFamily: "var(--font-mono)", color: "var(--accent)", borderColor: "rgba(94,234,212,0.35)" }}
          className="text-[12px] px-4 py-2 rounded-full border hover:bg-[rgba(94,234,212,0.08)] transition-colors"
        >
          Say hi ↗
        </a>
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// Hero — signature: a data readout, same instinct as SPLIT's dashboard ring
// ---------------------------------------------------------------------------
function TerminalTicker() {
  const [lineIndex, setLineIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [phase, setPhase] = useState("typing");

  useEffect(() => {
    const current = TERMINAL_LINES[lineIndex];
    let timeout;
    if (phase === "typing") {
      if (charCount < current.length) timeout = setTimeout(() => setCharCount((c) => c + 1), 28);
      else timeout = setTimeout(() => setPhase("holding"), 1400);
    } else if (phase === "holding") {
      timeout = setTimeout(() => setPhase("deleting"), 900);
    } else if (phase === "deleting") {
      if (charCount > 0) timeout = setTimeout(() => setCharCount((c) => c - 1), 12);
      else {
        setLineIndex((i) => (i + 1) % TERMINAL_LINES.length);
        setPhase("typing");
      }
    }
    return () => clearTimeout(timeout);
  }, [charCount, phase, lineIndex]);

  const text = TERMINAL_LINES[lineIndex].slice(0, charCount);

  return (
    <div
      style={{ fontFamily: "var(--font-mono)", background: "var(--surface)", borderColor: "var(--border)" }}
      className="inline-flex items-center gap-2 rounded-lg border px-4 py-3 text-[13px] md:text-[14px]"
    >
      <span style={{ color: "var(--accent)" }}>$</span>
      <span style={{ color: "var(--text)" }} className="min-w-0">{text}</span>
      <span
        style={{ background: "var(--accent)", animation: "blink 1s steps(1) infinite" }}
        className="inline-block w-[7px] h-[15px]"
      />
    </div>
  );
}

function Ring({ percent = 86, label = "retrieval precision" }) {
  const size = 128;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(percent), 300);
    return () => clearTimeout(t);
  }, [percent]);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--border)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="var(--accent)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (animated / 100) * c}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="-mt-[76px] flex flex-col items-center">
        <span style={{ fontFamily: "var(--font-display)", color: "var(--text)" }} className="text-[26px] font-semibold">
          {percent}%
        </span>
      </div>
      <span style={{ fontFamily: "var(--font-mono)", color: "var(--dim)" }} className="mt-3 text-[10.5px] uppercase tracking-[0.1em] text-center">
        {label}
      </span>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="relative min-h-[92vh] flex items-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(#ECEFF3 1px, transparent 1px), linear-gradient(90deg, #ECEFF3 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div
          className="absolute -top-52 right-[-120px] w-[560px] h-[560px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(94,234,212,0.08) 0%, rgba(94,234,212,0) 65%)" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 0%, var(--bg) 94%)" }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 md:px-10 pt-24 pb-16 w-full grid lg:grid-cols-[1fr_260px] gap-14 items-center">
        <div>
          <Reveal>
            <SectionLabel>Final-year ISE · NMIT Bengaluru · 2027</SectionLabel>
          </Reveal>

          <Reveal delay={80}>
            <h1
              style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
              className="mt-5 font-semibold text-[38px] leading-[1.1] sm:text-[52px] md:text-[62px] tracking-tight max-w-2xl"
            >
              Building production-shaped{" "}
              <span style={{ color: "var(--accent)" }}>AI systems, end to end.</span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p style={{ fontFamily: "var(--font-body)", color: "var(--muted)" }} className="mt-6 text-[16px] md:text-[18px] max-w-xl leading-relaxed">
              Ingestion, retrieval, evaluation, API, CI and containerised deployment. I'm
              comfortable working directly against real customer data and messy third-party
              sources, and I measure a system before I try to improve it.
            </p>
          </Reveal>

          <Reveal delay={240} className="mt-8">
            <TerminalTicker />
          </Reveal>

          <Reveal delay={320} className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={`mailto:${EMAIL}`}
              style={{ fontFamily: "var(--font-body)", background: "var(--accent)", color: "var(--bg)" }}
              className="text-[14px] font-medium px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
            >
              Email me
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              style={{ fontFamily: "var(--font-body)", color: "var(--text)", borderColor: "var(--border)" }}
              className="text-[14px] font-medium px-6 py-3 rounded-full border hover:border-[var(--accent)] transition-colors"
            >
              GitHub
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              style={{ fontFamily: "var(--font-body)", color: "var(--text)", borderColor: "var(--border)" }}
              className="text-[14px] font-medium px-6 py-3 rounded-full border hover:border-[var(--accent)] transition-colors"
            >
              LinkedIn
            </a>
          </Reveal>
        </div>

        <Reveal delay={200} className="hidden lg:flex justify-center">
          <div style={{ background: "var(--surface)", borderColor: "var(--border)" }} className="rounded-2xl border p-8">
            <Ring percent={86} label="retrieval precision" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// About
// ---------------------------------------------------------------------------
function About() {
  return (
    <section id="about" className="relative py-24 md:py-32" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto px-6 md:px-10 grid md:grid-cols-[220px_1fr] gap-10">
        <Reveal><SectionLabel>About</SectionLabel></Reveal>
        <Reveal delay={80}>
          <p style={{ fontFamily: "var(--font-display)", color: "var(--text)" }} className="text-[22px] md:text-[28px] leading-[1.4] max-w-2xl">
            Final-year Information Science and Engineering student at NMIT Bengaluru, looking for
            forward deployed, solutions or applied AI engineering work — the kind where the job is
            getting something working in front of a customer.
          </p>
          <p style={{ fontFamily: "var(--font-body)", color: "var(--muted)" }} className="mt-6 text-[15px] max-w-xl leading-relaxed">
            Outside of shipping code, I train as a hybrid athlete and grew up playing
            competitive cricket — habits that mostly explain why I default to measuring things.
          </p>
          <p style={{ fontFamily: "var(--font-mono)", color: "var(--dim)" }} className="mt-6 text-[12px] tracking-[0.04em]">
            Languages: {SPOKEN_LANGUAGES.join(" · ")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
function ProjectCard({ project, index, onOpen }) {
  return (
    <Reveal delay={index * 60}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => onOpen(project)}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen(project)}
        style={{ background: "var(--surface)", borderColor: "var(--border)", cursor: "pointer" }}
        className="group h-full rounded-2xl border p-6 md:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-24px_rgba(94,234,212,0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(94,234,212,0.35)")}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
      >
        <div>
          <div className="flex items-center justify-between">
            <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }} className="text-[10px] tracking-[0.14em] uppercase">
              {project.tag}
            </span>
            <span style={{ fontFamily: "var(--font-mono)", color: "var(--dim)" }} className="text-[10px] tracking-[0.1em] uppercase">
              {project.kind}
            </span>
          </div>
          <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)" }} className="mt-4 text-[19px] font-medium">
            {project.title}
          </h3>
          <p style={{ fontFamily: "var(--font-body)", color: "var(--muted)" }} className="mt-3 text-[13.5px] leading-relaxed">
            {project.description}
          </p>
        </div>

        <div className="mt-6">
          <div className="flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <span
                key={s}
                style={{ fontFamily: "var(--font-mono)", color: "var(--muted)", borderColor: "var(--border)" }}
                className="text-[10.5px] px-2.5 py-1 rounded-md border"
              >
                {s}
              </span>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span style={{ fontFamily: "var(--font-display)", color: "var(--accent)" }} className="text-[20px] font-semibold">
                {project.metric}
              </span>
              <span style={{ fontFamily: "var(--font-mono)", color: "var(--dim)" }} className="text-[11px] uppercase tracking-[0.06em]">
                {project.metricLabel}
              </span>
            </div>
            <div className="flex items-center gap-4">
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  style={{ fontFamily: "var(--font-mono)", color: "var(--muted)" }}
                  className="text-[11px] hover:text-[var(--accent)] transition-colors"
                >
                  github ↗
                </a>
              )}
              <span
                style={{ fontFamily: "var(--font-mono)", color: "var(--dim)" }}
                className="text-[11px] opacity-0 group-hover:opacity-100 group-hover:text-[var(--accent)] transition-all"
              >
                view →
              </span>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function Projects({ onOpenProject }) {
  return (
    <section id="projects" className="relative py-24 md:py-32" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <Reveal>
          <SectionLabel>Featured work</SectionLabel>
          <h2 style={{ fontFamily: "var(--font-display)", color: "var(--text)" }} className="mt-4 text-[28px] md:text-[36px] font-semibold max-w-2xl">
            Systems built to run past the demo stage.
          </h2>
          <p style={{ fontFamily: "var(--font-body)", color: "var(--dim)" }} className="mt-2 text-[13px]">
            Tap any card for the full case study.
          </p>
        </Reveal>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.title} project={p} index={i} onOpen={onOpenProject} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------
function Skills() {
  return (
    <section id="skills" className="relative py-24 md:py-32" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <Reveal>
          <SectionLabel>Skills</SectionLabel>
          <h2 style={{ fontFamily: "var(--font-display)", color: "var(--text)" }} className="mt-4 text-[28px] md:text-[36px] font-semibold max-w-2xl">
            The stack behind the projects.
          </h2>
        </Reveal>
        <div className="mt-12 grid sm:grid-cols-2 gap-x-10 gap-y-10">
          {SKILLS.map((group, i) => (
            <Reveal key={group.category} delay={i * 60}>
              <h3 style={{ fontFamily: "var(--font-body)", color: "var(--text)" }} className="text-[13px] font-medium mb-4">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    style={{ fontFamily: "var(--font-mono)", color: "var(--muted)", borderColor: "var(--border)" }}
                    className="text-[12px] px-3 py-1.5 rounded-full border hover:text-[var(--accent)] transition-colors"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------
function Experience() {
  return (
    <section id="experience" className="relative py-24 md:py-32" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <Reveal>
          <SectionLabel>Experience</SectionLabel>
          <h2 style={{ fontFamily: "var(--font-display)", color: "var(--text)" }} className="mt-4 text-[28px] md:text-[36px] font-semibold max-w-2xl">
            Work and education.
          </h2>
        </Reveal>

        <div className="mt-12 relative pl-8 md:pl-10">
          <div className="absolute left-[3px] top-2 bottom-2 w-px" style={{ background: "var(--border)" }} />
          <div className="space-y-12">
            {EXPERIENCE.map((exp, i) => (
              <Reveal key={exp.role} delay={i * 80} className="relative">
                <div className="absolute -left-8 md:-left-10 top-1.5 w-[7px] h-[7px] rounded-full" style={{ background: "var(--accent)" }} />
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--dim)" }} className="text-[11px] tracking-[0.1em] uppercase">
                  {exp.period}
                </span>
                <h3 style={{ fontFamily: "var(--font-display)", color: "var(--text)" }} className="mt-2 text-[19px] font-medium">
                  {exp.role}
                </h3>
                <div style={{ fontFamily: "var(--font-body)", color: "var(--accent)" }} className="mt-1 text-[13.5px]">
                  {exp.org}
                </div>
                {exp.description && (
                  <p style={{ fontFamily: "var(--font-body)", color: "var(--muted)" }} className="mt-3 text-[14px] leading-relaxed max-w-2xl">
                    {exp.description}
                  </p>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------
function Contact() {
  return (
    <section id="contact" className="relative py-24 md:py-36" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <Reveal className="text-center max-w-2xl mx-auto block">
          <SectionLabel>Contact</SectionLabel>
          <h2 style={{ fontFamily: "var(--font-display)", color: "var(--text)" }} className="mt-4 text-[30px] md:text-[42px] font-semibold leading-tight">
            Open to forward deployed and applied AI engineering roles.
          </h2>
          <p style={{ fontFamily: "var(--font-body)", color: "var(--muted)" }} className="mt-5 text-[15px]">
            If you need someone to take a system from messy data to a working deployment, let's talk.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href={`mailto:${EMAIL}`}
              style={{ fontFamily: "var(--font-body)", background: "var(--accent)", color: "var(--bg)" }}
              className="text-[14px] font-medium px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity"
            >
              {EMAIL}
            </a>
            <a
              href={RESUME_URL}
              style={{ fontFamily: "var(--font-body)", color: "var(--text)", borderColor: "var(--border)" }}
              className="text-[14px] font-medium px-7 py-3.5 rounded-full border hover:border-[var(--accent)] transition-colors"
            >
              Download résumé
            </a>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6">
            <a href={`tel:${PHONE}`} style={{ fontFamily: "var(--font-mono)", color: "var(--dim)" }} className="text-[12px] hover:text-[var(--accent)] transition-colors">
              {PHONE_DISPLAY}
            </a>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" style={{ fontFamily: "var(--font-mono)", color: "var(--dim)" }} className="text-[12px] hover:text-[var(--accent)] transition-colors">
              github
            </a>
            <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" style={{ fontFamily: "var(--font-mono)", color: "var(--dim)" }} className="text-[12px] hover:text-[var(--accent)] transition-colors">
              linkedin
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-8" style={{ borderTop: "1px solid var(--border)" }}>
      <div className="max-w-6xl mx-auto px-6 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span style={{ fontFamily: "var(--font-mono)", color: "var(--dim)" }} className="text-[11px]">
          © {new Date().getFullYear()} Sai Pratheesh
        </span>
        <span style={{ fontFamily: "var(--font-mono)", color: "var(--dim)" }} className="text-[11px]">
          React · Tailwind · Custom design tokens
        </span>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------
export default function PortfolioSite() {
  useGoogleFonts();
  const [activeProject, setActiveProject] = useState(null);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }} className="antialiased">
      <style>{TOKENS}</style>
      <Nav />
      <main>
        <Hero />
        <About />
        <Projects onOpenProject={setActiveProject} />
        <Skills />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </div>
  );
}
