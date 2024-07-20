const createModalButton = (text, classes, dataset, ariaLabel) => {
  const modalButton = document.createElement('button');
  modalButton.type = 'button';
  modalButton.classList.add(...classes);
  modalButton.dataset.bsDismiss = dataset;
  modalButton.ariaLabel = ariaLabel;
  modalButton.textContent = text;
  return modalButton;
};

const createModalHeader = () => {
  const modalHeader = document.createElement('div');
  modalHeader.classList.add('modal-header', 'align-items-start');

  const modalTitle = document.createElement('h5');
  modalTitle.classList.add('modal-title');
  modalTitle.id = 'postModalLabel';

  const modalCloseButton = createModalButton('', ['btn-close'], 'modal', 'Close');

  modalHeader.appendChild(modalTitle);
  modalHeader.appendChild(modalCloseButton);

  return modalHeader;
};

const createModalBody = () => {
  const modalBody = document.createElement('div');
  modalBody.classList.add('modal-body');

  return modalBody;
};

const createModalFooter = (state) => {
  const modalGoButton = createModalButton(state.i18nextInstance.t('buttons.read'), ['btn', 'btn-primary'], '', '');

  const modalCloseButtonButtom = createModalButton(state.i18nextInstance.t('buttons.close'), ['btn', 'btn-secondary'], 'modal', '');

  const modalFooter = document.createElement('div');
  modalFooter.classList.add('modal-footer');
  modalFooter.appendChild(modalGoButton);
  modalFooter.appendChild(modalCloseButtonButtom);

  return modalFooter;
};

const createModal = (state) => {
  const modal = document.createElement('div');
  modal.classList.add('modal', 'fade');
  modal.id = 'postModal';
  modal.tabIndex = -1;
  modal.role = 'dialog';

  const modalDialog = document.createElement('div');
  modalDialog.classList.add('modal-dialog');
  modalDialog.role = 'document';

  const modalHeader = createModalHeader();

  const modalBody = createModalBody();

  const modalFooter = createModalFooter(state);

  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  modalContent.appendChild(modalFooter);

  modalDialog.appendChild(modalContent);
  modal.appendChild(modalDialog);

  document.body.appendChild(modal);

  return modal;
};

export default createModal;
