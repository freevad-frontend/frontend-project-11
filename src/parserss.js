import { watchedState } from './view.js';
import checkAndFetchUrl from './fetchurl.js';

export const parseRss = (xmlString, url) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
  const parseError = xmlDoc.querySelector('parsererror');
  if (parseError) {
    throw new Error(`${watchedState.i18nextInstance.t('errors.rss.parsing')}`);
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

const timeIntervalUpdateRss = 5000;

export const checkNewPosts = () => {
  const fetchPromises = watchedState.feeds.map(
    (feed) => checkAndFetchUrl(feed.url, watchedState.i18nextInstance)
      .then((rssData) => parseRss(rssData.contents, feed.url))
      .then((rssParsed) => {
        const existingPostLinks = new Set(feed.posts.map((post) => post.link));
        const newPosts = rssParsed.posts.filter((post) => !existingPostLinks.has(post.link));

        if (newPosts.length > 0) {
          const updatedFeed = { ...feed, posts: [...newPosts, ...feed.posts] };
          Object.assign(feed, updatedFeed);
        }
      })
      .catch((error) => {
        console.error(`${watchedState.i18nextInstance.t('errors.rss.receipt')}: ${feed.url}. ${watchedState.i18nextInstance.t('errors.rss.error')}: ${error.message}`);
      }),
  );

  Promise.all(fetchPromises).then(() => {
    if (watchedState.feeds.length > 0) {
      setTimeout(() => {
        checkNewPosts();
      }, timeIntervalUpdateRss);
    } else {
      watchedState.isUpdating = false;
    }
  });
};
