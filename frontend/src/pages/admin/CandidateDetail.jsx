import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ArrowLeft, CheckCircle2, User, Briefcase, GraduationCap,
  FileText, IndianRupee, Handshake, Clock, Plus, Upload
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { StatusPill, StatusDot } from "@/components/StatusDot";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

const STAGES = ["verified", "assigned", "profile_reviewed", "company_assigned",
  "interview_scheduled", "round_1", "round_2", "technical", "hr",
  "selected", "offer_released", "joined", "placed", "rejected", "waiting"];

export default function CandidateDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: c, isLoading } = useQuery({
    queryKey: ["candidate", id],
    queryFn: async () => (await api.get(`/candidates/${id}`)).data,
  });
  const { data: employees = [] } = useQuery({
    queryKey: ["employees"], queryFn: async () => (await api.get("/employees")).data,
    enabled: user?.role === "admin",
  });
  const { data: companies = [] } = useQuery({
    queryKey: ["companies-basic"], queryFn: async () => (await api.get("/companies")).data,
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["candidate", id] });

  if (isLoading || !c) return <div className="text-muted-foreground">Loading...</div>;

  const verify = async () => {
    try { await api.post(`/candidates/${id}/verify`); toast.success("Candidate verified"); refresh(); }
    catch { toast.error("Failed"); }
  };
  const assignEmp = async (empId) => {
    try {
      const fd = new FormData(); fd.append("employee_id", empId);
      await api.post(`/candidates/${id}/assign`, fd);
      toast.success("Assigned"); refresh();
    } catch { toast.error("Failed"); }
  };

  return (
    <div className="space-y-6" data-testid="candidate-detail-page">
      <Link to="/app/candidates" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to candidates
      </Link>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* LEFT: Profile summary */}
        <Card className="lg:col-span-4 p-6 border-border h-fit sticky top-24">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-blue-700 text-white grid place-items-center font-display text-2xl font-bold">
              {c.full_name?.[0]}
            </div>
            <div className="min-w-0">
              <div className="font-display font-bold text-xl truncate">{c.full_name}</div>
              <div className="text-xs text-muted-foreground">{c.candidate_code}</div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <StatusPill status={c.status} />
            <StatusPill status={c.payment_status} />
          </div>
          <div className="mt-6 space-y-2.5 text-sm">
            <Row label="Email" value={c.email} />
            <Row label="Phone" value={c.phone} />
            <Row label="Location" value={[c.city, c.state].filter(Boolean).join(", ") || "—"} />
            <Row label="Experience" value={`${c.total_experience_years || 0} years`} />
            <Row label="Expected CTC" value={c.expected_salary ? `₹${c.expected_salary.toLocaleString("en-IN")}` : "—"} />
            <Row label="Notice" value={c.notice_period_days ? `${c.notice_period_days} days` : "—"} />
          </div>

          {user?.role === "admin" && (
            <div className="mt-6 pt-6 border-t border-border space-y-3">
              {c.status === "pending_verification" && (
                <Button className="w-full" onClick={verify} data-testid="verify-btn"><CheckCircle2 className="h-4 w-4 mr-2" /> Verify Candidate</Button>
              )}
              <div>
                <Label className="text-xs mb-1.5 block">Assign Recruiter</Label>
                <Select value={c.assigned_employee_id || ""} onValueChange={assignEmp}>
                  <SelectTrigger data-testid="assign-employee-select"><SelectValue placeholder="Select recruiter" /></SelectTrigger>
                  <SelectContent>
                    {employees.map(e => <SelectItem key={e.id} value={e.id}>{e.full_name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </Card>

        {/* RIGHT: Tabs */}
        <div className="lg:col-span-8">
          <Tabs defaultValue="overview">
            <TabsList className="h-auto flex-wrap">
              <TabsTrigger value="overview" data-testid="tab-overview"><User className="h-4 w-4 mr-1.5" />Overview</TabsTrigger>
              <TabsTrigger value="pipeline" data-testid="tab-pipeline"><Briefcase className="h-4 w-4 mr-1.5" />Pipeline</TabsTrigger>
              <TabsTrigger value="documents" data-testid="tab-documents"><FileText className="h-4 w-4 mr-1.5" />Documents</TabsTrigger>
              <TabsTrigger value="payments" data-testid="tab-payments"><IndianRupee className="h-4 w-4 mr-1.5" />Payments</TabsTrigger>
              <TabsTrigger value="partner" data-testid="tab-partner"><Handshake className="h-4 w-4 mr-1.5" />Partner</TabsTrigger>
              <TabsTrigger value="activity" data-testid="tab-activity"><Clock className="h-4 w-4 mr-1.5" />Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              <Section title="Education" icon={GraduationCap}>
                {(c.education || []).length === 0 ? <Empty text="No education added" /> :
                  c.education.map((e, i) => <div key={i} className="text-sm mb-2"><div className="font-medium">{e.degree}</div><div className="text-muted-foreground">{e.institution} · {e.year || "—"} · {e.percentage || "—"}</div></div>)}
              </Section>
              <Section title="Experience" icon={Briefcase}>
                {(c.experience || []).length === 0 ? <Empty text="No experience added" /> :
                  c.experience.map((e, i) => <div key={i} className="text-sm mb-2"><div className="font-medium">{e.role} @ {e.company}</div><div className="text-muted-foreground">{e.duration || "—"}</div></div>)}
              </Section>
              <Section title="Skills">
                <div className="flex flex-wrap gap-1.5">
                  {(c.skills || []).map(s => <span key={s} className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs">{s}</span>)}
                  {(c.skills || []).length === 0 && <Empty text="No skills added" />}
                </div>
              </Section>
            </TabsContent>

            <TabsContent value="pipeline" className="mt-6">
              <PipelineTab candidate={c} companies={companies} onUpdate={refresh} />
            </TabsContent>

            <TabsContent value="documents" className="mt-6">
              <DocumentsTab candidate={c} onUpdate={refresh} />
            </TabsContent>

            <TabsContent value="payments" className="mt-6">
              <PaymentsTab candidate={c} onUpdate={refresh} />
            </TabsContent>

            <TabsContent value="partner" className="mt-6">
              <PartnerTab candidate={c} onUpdate={refresh} />
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <ActivityTab candidateId={id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

const Row = ({ label, value }) => (
  <div className="flex justify-between gap-3">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-sm font-medium text-right truncate">{value}</span>
  </div>
);
const Section = ({ title, icon: Icon, children }) => (
  <Card className="p-5 border-border">
    <div className="flex items-center gap-2 mb-3">
      {Icon && <Icon className="h-4 w-4 text-primary" />}
      <div className="font-display font-semibold">{title}</div>
    </div>
    {children}
  </Card>
);
const Empty = ({ text }) => <div className="text-sm text-muted-foreground italic">{text}</div>;

function PipelineTab({ candidate, companies, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState("interview_scheduled");
  const [companyId, setCompanyId] = useState("");
  const [remarks, setRemarks] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");

  const submit = async () => {
    try {
      await api.post(`/candidates/${candidate.id}/interview-events`, {
        stage, company_id: companyId || null, remarks,
        scheduled_at: scheduledAt || null, status: "scheduled",
      });
      toast.success("Stage updated"); setOpen(false); onUpdate();
    } catch { toast.error("Failed"); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="font-display font-semibold">Interview Timeline</div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm" data-testid="add-stage-btn"><Plus className="h-4 w-4 mr-1" /> Add Stage</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Interview Stage</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Stage</Label>
                <Select value={stage} onValueChange={setStage}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{STAGES.map(s => <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Company</Label>
                <Select value={companyId || "none"} onValueChange={(v) => setCompanyId(v === "none" ? "" : v)}>
                  <SelectTrigger><SelectValue placeholder="Optional" /></SelectTrigger>
                  <SelectContent><SelectItem value="none">None</SelectItem>{companies.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Scheduled at</Label><Input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} /></div>
              <div><Label>Remarks</Label><Textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={3} /></div>
            </div>
            <DialogFooter><Button onClick={submit} data-testid="add-stage-submit">Save</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative pl-6 border-l-2 border-border/60 space-y-5">
        {(candidate.interview_timeline || []).length === 0 && <Empty text="No events yet" />}
        {(candidate.interview_timeline || []).map(e => (
          <div key={e.id} className="relative">
            <div className="absolute -left-[27px] top-1"><StatusDot status={e.stage} /></div>
            <div className="rounded-xl border border-border p-4 bg-white dark:bg-slate-900/40">
              <div className="flex items-center justify-between">
                <StatusPill status={e.stage} />
                <span className="text-xs text-muted-foreground">{new Date(e.created_at).toLocaleString()}</span>
              </div>
              {e.remarks && <div className="mt-2 text-sm">{e.remarks}</div>}
              <div className="mt-2 text-xs text-muted-foreground">By {e.updated_by_name || "System"}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentsTab({ candidate, onUpdate }) {
  const [label, setLabel] = useState("resume");
  const upload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const fd = new FormData();
    fd.append("file", file); fd.append("label", label); fd.append("candidate_id", candidate.id);
    try { await api.post("/files/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success("Uploaded"); onUpdate();
    } catch { toast.error("Upload failed"); }
    e.target.value = "";
  };
  return (
    <div className="space-y-4">
      <Card className="p-5 border-border">
        <div className="font-display font-semibold mb-3">Upload Document</div>
        <div className="flex gap-3">
          <Select value={label} onValueChange={setLabel}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="resume">Resume</SelectItem>
              <SelectItem value="photo">Photo</SelectItem>
              <SelectItem value="id_proof">ID Proof</SelectItem>
              <SelectItem value="certificate">Certificate</SelectItem>
              <SelectItem value="offer_letter">Offer Letter</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <label className="cursor-pointer">
            <input type="file" onChange={upload} className="hidden" data-testid="doc-upload-input" />
            <Button asChild><span><Upload className="h-4 w-4 mr-1" /> Upload</span></Button>
          </label>
        </div>
      </Card>
      <Card className="p-5 border-border">
        <div className="font-display font-semibold mb-3">Files</div>
        <div className="space-y-2 text-sm">
          {candidate.resume_file_id && <FileRow label="Resume" fileId={candidate.resume_file_id} />}
          {candidate.photo_file_id && <FileRow label="Photo" fileId={candidate.photo_file_id} />}
          {(candidate.documents || []).map(d => <FileRow key={d.id} label={d.label} fileId={d.file_id} />)}
          {!candidate.resume_file_id && !candidate.photo_file_id && (candidate.documents || []).length === 0 && <Empty text="No documents uploaded" />}
        </div>
      </Card>
    </div>
  );
}

function FileRow({ label, fileId }) {
  const token = localStorage.getItem("ugs_token");
  const url = `${process.env.REACT_APP_BACKEND_URL}/api/files/${fileId}/download?auth=${token}`;
  return (
    <a href={url} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60">
      <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-primary" /><span className="capitalize">{label}</span></div>
      <span className="text-xs text-primary hover:underline">View</span>
    </a>
  );
}

function PaymentsTab({ candidate, onUpdate }) {
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("upi");
  const [remarks, setRemarks] = useState("");
  const submit = async () => {
    if (!amount) return;
    try {
      await api.post(`/candidates/${candidate.id}/payments`,
        { amount: parseFloat(amount), payment_mode: mode, remarks });
      toast.success("Payment recorded"); setAmount(""); setRemarks(""); onUpdate();
    } catch { toast.error("Failed"); }
  };
  const fee = candidate.registration_fee || 0;
  const paid = candidate.amount_paid || 0;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Stat label="Fee" value={`₹${fee.toLocaleString("en-IN")}`} />
        <Stat label="Paid" value={`₹${paid.toLocaleString("en-IN")}`} tone="text-emerald-600" />
        <Stat label="Due" value={`₹${Math.max(0, fee - paid).toLocaleString("en-IN")}`} tone="text-red-600" />
      </div>
      <Card className="p-5 border-border">
        <div className="font-display font-semibold mb-3">Record Payment</div>
        <div className="grid md:grid-cols-3 gap-3">
          <Input placeholder="Amount ₹" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} data-testid="payment-amount" />
          <Select value={mode} onValueChange={setMode}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="upi">UPI</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="bank">Bank Transfer</SelectItem>
              <SelectItem value="card">Card</SelectItem>
            </SelectContent>
          </Select>
          <Input placeholder="Remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
          <Button onClick={submit} className="md:col-span-3" data-testid="add-payment-btn">Add Payment</Button>
        </div>
      </Card>
      <Card className="p-5 border-border">
        <div className="font-display font-semibold mb-3">History</div>
        {(candidate.payments || []).length === 0 ? <Empty text="No payments yet" /> :
          <div className="space-y-2 text-sm">
            {candidate.payments.map(p => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div><div className="font-medium">₹{p.amount.toLocaleString("en-IN")}</div><div className="text-xs text-muted-foreground">{p.payment_mode} · {p.receipt_number}</div></div>
                <div className="text-xs text-muted-foreground">{new Date(p.payment_date).toLocaleDateString()}</div>
              </div>
            ))}
          </div>}
      </Card>
    </div>
  );
}

const Stat = ({ label, value, tone = "" }) => (
  <Card className="p-4 border-border">
    <div className="overline text-[10px] text-muted-foreground">{label}</div>
    <div className={`mt-1 font-display text-2xl font-bold ${tone}`}>{value}</div>
  </Card>
);

function PartnerTab({ candidate, onUpdate }) {
  const p = candidate.partner || {};
  const [form, setForm] = useState({ name: p.name || "", contact: p.contact || "",
    email: p.email || "", commission_percent: p.commission_percent || "", notes: p.notes || "" });
  const on = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const submit = async () => {
    try {
      await api.patch(`/candidates/${candidate.id}/partner`, {
        ...form, commission_percent: parseFloat(form.commission_percent) || null,
      });
      toast.success("Partner info updated"); onUpdate();
    } catch { toast.error("Failed"); }
  };
  return (
    <Card className="p-5 border-border">
      <div className="font-display font-semibold mb-3">Partner / Referral Info</div>
      <div className="grid md:grid-cols-2 gap-3">
        <div><Label>Partner Name</Label><Input value={form.name} onChange={on("name")} data-testid="partner-name" /></div>
        <div><Label>Contact</Label><Input value={form.contact} onChange={on("contact")} /></div>
        <div><Label>Email</Label><Input value={form.email} onChange={on("email")} /></div>
        <div><Label>Commission %</Label><Input type="number" value={form.commission_percent} onChange={on("commission_percent")} /></div>
        <div className="md:col-span-2"><Label>Notes</Label><Textarea value={form.notes} onChange={on("notes")} rows={3} /></div>
      </div>
      <Button onClick={submit} className="mt-4" data-testid="partner-save-btn">Save</Button>
    </Card>
  );
}

function ActivityTab({ candidateId }) {
  const { data = [] } = useQuery({
    queryKey: ["activity", candidateId],
    queryFn: async () => (await api.get("/activity-logs", { params: { entity_id: candidateId } })).data,
  });
  return (
    <Card className="p-5 border-border">
      <div className="font-display font-semibold mb-3">Activity Log</div>
      {data.length === 0 ? <Empty text="No activity yet" /> :
        <div className="space-y-3">{data.map(a => (
          <div key={a.id} className="text-sm border-l-2 border-primary/40 pl-3">
            <div>{a.description}</div>
            <div className="text-xs text-muted-foreground">{a.actor_name || "System"} · {new Date(a.created_at).toLocaleString()}</div>
          </div>
        ))}</div>}
    </Card>
  );
}
