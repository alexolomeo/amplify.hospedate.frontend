export const openLoginModal = () => {
  const modalId = 'modal-login';
  const modal = document.getElementById(modalId) as HTMLDialogElement;

  if (modal) {
    modal.showModal();
  } else {
    console.error(`[ModalHelper] Could not find the modal with ID: ${modalId}`);
  }
};
