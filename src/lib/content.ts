import { getCollection } from 'astro:content';
export const getNews = async () =>
  (await getCollection('news', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
export const getProjects = async () =>
  await getCollection('projects', ({ data }) => !data.draft);
export const readingTime = (body = '') =>
  Math.max(1, Math.ceil(body.trim().split(/\s+/).length / 200));
export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(date);
