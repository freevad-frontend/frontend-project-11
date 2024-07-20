import * as bootstrap from 'bootstrap';

const showModal = (title, description, link) => {
  const modal = document.querySelector('#postModal');
  const modalTitle = modal.querySelector('.modal-title');
  const modalBody = modal.querySelector('.modal-body');
  const modalGoButton = modal.querySelector('.btn-primary');

  modalTitle.textContent = title;
  modalBody.textContent = description;

  const bootstrapModal = new bootstrap.Modal(modal);

  modalGoButton.onclick = () => {
    window.open(link, '_blank');
    bootstrapModal.hide();
  };

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

const createLink = (state, item) => {
  const postClass = state.readPosts.has(item.link) ? 'fw-normal' : 'fw-bold';

  const link = document.createElement('a');
  link.href = item.link;
  link.textContent = item.title;
  link.classList.add(postClass);
  link.target = '_blank';
  link.dataset.postId = item.link;

  return link;
};

const createPostList = (state) => {
  const postsList = document.createElement('ul');
  postsList.classList.add('list-group', 'border-0', 'rounded-0');

  state.feeds.forEach(({ posts }) => {
    posts.forEach((item) => {
      const listItem = document.createElement('li');
      listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

      const link = createLink(state, item);

      const previewButton = document.createElement('button');
      previewButton.textContent = state.i18nextInstance?.t('buttons.view');
      previewButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      previewButton.dataset.id = item.link;
      previewButton.addEventListener('click', () => {
        state.readPosts.add(item.link);
        showModal(item.title, item.description, link);
      });

      listItem.appendChild(link);
      listItem.appendChild(previewButton);
      postsList.appendChild(listItem);
    });
  });

  return postsList;
};

const createCardAndFeed = (state, feedsContainer, postsContainer) => {
  const feedsCard = createCard(state.i18nextInstance?.t('rss.feeds') || 'Feeds');
  const feedsList = createFeedList(state);

  feedsCard.appendChild(feedsList);
  feedsContainer.appendChild(feedsCard);

  const modal = document.querySelector('#postModal');

  const postsCard = createCard(state.i18nextInstance?.t('rss.posts') || 'Posts');
  const postsList = createPostList(state, modal, state);

  postsCard.appendChild(postsList);
  postsContainer.appendChild(postsCard);
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
    feedbackEl.textContent = `${state.i18nextInstance.t('rss.loaded')}`;
    feedbackEl.classList.remove('text-danger');
    feedbackEl.classList.add('text-success');
  }

  const feedsContainer = document.querySelector('.feeds');
  const postsContainer = document.querySelector('.posts');

  feedsContainer.innerHTML = '';
  postsContainer.innerHTML = '';

  if (state.feeds.length > 0) {
    createCardAndFeed(state, feedsContainer, postsContainer);
  }
};

export default render;
