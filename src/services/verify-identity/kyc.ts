import api from '@/utils/api.ts';
import { $isLoggedInHint } from '@/stores/authHint';
import type {
  ProcessVerificationRequest,
  ProcessVerificationResponse,
  KycUploadResponse,
  KycProcessResponse,
  KycStatusResponse,
} from '@/types/verify-identity/verification';
import type { KycSession } from '@/types/verify-identity/kyc';
import { $auth } from '@/stores/auth';

/**
 * Creates a new KYC session for authenticated users
 * @returns Promise resolving to session data with token
 */
export async function createKycSession(): Promise<KycSession> {
  try {
    const response = await api.post<KycSession>('/kyc/sessions/');
    return response.data;
  } catch (error) {
    console.error('[createKycSession] Error creating KYC session:', error);
    throw error;
  }
}

/**
 * Validates a session token on server side
 * @param sessionToken - Token to validate
 * @returns Promise resolving to validation result
 */
export async function validateSessionToken(sessionToken: string): Promise<{
  isValid: boolean;
  isExpired: boolean;
}> {
  try {
    const response = await api.post('/public/kyc/sessions/validate/', {
      token: sessionToken,
    });
    return response.data;
  } catch (error) {
    console.error('[validateSessionToken] Error validating token:', error);
    return { isValid: false, isExpired: false };
  }
}

/**
 * Determines if user is authenticated by checking login token and auth hint
 * @returns Whether the user is authenticated
 */
function isUserAuthenticated(): boolean {
  const { accessToken } = $auth.get();
  const authHint = $isLoggedInHint.get();

  return Boolean(accessToken && authHint);
}

/**
 * Determines if we should use public endpoints based on user authentication status
 * Public endpoints are used when the user is NOT authenticated (QR code flow)
 * Private endpoints are used when the user IS authenticated (regular flow)
 * @returns Whether to use public endpoints
 */
function shouldUsePublicEndpoints(): boolean {
  return !isUserAuthenticated();
}

/**
 * Gets the appropriate API base path based on authentication status
 * @returns API base path
 */
function getKycEndpointBase(): string {
  return shouldUsePublicEndpoints() ? '/public/kyc' : '/kyc';
}

/**
 * Step 1: Upload documents (for authenticated users or with session token)
 * @param frontDocument Front document file
 * @param backDocument Back document file
 * @param selfie Selfie file
 * @param sessionToken Optional session token for QR flow
 * @returns Upload response with session token
 */
export async function uploadDocuments(
  frontDocument: File,
  backDocument: File,
  selfie: File,
  sessionToken?: string | null
): Promise<KycUploadResponse> {
  const basePath = getKycEndpointBase();
  const isPublicEndpoint = shouldUsePublicEndpoints();

  const formData = new FormData();
  if (sessionToken != null) {
    formData.append('sessionToken', sessionToken);
  }
  formData.append('idFront', frontDocument);
  formData.append('idBack', backDocument);
  formData.append('selfie', selfie);

  try {
    if (isPublicEndpoint && sessionToken) {
      // QR code flow (unauthenticated user) - use public endpoint with session token
      const response = await api.post<KycUploadResponse>(
        `${basePath}/documents/upload/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } else {
      // Regular authenticated flow - use protected endpoint with Bearer token + cookies
      const response = await api.post<KycUploadResponse>(
        `${basePath}/documents/upload/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    }
  } catch (error) {
    console.error('[uploadDocuments] Error uploading documents:', error);
    throw error;
  }
}

/**
 * Step 2: Process document verification using session token
 * @param sessionToken Session token from upload step or QR flow
 * @returns Process verification response
 */
export async function processDocumentVerification(
  sessionToken: string
): Promise<KycProcessResponse> {
  const basePath = getKycEndpointBase();
  const isPublicEndpoint = shouldUsePublicEndpoints();

  try {
    if (isPublicEndpoint) {
      // QR code flow (unauthenticated user) - use public endpoint with session token in body
      const response = await api.post<KycProcessResponse>(
        `${basePath}/documents/process/`,
        { sessionToken }
      );
      return response.data;
    } else {
      // Regular authenticated flow - use protected endpoint with Bearer token + cookies
      const response = await api.post<KycProcessResponse>(
        `${basePath}/documents/process/`,
        { sessionToken }
      );
      return response.data;
    }
  } catch (error) {
    console.error(
      '[processDocumentVerification] Error processing verification:',
      error
    );
    throw error;
  }
}

/**
 * Check KYC document processing status
 * @param sessionToken Session token to check status for
 * @returns Current processing status and results
 */
export async function getKycDocumentStatus(
  sessionToken: string
): Promise<KycStatusResponse> {
  const basePath = getKycEndpointBase();
  const isPublicEndpoint = shouldUsePublicEndpoints();

  try {
    if (isPublicEndpoint) {
      // QR code flow (unauthenticated user) - use public endpoint with session token as query param
      const response = await api.get<KycStatusResponse>(
        `${basePath}/documents/status/`,
        {
          params: { session_token: sessionToken },
        }
      );
      return response.data;
    } else {
      // Regular authenticated flow - use protected endpoint with Bearer token + cookies
      const response = await api.get<KycStatusResponse>(
        `${basePath}/documents/status/`,
        {
          params: { session_token: sessionToken },
        }
      );
      return response.data;
    }
  } catch (error) {
    console.error('[getKycDocumentStatus] Error checking status:', error);
    throw error;
  }
}

/**
 * Complete two-step verification process
 * @param request Document verification request
 * @param sessionToken Optional session token for QR flow
 * @returns Final verification result with session info for polling if async
 */
export async function processVerification(
  request: ProcessVerificationRequest,
  sessionToken?: string | null
): Promise<
  ProcessVerificationResponse & { sessionToken?: string; isAsync?: boolean }
> {
  try {
    // Step 1: Always upload documents first (regardless of flow type)
    const uploadResult = await uploadDocuments(
      request.documentFront,
      request.documentBack,
      request.selfie,
      sessionToken
    );

    if (!uploadResult.canProcess) {
      return {
        success: false,
        verified: false,
        message: uploadResult.message || 'Documents could not be processed',
      };
    }

    // Use the session token from upload result if we don't have one
    const effectiveSessionToken = sessionToken || uploadResult.sessionId;

    if (!effectiveSessionToken) {
      throw new Error('No session token available for processing');
    }
    // Step 2: Process the verification (now returns immediate response)
    const processResult = await processDocumentVerification(
      effectiveSessionToken
    );

    // Check if this is an async processing (status is IN_PROGRESS)
    if (
      processResult.status === 'IN_PROGRESS' ||
      processResult.sessionStatus === 'processing'
    ) {
      return {
        success: true,
        verified: false, // Not verified yet, still processing
        message: processResult.message || 'Processing documents...',
        sessionToken: effectiveSessionToken,
        isAsync: true,
      };
    }

    // Immediate result (legacy behavior or completed processing)
    return {
      success: processResult.verificationPassed,
      verified: processResult.verificationPassed,
      message: processResult.message,
      sessionToken: effectiveSessionToken,
      isAsync: false,
    };
  } catch (error) {
    console.error('[processVerification] Error:', error);
    return {
      success: false,
      verified: false,
      message: error instanceof Error ? error.message : 'Verification failed',
    };
  }
}
