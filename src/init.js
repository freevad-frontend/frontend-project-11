import * as yup from 'yup';
import 'bootstrap';
import { state, watchedState } from './view.js';
import parseRss from './parserss.js';

const validate = () => {
  const form = document.querySelector('.rss-form');
  const urlInput = document.querySelector('#url-input');

  const schema = yup.string().url('Неправильный URL').required('URL обязателен');

  const isDuplicate = (feeds, newUrl) => (feeds.some((feed) => feed.url === newUrl) ? Promise.reject(new Error('URL уже существует')) : Promise.resolve(newUrl));

  const validateUrl = (url) => schema.validate(url)
    .then(() => url)
    .catch((error) => Promise.reject(error));

  const checkUrlAccessibility = (url) => fetch(url, { method: 'HEAD', mode: 'no-cors' })
    .then((response) => {
      if (response.ok || response.type === 'opaque') {
        return url;
      }
      throw new Error('URL недоступен');
    })
    .catch(() => {
      throw new Error('URL недоступен');
    });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const url = urlInput.value.trim();

    validateUrl(url)
      .then((validatedUrl) => isDuplicate(state.feeds, validatedUrl))
      .then((validUniqueUrl) => checkUrlAccessibility(validUniqueUrl))
      .then((rssData) => parseRss(rssData))
      .then((rssParsed) => {
        const newFeed = rssParsed;
        watchedState.feeds = [...state.feeds, newFeed];
        form.reset();
        urlInput.focus();
        watchedState.form = { valid: true, error: null, success: true };
      })
      .catch((error) => {
        watchedState.form = { valid: false, error: error.message, success: false };
      });
  });
};

export default validate;
