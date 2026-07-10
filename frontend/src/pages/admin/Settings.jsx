import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function Settings() {
  const { user } = useAuth();
  const [pwd, setPwd] = useState({ current_password: "", new_password: "" });
  const change = async (e) => {
    e.preventDefault();
    try { await api.post("/auth/change-password", pwd); toast.success("Password changed"); setPwd({ current_password: "", new_password: "" }); }
    catch (er) { toast.error(er?.response?.data?.detail || "Failed"); }
  };
  return (
    <div className="space-y-6 max-w-3xl" data-testid="settings-page">
      <div><div className="overline text-primary">Account</div><h1 className="mt-1 font-display text-3xl font-bold tracking-tight">Settings</h1></div>
      <Card className="p-6 border-border">
        <h3 className="font-display font-semibold mb-4">Profile</h3>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <div><Label>Name</Label><Input value={user?.full_name || ""} disabled /></div>
          <div><Label>Email</Label><Input value={user?.email || ""} disabled /></div>
          <div><Label>Role</Label><Input value={user?.role || ""} disabled className="capitalize" /></div>
        </div>
      </Card>
      <Card className="p-6 border-border">
        <h3 className="font-display font-semibold mb-4">Change Password</h3>
        <form onSubmit={change} className="grid md:grid-cols-2 gap-3">
          <div><Label>Current Password</Label><Input type="password" required value={pwd.current_password} onChange={(e) => setPwd({ ...pwd, current_password: e.target.value })} data-testid="current-pwd" /></div>
          <div><Label>New Password</Label><Input type="password" required minLength={6} value={pwd.new_password} onChange={(e) => setPwd({ ...pwd, new_password: e.target.value })} data-testid="new-pwd" /></div>
          <div className="md:col-span-2"><Button data-testid="change-pwd-btn">Update Password</Button></div>
        </form>
      </Card>
    </div>
  );
}
