import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { LanguageProvider } from '../context/LanguageContext';
import useTranslate from '../hooks/useTranslate';
import { TopBar, Nav } from '../components/TopNav';

export const Route = createFileRoute('/news-detail')({
  head: () => ({
    meta: [
      { title: 'Bulletin detail - PashuSevak Vaani' },
      {
        name: 'description',
        content:
          'Read the full bulletin with ministry updates, field reporting and scheme context from PashuSevak Vaani.',
      },
    ],
  }),
  component: NewsDetailPage,
});

type SelectedNewsDetail = {
  category: string;
  time: string;
  title: string;
  subheading?: string;
  excerpt: string;
  body?: string;
  byline?: string;
  credit?: string;
  reference_link?: string;
  poster_url?: string;
  startup_name?: string;
  product_name?: string;
  startup_sector?: string;
  startup_stage?: string;
};

function NewsDetailPage() {
  const t = useTranslate();
  const [selectedNews, setSelectedNews] = useState<SelectedNewsDetail | null>(null);

  useEffect(() => {
    const item = localStorage.getItem('selected_news_detail');
    if (item) {
      try {
        setSelectedNews(JSON.parse(item));
      } catch {
        setSelectedNews(null);
      }
    }
  }, []);

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#F8C21B] text-[#2f1f0e]">
        <TopBar />
        <Nav />
        <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="rounded-[2.5rem] border border-[#6F450E] bg-[#fffbe4] p-6 shadow-sm sm:p-10">
            {!selectedNews ? (
              <div>
                <h1 className="text-3xl font-semibold text-[#6f450e]">{t('Bulletin detail')}</h1>
                <p className="mt-4 text-base text-[#2f1f0ebb]">
                  {t(
                    'No bulletin data was found. Please return to the latest bulletins and select one again.'
                  )}
                </p>
                <div className="mt-8">
                  <Link
                    to="/"
                    className="inline-flex rounded-full bg-[#9DBB0B] px-5 py-3 text-sm font-semibold text-[#6F450E] transition hover:bg-[#8eb107]"
                  >
                    {t('Back to homepage')}
                  </Link>
                </div>
              </div>
            ) : (
              <article>
                {selectedNews.poster_url ? (
                  <img
                    src={selectedNews.poster_url}
                    alt={selectedNews.title}
                    className="h-auto w-full rounded-xl object-cover object-center"
                  />
                ) : null}

                <div className="mt-8 max-w-none">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-[#9DBB0B] px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-[#6F450E]">
                      {t(selectedNews.category)}
                    </span>
                    <span className="text-sm uppercase tracking-[0.24em] text-[#2f1f0e88]">
                      {t('Today')} · {t(selectedNews.time)}
                    </span>
                  </div>

                  <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight text-[#6f450e] md:text-5xl">
                    {t(selectedNews.title)}
                  </h1>

                  {selectedNews.startup_name ||
                  selectedNews.product_name ||
                  selectedNews.startup_sector ||
                  selectedNews.startup_stage ? (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {selectedNews.startup_name ? (
                        <span className="rounded-full bg-[#F8C21B] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#6F450E]">
                          {t('Startup Name')}: {t(selectedNews.startup_name)}
                        </span>
                      ) : null}
                      {selectedNews.product_name ? (
                        <span className="rounded-full bg-[#F8C21B] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#6F450E]">
                          {t('Product Name')}: {t(selectedNews.product_name)}
                        </span>
                      ) : null}
                      {selectedNews.startup_sector ? (
                        <span className="rounded-full bg-[#F8C21B] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#6F450E]">
                          {t('Startup Sector')}: {t(selectedNews.startup_sector)}
                        </span>
                      ) : null}
                      {selectedNews.startup_stage ? (
                        <span className="rounded-full bg-[#F8C21B] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#6F450E]">
                          {t('Startup Stage')}: {t(selectedNews.startup_stage)}
                        </span>
                      ) : null}
                    </div>
                  ) : null}

                  {selectedNews.subheading ? (
                    <p className="mt-4 font-serif text-xl leading-snug text-[#6F450E] md:text-2xl">
                      {t(selectedNews.subheading)}
                    </p>
                  ) : null}

                  {selectedNews.byline ? (
                    <p className="mt-4 text-sm font-semibold text-[#6F450E]/80">
                      {t(selectedNews.byline)}
                    </p>
                  ) : null}

                  <div className="mt-8 space-y-5 text-base leading-8 text-[#2f1f0ecc] md:text-lg">
                    {(selectedNews.body || selectedNews.excerpt)
                      .split(/\n\s*\n/)
                      .filter((paragraph) => paragraph.trim().length > 0)
                      .map((paragraph, index) => (
                        <p key={`${selectedNews.title}-${index}`}>{t(paragraph)}</p>
                      ))}
                  </div>

                  {selectedNews.credit ? (
                    <p className="mt-6 text-sm font-semibold text-[#6F450E]">
                      {t(`Credit: ${selectedNews.credit}`)}
                    </p>
                  ) : null}

                  {selectedNews.reference_link ? (
                    <a
                      href={selectedNews.reference_link}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-block text-sm font-semibold text-[#6F450E] underline underline-offset-2"
                    >
                      {t('RTI')}
                    </a>
                  ) : null}

                  <div className="mt-10 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        // If this detail is a startup, navigate to the homepage's startups section
                        const isStartup =
                          selectedNews &&
                          selectedNews.category &&
                          String(selectedNews.category).toLowerCase().includes('startup');
                        if (isStartup) {
                          // navigate directly to the anchor so the Startups section opens
                          window.location.href = '/#startups';
                          return;
                        }

                        if (window.history.length > 1) {
                          window.history.back();
                        } else {
                          window.location.href = '/';
                        }
                      }}
                      className="inline-flex rounded-full bg-[#9DBB0B] px-5 py-3 text-sm font-semibold text-[#6F450E] transition hover:bg-[#8eb107]"
                    >
                      {t('Back')}
                    </button>
                  </div>
                </div>
              </article>
            )}
          </div>
        </main>
      </div>
    </LanguageProvider>
  );
}
