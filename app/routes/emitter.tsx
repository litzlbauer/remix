import { LoaderFunction, LoaderFunctionArgs } from '@remix-run/node';
import { EventStream } from '@remix-sse/server'
import { getNews } from '~/data';



export async function loader({ request }: LoaderFunctionArgs) {
  let news = await getNews();
  
  // Return the EventStream from your route loader
  return new EventStream(request, (send) => {
    // In the init function, setup your SSE Event source
    // This can be any asynchronous data source, that will send
    // events to the client periodically

    // Here we will just use a `setInterval`

    ;
    let count = news.length;

    const interval = setInterval(async () => {
      news = await getNews();

      if (news.length !== count) {
        count = news.length;
        // You can send events to the client via the `send` function
        send(JSON.stringify({ hello: 'world + ' + count}))
      }
    }, 1000)


    return () => {
      // Return a cleanup function
      clearInterval(interval)
    };
  });
};