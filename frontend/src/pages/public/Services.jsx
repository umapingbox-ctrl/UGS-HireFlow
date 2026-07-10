import React from "react";
import { CheckCircle2 } from "lucide-react";

const services = [
  { title: "IT Consultancy", desc: "Recruitment for tech, product, engineering roles across India." },
  { title: "Non-IT Placement", desc: "Sales, operations, finance, HR — end-to-end lifecycle." },
  { title: "Training Batches", desc: "Full-stack, DevOps, cloud batches. Hire-ready in 8 weeks." },
  { title: "Corporate Hiring", desc: "Volume hiring campaigns with dedicated recruiter pods." },
];

export default function Services() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <div className="overline text-primary">Our Services</div>
      <h1 className="mt-3 font-display text-5xl font-bold tracking-tighter">Recruitment done right.</h1>
      <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-2xl">From candidate sourcing to placement, our platform powers every stage.</p>
      <div className="mt-12 grid md:grid-cols-2 gap-6">
        {services.map(s => (
          <div key={s.title} className="rounded-2xl border border-border p-8 bg-white dark:bg-slate-900/40 soft-shadow hover:-translate-y-1 transition-transform">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" strokeWidth={1.5} />
            <h3 className="mt-4 font-display text-2xl font-semibold">{s.title}</h3>
            <p className="mt-2 text-slate-600 dark:text-slate-300">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
