import { Link } from "react-router-dom";
import {
  ArrowRight, Brain, BarChart3, Lightbulb, FileCode2, Trophy, LayoutDashboard,
  Github, Linkedin, Mail, Sparkles, TrendingUp, Star, Quote,
} from "lucide-react";

import dashboardHero from "../assets/dashboard-hero.png";

const features = [
  { icon: Brain, title: "AI-Powered Roadmaps", desc: "Personalized learning paths generated from your current skills and goals." },
  { icon: BarChart3, title: "Skill Analytics", desc: "Beautiful charts that track growth, streaks, and completed milestones." },
  { icon: Lightbulb, title: "Project Recommendations", desc: "Hand-picked project ideas matched to your level and stack." },
  { icon: FileCode2, title: "Portfolio Builder", desc: "Compose a recruiter-ready portfolio with AI-generated bio and case studies." },
  { icon: Trophy, title: "Progress Tracking", desc: "Tick off technologies, hit milestones, and celebrate small wins daily." },
  { icon: LayoutDashboard, title: "Developer Dashboard", desc: "One calm command center for everything you're learning and shipping." },
];

const stats = [
  { value: "12k+", label: "Roadmaps Generated" },
  { value: "84k", label: "Skills Tracked" },
  { value: "6.2k", label: "Portfolios Created" },
  { value: "320k", label: "AI Suggestions Given" },
];

const testimonials = [
  { name: "Aanya K.", role: "CS Student, IIT Bombay", body: "SkillSnap turned my scattered learning into a clear roadmap. I shipped my first full-stack project in 6 weeks." },
  { name: "Marcus L.", role: "Junior Frontend Dev", body: "The portfolio generator is unreal. Recruiters started replying the same week I shared my SkillSnap link." },
  { name: "Priya S.", role: "Bootcamp Grad", body: "It's the only tool that made me feel like someone was actually mentoring me through the chaos." },
];

function FloatingCard({ className = "", children }) {
  return (
    <div className={`absolute glass-panel rounded-xl p-3 text-xs shadow-2xl animate-float ${className}`}>
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen">

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="absolute inset-x-0 -top-40 h-[600px] pointer-events-none" style={{ background: "var(--gradient-glow)" }} />
        <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-28 grid lg:grid-cols-[1.05fr_1fr] gap-12 items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted-foreground mb-6">
              <Sparkles className="h-3.5 w-3.5 text-brand-pink" />
              Now with AI-generated portfolios
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
              Build your skills.<br />
              <span className="text-gradient">Shape your future.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              SkillSnap is the AI-powered companion for developers and students — track growth, follow personalized roadmaps, and turn your work into a portfolio that gets noticed.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/dashboard" className="inline-flex items-center gap-1 px-6 py-3 rounded-md bg-gradient-brand text-primary-foreground shadow-[0_0_32px_-6px_var(--brand-purple)] hover:opacity-90 text-sm font-medium">
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#features" className="inline-flex items-center px-6 py-3 rounded-md border border-border bg-surface/60 hover:bg-surface-elevated text-sm font-medium">
                Explore Features
              </a>
            </div>
            <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 fill-brand-pink text-brand-pink" /> 4.9 from early users</div>
              <div>Free to start · No card needed</div>
            </div>
          </div>

          <div className="relative animate-fade-up [animation-delay:120ms]">
            <div className="relative">
              <img src={dashboardHero} alt="SkillSnap dashboard preview" className="relative z-10 w-full drop-shadow-[0_30px_60px_oklch(0.10_0.02_280/0.6)]" />
              <FloatingCard className="z-20 -left-2 top-10 hidden sm:block">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-md bg-gradient-brand grid place-items-center"><TrendingUp className="h-3.5 w-3.5 text-primary-foreground" /></div>
                  <div>
                    <div className="font-semibold">React Mastery</div>
                    <div className="text-muted-foreground">+12% this week</div>
                  </div>
                </div>
              </FloatingCard>
              <FloatingCard className="z-20 right-0 top-1/3 hidden sm:block [animation-delay:1.5s]">
                <div className="font-semibold mb-1 flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-brand-pink" /> AI suggestion</div>
                <div className="text-muted-foreground max-w-[180px]">Try building a real-time chat to lock in WebSocket fundamentals.</div>
              </FloatingCard>
              <FloatingCard className="z-20 left-6 -bottom-2 hidden sm:block [animation-delay:3s]">
                <div className="text-muted-foreground mb-1">Portfolio Score</div>
                <div className="text-2xl font-display font-bold text-gradient">87 / 100</div>
              </FloatingCard>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.2em] text-brand-pink mb-3">Features</div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Everything you need to grow as a developer.</h2>
          <p className="mt-4 text-muted-foreground">Six tightly-integrated tools that replace a dozen tabs — designed to feel calm, focused, and a little bit magical.</p>
        </div>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="card-glow rounded-2xl p-6 group">
              <div className="h-11 w-11 rounded-xl bg-gradient-brand grid place-items-center shadow-[0_0_24px_-6px_var(--brand-purple)] group-hover:scale-105 transition-transform">
                <f.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="card-glow rounded-3xl p-10 sm:p-14 relative overflow-hidden">
          <div className="absolute -top-32 -right-20 h-80 w-80 rounded-full opacity-30" style={{ background: "var(--gradient-brand)", filter: "blur(80px)" }} />
          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-4xl sm:text-5xl font-display font-bold text-gradient">{s.value}</div>
                <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.2em] text-brand-pink mb-3">Loved by builders</div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">From first commit to first job offer.</h2>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <figure key={t.name} className="card-glow rounded-2xl p-6">
              <Quote className="h-5 w-5 text-brand-purple" />
              <blockquote className="mt-4 text-sm leading-relaxed">"{t.body}"</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gradient-brand grid place-items-center text-xs font-semibold text-primary-foreground">
                  {t.name.split(" ").map((s) => s[0]).join("")}
                </div>
                <div>
                  <div className="text-sm font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-5xl px-6 pb-24">
        <div className="card-glow rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ background: "var(--gradient-glow)" }} />
          <div className="relative">
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Your developer journey, <span className="text-gradient">visualized.</span>
            </h3>
            <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
              Join thousands of students and developers using SkillSnap to learn smarter and ship more.
            </p>
            <Link to="/dashboard" className="inline-flex items-center gap-1 mt-6 px-6 py-3 rounded-md bg-gradient-brand text-primary-foreground shadow-[0_0_32px_-6px_var(--brand-purple)] text-sm font-medium">
              Start free <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border mt-10">
        <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col md:flex-row gap-6 items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>© {new Date().getFullYear()} SkillSnap</span>
            <span className="opacity-50">·</span>
            <span>Built with React + Node.js</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#" aria-label="GitHub" className="hover:text-foreground"><Github className="h-4 w-4" /></a>
            <a href="#" aria-label="LinkedIn" className="hover:text-foreground"><Linkedin className="h-4 w-4" /></a>
            <a href="#" aria-label="Contact" className="hover:text-foreground"><Mail className="h-4 w-4" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
