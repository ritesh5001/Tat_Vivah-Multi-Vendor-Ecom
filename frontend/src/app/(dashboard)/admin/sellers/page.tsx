"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { approveSeller, getSellers, suspendSeller } from "@/services/admin";
import { toast } from "sonner";

export default function AdminSellersPage() {
  const [loading, setLoading] = React.useState(true);
  const [sellers, setSellers] = React.useState<Array<any>>([]);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const result = await getSellers();
      setSellers(result.sellers ?? []);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to load sellers"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  const handleApprove = async (id: string) => {
    try {
      await approveSeller(id);
      toast.success("Seller approved.");
      load();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to approve seller"
      );
    }
  };

  const handleSuspend = async (id: string) => {
    try {
      await suspendSeller(id);
      toast.success("Seller suspended.");
      load();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to suspend seller"
      );
    }
  };

  return (
    <div className="min-h-[calc(100vh-160px)] bg-gradient-to-br from-emerald-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
            Seller approvals
          </p>
          <h1 className="text-4xl font-semibold text-slate-900 dark:text-white">
            Approve or suspend sellers.
          </h1>
        </div>

        <Card className="border border-emerald-100/70 bg-white/80 dark:border-slate-800 dark:bg-slate-900/70">
          <CardHeader>
            <CardTitle className="text-lg text-slate-900 dark:text-white">
              Sellers table
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            {loading ? (
              <p className="text-sm text-slate-500">Loading sellers...</p>
            ) : sellers.length === 0 ? (
              <p className="text-sm text-slate-500">No sellers found.</p>
            ) : (
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                <thead className="text-xs uppercase tracking-[0.2em] text-slate-500">
                  <tr>
                    <th className="py-3">Seller</th>
                    <th className="py-3">Status</th>
                    <th className="py-3">Joined</th>
                    <th className="py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800">
                  {sellers.map((seller) => (
                    <tr key={seller.id}>
                      <td className="py-3 font-semibold text-slate-900 dark:text-white">
                        {seller.email ?? seller.phone ?? seller.id?.slice(0, 8)}
                      </td>
                      <td className="py-3">{seller.status}</td>
                      <td className="py-3">
                        {seller.createdAt
                          ? new Date(seller.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="py-3">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprove(seller.id)}
                            disabled={seller.status === "ACTIVE"}
                          >
                            {seller.status === "ACTIVE" ? "Approved" : "Approve"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSuspend(seller.id)}
                            disabled={seller.status === "SUSPENDED"}
                          >
                            {seller.status === "SUSPENDED" ? "Suspended" : "Suspend"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
