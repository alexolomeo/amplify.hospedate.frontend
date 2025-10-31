import type { Slug } from '@/components/React/Utils/edit-listing/slugs';
import type { UpdateListingEditorPayload } from '@/types/host/edit-listing/updateListingEditorPayload';

export type PatchPayload = UpdateListingEditorPayload;

/** Homogeneous error structure by field within the section */
export type FieldErrors = Record<string, string>;

/** Validation result with strict typing */
export type ValidationResult =
  | { ok: true }
  | { ok: false; errors: FieldErrors };

/** Watchers unsubscription */
export type Unsubscribe = () => void;

/**
 * All editor sections must implement this contract.
 * No network logic here (nor save()) to maintain low coupling.
 */
export interface SectionController {
  /** Identifies the current section (slug) */
  getSlug(): Slug;

  /** Indicates if there are unsaved local changes */
  isDirty(): boolean;

  /** Validates the local form. Must be side-effect-free (does not trigger UI). */
  validate(): ValidationResult;

  /** Builds the minimal PATCH (only the branch of the section) */
  buildPatch(): PatchPayload;

  /** Restores the form to the baseline (serverValues) and clears errors */
  discard(): void;

  /**
   * Allows mapping server errors to the section UI.
   * Maps by field keys compatible with the view.
   */
  applyServerErrors?(errors: FieldErrors): void;

  /**
   * Indicates if this section is saved from the Footer.
   * Expected default: true.
   */
  supportsFooterSave?(): boolean;

  /**
   * Notifies "dirty" changes so the orchestrator/CTA can react.
   * Returns an unsubscribe function.
   */
  watchDirty?(cb: (dirty: boolean) => void): Unsubscribe;

  /**
   * Notifies "validity" changes (true=ok) for reactive CTA.
   * Returns an unsubscribe function.
   */
  watchValidity?(cb: (valid: boolean) => void): Unsubscribe;

  /** Optional custom save hook */
  customSave?(): Promise<void>;
}
