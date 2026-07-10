import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function Contact() {
  const submit = (e) => { e.preventDefault(); toast.success("Message received. We'll be in touch shortly."); e.target.reset(); };
  return (
    <div className="mx-auto max-w-6xl px-6 py-20 grid md:grid-cols-2 gap-12">
      <div>
        <div className="overline text-primary">Get in touch</div>
        <h1 className="mt-3 font-display text-5xl font-bold tracking-tighter">Let's talk hiring.</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300">Reach us via email or phone, or drop a message on the right.</p>
        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-3"><Mail className="h-5 w-5 text-primary" /> hello@ugs-itsolutions.com</div>
          <div className="flex items-center gap-3"><Phone className="h-5 w-5 text-primary" /> +91 90000 00000</div>
          <div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-primary" /> Hyderabad, India</div>
        </div>
      </div>
      <form onSubmit={submit} className="rounded-2xl border border-border p-8 bg-white dark:bg-slate-900/40 soft-shadow space-y-4">
        <div><Label>Name</Label><Input required data-testid="contact-name" /></div>
        <div><Label>Email</Label><Input type="email" required data-testid="contact-email" /></div>
        <div><Label>Message</Label><Textarea rows={5} required data-testid="contact-message" /></div>
        <Button className="w-full" data-testid="contact-submit">Send Message</Button>
      </form>
    </div>
  );
}
