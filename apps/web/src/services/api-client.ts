import type {
  AppUser,
  JobFair,
  FairMembership,
  Company,
  Booth,
  JobPosting,
  CandidateProfile,
  RegisterUserRequest,
  LoginUserRequest,
  AccountUpdateRequest,
  PasswordChangeRequest,
  CreateFairRequest,
  UpdateFairRequest,
  CreateCompanyRequest,
  UpdateCompanyRequest,
  CreateBoothRequest,
  UpdateBoothRequest,
  CreateJobPostingRequest,
  UpdateJobPostingRequest,
  UpdateCandidateProfileRequest,
  InviteRecruiterInput,
  ReviewFairMembershipInput,
  ApiErrorEnvelope,
} from "@maskedmatch/contracts";

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8787";

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
    public retryable: boolean = false,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(path: string, options: RequestInit = {}, token?: string | null): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const errorEnvelope = data as ApiErrorEnvelope | null;
    const code = errorEnvelope?.error?.code || `HTTP_${response.status}`;
    const message = errorEnvelope?.error?.message || response.statusText || "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์";
    const retryable = errorEnvelope?.error?.retryable ?? (response.status >= 500);
    throw new ApiError(code, message, response.status, retryable);
  }

  return data as T;
}

export const apiClient = {
  // Auth
  auth: {
    register: (data: RegisterUserRequest) =>
      request<{ user: AppUser; token: string }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    login: (data: LoginUserRequest) =>
      request<{ user: AppUser; token: string }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getMe: (token: string) =>
      request<{ user: AppUser }>("/api/auth/me", { method: "GET" }, token),
    updateAccount: (data: AccountUpdateRequest, token: string) =>
      request<{ user: AppUser }>("/api/auth/account", {
        method: "PATCH",
        body: JSON.stringify(data),
      }, token),
    changePassword: (data: PasswordChangeRequest, token: string) =>
      request<{ success: boolean; message: string }>("/api/auth/password", {
        method: "POST",
        body: JSON.stringify(data),
      }, token),
  },

  // Fairs
  fairs: {
    list: (token?: string | null) =>
      request<{ fairs: JobFair[] }>("/api/fairs", { method: "GET" }, token),
    get: (idOrSlug: string, token?: string | null) =>
      request<{ fair: JobFair }>(`/api/fairs/${encodeURIComponent(idOrSlug)}`, { method: "GET" }, token),
    create: (data: CreateFairRequest, token: string) =>
      request<{ fair: JobFair }>("/api/fairs", {
        method: "POST",
        body: JSON.stringify(data),
      }, token),
    update: (id: string, data: UpdateFairRequest, token: string) =>
      request<{ fair: JobFair }>(`/api/fairs/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }, token),
    delete: (id: string, token: string) =>
      request<{ success: boolean; message: string }>(`/api/fairs/${encodeURIComponent(id)}`, {
        method: "DELETE",
      }, token),
  },

  // Memberships
  memberships: {
    list: (fairId: string, token: string) =>
      request<{ memberships: FairMembership[] }>(`/api/fairs/${encodeURIComponent(fairId)}/memberships`, { method: "GET" }, token),
    join: (fairId: string, token: string) =>
      request<{ membership: FairMembership }>(`/api/fairs/${encodeURIComponent(fairId)}/memberships/join`, {
        method: "POST",
      }, token),
    requestAccess: (fairId: string, token: string) =>
      request<{ membership: FairMembership }>(`/api/fairs/${encodeURIComponent(fairId)}/memberships/request`, {
        method: "POST",
      }, token),
    invite: (fairId: string, data: InviteRecruiterInput, token: string) =>
      request<{ membership: FairMembership }>(`/api/fairs/${encodeURIComponent(fairId)}/memberships/invite`, {
        method: "POST",
        body: JSON.stringify(data),
      }, token),
    review: (fairId: string, membershipId: string, data: ReviewFairMembershipInput, token: string) =>
      request<{ membership: FairMembership }>(`/api/fairs/${encodeURIComponent(fairId)}/memberships/${encodeURIComponent(membershipId)}/review`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }, token),
    accept: (fairId: string, membershipId: string, token: string) =>
      request<{ membership: FairMembership }>(`/api/fairs/${encodeURIComponent(fairId)}/memberships/accept`, {
        method: "POST",
        body: JSON.stringify({ membershipId }),
      }, token),
    remove: (fairId: string, membershipId: string, token: string) =>
      request<{ success: boolean; message: string }>(`/api/fairs/${encodeURIComponent(fairId)}/memberships/${encodeURIComponent(membershipId)}`, {
        method: "DELETE",
      }, token),
  },

  // Companies, Booths, Jobs & Profile
  companies: {
    list: (ownerId?: string, token?: string | null) => {
      const q = ownerId ? `?ownerId=${encodeURIComponent(ownerId)}` : "";
      return request<{ companies: Company[] }>(`/api/companies${q}`, { method: "GET" }, token);
    },
    create: (data: CreateCompanyRequest, token: string) =>
      request<{ company: Company }>("/api/companies", {
        method: "POST",
        body: JSON.stringify(data),
      }, token),
    update: (id: string, data: UpdateCompanyRequest, token: string) =>
      request<{ company: Company }>(`/api/companies/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }, token),
  },

  booths: {
    list: (fairId?: string, ownerId?: string, token?: string | null) => {
      const params = new URLSearchParams();
      if (fairId) params.set("fairId", fairId);
      if (ownerId) params.set("ownerId", ownerId);
      const q = params.toString() ? `?${params.toString()}` : "";
      return request<{ booths: Booth[] }>(`/api/booths${q}`, { method: "GET" }, token);
    },
    create: (data: CreateBoothRequest, token: string) =>
      request<{ booth: Booth }>("/api/booths", {
        method: "POST",
        body: JSON.stringify(data),
      }, token),
    update: (id: string, data: UpdateBoothRequest, token: string) =>
      request<{ booth: Booth }>(`/api/booths/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }, token),
    delete: (id: string, token: string) =>
      request<{ success: boolean; message: string }>(`/api/booths/${encodeURIComponent(id)}`, {
        method: "DELETE",
      }, token),
  },

  jobs: {
    list: (boothId?: string, token?: string | null) => {
      const q = boothId ? `?boothId=${encodeURIComponent(boothId)}` : "";
      return request<{ jobs: JobPosting[] }>(`/api/jobs${q}`, { method: "GET" }, token);
    },
    create: (data: CreateJobPostingRequest, token: string) =>
      request<{ job: JobPosting }>("/api/jobs", {
        method: "POST",
        body: JSON.stringify(data),
      }, token),
    update: (id: string, data: UpdateJobPostingRequest, token: string) =>
      request<{ job: JobPosting }>(`/api/jobs/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }, token),
    delete: (id: string, token: string) =>
      request<{ success: boolean; message: string }>(`/api/jobs/${encodeURIComponent(id)}`, {
        method: "DELETE",
      }, token),
  },

  candidate: {
    getProfile: (token: string) =>
      request<{ profile: CandidateProfile | null }>("/api/candidate/profile", { method: "GET" }, token),
    updateProfile: (data: UpdateCandidateProfileRequest, token: string) =>
      request<{ profile: CandidateProfile }>("/api/candidate/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      }, token),
  },
};
