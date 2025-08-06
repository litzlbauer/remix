import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link, Outlet } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";

import { getNews } from "~/data";

export const meta: MetaFunction = () => {
  return [
    { title: "News - Stay Updated" },
    { name: "description", content: "Latest news and updates from our platform." },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const news = await getNews();
  return json({ news });
}

export default function NewsIndex() {
  const { news } = useLoaderData<typeof loader>();
  
  const unreadCount = news.filter(article => !article.isRead).length;
  const readCount = news.filter(article => article.isRead).length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Latest News
        </h1>
        <Link
          to="/news/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Add News
        </Link>
      </div>

      {/* Stats section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{news.length}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Articles</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{unreadCount}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Unread</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{readCount}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Read</div>
        </div>
      </div>

      {news.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
            No news articles yet.
          </p>
          <Link
            to="/news/new"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Create the first article
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {news.map((article) => (
            <article
              key={article.id}
              className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-l-4 relative ${
                article.featured
                  ? "border-blue-500"
                  : "border-gray-300 dark:border-gray-600"
              } ${
                article.isRead 
                  ? "opacity-75" 
                  : ""
              }`}
            >
              {!article.isRead && (
                <div className="absolute top-4 right-4">
                  <span className="w-3 h-3 bg-blue-500 rounded-full inline-block"></span>
                </div>
              )}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className={`text-xl font-semibold ${article.isRead ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
                      <Link
                        to={`/news/${article.id}`}
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {article.title}
                      </Link>
                    </h2>
                    {article.isRead && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        Read
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {article.featured && (
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
                {article.category && (
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm px-3 py-1 rounded-full">
                    {article.category}
                  </span>
                )}
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                {article.content}
              </p>

              {article.coords && (
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>
                    {article.coords.address || `${article.coords.latitude.toFixed(4)}, ${article.coords.longitude.toFixed(4)}`}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-4">
                  <span>By {article.author}</span>
                  <span>
                    {new Date(article.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <Link
                  to={`/news/${article.id}`}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  Read more →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      <Outlet />
    </div>
  );
}
