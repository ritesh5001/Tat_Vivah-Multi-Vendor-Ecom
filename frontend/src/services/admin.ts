import { apiRequest } from "@/services/api";

export interface AdminProduct {
  id: string;
  title: string;
  sellerId: string;
  sellerEmail?: string | null;
  categoryId: string;
  categoryName?: string | null;
  isPublished: boolean;
  deletedByAdmin: boolean;
  deletedByAdminAt?: string | null;
  deletedByAdminReason?: string | null;
  createdAt: string;
  moderation?: {
    status?: string | null;
    reason?: string | null;
    reviewedBy?: string | null;
    reviewedAt?: string | null;
  } | null;
}

export interface AdminSeller {
  id: string;
  email?: string | null;
  phone?: string | null;
  status: string;
  createdAt: string;
}

export interface AdminOrder {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items?: Array<{ id: string }>;
}

export interface AdminPayment {
  id: string;
  amount: number;
  status: string;
  provider: string;
  createdAt: string;
}

export interface AdminSettlement {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  actorId: string;
  createdAt: string;
  metadata?: Record<string, unknown> | null;
}

export async function getSellers(token?: string | null) {
  return apiRequest<{ sellers: AdminSeller[] }>("/v1/admin/sellers", {
    method: "GET",
    token,
  });
}

export async function approveSeller(id: string, token?: string | null) {
  return apiRequest<{ message: string }>(`/v1/admin/sellers/${id}/approve`, {
    method: 'PUT',
    token,
  });
}

export async function suspendSeller(id: string, token?: string | null) {
  return apiRequest<{ message: string }>(`/v1/admin/sellers/${id}/suspend`, {
    method: 'PUT',
    token,
  });
}

export async function getPendingProducts(token?: string | null) {
  return apiRequest<{ products: AdminProduct[] }>(
    "/v1/admin/products/pending",
    {
      method: "GET",
      token,
    }
  );
}

export async function getAllProducts(token?: string | null) {
  return apiRequest<{ products: AdminProduct[] }>("/v1/admin/products", {
    method: "GET",
    token,
  });
}

export async function approveProduct(id: string, token?: string | null) {
  return apiRequest<{ message: string }>(`/v1/admin/products/${id}/approve`, {
    method: "PUT",
    token,
  });
}

export async function rejectProduct(
  id: string,
  reason: string,
  token?: string | null
) {
  return apiRequest<{ message: string }>(`/v1/admin/products/${id}/reject`, {
    method: "PUT",
    body: { reason },
    token,
  });
}

export async function deleteProduct(
  id: string,
  reason?: string,
  token?: string | null
) {
  return apiRequest<{ message: string }>(`/v1/admin/products/${id}`, {
    method: "DELETE",
    body: reason ? { reason } : undefined,
    token,
  });
}

export async function getOrders(token?: string | null) {
  return apiRequest<{ orders: AdminOrder[] }>("/v1/admin/orders", {
    method: "GET",
    token,
  });
}

export async function getPayments(token?: string | null) {
  return apiRequest<{ payments: AdminPayment[] }>("/v1/admin/payments", {
    method: "GET",
    token,
  });
}

export async function getSettlements(token?: string | null) {
  return apiRequest<{ settlements: AdminSettlement[] }>(
    "/v1/admin/settlements",
    {
      method: "GET",
      token,
    }
  );
}

export async function getAuditLogs(token?: string | null) {
  return apiRequest<{ auditLogs: AuditLog[] }>("/v1/admin/audit-logs", {
    method: "GET",
    token,
  });
}
