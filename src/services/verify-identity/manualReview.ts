import api from '@/utils/api.ts';
import { $loginToken } from '@/stores/loginToken';
import { $isLoggedInHint } from '@/stores/authHint';
import type { KycUploadResponse } from '@/types/verify-identity/verification';

/**
 * Determines if user is authenticated by checking login token and auth hint
 * @returns Whether the user is authenticated
 */
function isUserAuthenticated(): boolean {
  const loginToken = $loginToken.get();
  const authHint = $isLoggedInHint.get();

  return Boolean(loginToken && authHint);
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
 * Upload documents for manual review (simplified flow)
 * @param frontDocument Front document file
 * @param backDocument Back document file
 * @param selfie Selfie file
 * @param sessionToken Optional session token for QR flow
 * @returns Upload response
 */
export async function uploadDocumentsForManualReview(
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
    console.error(
      '[uploadDocumentsForManualReview] Error uploading documents:',
      error
    );
    throw error;
  }
}
