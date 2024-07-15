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
    feedbackEl.textContent = 'RSS успешно загружен';
    feedbackEl.classList.remove('text-danger');
    feedbackEl.classList.add('text-success');
  }

  const feedsContainer = document.querySelector('.feeds');
  const postsContainer = document.querySelector('.posts');

  feedsContainer.innerHTML = '';
  postsContainer.innerHTML = '';

  const feedsCard = document.createElement('div');
  feedsCard.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = 'Фиды';

  cardBody.appendChild(cardTitle);
  feedsCard.appendChild(cardBody);

  const feedsList = document.createElement('ul');
  feedsList.classList.add('list-group', 'border-0', 'rounded-0');

  state.feeds.forEach(({ feed, description }) => {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item', 'border-0', 'border-end-0');

    const feedTitle = document.createElement('h3');
    feedTitle.classList.add('h6', 'm-0');
    feedTitle.textContent = feed;

    const feedDescription = document.createElement('p');
    feedDescription.classList.add('m-0', 'small', 'text-black-50');
    feedDescription.textContent = description;

    listItem.appendChild(feedTitle);
    listItem.appendChild(feedDescription);
    feedsList.appendChild(listItem);
  });

  feedsCard.appendChild(feedsList);
  feedsContainer.appendChild(feedsCard);

  const postsCard = document.createElement('div');
  postsCard.classList.add('card', 'border-0');

  const cardBodyPost = document.createElement('div');
  cardBodyPost.classList.add('card-body');

  const cardTitlePost = document.createElement('h2');
  cardTitlePost.classList.add('card-title', 'h4');
  cardTitlePost.textContent = 'Посты';

  cardBodyPost.appendChild(cardTitlePost);
  postsCard.appendChild(cardBodyPost);

  postsContainer.appendChild(postsCard);

  const postsList = document.createElement('ul');
  postsList.classList.add('list-group', 'border-0', 'rounded-0');

  state.feeds.forEach(({ posts }) => {
    posts.forEach((item) => {
      const listItem = document.createElement('li');
      listItem.classList.add('list-group-item', 'border-0', 'border-end-0');

      const link = document.createElement('a');
      link.href = item.link;
      link.textContent = item.title;
      link.target = '_blank';

      listItem.appendChild(link);
      postsList.appendChild(listItem);
    });
  });

  postsContainer.appendChild(postsList);
};

export default render;
