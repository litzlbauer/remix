import { getNews } from '~/data';

import { LoaderFunction, LoaderFunctionArgs } from '@remix-run/node';
import { EventStream } from '@remix-sse/server';

export async function loader({ request }: LoaderFunctionArgs) {
  let news = await getNews();
  
  // Return the EventStream from your route loader
  return new EventStream(request, (send) => {
    let lastPublishedAt = news.length > 0 ? news[0].publishedAt : null;

    const interval = setInterval(async () => {
      news = await getNews();
      let publishedAt = news.length > 0 ?news[0].publishedAt : null;

      if (lastPublishedAt && publishedAt && lastPublishedAt < publishedAt) {
        lastPublishedAt = publishedAt;
        send(JSON.stringify( news[0] ))
      }
    }, 1000)


    return () => {
      // Return a cleanup function
      clearInterval(interval)
    };
  });
};