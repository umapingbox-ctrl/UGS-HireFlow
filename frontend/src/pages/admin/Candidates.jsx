import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Download, Upload, Search, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusPill } from "@/components/StatusDot";
import { toast } from "sonner";
import api, { API_BASE } from "@/lib/api";

const STATUSES = ["", "pending_verification", "verified", "assigned", "company_assigned",
  "interview_scheduled", "round_1", "round_2", "technical", "hr", "selected",
  "offer_released", "joined", "placed", "rejected", "waiting"];

export default function Candidates() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [payment, setPayment] = useState("");
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["candidates", q, status, payment],
    queryFn: async () => (await api.get("/candidates", { params: { q, status, payment_status: payment } })).data,
  });

  const items = data?.items || [];

  const exportCsv = async () => {
    const token = localStorage.getItem("ugs_token");
    const r = await fetch(`${API_BASE}/candidates/export/csv`, { headers: { Authorization: `Bearer ${token}` } });
    if (!r.ok) return toast.error("Export failed");
    const blob = await r.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "candidates.csv"; a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported");
  };

  const importCsv = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData(); fd.append("file", file);
    try {
      const r = await api.post("/candidates/import/csv", fd, { headers: { "Content-Type": "multipart/form-data" } });
      toast.success(`Imported ${r.data.imported}, skipped ${r.data.skipped}`);
      refetch();
    } catch (err) { toast.error("Import failed"); }
    e.target.value = "";
  };

  return (
    <div className="space-y-6" data-testid="candidates-page">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="overline text-primary">Directory</div>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight">Candidates</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={exportCsv} data-testid="export-csv-btn"><Download className="h-4 w-4 mr-2" /> Export CSV</Button>
          <label className="cursor-pointer">
            <input type="file" accept=".csv" onChange={importCsv} className="hidden" data-testid="import-csv-input" />
            <Button variant="outline" asChild><span><Upload className="h-4 w-4 mr-2" /> Import CSV</span></Button>
          </label>
        </div>
      </div>

      <Card className="p-4 border-border">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, email, phone, code, skills..." className="pl-9" data-testid="candidates-search" />
          </div>
          <Select value={status || "all"} onValueChange={(v) => setStatus(v === "all" ? "" : v)}>
            <SelectTrigger className="w-52" data-testid="candidates-status-filter"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.slice(1).map(s => <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={payment || "all"} onValueChange={(v) => setPayment(v === "all" ? "" : v)}>
            <SelectTrigger className="w-44" data-testid="candidates-payment-filter"><SelectValue placeholder="Payment" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All payments</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="glass border-b border-border">
              <tr className="text-left">
                {["Code", "Name", "Contact", "Status", "Payment", "Experience", "Created"].map(h =>
                  <th key={h} className="px-4 py-3 overline text-[10px] text-muted-foreground">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">Loading...</td></tr>}
              {!isLoading && items.length === 0 && <tr><td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">No candidates found</td></tr>}
              {items.map(c => (
                <tr key={c.id} className="border-b border-border/50 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors" data-testid={`candidate-row-${c.id}`}>
                  <td className="px-4 py-3 font-medium text-xs">{c.candidate_code}</td>
                  <td className="px-4 py-3"><Link to={`/app/candidates/${c.id}`} className="font-medium text-primary hover:underline">{c.full_name}</Link></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{c.email}<br />{c.phone}</td>
                  <td className="px-4 py-3"><StatusPill status={c.status} /></td>
                  <td className="px-4 py-3"><StatusPill status={c.payment_status} /></td>
                  <td className="px-4 py-3">{c.total_experience_years || 0} yrs</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="text-xs text-muted-foreground">Total: {data?.total || 0}</div>
    </div>
  );
}
