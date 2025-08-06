import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link, Form, redirect } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";

import { getNewsItem, markNewsAsRead, toggleNewsReadStatus } from "~/data";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.news ? `${data.news.title} - News` : "News Article Not Found" },
    { name: "description", content: data?.news?.content.substring(0, 160) + "..." || "News article" },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const newsId = params.newsId;
  
  if (!newsId) {
    throw new Response("News ID is required", { status: 400 });
  }

  const news = await getNewsItem(newsId);

  if (!news) {
    throw new Response("News article not found", { status: 404 });
  }

  // Automatically mark as read when viewing
  if (!news.isRead) {
    await markNewsAsRead(newsId);
  }

  return json({ news: { ...news, isRead: true } });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const newsId = params.newsId;
  
  if (!newsId) {
    throw new Response("News ID is required", { status: 400 });
  }

  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "toggle-read") {
    console.log(`Toggling read status for news ID: ${newsId}`);
    const updatedNews = await toggleNewsReadStatus(newsId);
    if (!updatedNews) {
      throw new Response("News article not found", { status: 404 });
    }
    //return json({ news: updatedNews });
    return redirect('/news');
  }

  return json({ news: null });
}


export default function NewsDetail() {
  const { news } = useLoaderData<typeof loader>();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <nav className="mb-6">
        <Link
          to="/news"
          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
        >
          ← Back to News
        </Link>
      </nav>

      <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <header className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex gap-2 mb-3">
                {news.featured && (
                  <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium px-3 py-1 rounded-full">
                    Featured Article
                  </span>
                )}
                {news.isRead && (
                  <span className="inline-block bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm font-medium px-3 py-1 rounded-full">
                    ✓ Read
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                {news.title}
              </h1>
            </div>
            {news.category && (
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm px-3 py-1 rounded-full ml-4">
                {news.category}
              </span>
            )}
          </div>

          <div className="flex items-center text-gray-600 dark:text-gray-400 space-x-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span>By {news.author}</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span>
                {new Date(news.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </header>

        <div className="prose prose-lg max-w-none dark:prose-invert">
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
            {news.content}
          </div>
        </div>

        <footer className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Article ID: {news.id}
            </div>
            <div className="flex space-x-4">
              <Form method="post">
                <input type="hidden" name="intent" value="toggle-read" />
                <button
                  type="submit"
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    news.isRead
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      : "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800"
                  }`}
                >
                  {news.isRead ? "Mark as Unread" : "Mark as Read"}
                </button>
              </Form>
              <button
                onClick={() => navigator.share?.({ 
                  title: news.title, 
                  text: news.content.substring(0, 160) + "...",
                  url: window.location.href 
                }) || navigator.clipboard?.writeText(window.location.href)}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Share
              </button>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
}
