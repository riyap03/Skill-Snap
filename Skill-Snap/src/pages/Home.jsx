import { Link } from "react-router-dom";
import {
  ArrowRight, Brain, BarChart3, Lightbulb, FileCode2, Trophy, LayoutDashboard,
  Github, Linkedin, Mail, Sparkles, TrendingUp, Star, Quote, Rocket
} from "lucide-react";

import dashboardHero from "../assets/dashboard-hero.png";

const features = [
  { icon: Brain, title: "AI-Powered Roadmaps", desc: "Personalized learning paths generated from your current skills and career trajectory." },
  { icon: BarChart3, title: "Skill Analytics", desc: "Futuristic charts that track growth, streaks, and completed technical milestones." },
  { icon: Lightbulb, title: "Project Recommendations", desc: "Hand-picked project ideas matched to your level and desired tech stack." },
  { icon: FileCode2, title: "Portfolio Builder", desc: "Compose a recruiter-ready portfolio with AI-generated bio and case studies." },
  { icon: Trophy, title: "Progress Tracking", desc: "Tick off technologies, hit milestones, and quantify your small wins daily." },
  { icon: LayoutDashboard, title: "Mission Control", desc: "One premium command center for everything you're learning and shipping." },
];

const stats = [
  { value: "12k+", label: "Roadmaps Generated" },
  { value: "84k", label: "Skills Tracked" },
  { value: "6.2k", label: "Portfolios Created" },
  { value: "320k", label: "AI Insights Given" },
];

const testimonials = [
  { name: "Aanya K.", role: "CS Student, IIT Bombay", body: "SkillSnap turned my scattered learning into a clear roadmap. I shipped my first full-stack project in 6 weeks." },
  { name: "Marcus L.", role: "Junior Frontend Dev", body: "The portfolio generator is unreal. Recruiters started replying the same week I shared my SkillSnap link." },
  { name: "Priya S.", role: "Bootcamp Grad", body: "It's the only tool that made me feel like someone was actually mentoring me through the chaos." },
];

function FloatingCard({ className = "", children }) {
  return (
    <div className={`absolute glass-panel rounded-xl p-3 text-xs shadow-2xl animate-float border-border ${className}`}>
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen relative selection:bg-brand-blue selection:text-white">
      <div className="fixed inset-0 grid-bg pointer-events-none z-0"></div>
      <div className="relative z-10">

      <section className="relative overflow-hidden pt-24 pb-32">
        {/* Glow orb behind text */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-blue/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6 grid lg:grid-cols-[1.05fr_1fr] gap-12 items-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 backdrop-blur-md px-3 py-1.5 text-xs text-brand-cyan mb-8 uppercase tracking-widest font-semibold shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <Sparkles className="h-3.5 w-3.5" />
              Your AI Career Coach
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white">
              Build skills <span className="text-gradient">intelligently.</span><br />
              <span className="text-white">Track growth with AI.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              The AI-powered career operating system for ambitious developers. Generate personalized roadmaps, track skill analytics, and build an investor-demo ready portfolio.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/dashboard" className="btn-primary-glow inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm font-semibold tracking-wide">
                Start Mission <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#features" className="inline-flex items-center px-8 py-4 rounded-md border border-border bg-surface/60 hover:bg-surface-elevated transition-colors text-sm font-medium">
                Explore Platform
              </a>
            </div>
            <div className="mt-12 flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><Rocket className="h-4 w-4 text-brand-blue" /> Intelligent progression</div>
              <div className="flex items-center gap-1.5"><Brain className="h-4 w-4 text-brand-purple" /> AI-driven insights</div>
            </div>
          </div>

          <div className="relative animate-fade-in-up animate-delay-200">
            <div className="relative rounded-2xl border border-border bg-surface p-2 shadow-[0_0_50px_rgba(59,130,246,0.15)]">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/10 to-transparent opacity-50 rounded-2xl" />
              <img src={dashboardHero} alt="SkillSnap Mission Control" className="relative z-10 w-full rounded-xl opacity-90 border border-border" />

              <FloatingCard className="z-20 -left-6 top-12 hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-gradient-brand grid place-items-center"><TrendingUp className="h-4 w-4 text-white" /></div>
                  <div>
                    <div className="font-semibold text-foreground">React Architecture</div>
                    <div className="text-brand-cyan mt-0.5 font-medium">+15% Readiness</div>
                  </div>
                </div>
              </FloatingCard>

              <FloatingCard className="z-20 -right-4 top-1/3 hidden sm:block">
                <div className="font-semibold mb-1.5 flex items-center gap-1.5 text-brand-purple"><Sparkles className="h-3.5 w-3.5" /> Core Insight</div>
                <div className="text-muted-foreground max-w-[180px] leading-relaxed">Optimize your database queries to unlock Senior tier.</div>
              </FloatingCard>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative mx-auto max-w-7xl px-6 py-32">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.2em] text-brand-cyan mb-4 font-semibold">Capabilities</div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">The ultimate developer operating system.</h2>
          <p className="mt-5 text-muted-foreground text-lg">A suite of intelligent tools designed to replace your messy spreadsheets and generic tutorials.</p>
        </div>
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="card-glow rounded-xl p-8 group">
              <div className="h-12 w-12 rounded-lg bg-surface-elevated border border-border grid place-items-center mb-6 group-hover:border-brand-blue/50 transition-colors">
                <f.icon className="h-5 w-5 text-brand-cyan group-hover:text-brand-blue transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">{f.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="card-glow rounded-2xl p-10 sm:p-14 relative overflow-hidden border border-border">
          <div className="absolute inset-0 bg-gradient-brand opacity-5" />
          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="border-l border-border pl-6">
                <div className="text-3xl font-bold text-foreground mb-1">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-6 py-32">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Backed by ambition.</h2>
          <p className="mt-4 text-muted-foreground">See how ambitious developers are accelerating their careers.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="card-glow rounded-xl p-8 flex flex-col justify-between">
              <div>
                <Quote className="h-6 w-6 text-brand-purple/40 mb-4" />
                <p className="text-sm text-foreground/90 leading-relaxed italic">"{t.body}"</p>
              </div>
              <div className="mt-8 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-surface-elevated grid place-items-center font-bold text-brand-blue">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border bg-surface mt-20">
        <div className="mx-auto max-w-7xl px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-brand grid place-items-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">SkillSnap</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Github className="h-5 w-5" /></a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Linkedin className="h-5 w-5" /></a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Mail className="h-5 w-5" /></a>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
