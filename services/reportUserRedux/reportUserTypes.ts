export enum ReportReason {
  HARASSMENT_AND_BULLYING = 'HARASSMENT_AND_BULLYING',
  HATE_SPEECH = 'HATE_SPEECH',
  IMPERSONATION_FAKE_ACCOUNTS = 'IMPERSONATION_FAKE_ACCOUNTS',
  GRAPHIC_CONTENT = 'GRAPHIC_CONTENT',
  THREATS_AND_VIOLENCE = 'THREATS_AND_VIOLENCE',
  SCAMS_AND_FRAUD = 'SCAMS_AND_FRAUD',
  SENSITIVE_PERSONAL_INFO = 'SENSITIVE_PERSONAL_INFO',
  SELF_HARM = 'SELF_HARM',
  OTHER = 'OTHER',
}

export interface CreateReportUserDto {
  targetId: string;
  reason: ReportReason;
  description?: string;
}

export interface ReportUser {
  _id: string;
  reporterId: string;
  targetId: string;
  reason: ReportReason;
  description?: string;
  isRead: boolean;
  resolved: boolean;
  isDismissed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedReports {
  data: ReportUser[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}