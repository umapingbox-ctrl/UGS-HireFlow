import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, LineChart, Users2, Building2, Shield, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 -left-40 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute top-40 right-0 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-6 pt-20 pb-24 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary border border-primary/20" data-testid="hero-badge">
              <Sparkles className="h-3.5 w-3.5" /> Recruitment OS · Version 1.0
            </div>
            <h1 className="mt-6 font-display text-5xl lg:text-6xl font-bold tracking-tighter leading-[1.02]">
              Replace <span className="line-through text-slate-400">Excel</span>.
              <br />Run your consultancy on <span className="text-primary">HireFlow</span>.
            </h1>
            <p className="mt-5 text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
              The enterprise recruitment operating system built for consultancies who
              have outgrown spreadsheets. Track every candidate from registration to placement — in one workspace.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register"><Button size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-6" data-testid="hero-register-btn">Register as Candidate <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
              <Link to="/login"><Button size="lg" variant="outline" className="rounded-full h-12 px-6" data-testid="hero-login-btn">Sign in to Console</Button></Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-600 dark:text-slate-400">
              {["15 years of recruitment expertise", "End-to-end lifecycle tracking", "Bank-grade access control"].map(x => (
                <div key={x} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" />{x}</div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="glass rounded-3xl p-2 soft-shadow-lg">
                <img src="https://images.pexels.com/photos/8134173/pexels-photo-8134173.jpeg" alt="team" className="w-full h-[420px] object-cover rounded-2xl" />
              </div>
              <div className="absolute -bottom-6 -left-6 glass rounded-2xl p-4 soft-shadow-lg w-56 hidden md:block">
                <div className="overline text-muted-foreground text-[10px]">Placed this month</div>
                <div className="font-display text-3xl font-bold mt-1">128</div>
                <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600 font-medium">
                  <LineChart className="h-3.5 w-3.5" /> +18.4% vs last month
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl">
          <div className="overline text-primary">Everything, connected</div>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight">One workspace. Every stage of hiring.</h2>
        </div>
        <div className="mt-12 grid md:grid-cols-6 gap-5">
          <div className="md:col-span-4 rounded-2xl bg-white dark:bg-slate-900/40 border border-border p-8 soft-shadow">
            <Users2 className="h-8 w-8 text-primary" strokeWidth={1.5} />
            <h3 className="mt-4 font-display text-2xl font-semibold">Candidate Workspace</h3>
            <p className="mt-2 text-slate-600 dark:text-slate-300 leading-relaxed">The heart of HireFlow. Personal info, documents, payments, interview timeline, partner — everything on one page.</p>
          </div>
          <div className="md:col-span-2 rounded-2xl bg-primary text-primary-foreground p-8 soft-shadow">
            <Zap className="h-8 w-8" strokeWidth={1.5} />
            <h3 className="mt-4 font-display text-2xl font-semibold">3-click ops</h3>
            <p className="mt-2 text-primary-foreground/80 leading-relaxed">Verify, assign, schedule — all within three clicks from anywhere.</p>
          </div>
          <div className="md:col-span-2 rounded-2xl bg-white dark:bg-slate-900/40 border border-border p-8 soft-shadow">
            <Building2 className="h-8 w-8 text-primary" strokeWidth={1.5} />
            <h3 className="mt-4 font-display text-xl font-semibold">Companies & Jobs</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Manage clients, HR contacts, active vacancies, hiring status.</p>
          </div>
          <div className="md:col-span-2 rounded-2xl bg-white dark:bg-slate-900/40 border border-border p-8 soft-shadow">
            <LineChart className="h-8 w-8 text-primary" strokeWidth={1.5} />
            <h3 className="mt-4 font-display text-xl font-semibold">Pipeline</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Kanban of interview stages. Move candidates. Track dropouts.</p>
          </div>
          <div className="md:col-span-2 rounded-2xl bg-slate-950 text-slate-50 p-8 soft-shadow">
            <Shield className="h-8 w-8 text-emerald-400" strokeWidth={1.5} />
            <h3 className="mt-4 font-display text-xl font-semibold">RBAC & Audit</h3>
            <p className="mt-2 text-sm text-slate-300">Admin, Recruiter and Candidate roles. Every action logged.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="rounded-3xl bg-gradient-to-br from-primary to-blue-700 text-white p-12 md:p-16 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_20%_20%,white,transparent_40%)]" />
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tighter leading-tight">Ready to shut down Excel for good?</h2>
              <p className="mt-3 text-white/85 max-w-lg">Sign in to your admin console or register as a candidate to begin.</p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link to="/register"><Button size="lg" variant="secondary" className="rounded-full h-12 px-6" data-testid="cta-register">Register now</Button></Link>
              <Link to="/contact"><Button size="lg" className="rounded-full h-12 px-6 bg-white/10 hover:bg-white/20 text-white border border-white/20" data-testid="cta-contact">Talk to us</Button></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
