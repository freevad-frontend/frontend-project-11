import { state, watchedState } from './view.js';

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
    description: item.querySelector('description').textContent,
    link: item.querySelector('link').textContent,
  }));
  return {
    url, title, description, posts,
  };
};

export const parseRss = (url) => fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`${state.i18nextInstance.t('errors.url.unavailable')}`);
    }
    return response.json();
  })
  .then((data) => parseXML(data.contents, url));

export const checkNewPosts = () => {
  const fetchPromises = watchedState.feeds.map((feed) => parseRss(feed.url)
    .then((rssData) => {
      const existingPostLinks = new Set(feed.posts.map((post) => post.link));
      const newPosts = rssData.posts.filter((post) => !existingPostLinks.has(post.link));

      if (newPosts.length > 0) {
        const updatedFeed = { ...feed, posts: [...newPosts, ...feed.posts] };
        Object.assign(feed, updatedFeed);
      }
    })
    .catch((error) => {
      console.error(`${state.i18nextInstance.t('errors.rss.receipt')}: ${feed.url}. ${state.i18nextInstance.t('errors.rss.error')}: ${error.message}`);
    }));

  Promise.all(fetchPromises).then(() => {
    if (state.feeds.length > 0) {
      setTimeout(() => {
        checkNewPosts();
      }, 5000);
    } else {
      state.isUpdating = false;
    }
  });
};
