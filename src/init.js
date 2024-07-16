import * as yup from 'yup';
import 'bootstrap';
import i18next from 'i18next';
import { state, watchedState } from './view.js';
import { parseRss, checkNewPosts } from './parserss.js';
import ru from './ru.js';

const validateUrl = (url, i18nextInstance) => {
  const schema = yup.string().url(`${i18nextInstance.t('errors.url.invalid')}`).required(`${i18nextInstance.t('errors.url.required')}`);

  return schema.validate(url)
    .then(() => url)
    .catch((error) => Promise.reject(error));
};

const isDuplicate = (feeds, newUrl, i18nextInstance) => (feeds.some((feed) => feed.url === newUrl) ? Promise.reject(new Error(`${i18nextInstance.t('errors.url.already_exists')}`)) : Promise.resolve(newUrl));

const checkUrlAccessibility = (url, i18nextInstance) => fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`${i18nextInstance.t('errors.url.unavailable')}`);
    }
    return url;
  })
  .catch(() => {
    throw new Error(`${i18nextInstance.t('errors.url.unavailable')}`);
  });

const refreshStateWithNewRss = (newFeed) => {
  const newState = {
    feeds: [...state.feeds, newFeed],
    form: {
      valid: true,
      error: null,
      success: true,
      isProcessing: false,
    },
  };
  Object.assign(watchedState, newState);

  if (!state.isUpdating) {
    state.isUpdating = true;
    checkNewPosts();
  }
};

const validate = (i18nextInstance) => {
  const form = document.querySelector('.rss-form');
  const urlInput = document.querySelector('#url-input');

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const url = urlInput.value.trim();

    if (watchedState.form.isProcessing) {
      return;
    }
    watchedState.form.isProcessing = true;

    validateUrl(url, i18nextInstance)
      .then((validatedUrl) => isDuplicate(state.feeds, validatedUrl, i18nextInstance))
      .then((validUniqueUrl) => checkUrlAccessibility(validUniqueUrl, i18nextInstance))
      .then((rssData) => parseRss(rssData))
      .then((rssParsed) => {
        const newFeed = rssParsed;
        refreshStateWithNewRss(newFeed);

        form.reset();
        urlInput.focus();
      })
      .catch((error) => {
        watchedState.form = { valid: false, error: error.message, success: false };
      });
  });
};

const runApp = () => {
  const i18nextInstance = i18next.createInstance();

  i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  }).then(() => {
    state.i18nextInstance = i18nextInstance;
    validate(i18nextInstance);
  }).catch((error) => {
    console.error(`Failed to initialize i18next instance: ${error}`);
  });
};

export default runApp;
