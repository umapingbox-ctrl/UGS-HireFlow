import React from "react";
export default function About() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <div className="overline text-primary">About UGS IT Solutions</div>
      <h1 className="mt-3 font-display text-5xl font-bold tracking-tighter">15 years. One mission. Zero spreadsheets.</h1>
      <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
        UGS IT Solutions has been building software for consultancies since 2010. After watching one recruiting firm run 15 years of business on Excel, we built HireFlow — a modern recruitment OS designed to replace spreadsheets from day one.
      </p>
      <img src="https://images.pexels.com/photos/1313534/pexels-photo-1313534.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" alt="office" className="mt-10 rounded-2xl w-full h-96 object-cover soft-shadow" />
      <div className="mt-10 grid md:grid-cols-3 gap-6">
        {[
          { k: "500+", v: "Placements Automated" },
          { k: "40+", v: "Consultancies Served" },
          { k: "15 yrs", v: "Domain Expertise" },
        ].map(x => (
          <div key={x.k} className="rounded-2xl border border-border p-6 bg-white dark:bg-slate-900/40">
            <div className="font-display text-4xl font-bold text-primary">{x.k}</div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">{x.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
