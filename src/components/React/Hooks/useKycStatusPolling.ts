import { useState, useEffect, useCallback, useRef } from 'react';
import { getKycDocumentStatus } from '@/services/verify-identity/kyc';
import type {
  KycStatusResponse,
  RateLimitInfo,
} from '@/types/verify-identity/verification';

/**
 * Custom hook for polling KYC document status with intelligent exponential backoff
 *
 * Optimized for user experience:
 * - Starts with 5s intervals for responsiveness
 * - Exponential backoff up to 15s max interval
 * - Total timeout of ~2-3 minutes (20 attempts)
 * - Reasonable balance between responsiveness and server load
 *
 * @param options Polling configuration options
 * @returns Polling state and control functions
 */

export interface KycPollingState {
  status: 'idle' | 'polling' | 'completed' | 'error';
  processingStatus?: string;
  verificationCompleted: boolean;
  documentsUploaded: string[];
  canProcess: boolean;
  results?: KycStatusResponse['results'];
  error?: string;
  rateLimitInfo?: RateLimitInfo;
  currentInterval?: number; // Current polling interval for debugging
  attemptCount?: number; // Current attempt count for debugging
}

export interface UseKycStatusPollingOptions {
  sessionToken?: string;
  enabled?: boolean;
  initialPollInterval?: number; // Initial polling interval in milliseconds
  maxPollInterval?: number; // Maximum polling interval in milliseconds
  backoffMultiplier?: number; // Multiplier for exponential backoff
  maxAttempts?: number;
  onComplete?: (results: KycStatusResponse['results']) => void;
  onError?: (error: string) => void;
}

export function useKycStatusPolling({
  sessionToken,
  enabled = true,
  initialPollInterval = 5000, // Start with 5 seconds - responsive for user
  maxPollInterval = 15000, // Max 15 seconds between polls - keep it reasonable
  backoffMultiplier = 1.3, // Gradual 30% increase
  maxAttempts = 20, // Max 2-3 minutes total polling time
  onComplete,
  onError,
}: UseKycStatusPollingOptions) {
  const [state, setState] = useState<KycPollingState>({
    status: 'idle',
    verificationCompleted: false,
    documentsUploaded: [],
    canProcess: false,
  });

  const attemptCountRef = useRef(0);
  const currentPollIntervalRef = useRef(initialPollInterval);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);
  const hasStartedRef = useRef(false);

  const clearPollTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const checkStatus = useCallback(async () => {
    if (!sessionToken || !enabled || !mountedRef.current) {
      return;
    }

    try {
      const response = await getKycDocumentStatus(sessionToken);

      if (!mountedRef.current) return;

      setState((prev) => ({
        ...prev,
        status: response.verificationCompleted ? 'completed' : 'polling',
        processingStatus: response.processingStatus,
        verificationCompleted: response.verificationCompleted,
        documentsUploaded: response.documentsUploaded,
        canProcess: response.canProcess,
        results: response.results,
        rateLimitInfo: response.rateLimitInfo,
        currentInterval: currentPollIntervalRef.current,
        attemptCount: attemptCountRef.current + 1,
        error: undefined,
      }));

      // Check if verification is completed
      if (response.verificationCompleted) {
        if (import.meta.env.DEV) {
          console.log(
            `[KYC Polling] Verification completed after ${attemptCountRef.current} attempts`
          );
        }
        clearPollTimeout();
        onComplete?.(response.results);
        return;
      }

      // Check if we've reached max attempts
      attemptCountRef.current += 1;
      if (attemptCountRef.current >= maxAttempts) {
        setState((prev) => ({
          ...prev,
          status: 'error',
          error: 'Verification timed out. Please try again.',
        }));
        clearPollTimeout();
        onError?.('Verification timed out');
        return;
      }

      // Calculate next poll interval with exponential backoff
      const nextInterval = Math.min(
        currentPollIntervalRef.current * backoffMultiplier,
        maxPollInterval
      );
      currentPollIntervalRef.current = nextInterval;

      // Log polling info for debugging (only in development)
      if (import.meta.env.DEV) {
        console.log(
          `[KYC Polling] Attempt ${attemptCountRef.current}/${maxAttempts}, next check in ${Math.round(currentPollIntervalRef.current / 1000)}s`
        );
      }

      // Schedule next poll with the calculated interval
      if (mountedRef.current) {
        timeoutRef.current = setTimeout(() => {
          checkStatus();
        }, currentPollIntervalRef.current);
      }
    } catch (error) {
      if (!mountedRef.current) return;

      const errorMessage =
        error instanceof Error ? error.message : 'Failed to check status';

      setState((prev) => ({
        ...prev,
        status: 'error',
        error: errorMessage,
      }));

      clearPollTimeout();
      onError?.(errorMessage);
    }
  }, [
    sessionToken,
    enabled,
    maxAttempts,
    backoffMultiplier,
    maxPollInterval,
    onComplete,
    onError,
    clearPollTimeout,
  ]);

  const startPolling = useCallback(() => {
    if (!sessionToken || !enabled) {
      return;
    }

    // Reset polling state
    attemptCountRef.current = 0;
    currentPollIntervalRef.current = initialPollInterval; // Reset to initial interval
    setState((prev) => ({
      ...prev,
      status: 'polling',
      error: undefined,
    }));
    checkStatus();
  }, [sessionToken, enabled, initialPollInterval, checkStatus]);

  const stopPolling = useCallback(() => {
    clearPollTimeout();
    setState((prev) => ({
      ...prev,
      status: prev.verificationCompleted ? 'completed' : 'idle',
    }));
  }, [clearPollTimeout]);

  const resetPolling = useCallback(() => {
    clearPollTimeout();
    attemptCountRef.current = 0;
    currentPollIntervalRef.current = initialPollInterval; // Reset to initial interval
    hasStartedRef.current = false; // Reset started flag
    setState({
      status: 'idle',
      verificationCompleted: false,
      documentsUploaded: [],
      canProcess: false,
    });
  }, [clearPollTimeout, initialPollInterval]);

  // Auto-start polling once when enabled and sessionToken is provided
  useEffect(() => {
    if (
      enabled &&
      sessionToken &&
      state.status === 'idle' &&
      !hasStartedRef.current
    ) {
      hasStartedRef.current = true;
      startPolling();
    }
  }, [enabled, sessionToken, state.status, startPolling]);

  // Separate effect for cleanup
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      clearPollTimeout();
    };
  }, [clearPollTimeout]);

  return {
    ...state,
    startPolling,
    stopPolling,
    resetPolling,
  };
}
