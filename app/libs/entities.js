async function fetchDataWithDynamicRateLimit(urls, maxConcurrentRequests) {
  const queue = [];
  const inProgress = 0;

  const fetchWithDelay = async (url) => {
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 / maxConcurrentRequests)
    );
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };

  const enqueue = (url) => {
    return new Promise((resolve) => {
      const handle = setTimeout(() => {
        queue.push(fetchWithDelay(url));
        resolve();
      }, 0);

      queue.push(() => clearTimeout(handle));
    });
  };

  const promises = urls.map((url) => enqueue(url));
  const results = await Promise.all(promises);

  return results;
}
