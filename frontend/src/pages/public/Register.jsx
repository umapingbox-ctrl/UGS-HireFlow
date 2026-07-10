import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import api from "@/lib/api";

export default function Register() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", password: "",
    city: "", state: "", country: "India",
    skills: "", total_experience_years: 0,
    current_salary: "", expected_salary: "", notice_period_days: 30,
    preferred_locations: "",
    education_degree: "", education_institution: "",
    reference_name: "", reference_phone: "",
    emergency_name: "", emergency_phone: "",
  });
  const on = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        full_name: form.full_name, email: form.email, phone: form.phone,
        password: form.password || undefined,
        city: form.city, state: form.state, country: form.country,
        skills: form.skills.split(",").map(s => s.trim()).filter(Boolean),
        total_experience_years: parseFloat(form.total_experience_years) || 0,
        current_salary: parseFloat(form.current_salary) || null,
        expected_salary: parseFloat(form.expected_salary) || null,
        notice_period_days: parseInt(form.notice_period_days) || 30,
        preferred_locations: form.preferred_locations.split(",").map(s => s.trim()).filter(Boolean),
        education: form.education_degree ? [{ degree: form.education_degree, institution: form.education_institution }] : [],
        reference: form.reference_name ? { name: form.reference_name, phone: form.reference_phone } : null,
        emergency_contact: form.emergency_name ? { name: form.emergency_name, phone: form.emergency_phone } : null,
      };
      await api.post("/public/register-candidate", payload);
      toast.success("Registration successful! Login with your credentials.");
      nav("/login");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="overline text-primary">Candidate Registration</div>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tighter">Join UGS HireFlow</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-300">Create your profile. Our team will verify and match you with opportunities.</p>

      <Card className="mt-8 p-8 soft-shadow border-border">
        <form onSubmit={submit} className="grid md:grid-cols-2 gap-5">
          <Field label="Full Name" required><Input value={form.full_name} onChange={on("full_name")} required data-testid="reg-name" /></Field>
          <Field label="Email" required><Input type="email" value={form.email} onChange={on("email")} required data-testid="reg-email" /></Field>
          <Field label="Phone" required><Input value={form.phone} onChange={on("phone")} required data-testid="reg-phone" /></Field>
          <Field label="Password (for candidate login)"><Input type="password" value={form.password} onChange={on("password")} data-testid="reg-password" /></Field>

          <Field label="City"><Input value={form.city} onChange={on("city")} data-testid="reg-city" /></Field>
          <Field label="State"><Input value={form.state} onChange={on("state")} /></Field>

          <Field label="Skills (comma separated)" full><Input value={form.skills} onChange={on("skills")} placeholder="React, Python, AWS" data-testid="reg-skills" /></Field>

          <Field label="Total Experience (years)"><Input type="number" value={form.total_experience_years} onChange={on("total_experience_years")} /></Field>
          <Field label="Notice Period (days)"><Input type="number" value={form.notice_period_days} onChange={on("notice_period_days")} /></Field>
          <Field label="Current Salary (₹)"><Input type="number" value={form.current_salary} onChange={on("current_salary")} /></Field>
          <Field label="Expected Salary (₹)"><Input type="number" value={form.expected_salary} onChange={on("expected_salary")} /></Field>

          <Field label="Preferred Locations (comma separated)" full><Input value={form.preferred_locations} onChange={on("preferred_locations")} placeholder="Bangalore, Remote" /></Field>

          <Field label="Highest Degree"><Input value={form.education_degree} onChange={on("education_degree")} /></Field>
          <Field label="Institution"><Input value={form.education_institution} onChange={on("education_institution")} /></Field>

          <Field label="Reference Name"><Input value={form.reference_name} onChange={on("reference_name")} /></Field>
          <Field label="Reference Phone"><Input value={form.reference_phone} onChange={on("reference_phone")} /></Field>

          <Field label="Emergency Contact Name"><Input value={form.emergency_name} onChange={on("emergency_name")} /></Field>
          <Field label="Emergency Contact Phone"><Input value={form.emergency_phone} onChange={on("emergency_phone")} /></Field>

          <div className="md:col-span-2 flex items-center justify-between pt-4 border-t border-border">
            <span className="text-sm text-muted-foreground">Already registered? <Link to="/login" className="text-primary hover:underline">Sign in</Link></span>
            <Button type="submit" disabled={loading} className="rounded-full px-6" data-testid="reg-submit">
              {loading ? "Submitting..." : "Register"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function Field({ label, children, required, full }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <Label className="text-xs mb-1.5 block">{label}{required && <span className="text-red-500 ml-1">*</span>}</Label>
      {children}
    </div>
  );
}
