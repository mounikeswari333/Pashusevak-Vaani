import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { LanguageProvider, useLanguage } from '../context/LanguageContext';
import useTranslate from '../hooks/useTranslate';
import { TopBar, Nav } from '../components/TopNav';

export const Route = createFileRoute('/news')({
  head: () => ({
    meta: [
      { title: 'Latest News - PashuSevak Vaani' },
      {
        name: 'description',
        content: 'Read all accepted animal husbandry news from PashuSevak Vaani.',
      },
    ],
  }),
  component: AllNewsPage,
});

type NewsArticle = {
  id: number;
  headline: string;
  subheading?: string;
  byline?: string;
  body: string;
  category?: string;
  location?: string;
  poster_url?: string;
  created_at?: string;
};

function AllNewsPage() {
  const t = useTranslate();
  const { language } = useLanguage();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const apiBase = import.meta.env.VITE_API_BASE || '';
  const newsArticles = articles.filter((article) => article.category?.toLowerCase() === 'news');

  useEffect(() => {
    fetch(`${apiBase}/api/news/public?lang=${language}`)
      .then((response) => {
        if (!response.ok) throw new Error('Failed to load news');
        return response.json();
      })
      .then((data) => setArticles(Array.isArray(data.rows) ? data.rows : []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [apiBase, language]);

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#F8C21B] text-[#2f1f0e]">
        <TopBar />
        <Nav />
        <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5 border-b-2 border-[#6F450E] pb-6">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-[#9DBB0B] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#6F450E]">
                <span className="h-2 w-2 rounded-full bg-[#F8C21B]" />
                {t('Latest bulletins')}
              </p>
              <h1 className="mt-3 font-serif text-4xl leading-tight text-[#6F450E] md:text-6xl">
                {t('All news')}
              </h1>
              <p className="mt-3 max-w-2xl text-base text-[#2f1f0ecc]">
                {t('Complete reporting from the field and the ministry.')}
              </p>
            </div>
            <Link
              to="/"
              className="rounded-full bg-[#9DBB0B] px-5 py-3 text-sm font-semibold text-[#6F450E] transition hover:bg-[#8EB107]"
            >
              {t('Back to homepage')}
            </Link>
          </div>

          {loading ? (
            <p className="py-12 text-center text-[#6F450E]">{t('Loading news...')}</p>
          ) : error ? (
            <p className="rounded-xl border border-[#6F450E] bg-[#fffbe4] p-6 text-[#6F450E]">
              {t('Unable to load news right now.')}
            </p>
          ) : newsArticles.length === 0 ? (
            <p className="rounded-xl border border-[#6F450E] bg-[#fffbe4] p-6 text-[#6F450E]">
              {t('No accepted news is available yet.')}
            </p>
          ) : (
            <div className="space-y-8">
              {newsArticles.map((article) => (
                <article
                  key={article.id}
                  className="overflow-hidden rounded-2xl border border-[#6F450E] bg-[#fffbe4] shadow-sm"
                >
                  {article.poster_url ? (
                    <img
                      src={article.poster_url}
                      alt={article.headline}
                      className="h-auto w-full object-cover object-center"
                    />
                  ) : (
                    <div className="flex min-h-72 items-center justify-center bg-[#9DBB0B] px-8 text-center font-serif text-2xl text-[#6F450E]">
                      {t(article.category || 'News')}
                    </div>
                  )}
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.2em] text-[#6F450E]/70">
                      <span className="rounded-full bg-[#9DBB0B] px-3 py-1 font-bold text-[#6F450E]">
                        {t(article.category || 'News')}
                      </span>
                      <span>
                        {article.created_at
                          ? new Date(article.created_at).toLocaleDateString()
                          : t('Today')}
                      </span>
                    </div>
                    <h2 className="mt-4 font-serif text-3xl leading-tight text-[#6F450E] md:text-5xl">
                      {t(article.headline)}
                    </h2>
                    {article.subheading ? (
                      <p className="mt-4 font-serif text-xl leading-snug text-[#6F450E] md:text-2xl">
                        {t(article.subheading)}
                      </p>
                    ) : null}
                    {article.byline ? (
                      <p className="mt-4 text-sm font-semibold text-[#6F450E]/80">
                        {t(article.byline)}
                      </p>
                    ) : null}
                    <div className="mt-8 space-y-5 text-base leading-8 text-[#2f1f0ecc] md:text-lg">
                      {article.body
                        .split(/\n\s*\n/)
                        .filter((paragraph) => paragraph.trim().length > 0)
                        .map((paragraph, index) => (
                          <p key={`${article.id}-${index}`}>{t(paragraph)}</p>
                        ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>
    </LanguageProvider>
  );
}
