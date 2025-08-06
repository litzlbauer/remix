import { json, redirect, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";

import { createNews } from "~/data";

export const meta: MetaFunction = () => {
  return [
    { title: "Add News - Create New Article" },
    { name: "description", content: "Create a new news article." },
  ];
};

type ActionData = {
  errors: {
    title?: string;
    content?: string;
    author?: string;
    general?: string;
  };
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  
  const title = formData.get("title")?.toString();
  const content = formData.get("content")?.toString();
  const author = formData.get("author")?.toString();
  const category = formData.get("category")?.toString();
  const featured = formData.get("featured") === "on";

  // Validation
  const errors: { [key: string]: string } = {};
  
  if (!title || title.trim().length === 0) {
    errors.title = "Title is required";
  }
  
  if (!content || content.trim().length === 0) {
    errors.content = "Content is required";
  }
  
  if (!author || author.trim().length === 0) {
    errors.author = "Author is required";
  }

  if (Object.keys(errors).length > 0) {
    return json({ errors }, { status: 400 });
  }

  try {
    await createNews({
      title: title!,
      content: content!,
      author: author!,
      category: category || undefined,
      featured,
    });

    return redirect("/news");
  } catch (error) {
    return json(
      { errors: { general: "Failed to create news article" } },
      { status: 500 }
    );
  }
}

export default function NewNews() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        Create New Article
      </h1>

      <Form method="post" className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
            placeholder="Enter article title"
          />
          {actionData?.errors?.title && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {actionData.errors.title}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="author"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Author *
          </label>
          <input
            type="text"
            id="author"
            name="author"
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
            placeholder="Enter author name"
          />
          {actionData?.errors?.author && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {actionData.errors.author}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="">Select a category</option>
            <option value="General">General</option>
            <option value="Development">Development</option>
            <option value="Business">Business</option>
            <option value="Technology">Technology</option>
            <option value="Announcement">Announcement</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Content *
          </label>
          <textarea
            id="content"
            name="content"
            required
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100"
            placeholder="Write your article content here..."
          />
          {actionData?.errors?.content && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {actionData.errors.content}
            </p>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="featured"
            className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
          >
            Mark as featured article
          </label>
        </div>

        {actionData?.errors?.general && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-sm text-red-600 dark:text-red-400">
              {actionData.errors.general}
            </p>
          </div>
        )}

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md font-medium transition-colors"
          >
            {isSubmitting ? "Creating..." : "Create Article"}
          </button>
        </div>
      </Form>
    </div>
  );
}
