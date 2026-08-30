import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { LanguageProvider, useLanguage } from '../context/LanguageContext';
import useTranslate from '../hooks/useTranslate';
import { TopBar, Nav } from '../components/TopNav';

const newsAgritech = 'https://res.cloudinary.com/dxn7nethc/image/upload/v1784894587/man_bbro3k.jpg';
const newsGoat = 'https://res.cloudinary.com/dxn7nethc/image/upload/v1784894587/goat_aosiib.jpg';
const heroDairy = 'https://res.cloudinary.com/dxn7nethc/image/upload/v1784894587/cow_x4l8kz.jpg';

type Editorial = {
  id: string;
  title: string;
  body: string;
  author: string;
  role: string;
  image?: string;
  subheading?: string;
};

const existingEditorials: Editorial[] = [
  {
    id: 'meera-iyer',
    author: 'Dr. Meera Iyer',
    role: 'Dairy scientist, NDRI',
    title: 'The carbon ledger of high-yield dairy: what farmers can actually do',
    body: 'Practical field lessons for improving dairy productivity while protecting soil, water and animal welfare.',
    image: newsAgritech,
  },
  {
    id: 'arjun-varma',
    author: 'Arjun Varma',
    role: 'Veterinary epidemiologist',
    title: 'Tele-medicine for livestock is finally working — three field lessons from Telangana',
    body: 'What connected veterinary care means for rural communities, field teams and healthier livestock.',
    image: newsGoat,
  },
  {
    id: 'sara-khan',
    author: 'Sara Khan',
    role: 'Agri-economist',
    title: "Why milk solids will define India's next dairy decade, not litres",
    body: 'A closer look at the economics shaping the future of dairy production and farmer incomes.',
    image: heroDairy,
  },
];

export const Route = createFileRoute('/editorial')({
  head: () => ({ meta: [{ title: 'Editorial & Analysis - PashuSevak Vaani' }] }),
  component: EditorialPage,
});

function EditorialPage() {
  const t = useTranslate();
  const { language } = useLanguage();
  const [editorials, setEditorials] = useState<Editorial[]>(existingEditorials);
  const apiBase = import.meta.env.VITE_API_BASE || '';

  useEffect(() => {
    fetch(`${apiBase}/api/news/public?lang=${language}`)
      .then((response) => (response.ok ? response.json() : { rows: [] }))
      .then((data) => {
        const submitted: Editorial[] = (Array.isArray(data.rows) ? data.rows : [])
          .filter((item: { category?: string }) => item.category?.toLowerCase() === 'editorial')
          .map(
            (item: {
              id: number;
              headline?: string;
              subheading?: string;
              body?: string;
              byline?: string;
              poster_url?: string;
            }) => ({
              id: `submitted-${item.id}`,
              title: item.headline || 'Editorial',
              subheading: item.subheading,
              body: item.body || '',
              author: item.byline || 'PashuSevak Vaani Editorial Team',
              role: 'Editorial contributor',
              image: item.poster_url,
            })
          );
        setEditorials([...submitted, ...existingEditorials]);
      })
      .catch(() => setEditorials(existingEditorials));
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
                {t('Editorial & analysis')}
              </p>
              <h1 className="mt-3 font-serif text-4xl leading-tight text-[#6F450E] md:text-6xl">
                {t('All columns')}
              </h1>
            </div>
            <Link
              to="/"
              className="rounded-full bg-[#9DBB0B] px-5 py-3 text-sm font-semibold text-[#6F450E]"
            >
              {t('Back to homepage')}
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {editorials.map((editorial) => (
              <article
                key={editorial.id}
                className="flex min-h-[520px] flex-col rounded-xl border border-[#6F450E] bg-[#9DBB0B] p-6 shadow-lg"
              >
                {editorial.image ? (
                  <img
                    src={editorial.image}
                    alt={editorial.title}
                    className="h-52 w-full rounded-lg object-cover"
                  />
                ) : null}
                <p className="mt-5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#6F450E]">
                  {editorial.author} · {editorial.role}
                </p>
                <h2 className="mt-4 font-serif text-2xl leading-snug text-[#6F450E]">
                  {t(editorial.title)}
                </h2>
                {editorial.subheading ? (
                  <p className="mt-3 font-serif text-lg text-[#6F450E]">
                    {t(editorial.subheading)}
                  </p>
                ) : null}
                <EditorialDescription text={t(editorial.body)} />
              </article>
            ))}
          </div>
        </main>
      </div>
    </LanguageProvider>
  );
}

function EditorialDescription({ text }: { text: string }) {
  const t = useTranslate();
  const [expanded, setExpanded] = useState(false);
  const hasMore = text.trim().length > 100;

  return (
    <div className="mt-4 flex-grow">
      <p
        className={
          expanded || !hasMore
            ? 'text-sm leading-6 text-[#6F450E]'
            : 'line-clamp-3 text-sm leading-6 text-[#6F450E]'
        }
      >
        {text}
      </p>
      {hasMore ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-3 inline-flex rounded-full bg-[#F8C21B] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#6F450E] transition hover:opacity-90"
        >
          {t(expanded ? 'Show Less' : 'Read More')}
        </button>
      ) : null}
    </div>
  );
}
