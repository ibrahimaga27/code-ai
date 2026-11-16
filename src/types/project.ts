export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export type PackageId = "baslangic" | "kurumsal" | "ozel";

export interface CustomDomain {
  domain: string;
  status: "pending" | "verified";
  verification_token: string;
  ssl_enabled: boolean;
  added_at: string;
  verified_at: string | null;
  last_checked_at?: string | null;
  last_check_note?: string | null;
}

export interface SiteProject {
  id: string;
  title: string;
  sector: string;
  summary: string;
  html_code: string;
  brief: string;
  package: string;
  messages: ChatMessage[];
  domains: CustomDomain[];
  purchased: boolean;
  purchased_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BuilderResult {
  reply: string;
  ready: boolean;
  title: string;
  sector: string;
  summary: string;
  html: string;
}

export interface DomainVerifyResponse {
  project: SiteProject;
  verified: boolean;
  message: string;
  foundA: string[];
  foundCname: string[];
  foundTxt: string[];
}
