import * as yup from 'yup';
import 'bootstrap';
import i18next from 'i18next';
import { state, watchedState } from './view.js';
import parseRss from './parserss.js';
import ru from './ru.js';

const validate = (i18nextInstance) => {
  const form = document.querySelector('.rss-form');
  const urlInput = document.querySelector('#url-input');

  const schema = yup.string().url(`${i18nextInstance.t('errors.url.invalid')}`).required(`${i18nextInstance.t('errors.url.required')}`);

  const isDuplicate = (feeds, newUrl) => (feeds.some((feed) => feed.url === newUrl) ? Promise.reject(new Error(`${i18nextInstance.t('errors.url.already_exists')}`)) : Promise.resolve(newUrl));

  const validateUrl = (url) => schema.validate(url)
    .then(() => url)
    .catch((error) => Promise.reject(error));

  const checkUrlAccessibility = (url) => fetch(url, { method: 'HEAD', mode: 'no-cors' })
    .then((response) => {
      if (response.ok || response.type === 'opaque') {
        return url;
      }
      throw new Error(`${i18nextInstance.t('errors.url.unavailable')}`);
    })
    .catch(() => {
      throw new Error(`${i18nextInstance.t('errors.url.unavailable')}`);
    });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const url = urlInput.value.trim();

    if (watchedState.form.isProcessing) {
      return;
    }
    watchedState.form.isProcessing = true;

    validateUrl(url)
      .then((validatedUrl) => isDuplicate(state.feeds, validatedUrl))
      .then((validUniqueUrl) => checkUrlAccessibility(validUniqueUrl))
      .then((rssData) => parseRss(rssData))
      .then((rssParsed) => {
        const newFeed = rssParsed;
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
