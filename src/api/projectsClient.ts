import type {
  ChatMessage,
  DomainVerifyResponse,
  SiteProject,
} from "../types/project";

export interface CreateProjectPayload {
  title: string;
  sector?: string;
  summary?: string;
  html_code: string;
  brief?: string;
  package?: string;
  messages?: ChatMessage[];
}

export interface UpdateProjectPayload {
  title?: string;
  sector?: string;
  summary?: string;
  html_code?: string;
  brief?: string;
  package?: string;
  messages?: ChatMessage[];
  purchased?: boolean;
}

export const SiteProjectApi = {
  async list(): Promise<SiteProject[]> {
    const res = await fetch("/api/projects");
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error || "Projeler yüklenemedi.");
    }
    return data.projects as SiteProject[];
  },

  async get(id: string): Promise<SiteProject> {
    const res = await fetch(`/api/projects/${encodeURIComponent(id)}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error || "Proje bulunamadı.");
    }
    return data.project as SiteProject;
  },

  async create(payload: CreateProjectPayload): Promise<SiteProject> {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error || "Proje oluşturulamadı.");
    }
    return data.project as SiteProject;
  },

  async update(id: string, payload: UpdateProjectPayload): Promise<SiteProject> {
    const res = await fetch(`/api/projects/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error || "Proje güncellenemedi.");
    }
    return data.project as SiteProject;
  },

  async remove(id: string): Promise<void> {
    const res = await fetch(`/api/projects/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data?.error || "Proje silinemedi.");
    }
  },

  async addDomain(projectId: string, domain: string): Promise<SiteProject> {
    const res = await fetch(`/api/projects/${encodeURIComponent(projectId)}/domains`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error || "Alan adı eklenemedi.");
    }
    return data.project as SiteProject;
  },

  async verifyDomain(projectId: string, domain: string): Promise<DomainVerifyResponse> {
    const res = await fetch(
      `/api/projects/${encodeURIComponent(projectId)}/domains/verify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      },
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error || "DNS doğrulaması yapılamadı.");
    }
    return data as DomainVerifyResponse;
  },

  async removeDomain(projectId: string, domain: string): Promise<SiteProject> {
    const res = await fetch(
      `/api/projects/${encodeURIComponent(projectId)}/domains/${encodeURIComponent(domain)}`,
      {
        method: "DELETE",
      },
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error || "Alan adı kaldırılamadı.");
    }
    return data.project as SiteProject;
  },
};
