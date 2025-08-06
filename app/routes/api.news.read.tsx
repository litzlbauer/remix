import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { markNewsAsRead, toggleNewsReadStatus } from "~/data";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const newsId = formData.get("newsId")?.toString();
  const action = formData.get("action")?.toString();

  if (!newsId) {
    return json({ success: false, error: "News ID is required" }, 400);
  }

  try {
    let updatedNews;
    
    if (action === "mark-read") {
      updatedNews = await markNewsAsRead(newsId);
    } else if (action === "toggle-read") {
      updatedNews = await toggleNewsReadStatus(newsId);
    } else {
      return json({ success: false, error: "Invalid action" }, 400);
    }

    if (!updatedNews) {
      return json({ success: false, error: "News article not found" }, 404);
    }

    return json({ success: true, news: updatedNews }, 200);
  } catch (error) {
    return json({ success: false, error: "Failed to update news" }, 500);
  }
};
