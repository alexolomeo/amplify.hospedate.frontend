export interface VerificationPhoto {
  file: File;
  previewUrl: string;
  type: 'document-front' | 'document-back' | 'selfie';
}

export interface VerificationSession {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface UploadDocumentResponse {
  success: boolean;
  message?: string;
}

// New API response types based on backend specification
export interface KycUploadResponse {
  sessionId: string;
  uploadedDocuments: string[];
  message: string;
  canProcess: boolean;
}

export interface KycProcessResponse {
  sessionId: string;
  status: string;
  verificationPassed: boolean;
  overallConfidence: number | null;
  documentAnalysis: Record<string, unknown> | null;
  faceAnalysis: Record<string, unknown> | null;
  faceMatchAnalysis: Record<string, unknown> | null;
  sessionStatus: string;
  completedAt: string | null;
  message: string;
}

// New interface for async KYC status response
export interface RateLimitInfo {
  remainingAttempts: number;
  totalAttemptsUsed: number;
  maxAttempts: number;
  lockedUntil: string | null; // ISO date string or null
}

export interface KycStatusResponse {
  session_id: string;
  status: string;
  processingStatus: string;
  documentsUploaded: string[];
  canProcess: boolean;
  verificationCompleted: boolean;
  results: KycProcessResponse | null;
  rateLimitInfo: RateLimitInfo;
}

export interface ProcessVerificationRequest {
  documentFront: File;
  documentBack: File;
  selfie: File;
  sessionToken?: string; // Optional for QR-based verification
}

export interface ProcessVerificationResponse {
  success: boolean;
  verified: boolean;
  message?: string;
}

export type VerificationStep =
  | 'welcome'
  | 'instructions-front'
  | 'instructions-back'
  | 'instructions-reverse'
  | 'camera-front'
  | 'camera-back'
  | 'camera-reverse'
  | 'face-instructions'
  | 'face-camera'
  | 'processing'
  | 'documentsSubmitted'
  | 'success'
  | 'error';
