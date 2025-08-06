// Types for the application data models

export interface ContactRecord {
  id: string;
  first?: string;
  last?: string;
  avatar?: string;
  twitter?: string;
  notes?: string;
  favorite?: boolean;
}

export interface NewsRecord {
  id: string;
  title: string;
  content: string;
  author: string;
  publishedAt: string;
  category?: string;
  featured?: boolean;
  isRead?: boolean;
}

// Mock data for contacts
const contacts: ContactRecord[] = [
  {
    id: "1",
    first: "Your",
    last: "Name",
    avatar: "https://placecats.com/200/200",
    twitter: "your_handle",
    notes: "Some notes",
    favorite: true,
  },
  {
    id: "2",
    first: "Your",
    last: "Friend",
    avatar: "https://placecats.com/200/201",
    twitter: "friend_handle",
    notes: "Friend's notes",
    favorite: false,
  },
];

// Mock data for news
let news: NewsRecord[] = [
  {
    id: "1",
    title: "Welcome to Our News Platform",
    content: "This is the first news article on our platform. Stay tuned for more updates!",
    author: "Admin",
    publishedAt: new Date().toISOString(),
    category: "General",
    featured: true,
    isRead: false,
  },
  {
    id: "2",
    title: "Project Update: React Router Migration",
    content: "We've successfully migrated from Remix to React Router v7. This brings improved performance and better developer experience.",
    author: "Development Team",
    publishedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    category: "Development",
    featured: false,
    isRead: false,
  },
];

// Contact functions
export async function getContacts(): Promise<ContactRecord[]> {
  return contacts;
}

export async function getContact(id: string): Promise<ContactRecord | undefined> {
  return contacts.find(contact => contact.id === id);
}

// News functions
export async function getNews(): Promise<NewsRecord[]> {
  return news.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getNewsItem(id: string): Promise<NewsRecord | undefined> {
  return news.find(item => item.id === id);
}

export async function createNews(newsData: Omit<NewsRecord, 'id' | 'publishedAt' | 'isRead'>): Promise<NewsRecord> {
  const newNews: NewsRecord = {
    ...newsData,
    id: String(news.length + 1),
    publishedAt: new Date().toISOString(),
    isRead: false,
  };
  
  news.push(newNews);
  return newNews;
}

export async function markNewsAsRead(id: string): Promise<NewsRecord | undefined> {
  const index = news.findIndex(item => item.id === id);
  if (index === -1) return undefined;
  
  news[index] = { ...news[index], isRead: true };
  return news[index];
}

export async function toggleNewsReadStatus(id: string): Promise<NewsRecord | undefined> {
  const index = news.findIndex(item => item.id === id);
  if (index === -1) return undefined;
  
  news[index] = { ...news[index], isRead: !news[index].isRead };
  return news[index];
}

export async function updateNews(id: string, updates: Partial<Omit<NewsRecord, 'id'>>): Promise<NewsRecord | undefined> {
  const index = news.findIndex(item => item.id === id);
  if (index === -1) return undefined;
  
  news[index] = { ...news[index], ...updates };
  return news[index];
}

export async function deleteNews(id: string): Promise<boolean> {
  const index = news.findIndex(item => item.id === id);
  if (index === -1) return false;
  
  news.splice(index, 1);
  return true;
}
