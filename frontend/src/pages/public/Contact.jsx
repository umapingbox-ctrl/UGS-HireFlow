import React from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AmbientBackground } from "@/components/animated/AmbientBackground";
import { Reveal } from "@/components/animated/Reveal";

export default function Contact() {
  const submit = (e) => { e.preventDefault(); toast.success("Message received. We'll be in touch shortly."); e.target.reset(); };
  return (
    <div className="relative">
      <AmbientBackground />
      <div className="mx-auto max-w-6xl px-6 py-20 grid md:grid-cols-2 gap-12">
        <Reveal>
          <div className="overline text-primary">Get in touch</div>
          <h1 className="mt-3 font-display text-5xl lg:text-6xl font-bold tracking-tighter">Let's talk hiring.</h1>
          <p className="mt-4 text-slate-600 dark:text-slate-300">Reach us via email or phone, or drop a message on the right.</p>
          <div className="mt-8 space-y-4">
            {[
              { i: Mail, t: "hello@ugs-itsolutions.com" },
              { i: Phone, t: "+91 90000 00000" },
              { i: MapPin, t: "Hyderabad, India" },
            ].map((c, k) => (
              <motion.div key={k} whileHover={{ x: 4 }}
                className="flex items-center gap-3 rounded-xl border border-border p-4 bg-white/60 dark:bg-slate-900/40 backdrop-blur">
                <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center"><c.i className="h-4 w-4" /></div>
                <span className="text-sm font-medium">{c.t}</span>
              </motion.div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <form onSubmit={submit} className="rounded-3xl border border-border p-8 bg-white/80 dark:bg-slate-900/60 backdrop-blur soft-shadow-lg space-y-4">
            <div><Label>Name</Label><Input required data-testid="contact-name" /></div>
            <div><Label>Email</Label><Input type="email" required data-testid="contact-email" /></div>
            <div><Label>Message</Label><Textarea rows={5} required data-testid="contact-message" /></div>
            <Button className="w-full h-11 rounded-full" data-testid="contact-submit">
              Send Message <Send className="h-4 w-4 ml-2" />
            </Button>
          </form>
        </Reveal>
      </div>
    </div>
  );
}
