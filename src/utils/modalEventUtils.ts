interface ModalEventDetail {
  id?: string;
}
export const openAppModal = (id: string) => {
  window.dispatchEvent(
    new CustomEvent<ModalEventDetail>('openAppModal', {
      detail: { id },
    })
  );
};

export const closeAppModal = (id?: string) => {
  window.dispatchEvent(
    new CustomEvent<ModalEventDetail>('closeAppModal', {
      detail: { id },
    })
  );
};
