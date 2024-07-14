const parseRss = (url) => {
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;

  return fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Ошибка сети: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.status !== 'ok') {
        throw new Error('Ошибка парсинга RSS');
      }

      const feed = data.feed.title;
      const posts = data.items;
      const rssParsed = { url, feed, posts };
      return rssParsed;
    })
    .catch((error) => {
      throw new Error(`Ошибка получения RSS: ${error.message}`);
    });
};

export default parseRss;
