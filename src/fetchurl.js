const checkAndFetchUrl = (url, i18nextInstance) => fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`${i18nextInstance.t('errors.url.unavailable')}`);
    }
    return response.json();
  })
  .catch(() => {
    throw new Error(`${i18nextInstance.t('errors.url.unavailable')}`);
  });

export default checkAndFetchUrl;
