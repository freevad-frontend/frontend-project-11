import * as bootstrap from 'bootstrap';

const createModal = () => {
  const modal = document.createElement('div');
  modal.classList.add('modal', 'fade');
  modal.id = 'postModal';
  modal.tabIndex = -1;
  modal.role = 'dialog';

  const modalDialog = document.createElement('div');
  modalDialog.classList.add('modal-dialog');
  modalDialog.role = 'document';

  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');

  const modalHeader = document.createElement('div');
  modalHeader.classList.add('modal-header');

  const modalTitle = document.createElement('h5');
  modalTitle.classList.add('modal-title');
  modalTitle.id = 'postModalLabel';

  const modalCloseButton = document.createElement('button');
  modalCloseButton.type = 'button';
  modalCloseButton.classList.add('btn-close');
  modalCloseButton.dataset.bsDismiss = 'modal';
  modalCloseButton.ariaLabel = 'Close';

  modalHeader.appendChild(modalTitle);
  modalHeader.appendChild(modalCloseButton);

  const modalBody = document.createElement('div');
  modalBody.classList.add('modal-body');

  const modalGoButton = document.createElement('button');
  modalGoButton.type = 'button';
  modalGoButton.classList.add('btn');
  modalGoButton.classList.add('btn-primary');
  modalGoButton.textContent = 'Читать полностью';

  const modalCloseButtonButtom = document.createElement('button');
  modalCloseButtonButtom.type = 'button';
  modalCloseButtonButtom.classList.add('btn');
  modalCloseButtonButtom.classList.add('btn-secondary');
  modalCloseButtonButtom.textContent = 'Закрыть';

  const modalFooter = document.createElement('div');
  modalFooter.classList.add('modal-footer');
  modalFooter.appendChild(modalGoButton);
  modalFooter.appendChild(modalCloseButtonButtom);

  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  modalContent.appendChild(modalFooter);
  modalDialog.appendChild(modalContent);
  modal.appendChild(modalDialog);

  document.body.appendChild(modal);

  return modal;
};

const showModal = (title, description) => {
  const modal = document.querySelector('#postModal');
  const modalTitle = modal.querySelector('.modal-title');
  const modalBody = modal.querySelector('.modal-body');

  modalTitle.textContent = title;
  modalBody.textContent = description;

  const bootstrapModal = new bootstrap.Modal(modal);
  bootstrapModal.show();
};

const createCard = (title) => {
  const feedsCard = document.createElement('div');
  feedsCard.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = title;

  cardBody.appendChild(cardTitle);
  feedsCard.appendChild(cardBody);

  return feedsCard;
};

const createFeedList = (state) => {
  const feedsList = document.createElement('ul');
  feedsList.classList.add('list-group', 'border-0', 'rounded-0');

  state.feeds.forEach(({ title, description }) => {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item', 'border-0', 'border-end-0');

    const feedTitle = document.createElement('h3');
    feedTitle.classList.add('h6', 'm-0');
    feedTitle.textContent = title;

    const feedDescription = document.createElement('p');
    feedDescription.classList.add('m-0', 'small', 'text-black-50');
    feedDescription.textContent = description;

    listItem.appendChild(feedTitle);
    listItem.appendChild(feedDescription);
    feedsList.appendChild(listItem);
  });

  return feedsList;
};

const createPostList = (state) => {
  const postsList = document.createElement('ul');
  postsList.classList.add('list-group', 'border-0', 'rounded-0');

  state.feeds.forEach(({ posts }) => {
    posts.forEach((item) => {
      const listItem = document.createElement('li');
      listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      const postClass = state.readPosts.has(item.link) ? 'fw-normal' : 'fw-bold';

      const link = document.createElement('a');
      link.href = item.link;
      link.textContent = item.title;
      link.classList.add(postClass);
      link.target = '_blank';
      link.dataset.postId = item.link;

      const previewButton = document.createElement('button');
      previewButton.textContent = 'Просмотр';
      previewButton.classList.add('btn', 'btn-primary', 'btn-sm');
      previewButton.dataset.id = item.link;
      previewButton.addEventListener('click', () => {
        state.readPosts.add(item.link);
        showModal(item.title, item.description);
      });

      listItem.appendChild(link);
      listItem.appendChild(previewButton);
      postsList.appendChild(listItem);
    });
  });

  return postsList;
};

const render = (state) => {
  const urlInput = document.querySelector('#url-input');
  const feedbackEl = document.querySelector('.feedback');

  if (state.form.valid) {
    urlInput.classList.remove('is-invalid');
  } else {
    urlInput.classList.add('is-invalid');
  }

  if (state.form.error) {
    feedbackEl.textContent = state.form.error;
    feedbackEl.classList.remove('text-success');
    feedbackEl.classList.add('text-danger');
  } else if (state.form.success) {
    feedbackEl.textContent = state.form.success;
    feedbackEl.classList.remove('text-danger');
    feedbackEl.classList.add('text-success');
  }

  const feedsContainer = document.querySelector('.feeds');
  const postsContainer = document.querySelector('.posts');

  feedsContainer.innerHTML = '';
  postsContainer.innerHTML = '';

  if (state.feeds.length > 0) {
    const feedsCard = createCard(state.i18nextInstance?.t('rss.feeds') || 'Feeds');
    const feedsList = createFeedList(state);

    feedsCard.appendChild(feedsList);
    feedsContainer.appendChild(feedsCard);

    const postsCard = createCard(state.i18nextInstance?.t('rss.posts') || 'Posts');
    const modal = createModal();
    const postsList = createPostList(state, modal, state);

    postsCard.appendChild(postsList);
    postsContainer.appendChild(postsCard);
  }
};

export default render;
