import { state } from './view.js';

const parseXML = (xmlString, url) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
  const parseError = xmlDoc.querySelector('parsererror');
  if (parseError) {
    throw new Error(`${state.i18nextInstance.t('errors.rss.parsing')}`);
  }
  const title = xmlDoc.querySelector('channel > title').textContent;
  const description = xmlDoc.querySelector('channel > description').textContent;
  const items = xmlDoc.querySelectorAll('item');
  const posts = Array.from(items).map((item) => ({
    title: item.querySelector('title').textContent,
    link: item.querySelector('link').textContent,
  }));
  return {
    url, title, description, posts,
  };
};

const parseRss = (url) => fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`${state.i18nextInstance.t('errors.url.unavailable')}`);
    }
    return response.json();
  })
  .then((data) => parseXML(data.contents, url));

export default parseRss;
