import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { LanguageProvider, useLanguage } from '../context/LanguageContext';
import useTranslate from '../hooks/useTranslate';
import { TopBar, Nav } from '../components/TopNav';

type Startup = {
  id: string;
  name: string;
  focus: string;
  tag: string;
  time: string;
  poster_url?: string;
};

export const Route = createFileRoute('/startups')({
  head: () => ({ meta: [{ title: 'Startups & Innovation - PashuSevak Vaani' }] }),
  component: StartupsPage,
});

function StartupsPage() {
  const t = useTranslate();
  const { language } = useLanguage();
  const [startups, setStartups] = useState<Startup[]>([]);
  const apiBase = import.meta.env.VITE_API_BASE || '';

  const isBlacklistedStartupSubmission = (item: Record<string, unknown>) => {
    const productName = String(
      item?.product_name || item?.productName || item?.title || item?.headline || ''
    )
      .trim()
      .toLowerCase();
    const startupSector = String(
      item?.startup_sector || item?.startupSector || item?.category || ''
    )
      .trim()
      .toLowerCase();
    return (
      productName.includes('cowcare ai') &&
      productName.includes('smart livestock') &&
      startupSector.includes('dairy farming') &&
      startupSector.includes('animal husbandry')
    );
  };

  useEffect(() => {
    const stored = localStorage.getItem('startup_submissions');
    let localStartups: Startup[] = [];
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Array<Record<string, string>>;
        const cleaned = parsed.filter((item) => {
          const productName = String(
            item?.product_name || item?.productName || item?.title || item?.headline || ''
          ).trim();
          const startupSector = String(
            item?.startup_sector || item?.startupSector || item?.category || ''
          ).trim();
          return (
            productName &&
            startupSector &&
            !isBlacklistedStartupSubmission(item) &&
            productName.toLowerCase() !== 'undefined' &&
            productName.toLowerCase() !== 'null' &&
            startupSector.toLowerCase() !== 'undefined' &&
            startupSector.toLowerCase() !== 'null'
          );
        });
        if (cleaned.length !== parsed.length) {
          localStorage.setItem('startup_submissions', JSON.stringify(cleaned));
        }
        localStartups = cleaned.map((item, index) => ({
          id: `local-${index}-${item.title || item.productName || item.product_name || 'startup'}`,
          name: item.title || item.productName || item.product_name || 'Startup',
          focus: item.body || item.excerpt || '',
          tag: item.byline || 'Dairy-tech',
          time: item.time || 'Today',
          poster_url: item.poster_url,
        }));
      } catch {
        // ignore invalid local data
      }
    }

    fetch(`${apiBase}/api/news/public?lang=${language}`)
      .then((response) => (response.ok ? response.json() : { rows: [] }))
      .then((data) => {
        const apiStartups: Startup[] = (Array.isArray(data.rows) ? data.rows : [])
          .filter((item: { category?: string }) => item.category?.toLowerCase() === 'startups')
          .map(
            (item: {
              id: number;
              headline?: string;
              body?: string;
              byline?: string;
              poster_url?: string;
              created_at?: string;
            }) => ({
              id: `api-${item.id}`,
              name: item.headline || 'Startup',
              focus: item.body || '',
              tag: item.byline || 'Dairy-tech',
              time: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Today',
              poster_url: item.poster_url,
            })
          );
        setStartups([...localStartups, ...apiStartups]);
      })
      .catch(() => setStartups(localStartups));
  }, [apiBase]);

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
                {t('Startups & innovation')}
              </p>
              <h1 className="mt-3 font-serif text-4xl leading-tight text-[#6F450E] md:text-6xl">
                {t('All startups')}
              </h1>
            </div>
            <Link
              to="/"
              className="rounded-full bg-[#9DBB0B] px-5 py-3 text-sm font-semibold text-[#6F450E]"
            >
              {t('Back to homepage')}
            </Link>
          </div>

          {startups.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {startups.map((startup) => (
                <article
                  key={startup.id}
                  className="flex min-h-[320px] flex-col rounded-xl border border-[#6F450E] bg-[#9DBB0B] p-6 shadow-lg"
                >
                  {startup.poster_url ? (
                    <img
                      src={startup.poster_url}
                      alt={startup.name}
                      className="mb-5 h-44 w-full rounded-lg object-cover"
                    />
                  ) : null}
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-sm bg-[#F8C21B] px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-[#6F450E]">
                      {t(startup.tag)}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#6F450E]">
                      {startup.time}
                    </span>
                  </div>
                  <h2 className="mt-5 font-serif text-2xl leading-snug text-[#6F450E]">
                    {t(startup.name)}
                  </h2>
                  <p className="mt-3 flex-grow text-sm leading-6 text-[#6F450E]">
                    {t(startup.focus)}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-[#6F450E] bg-[#fffbe4] p-6 text-[#6F450E]">
              {t('No startups have been submitted yet.')}
            </p>
          )}
        </main>
      </div>
    </LanguageProvider>
  );
}
