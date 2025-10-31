import { render } from '@testing-library/react';
import {
  EditabilityProvider,
  useEditability,
} from '@/components/React/Host/EditListing/EditabilityContext';
import type { ListingStatus } from '@/types/host/edit-listing/editListingValues';

function Probe() {
  const { mode, isReadOnly, status } = useEditability();
  return (
    <div>
      <div data-testid="mode">{mode}</div>
      <div data-testid="is-readonly">{isReadOnly ? 'yes' : 'no'}</div>
      <div data-testid="status">{status ?? 'none'}</div>
      <input data-testid="text" readOnly={isReadOnly} defaultValue="hola" />
      <button data-testid="btn" disabled={isReadOnly}>
        Guardar
      </button>
    </div>
  );
}

function renderWithStatus(status?: ListingStatus) {
  return render(
    <EditabilityProvider status={status}>
      <Probe />
    </EditabilityProvider>
  );
}

describe('EditabilityProvider + useEditability', () => {
  it('with provider but without status ⇒ mode edit, isReadOnly=false', () => {
    const { getByTestId } = renderWithStatus(undefined);
    expect(getByTestId('mode').textContent).toBe('edit');
    expect(getByTestId('is-readonly').textContent).toBe('no');
    expect(getByTestId('status').textContent).toBe('none');
    expect(getByTestId('text')).not.toHaveAttribute('readOnly', 'true');
    expect(getByTestId('btn')).not.toBeDisabled();
  });

  it('NO provider ⇒ fallback to readOnly + warns in dev', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const { getByTestId, unmount } = render(<Probe />);

    expect(getByTestId('mode').textContent).toBe('readOnly');
    expect(getByTestId('is-readonly').textContent).toBe('yes');
    expect(getByTestId('status').textContent).toBe('none');
    expect(getByTestId('text')).toHaveAttribute('readOnly');
    expect(getByTestId('btn')).toBeDisabled();

    expect(warnSpy).toHaveBeenCalled();
    expect(
      warnSpy.mock.calls.some(([msg]) =>
        String(msg).includes('EditabilityProvider is missing')
      )
    ).toBe(true);

    warnSpy.mockRestore();
    unmount();
  });

  it('read-only statuses block the UI (readOnly/disabled)', () => {
    for (const s of [
      'APPROVED',
      'IN_PROGRESS',
      'PENDING_APPROVAL',
    ] as ListingStatus[]) {
      const { getByTestId, unmount } = renderWithStatus(s);
      expect(getByTestId('mode').textContent).toBe('readOnly');
      expect(getByTestId('is-readonly').textContent).toBe('yes');
      expect(getByTestId('status').textContent).toBe(s);
      expect(getByTestId('text')).toHaveAttribute('readOnly');
      expect(getByTestId('btn')).toBeDisabled();
      unmount();
    }
  });

  it('editable statuses enable the UI', () => {
    for (const s of [
      'CHANGES_REQUESTED',
      'PUBLISHED',
      'UNLISTED',
    ] as ListingStatus[]) {
      const { getByTestId, unmount } = renderWithStatus(s);
      expect(getByTestId('mode').textContent).toBe('edit');
      expect(getByTestId('is-readonly').textContent).toBe('no');
      expect(getByTestId('status').textContent).toBe(s);
      expect(getByTestId('text')).not.toHaveAttribute('readOnly');
      expect(getByTestId('btn')).not.toBeDisabled();
      unmount();
    }
  });

  it('changing status with rerender updates isReadOnly', () => {
    const { getByTestId, rerender } = renderWithStatus('UNLISTED');
    expect(getByTestId('is-readonly').textContent).toBe('no');
    expect(getByTestId('btn')).not.toBeDisabled();

    rerender(
      <EditabilityProvider status="APPROVED">
        <Probe />
      </EditabilityProvider>
    );
    expect(getByTestId('is-readonly').textContent).toBe('yes');
    expect(getByTestId('btn')).toBeDisabled();
  });
});
