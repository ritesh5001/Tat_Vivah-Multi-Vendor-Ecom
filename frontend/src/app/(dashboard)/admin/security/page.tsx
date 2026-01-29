"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuditLogs } from "@/services/admin";
import { toast } from "sonner";

export default function AdminSecurityPage() {
  const [loading, setLoading] = React.useState(true);
  const [logs, setLogs] = React.useState<Array<any>>([]);

  React.useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const result = await getAuditLogs();
        setLogs(result.auditLogs ?? []);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Unable to load audit logs"
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-[calc(100vh-160px)] bg-gradient-to-br from-emerald-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
            Audit logs
          </p>
          <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">
            Track admin actions and compliance.
          </h1>
        </div>

        <section className="grid gap-6">
          {loading ? (
            <p className="text-sm text-slate-500">Loading audit logs...</p>
          ) : logs.length === 0 ? (
            <Card className="border border-emerald-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70">
              <CardContent className="p-6 text-sm text-slate-600 dark:text-slate-300">
                No audit logs found.
              </CardContent>
            </Card>
          ) : (
            logs.map((log) => (
              <Card
                key={log.id}
                className="border border-emerald-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70"
              >
                <CardHeader className="flex-row items-center justify-between">
                  <CardTitle className="text-lg text-slate-900 dark:text-white">
                    {log.action}
                  </CardTitle>
                  <span className="text-xs text-slate-500">
                    {log.createdAt
                      ? new Date(log.createdAt).toLocaleString()
                      : "—"}
                  </span>
                </CardHeader>
                <CardContent className="grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Entity
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {log.entityType} · {log.entityId?.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Actor
                    </p>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {log.actorId?.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                      Metadata
                    </p>
                    <p className="truncate font-semibold text-slate-900 dark:text-white">
                      {log.metadata ? JSON.stringify(log.metadata) : "—"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
