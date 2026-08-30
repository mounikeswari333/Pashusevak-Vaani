import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from '../context/LanguageContext';
import useTranslate from '../hooks/useTranslate';
import { useTranslation } from 'react-i18next';
import { TopBar, Nav } from '../components/TopNav';
import { ShareMenu } from '../components/ShareMenu';
const heroDairy = 'https://res.cloudinary.com/dxn7nethc/image/upload/v1784894587/cow_x4l8kz.jpg';
const newsPoultry = '/src/assets/news-poultry.jpg';
const newsAgritech = 'https://res.cloudinary.com/dxn7nethc/image/upload/v1784894587/man_bbro3k.jpg';
const newsGoat = 'https://res.cloudinary.com/dxn7nethc/image/upload/v1784894587/goat_aosiib.jpg';
const logo =
  'https://id-preview--bb7debd9-3ec1-4854-b983-f61eb0ded53a.lovable.app/__l5e/assets-v1/3ba28a89-d3ee-4516-be83-96fccbe646e1/logo.png';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'PashuSevak Vaani — Animal Husbandry News, Schemes & Grants' },
      {
        name: 'description',
        content:
          "Sector-specific digital news for India's animal husbandry community with a live registry of central and state government schemes, subsidies and grants.",
      },
      { property: 'og:title', content: 'PashuSevak Vaani — Animal Husbandry News & Schemes' },
      {
        property: 'og:description',
        content:
          'Daily reporting on dairy, poultry and livestock, plus a searchable registry of government schemes, subsidies and acceleration programs.',
      },
      { property: 'og:image', content: heroDairy },
      { name: 'twitter:image', content: heroDairy },
    ],
  }),
  component: Landing,
});

type NewsItem = {
  category: string;
  time: string;
  title: string;
  subheading?: string;
  excerpt: string;
  body?: string;
  byline?: string;
  credit?: string;
  reference_link?: string;
  startup_name?: string;
  product_name?: string;
  startup_sector?: string;
  startup_stage?: string;
  status?: 'accept' | 'reject' | 'pending' | string;
  editor_name?: string;
  editor_designation?: string;
  editor_affiliation?: string;
  location?: string;
  poster_url?: string;
};

type ApprovalNotification = {
  type: 'accept' | 'reject';
  message: string;
} | null;

const headlines: NewsItem[] = [
  {
    category: 'Dairy',
    time: '12 min ago',
    title:
      'Cooperatives in Maharashtra report a 14% rise in procurement prices ahead of festival demand',
    excerpt:
      'Western dairy belts confirm sustained off-take from organised processors as fat-corrected milk prices firm up.',
  },
  {
    category: 'Veterinary',
    time: '1 hr ago',
    title:
      'Lumpy Skin Disease vaccination crosses 90% coverage in northern cattle belt; surveillance continues',
    excerpt:
      'State veterinary teams report a decisive drop in active cases across Punjab, Haryana and western UP.',
  },
  {
    category: 'Policy',
    time: '3 hrs ago',
    title: 'Cabinet clears ₹15,000 Cr top-up for Animal Husbandry Infrastructure Development Fund',
    excerpt:
      'Revised terms aim to widen eligibility for FPOs, dairy SHGs and Section 8 companies operating in tier-3 districts.',
  },
];

type Scheme = {
  level: 'Central' | 'State' | 'Accelerator';
  state?: string;
  status: 'Active' | 'Closing soon' | 'New';
  title: string;
  ministry: string;
  summary: string;
  benefit: string;
  deadline: string;
};

type AcceptedScheme = {
  id: number;
  name: string;
  organisation: string;
  scheme_type?: string;
  description: string;
  eligibility?: string;
  deadline?: string;
  benefits?: string;
  apply_link?: string;
  keywords?: string;
  poster_url?: string;
  author_email?: string;
  created_at?: string;
  status: 'accept' | 'reject' | 'pending';
};

const schemes: Scheme[] = [
  {
    level: 'Central',
    status: 'Active',
    title: 'Animal Husbandry Infrastructure Development Fund (AHIDF)',
    ministry: 'Dept. of Animal Husbandry & Dairying',
    summary:
      '3% interest subvention on loans to set up dairy processing, meat processing and animal feed plants.',
    benefit: 'Up to 25% capital subsidy',
    deadline: 'Rolling window',
  },
  {
    level: 'Central',
    status: 'Closing soon',
    title: 'National Livestock Mission — Entrepreneurship Component',
    ministry: 'Ministry of Fisheries, AH & Dairying',
    summary:
      'Capital subsidy for breed improvement of sheep, goat, poultry, piggery and feed & fodder units.',
    benefit: '50% subsidy up to ₹50 Lakh',
    deadline: '30 Oct 2026',
  },
  {
    level: 'State',
    state: 'Uttar Pradesh',
    status: 'Active',
    title: 'Nand Baba Mission — Commercial Dairy Units',
    ministry: 'UP Dept. of Animal Husbandry',
    summary:
      'Financial assistance for 25–100 high-yield indigenous milch animal units with interest-free working capital.',
    benefit: 'Up to ₹1.2 Cr per unit',
    deadline: 'Apply year-round',
  },
  {
    level: 'State',
    state: 'Gujarat',
    status: 'Active',
    title: 'Mukhyamantri Gau-Mata Poshan Yojana',
    ministry: 'Gujarat Animal Husbandry Dept.',
    summary:
      'Per-animal maintenance grant to registered gaushalas and panjrapoles caring for indigenous breeds.',
    benefit: '₹30/animal/day',
    deadline: 'Continuous',
  },
  {
    level: 'Accelerator',
    status: 'New',
    title: 'Livestock Tech Accelerator 2026 — Cohort 3',
    ministry: 'NDDB × Startup India',
    summary:
      'Equity-free grant and structured 16-week program for startups in diagnostics, nutrition and traceability.',
    benefit: '₹25 Lakh equity-free',
    deadline: 'Applications close 14 Dec 2026',
  },
  {
    level: 'Central',
    status: 'Active',
    title: 'Rashtriya Gokul Mission — IVF & Genomic Selection',
    ministry: 'Dept. of Animal Husbandry & Dairying',
    summary:
      'Subsidised IVF procedures and genomic chip support to accelerate indigenous bovine breed improvement.',
    benefit: '₹5,000 per pregnancy',
    deadline: 'Rolling window',
  },
];

const categories = [
  'All',
  'Central Govt',
  'State Schemes',
  'Subsidies',
  'Incubators',
  'Events/Competitions',
];

function Landing() {
  const t = useTranslate();
  const { language } = useLanguage();
  const [acceptedNews, setAcceptedNews] = useState<NewsItem[]>([]);
  const [acceptedAds, setAcceptedAds] = useState<
    { title: string; image_url: string; author_email: string }[]
  >([]);
  const [startupSubmissions, setStartupSubmissions] = useState<NewsItem[]>([]);
  const [notification, setNotification] = useState<ApprovalNotification>(null);
  const apiBase = import.meta.env.VITE_API_BASE || '';
  const newsItems = acceptedNews.filter(
    (item) => !['startups', 'editorial', 'schemes'].includes(item.category.toLowerCase())
  );
  const startupNews = acceptedNews.filter((item) => item.category.toLowerCase() === 'startups');
  const editorialNews = acceptedNews.filter((item) => item.category.toLowerCase() === 'editorial');
  const opportunityNews = acceptedNews.filter((item) => item.category.toLowerCase() === 'schemes');
  const topStoryNews = newsItems.find((item) => item.location === 'home-topstory');

  const isBlacklistedStartupSubmission = (submission: Record<string, unknown>) => {
    const productName = String(
      submission.product_name ||
        submission.productName ||
        submission.title ||
        submission.headline ||
        ''
    )
      .trim()
      .toLowerCase();
    const startupSector = String(
      submission.startup_sector || submission.startupSector || submission.category || ''
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

  const validStartupSubmissions = startupSubmissions.filter(
    (item): item is NewsItem =>
      Boolean(item) &&
      (Boolean(item.product_name) ||
        Boolean(item.startup_name) ||
        Boolean(item.title) ||
        Boolean(item.startup_sector))
  );

  const combinedStartupSubmissions = [...validStartupSubmissions, ...startupNews]
    .filter((item) => {
      const submission = item as NewsItem & {
        productName?: string;
        startupSector?: string;
        headline?: string;
      };
      const productName = String(
        item.product_name || submission.productName || item.title || submission.headline || ''
      ).trim();
      const startupSector = String(
        item.startup_sector || submission.startupSector || item.category || ''
      ).trim();
      const isValidStartup =
        Boolean(productName && startupSector) &&
        productName.toLowerCase() !== 'undefined' &&
        productName.toLowerCase() !== 'null' &&
        startupSector.toLowerCase() !== 'undefined' &&
        startupSector.toLowerCase() !== 'null';
      return isValidStartup && !isBlacklistedStartupSubmission(item);
    })
    .filter((item, index, array) => {
      const itemKey = `${item.product_name || item.title || ''}||${item.startup_name || ''}||${item.startup_sector || ''}||${item.startup_stage || ''}`;
      return (
        array.findIndex(
          (other) =>
            `${other.product_name || other.title || ''}||${other.startup_name || ''}||${other.startup_sector || ''}||${other.startup_stage || ''}` ===
            itemKey
        ) === index
      );
    });

  useEffect(() => {
    fetch(`${apiBase}/api/news/public?lang=${language}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.rows))
          setAcceptedNews(
            data.rows.map((item) => ({
              category: item.category || 'News',
              title: item.headline || '',
              subheading: item.subheading || '',
              excerpt: item.body?.slice(0, 120) || '',
              body: item.body || '',
              byline: item.byline || '',
              credit: item.credit || '',
              reference_link: item.reference_link || '',
              startup_name: item.startup_name || '',
              product_name: item.product_name || '',
              startup_sector: item.startup_sector || '',
              startup_stage: item.startup_stage || '',
              editor_name: item.editor_name || '',
              editor_designation: item.editor_designation || '',
              editor_affiliation: item.editor_affiliation || '',
              location: item.location || 'home-side',
              poster_url: item.poster_url || '',
              time: item.created_at
                ? new Date(item.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : 'Today',
            }))
          );
      });
    fetch(`${apiBase}/api/ads/public`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.rows)) setAcceptedAds(data.rows);
      });
    const storedCards = localStorage.getItem('startup_submissions');
    if (storedCards) {
      try {
        const parsedValue = JSON.parse(storedCards);
        if (Array.isArray(parsedValue)) {
          const cleaned = parsedValue.filter((item): item is NewsItem => {
            const submission = item as Record<string, unknown>;
            const productName = String(
              submission.product_name ||
                submission.productName ||
                submission.title ||
                submission.headline ||
                submission.body ||
                submission.excerpt ||
                ''
            ).trim();
            const startupSector = String(
              submission.startup_sector || submission.startupSector || submission.category || ''
            ).trim();
            return Boolean(
              productName &&
              startupSector &&
              !isBlacklistedStartupSubmission(submission) &&
              productName.toLowerCase() !== 'undefined' &&
              productName.toLowerCase() !== 'null' &&
              startupSector.toLowerCase() !== 'undefined' &&
              startupSector.toLowerCase() !== 'null'
            );
          });
          setStartupSubmissions(cleaned);
          if (cleaned.length !== parsedValue.length) {
            localStorage.setItem('startup_submissions', JSON.stringify(cleaned));
          }
        }
      } catch {
        // ignore invalid stored value
      }
    }
    const requestId = localStorage.getItem('join_request_id');
    if (requestId) {
      fetch(`${apiBase}/api/join-requests/${requestId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.row) {
            if (data.row.status === 'accept') {
              setNotification({
                type: 'accept',
                message: 'Admin accepted your profile. Click here for more details.',
              });
            } else if (data.row.status === 'reject') {
              setNotification({
                type: 'reject',
                message: 'Admin rejected your profile.',
              });
            }
          }
        });
    }
  }, [apiBase, language]);

  return (
    <LanguageProvider>
      <div className="min-h-screen" style={{ backgroundColor: '#F8C21B', color: '#2f1f0e' }}>
        <TopBar />
        <Nav />
        {notification ? (
          <div className="mx-auto mt-4 max-w-7xl rounded-2xl border border-[#D5B60A] bg-[#F8C21B] px-6 py-4 text-[#1f2a0d] shadow-lg">
            <button
              onClick={() => {
                if (notification.type === 'accept') {
                  window.location.href = '/role-dashboard';
                }
              }}
              className="w-full rounded-xl bg-[#9DBB0B] px-5 py-3 text-left font-semibold text-brown shadow-sm transition hover:bg-[#8EB107] focus:outline-none focus:ring-2 focus:ring-[#9DBB0B]/50"
            >
              {notification.message}
            </button>
          </div>
        ) : null}
        <Hero mainNews={topStoryNews} />
        <NewsSection acceptedNews={newsItems} />
        <AdsSection acceptedAds={acceptedAds} />
        <SchemesSection opportunityNews={opportunityNews} />
        <StartupsSection startupSubmissions={combinedStartupSubmissions} />
        <EditorialSection acceptedEditorialNews={editorialNews} />
        <NewsletterSection />
        <SiteFooter />
      </div>
    </LanguageProvider>
  );
}

/* --------------------------------- hero --------------------------------- */

function Hero({ mainNews }: { mainNews?: NewsItem } = {}) {
  const t = useTranslate();
  const title =
    mainNews?.title ||
    "The voice of India's livestock economy — news, policy & every scheme worth your time.";
  const excerpt =
    mainNews?.excerpt ||
    'PashuSevak Vaani is a sector-specific digital newsroom for dairy, poultry and livestock — paired with a live registry of central and state government grants, subsidies and acceleration programs.';
  const image = mainNews?.poster_url || heroDairy;
  const byline = mainNews?.byline;
  const category = mainNews?.category || 'Top story';

  return (
    <header className="border-b" style={{ borderColor: '#6F450E', backgroundColor: '#F8C21B' }}>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 py-14 md:grid-cols-12 md:py-20">
        <div className="md:col-span-7">
          <div
            className="mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1"
            style={{
              backgroundColor: '#9DBB0B',
              borderColor: '#6f450e',
            }}
          >
            <span
              className="size-1.5 animate-pulse rounded-full"
              style={{ backgroundColor: '#F8C21B' }}
            />
            <span
              className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: '#6f450e' }}
            >
              {t('Live · Sector wire for animal husbandry')}
            </span>
          </div>
          <h1
            className="oswald text-4xl leading-[1.05] tracking-tight text-balance md:text-6xl"
            style={{ color: '#6f450e' }}
          >
            {t(title)}
          </h1>
          {mainNews?.subheading ? (
            <p className="mt-3 max-w-[58ch] font-serif text-xl" style={{ color: '#6f450e' }}>
              {t(mainNews.subheading)}
            </p>
          ) : null}
          {!mainNews ? (
            <ExpandableNewsText
              excerpt={excerpt}
              body={undefined}
              className="mt-6 max-w-[58ch] font-body text-lg text-pretty"
              style={{ color: '#2f1f0ecc' }}
            />
          ) : null}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {!mainNews ? (
              <a
                href="#news"
                className="rounded-full px-6 py-3 font-sans text-sm font-semibold shadow-md transition-transform hover:-translate-y-px"
                style={{ backgroundColor: '#9DBB0B', color: '#6F450E' }}
              >
                {t('Read More')}
              </a>
            ) : (
              <button
                type="button"
                onClick={() => openNewsDetail(mainNews)}
                className="rounded-full px-6 py-3 font-sans text-sm font-semibold shadow-md transition-transform hover:-translate-y-px"
                style={{ backgroundColor: '#9DBB0B', color: '#6F450E' }}
              >
                {t('Read More')}
              </button>
            )}
            {/* <a
              href="#schemes"
              className="rounded-full border px-6 py-3 font-sans text-sm font-semibold transition-colors hover:opacity-90"
              style={{
                borderColor: '#6f450e40',
                backgroundColor: '#6F450E',
                color: '#F8C21B',
              }}
            >
              {t('Browse 124 schemes →')}
            </a> */}
            <ShareMenu
              title={title}
              url={typeof window !== 'undefined' ? window.location.href : ''}
            />
          </div>
        </div>

        <div className="md:col-span-5">
          <figure
            className="overflow-hidden rounded-2xl border shadow-xl"
            style={{
              borderColor: '#6f450e18',
              boxShadow: '0 16px 40px #6f450e10',
            }}
          >
            <img
              src={image}
              alt={t('Featured section hero image')}
              width={1600}
              height={1000}
              className="aspect-[4/3] w-full object-cover"
            />
            <figcaption
              className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
              style={{ backgroundColor: '#fffdf7' }}
            >
              <div>
                {!mainNews ? (
                  <p
                    className="font-mono text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: '#F8C21B' }}
                  >
                    {t(category)}
                  </p>
                ) : null}
                {!mainNews ? (
                  <p
                    className="mt-1 font-serif text-base leading-snug"
                    style={{ color: '#6F450E' }}
                  >
                    {t(excerpt)}
                  </p>
                ) : null}
                {!mainNews && byline ? (
                  <p className="mt-2 text-sm font-semibold text-[#6F450E]/80">{t(byline)}</p>
                ) : null}
                {!mainNews ? <NewsMetadata item={mainNews} /> : null}
              </div>
              <span className="font-mono text-[10px]" style={{ color: '#2f1f0e88' }}>
                {t('Today')} · {mainNews?.time || '3h'}
              </span>
            </figcaption>
          </figure>
        </div>
      </div>
    </header>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="font-serif text-3xl font-semibold" style={{ color: '#6f450e' }}>
        {value}
      </dt>
      <dd
        className="mt-1 font-sans text-[11px] uppercase tracking-wider"
        style={{ color: '#2f1f0e88' }}
      >
        {label}
      </dd>
    </div>
  );
}

function ExpandableNewsText({
  excerpt,
  body,
  className,
  style,
}: {
  excerpt: string;
  body?: string;
  className: string;
  style?: React.CSSProperties;
}) {
  const t = useTranslate();
  const [expanded, setExpanded] = useState(false);
  const hasMore = Boolean(body && body !== excerpt);

  return (
    <div>
      <p className={className} style={style}>
        {t(expanded && body ? body : excerpt)}
        {!expanded && hasMore ? '...' : ''}
      </p>
      {hasMore ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-2 font-sans text-sm font-semibold text-[#6F450E] underline underline-offset-4"
        >
          {t(expanded ? 'Show Less' : 'Read More')}
        </button>
      ) : null}
    </div>
  );
}

/* --------------------------------- news --------------------------------- */

function NewsSection({ acceptedNews }: { acceptedNews: NewsItem[] }) {
  const t = useTranslate();
  const [showAll, setShowAll] = useState(false);
  // When we have acceptedNews from the API, group them strictly by `location`.
  // If there are no acceptedNews yet (development/fallback), fall back to the
  // sample `headlines` array so the UI still shows content.
  const hasRemoteNews = acceptedNews.length > 0;
  const newsFeed = hasRemoteNews ? acceptedNews : headlines;

  const homeMain = hasRemoteNews
    ? newsFeed.filter((item) => ['home-main', 'home-topstory'].includes(item.location || ''))
    : [];
  const homeSide = hasRemoteNews
    ? newsFeed.filter((item) => item.location === 'home-side')
    : headlines; // if no remote sidebar news, show sample headlines
  const homeViewAll = hasRemoteNews
    ? newsFeed.filter((item) => item.location === 'home-view-all')
    : headlines;
  const featureNews = homeMain.length > 0 ? homeMain[0] : undefined;

  // Use `home-side` items in the sidebar list, and `home-main` as the featured bulletin.
  const listNews = hasRemoteNews ? homeSide : headlines;
  const displayNews = showAll ? homeViewAll.slice(0, 11) : listNews.slice(0, 4);

  return (
    <section
      id="news"
      className="border-b py-12 md:py-20"
      style={{ borderColor: '#6F450E', backgroundColor: '#F8C21B' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={t('Latest bulletins')}
          title={t('Reporting from the field & the ministry')}
          link={t('View More')}
          href="/news"
        />

        <div className="grid gap-12 md:grid-cols-12">
          <article className="group cursor-pointer md:col-span-7">
            <figure
              className="overflow-hidden rounded-xl border"
              style={{ borderColor: '#6F450E' }}
            >
              <img
                src={
                  featureNews?.poster_url ||
                  'https://res.cloudinary.com/dxn7nethc/image/upload/v1784894587/hen_xw9wkj.jpg'
                }
                alt={featureNews?.title || 'Featured bulletin'}
                width={800}
                height={600}
                loading="lazy"
                className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </figure>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="rounded-sm px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest"
                  style={{ backgroundColor: '#9DBB0B', color: '#6F450E' }}
                >
                  {t(featureNews?.category || 'Poultry')}
                </span>
                <span
                  className="font-mono text-[10px] uppercase tracking-widest"
                  style={{ color: '#2f1f0e88' }}
                >
                  {t('Today')} · {featureNews?.time || '4 min read'}
                </span>
                {featureNews?.byline ? (
                  <span
                    className="font-mono text-[10px] uppercase tracking-widest"
                    style={{ color: '#2f1f0e88' }}
                  >
                    {featureNews.byline}
                  </span>
                ) : null}
              </div>
              <div className="flex items-center gap-3">
                <ShareMenu title={featureNews?.title || 'Featured bulletin'} />
              </div>
            </div>
            <h3
              className="mt-3 font-serif text-3xl leading-tight text-balance group-hover:underline group-hover:underline-offset-4"
              style={{ color: '#6f450e' }}
            >
              {t(
                featureNews?.title ||
                  'Avian influenza preparedness: winter advisory tightens surveillance across 11 states'
              )}
            </h3>
            {featureNews?.subheading ? (
              <p className="mt-2 max-w-[62ch] font-serif text-lg" style={{ color: '#6f450e' }}>
                {t(featureNews.subheading)}
              </p>
            ) : null}
            <ExpandableNewsText
              excerpt={
                featureNews?.excerpt ||
                'The Department of Animal Husbandry circulates revised SOPs for backyard and commercial layer units, prioritising serological testing in migratory corridors.'
              }
              body={featureNews?.body}
              className="mt-3 max-w-[62ch] font-body text-base text-pretty"
              style={{ color: '#2f1f0ebb' }}
            />
            <NewsMetadata item={featureNews} />
          </article>

          <div
            className="flex flex-col divide-y-2 md:col-span-5"
            style={{ borderColor: '#6F450E', ['--tw-divide-color']: '#6F450E' } as any}
          >
            {displayNews.map((h) => (
              <div key={h.title} className="group flex flex-col gap-3 py-5 first:pt-0 last:pb-0">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-0">
                  <div className="-ml-3 flex items-center gap-1.5 mb-3">
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#F8C21B] animate-pulse flex-shrink-0" />
                    <span className="rounded-full bg-[#9DBB0B] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#6F450E]">
                      {t(h.category)} · {t('Today')} · {t(h.time)}
                    </span>
                  </div>
                </div>
                <h4
                  className="font-serif text-lg leading-snug text-balance transition-colors"
                  style={{ color: '#6F450E' }}
                >
                  {t(((h as any).title as any) || ((h as any).headline as any))}
                </h4>
                {h.subheading ? (
                  <p className="font-serif text-base" style={{ color: '#6F450E' }}>
                    {t(h.subheading)}
                  </p>
                ) : null}
                <ExpandableNewsText
                  excerpt={h.excerpt || h.body || ''}
                  body={h.body}
                  className="font-body text-sm"
                  style={{ color: '#2f1f0ebb' }}
                />
                <NewsMetadata item={h} />
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <ShareMenu
                    title={h.title}
                    url={typeof window !== 'undefined' ? window.location.href : ''}
                  />
                </div>
              </div>
            ))}
            {homeViewAll.length > 0 ? (
              <div
                className="mt-6 flex items-center justify-between gap-4 border-t pt-6"
                style={{ borderColor: '#6F450E' }}
              >
                <div className="text-sm text-[#2f1f0e]">
                  {showAll
                    ? t('Showing all homepage news selections.')
                    : t('Showing selected sidebar news.')}
                </div>
                <button
                  type="button"
                  onClick={() => setShowAll((value) => !value)}
                  className="rounded-full border border-[#6f450e] bg-[#f8f1d0] px-4 py-2 text-sm font-semibold text-[#6f450e] transition hover:bg-[#fff7d6]"
                >
                  {showAll ? t('Show sidebar news') : t('Show all news')}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

function NewsMetadata({ item }: { item?: NewsItem }) {
  const t = useTranslate();
  if (!item?.credit && !item?.reference_link) return null;

  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#6F450E]/80">
      {item.credit ? <span>{t(`Credit: ${item.credit}`)}</span> : null}
      {item.reference_link ? (
        <a
          href={item.reference_link}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2"
        >
          {t('RTI')}
        </a>
      ) : null}
    </div>
  );
}

function openNewsDetail(item: NewsItem) {
  localStorage.setItem(
    'selected_news_detail',
    JSON.stringify({
      category: item.category,
      time: item.time,
      title: item.title,
      subheading: item.subheading,
      excerpt: item.excerpt,
      body: item.body,
      byline: item.byline,
      credit: item.credit,
      reference_link: item.reference_link,
      poster_url: item.poster_url,
    })
  );
  window.location.href = '/news-detail';
}

/* ------------------------------- schemes ------------------------------- */

function AdsSection({
  acceptedAds,
}: {
  acceptedAds: { title: string; image_url: string; author_email: string }[];
}) {
  const t = useTranslate();

  return (
    <section
      className="border-b py-12 md:py-20"
      style={{ backgroundColor: '#F8C21B', borderColor: '#6F450E' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center rounded-full bg-[#9DBB0B] px-3 py-1 text-sm font-mono font-bold uppercase tracking-[0.25em] text-[#6F450E]">
              <span
                className="inline-block mr-2 h-2.5 w-2.5 rounded-full animate-pulse"
                style={{ backgroundColor: '#F8C21B' }}
                aria-hidden="true"
              />
              {t('Advertisements')}
            </div>
            <h2 className="mt-3 font-serif text-4xl leading-tight text-[#6F450E]">
              {t('Sponsored creative banners for our audience')}
            </h2>
          </div>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {acceptedAds.length > 0 ? (
            acceptedAds.map((ad, index) => (
              <div
                key={index}
                className="rounded-3xl border border-[#6F450E] bg-[#9DBB0B] p-5 shadow-sm text-[#6F450E]"
              >
                <div className="mb-3 h-44 overflow-hidden rounded-2xl bg-[#6F450E0F]">
                  <img
                    src={ad.image_url}
                    alt={ad.title || 'Advertisement'}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-sm font-semibold text-[#6F450E]">
                  {ad.title || t('Advertisement')}
                </div>
                <div className="mt-2 text-sm text-[#6F450E]">
                  {t('Submitted by')} {ad.author_email || '-'}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-[#6f450e33] bg-[#fffdf7] p-6 text-center text-sm text-[#6f450e]">
              {t('No approved advertisements yet.')}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function SchemesSection({ opportunityNews = [] }: { opportunityNews?: NewsItem[] }) {
  const t = useTranslate();
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]);
  const [acceptedSchemes, setAcceptedSchemes] = useState<AcceptedScheme[] | null>(null);
  const [showAllSchemes, setShowAllSchemes] = useState(false);
  const apiBase = import.meta.env.VITE_API_BASE || '';

  useEffect(() => {
    fetch(`${apiBase}/api/schemes/public`)
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data?.rows) {
          setAcceptedSchemes(data.rows || []);
        } else {
          setAcceptedSchemes([]);
        }
      })
      .catch(() => {
        setAcceptedSchemes([]);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const schemesToShow = acceptedSchemes && acceptedSchemes.length > 0 ? acceptedSchemes : schemes;

  return (
    <section
      id="schemes"
      className="border-b py-12 md:py-20"
      style={{ backgroundColor: '#F8C21B', borderColor: '#6F450E' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center rounded-full bg-[#9DBB0B] px-3 py-1 text-sm font-mono font-bold uppercase tracking-[0.25em]">
              <span
                className="inline-block mr-2 h-2.5 w-2.5 rounded-full animate-pulse"
                style={{ backgroundColor: '#F8C21B' }}
                aria-hidden="true"
              />
              <span style={{ color: '#6F450E' }}>{t('Opportunities')}</span>
            </div>
            <h2
              className="mt-3 font-serif text-4xl leading-tight text-balance md:text-5xl"
              style={{ color: '#6F450E' }}
            >
              {t('Grants, subsidies & accelerators —')}{' '}
              <span className="inline-flex rounded-full bg-[#9DBB0B] px-6 py-3 text-base font-semibold text-[#6F450E]">
                {t('all in one place.')}
              </span>
            </h2>
            <p className="mt-4 font-body text-base" style={{ color: '#2f1f0ebb' }}>
              {t(
                'A continuously updated registry of central, state and private-sector programs for dairy, poultry, goat, piggery and veterinary entrepreneurs.'
              )}
            </p>
          </div>
          <div className="hidden items-center gap-2 rounded-full bg-[#9DBB0B] px-4 py-2 text-sm font-bold uppercase tracking-widest text-[#6F450E] md:flex">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6F450E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <span className="font-bold text-[11px] uppercase tracking-widest text-[#6F450E]">
              {t('Search scheme')}
            </span>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className="rounded-full px-4 py-1.5 font-sans text-[11px] font-bold uppercase tracking-widest"
              style={
                activeCategory === c
                  ? { backgroundColor: '#6F450E', color: '#9DBB0B' }
                  : { backgroundColor: '#9DBB0B', color: '#6F450E' }
              }
            >
              {t(c)}
            </button>
          ))}
        </div>

        <div className="mt-10 flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [scrollbar-width:none] [-ms-overflow-style:none] md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:pb-0 md:snap-none lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
          {opportunityNews.map((item) => (
            <AcceptedOpportunityNewsCard key={`news-${item.title}`} item={item} />
          ))}
          {schemesToShow
            .filter((scheme) => {
              if (showAllSchemes || activeCategory === 'All') return true;
              if ('scheme_type' in scheme) {
                return scheme.scheme_type === 'Central Government Scheme'
                  ? activeCategory === 'Central Govt'
                  : scheme.scheme_type === 'State Government Scheme'
                    ? activeCategory === 'State Schemes'
                    : scheme.scheme_type === 'Subsidies'
                      ? activeCategory === 'Subsidies'
                      : scheme.scheme_type === 'Events/Competitions'
                        ? activeCategory === 'Events/Competitions'
                        : activeCategory === 'Incubators';
              }
              return (scheme as any).level === 'Central' && activeCategory === 'Central Govt'
                ? true
                : (scheme as any).level === 'State' && activeCategory === 'State Schemes'
                  ? true
                  : (scheme as any).level === 'Accelerator' &&
                      (activeCategory === 'Subsidies' || activeCategory === 'Incubators')
                    ? true
                    : false;
            })
            .map((s) =>
              'title' in s ? (
                <SchemeCard key={s.title} scheme={s} />
              ) : (
                <AcceptedSchemeCard key={s.id} scheme={s} />
              )
            )}
        </div>
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={() => {
              setShowAllSchemes(true);
              setActiveCategory('All');
            }}
            className="rounded-full px-6 py-3 font-sans text-xs font-bold uppercase tracking-widest transition-colors hover:opacity-90"
            style={{
              backgroundColor: '#6F450E',
              color: '#F8C21B',
            }}
          >
            {t(showAllSchemes ? 'Showing all schemes' : 'View all schemes →')}
          </button>
        </div>
      </div>
    </section>
  );
}

function AcceptedOpportunityNewsCard({ item }: { item: NewsItem }) {
  const t = useTranslate();
  const [expanded, setExpanded] = useState(false);
  const description = item.body || item.excerpt;
  const statusLabel = item.status === 'accept' ? 'Active' : 'New';

  return (
    <article
      className="group flex min-h-[420px] w-[85vw] max-w-[320px] flex-shrink-0 flex-col rounded-xl border p-6 transition-all hover:-translate-y-1 hover:shadow-lg snap-start sm:w-[320px] md:w-auto md:max-w-none md:flex-shrink-0 md:snap-none"
      style={{
        borderColor: '#6F450E',
        backgroundColor: '#9DBB0B',
        boxShadow: '0 10px 30px #6f450e22',
      }}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="mt-3 font-mono text-[10px] font-bold uppercase tracking-widest text-[#F8C21B]">
            {t('Scheme / Opportunity')}
          </p>
          <p className="mt-2 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[#6F450E]">
            <span className="size-1.5 rounded-full bg-current" />
            {t(statusLabel)}
          </p>
        </div>
        <div className="shrink-0">
          <ShareMenu title={item.title} />
        </div>
      </div>
      {item.poster_url ? (
        <img
          src={item.poster_url}
          alt={item.title}
          className="h-32 w-full rounded-lg object-cover"
        />
      ) : null}
      <p className="mt-3 font-mono text-[10px] font-bold uppercase tracking-widest text-[#F8C21B]">
        {t('Scheme / Opportunity')}
      </p>
      <h3 className="mt-3 font-serif text-xl leading-snug text-[#6F450E]">{t(item.title)}</h3>
      {item.subheading ? (
        <p className="mt-2 font-serif text-base text-[#6F450E]">{t(item.subheading)}</p>
      ) : null}
      <div className="mt-3 flex-grow">
        <p
          className={
            expanded
              ? 'font-body text-sm text-pretty'
              : 'line-clamp-2 font-body text-sm text-pretty'
          }
          style={{ color: '#6F450E' }}
        >
          {t(description)}
        </p>
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-3 rounded-full bg-[#F8C21B] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#6F450E]"
        >
          {t(expanded ? 'Show Less' : 'Read More')}
        </button>
      </div>
      <ShareMenu title={item.title} />
    </article>
  );
}

function AcceptedSchemeCard({ scheme }: { scheme: AcceptedScheme }) {
  const t = useTranslate();
  const [showDetails, setShowDetails] = useState(false);
  const statusLabel = scheme.status === 'accept' ? 'Active' : 'New';
  const eligibility = (scheme.eligibility || t('Open to all'))
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 5)
    .join(' ');
  return (
    <article
      className="group flex h-full w-[85vw] max-w-[320px] flex-shrink-0 flex-col rounded-xl border p-6 transition-all hover:-translate-y-1 hover:shadow-lg snap-start sm:w-[320px] md:w-auto md:max-w-none md:flex-shrink-0 md:snap-none"
      style={{
        borderColor: '#6F450E',
        backgroundColor: '#9DBB0B',
        boxShadow: '0 10px 30px #6f450e22',
        minHeight: '420px',
      }}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <span
            className="rounded-sm px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest"
            style={{ backgroundColor: '#f8c21b', color: '#6f450e' }}
          >
            {t('Accelerator')}
          </span>
          <span
            className="mt-2 inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest"
            style={{ color: '#6F450E' }}
          >
            <span className="size-1.5 rounded-full bg-current" />
            {t(statusLabel)}
          </span>
        </div>
        <div className="shrink-0">
          <ShareMenu title={scheme.name} />
        </div>
      </div>

      <h3
        className="mt-4 font-serif text-xl leading-snug text-balance transition-colors group-hover:opacity-90"
        style={{ color: '#6F450E' }}
      >
        {scheme.name}
      </h3>
      {scheme.poster_url ? (
        <img
          src={scheme.poster_url}
          alt={scheme.name}
          className="mt-4 h-32 w-full rounded-lg object-cover"
        />
      ) : null}
      <p
        className="mt-1 font-mono text-[10px] uppercase tracking-widest"
        style={{ color: '#F8C21B' }}
      >
        {scheme.organisation}
      </p>

      <SchemeDescription text={scheme.description} />

      <div className="mt-6 border-t-2 pt-4" style={{ borderColor: '#6F450E' }}>
        <button
          type="button"
          onClick={() => setShowDetails((value) => !value)}
          className="inline-flex rounded-full bg-[#F8C21B] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#6F450E] transition hover:opacity-90"
          aria-expanded={showDetails}
        >
          {t(showDetails ? 'Read Less' : 'Read More')}
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showDetails ? 'mt-4 max-h-[28rem] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt
                className="inline-flex rounded-full bg-[#F8C21B] px-2 py-1 font-mono text-[10px] uppercase tracking-widest"
                style={{ color: '#6F450E' }}
              >
                {t('Eligibility')}
              </dt>
              <dd className="mt-1 font-sans font-bold" style={{ color: '#6F450E' }}>
                {eligibility}
              </dd>
            </div>
            <div>
              <dt
                className="inline-flex rounded-full bg-[#F8C21B] px-2 py-1 font-mono text-[10px] uppercase tracking-widest"
                style={{ color: '#6F450E' }}
              >
                {t('Deadline')}
              </dt>
              <dd className="mt-1 font-sans font-bold" style={{ color: '#6F450E' }}>
                {scheme.deadline || t('Not specified')}
              </dd>
            </div>
            <div>
              <dt
                className="inline-flex rounded-full bg-[#F8C21B] px-2 py-1 font-mono text-[10px] uppercase tracking-widest"
                style={{ color: '#6F450E' }}
              >
                {t('Benefits')}
              </dt>
              <dd className="mt-1 font-sans font-semibold" style={{ color: '#6F450E' }}>
                {scheme.benefits || t('Not specified')}
              </dd>
            </div>
            <div>
              <dt
                className="inline-flex rounded-full bg-[#F8C21B] px-2 py-1 font-mono text-[10px] uppercase tracking-widest"
                style={{ color: '#6F450E' }}
              >
                {t('Keywords')}
              </dt>
              <dd className="mt-1 font-sans font-semibold" style={{ color: '#6F450E' }}>
                {scheme.keywords || t('General')}
              </dd>
            </div>
          </dl>

          <div className="mt-4 flex items-center justify-between gap-3">
            <ShareMenu title={scheme.name} />
          </div>
        </div>
      </div>
    </article>
  );
}

function SchemeCard({ scheme }: { scheme: Scheme }) {
  const t = useTranslate();
  const [showDetails, setShowDetails] = useState(false);
  const eligibility = scheme.eligibility || t('Open to all');

  const levelStyle =
    scheme.level === 'Central'
      ? { backgroundColor: '#f8c21b', color: '#6f450e' }
      : scheme.level === 'State'
        ? { backgroundColor: '#f8c21b', color: '#6f450e' }
        : { backgroundColor: '#6f450e', color: '#fffdf7' };

  const statusStyle = { color: '#6F450E' };

  return (
    <article
      className="group flex h-full w-[85vw] max-w-[320px] flex-shrink-0 flex-col rounded-xl border p-6 transition-all hover:-translate-y-1 hover:shadow-lg snap-start sm:w-[320px] md:w-auto md:max-w-none md:flex-shrink-0 md:snap-none"
      style={{
        borderColor: '#6F450E',
        backgroundColor: '#9DBB0B',
        boxShadow: '0 10px 30px #6f450e22',
        minHeight: '420px',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className="rounded-sm px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest"
          style={levelStyle}
        >
          {t(scheme.level)}
          {scheme.state ? ` · ${scheme.state}` : ''}
        </span>
        <span
          className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest"
          style={statusStyle}
        >
          <span className="size-1.5 rounded-full bg-current" />
          {t(scheme.status)}
        </span>
      </div>

      <h3
        className="mt-4 font-serif text-xl leading-snug text-balance transition-colors group-hover:opacity-90"
        style={{ color: '#6F450E' }}
      >
        {t(scheme.title)}
      </h3>
      <p
        className="mt-1 font-mono text-[10px] uppercase tracking-widest"
        style={{ color: '#F8C21B' }}
      >
        {t(scheme.ministry)}
      </p>

      <SchemeDescription text={t(scheme.summary)} />

      <div className="mt-6 border-t-2 pt-4" style={{ borderColor: '#6F450E' }}>
        <button
          type="button"
          onClick={() => setShowDetails((value) => !value)}
          className="inline-flex rounded-full bg-[#F8C21B] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#6F450E] transition hover:opacity-90"
          aria-expanded={showDetails}
        >
          {t(showDetails ? 'Show Less' : 'Read More')}
        </button>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showDetails ? 'mt-4 max-h-[24rem] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt
                className="inline-flex rounded-full bg-[#F8C21B] px-2 py-1 font-mono text-[10px] uppercase tracking-widest"
                style={{ color: '#6F450E' }}
              >
                {t('Eligibility')}
              </dt>
              <dd className="mt-1 font-sans font-bold" style={{ color: '#6F450E' }}>
                {eligibility}
              </dd>
            </div>
            <div>
              <dt
                className="inline-flex rounded-full bg-[#F8C21B] px-2 py-1 font-mono text-[10px] uppercase tracking-widest"
                style={{ color: '#6F450E' }}
              >
                {t('Deadline')}
              </dt>
              <dd className="mt-1 font-sans font-semibold" style={{ color: '#6F450E' }}>
                {t(scheme.deadline)}
              </dd>
            </div>
            <div>
              <dt
                className="inline-flex rounded-full bg-[#F8C21B] px-2 py-1 font-mono text-[10px] uppercase tracking-widest"
                style={{ color: '#6F450E' }}
              >
                {t('Benefits')}
              </dt>
              <dd className="mt-1 font-sans font-semibold" style={{ color: '#6F450E' }}>
                {t(scheme.benefit)}
              </dd>
            </div>
            <div>
              <dt
                className="inline-flex rounded-full bg-[#F8C21B] px-2 py-1 font-mono text-[10px] uppercase tracking-widest"
                style={{ color: '#6F450E' }}
              >
                {t('Keywords')}
              </dt>
              <dd className="mt-1 font-sans font-semibold" style={{ color: '#6F450E' }}>
                {t(scheme.keywords || 'General')}
              </dd>
            </div>
          </dl>

          <div className="mt-4 flex items-center justify-between gap-3">
            <ShareMenu title={scheme.title} />
          </div>
        </div>
      </div>
    </article>
  );
}

function SchemeDescription({ text }: { text: string }) {
  const t = useTranslate();
  const [expanded, setExpanded] = useState(false);
  const hasMore = text.trim().length > 70;

  return (
    <div className="mt-4 min-h-[66px]">
      <p
        className={
          expanded || !hasMore
            ? 'font-body text-sm text-pretty'
            : 'line-clamp-2 font-body text-sm text-pretty'
        }
        style={{ color: '#6F450E' }}
      >
        {text}
      </p>
      {hasMore ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-2 inline-flex rounded-full bg-[#F8C21B] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#6F450E] transition hover:opacity-90"
        >
          {t(expanded ? 'Show Less' : 'Read More')}
        </button>
      ) : null}
    </div>
  );
}

function StartupDescription({ text }: { text: string }) {
  const t = useTranslate();
  const [expanded, setExpanded] = useState(false);
  const hasMore = text.trim().length > 70;

  return (
    <div className="mt-3 min-h-[88px]">
      <p
        className={
          expanded || !hasMore
            ? 'font-body text-sm leading-6 text-pretty'
            : 'overflow-hidden text-ellipsis font-body text-sm leading-6 text-pretty [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]'
        }
        style={{ color: '#6F450E' }}
      >
        {text}
      </p>
      {hasMore ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-3 inline-flex items-center gap-1 rounded-full bg-[#F8C21B] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#6F450E] transition hover:opacity-90"
        >
          {t(expanded ? 'Show Less' : 'Read More')}
        </button>
      ) : null}
    </div>
  );
}

function EditorialDescription({ text }: { text: string }) {
  const hasMore = text.trim().length > 120;

  return (
    <div className="mt-3 flex min-h-0 flex-1 flex-col overflow-hidden">
      <p
        className={
          hasMore
            ? 'min-h-0 overflow-hidden text-ellipsis font-body text-sm leading-6 text-pretty text-[#6F450E] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]'
            : 'min-h-0 overflow-hidden font-body text-sm leading-6 text-pretty text-[#6F450E]'
        }
      >
        {text}
      </p>
    </div>
  );
}

/* -------------------------------- sectors -------------------------------- */

function SectorsSection() {
  const t = useTranslate();
  const sectors = [
    { name: 'Dairy', count: '48 schemes', emoji: '🐄' },
    { name: 'Poultry', count: '21 schemes', emoji: '🐓' },
    { name: 'Goat & Sheep', count: '17 schemes', emoji: '🐐' },
    { name: 'Piggery', count: '9 schemes', emoji: '🐖' },
    { name: 'Fisheries', count: '14 schemes', emoji: '🐟' },
    { name: 'Veterinary', count: '15 schemes', emoji: '🩺' },
  ];

  return (
    <section
      id="sectors"
      className="border-b py-12 md:py-20"
      style={{ borderColor: '#6F450E', backgroundColor: '#F8C21B' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={t('Coverage by sector')}
          title={t('Every corner of animal husbandry, deeply reported.')}
          link={t('Sector index')}
        />

        <div
          className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border md:grid-cols-3 lg:grid-cols-6"
          style={{
            borderColor: '#6F450E',
            backgroundColor: '#6F450E',
          }}
        >
          {sectors.map((s) => (
            <a
              key={s.name}
              href="#"
              className="group flex flex-col gap-2 p-6 transition-colors"
              style={{ backgroundColor: '#fffdf7' }}
            >
              <span className="text-3xl">{s.emoji}</span>
              <span
                className="font-serif text-xl transition-colors group-hover:opacity-90"
                style={{ color: '#2f1f0e' }}
              >
                {t(s.name)}
              </span>
              <span
                className="font-mono text-[10px] uppercase tracking-widest"
                style={{ color: '#2f1f0e88' }}
              >
                {t(s.count)}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- startups ------------------------------- */

function StartupsSection({ startupSubmissions }: { startupSubmissions: NewsItem[] }) {
  const t = useTranslate();
  const startups = [
    {
      name: 'MoooFarm',
      focus: 'Dairy advisory & marketplace for smallholders',
      tag: 'Dairy-tech',
    },
    {
      name: 'Stellapps',
      focus: 'End-to-end milk supply-chain digitisation',
      tag: 'IoT',
    },
    {
      name: 'Animall',
      focus: 'Cattle trading & farmer community network',
      tag: 'Marketplace',
    },
    {
      name: 'Pashushala',
      focus: 'Veterinary tele-consultation for rural India',
      tag: 'Vet-tech',
    },
  ];

  const normalizeText = (value: unknown) => {
    if (value == null) return '';
    const text = String(value).trim();
    if (!text || text.toLowerCase() === 'undefined' || text.toLowerCase() === 'null') return '';
    return text;
  };

  const limitWords = (value: string, maxWords = 2) =>
    value.split(/\s+/).filter(Boolean).slice(0, maxWords).join(' ');

  const submissions = startupSubmissions
    .map((item) => {
      const submission = item as Record<string, unknown>;
      const startup_name = normalizeText(item.startup_name || submission.startupName);
      const product_name = normalizeText(
        item.product_name || submission.productName || submission.headline || item.title
      );
      const startup_sector = normalizeText(
        item.startup_sector || submission.startupSector || item.category
      );
      const startupSectorLabel = limitWords(startup_sector, 2);
      const startup_stage = normalizeText(item.startup_stage || submission.startupStage);
      const title = normalizeText(item.title || submission.headline || product_name);
      const excerpt = normalizeText(item.excerpt || item.body || submission.headline || item.title);
      const body = normalizeText(item.body || item.excerpt);
      const byline = normalizeText(
        item.byline || item.startup_sector || item.startup_sector || startup_sector
      );
      const poster_url = normalizeText(item.poster_url || '');

      return {
        ...item,
        startup_name,
        product_name,
        startup_sector,
        startup_stage,
        title,
        excerpt,
        body,
        byline,
        poster_url,
      } as NewsItem;
    })
    .filter((item) => Boolean(item.product_name && item.startup_sector));

  const uniqueSubmissions = submissions.filter(
    (item, index, self) =>
      self.findIndex(
        (other) =>
          item.product_name === other.product_name &&
          item.startup_sector === other.startup_sector &&
          item.startup_stage === other.startup_stage
      ) === index
  );

  const cards = uniqueSubmissions.length > 0 ? uniqueSubmissions : startups;

  const openStartupDetail = (item: NewsItem) => {
    localStorage.setItem(
      'selected_news_detail',
      JSON.stringify({
        category: normalizeText(item.category) || 'Startups',
        time: normalizeText(item.time) || 'Today',
        title: normalizeText(item.title || item.product_name) || '',
        subheading: normalizeText(item.subheading) || '',
        excerpt: normalizeText(item.excerpt) || '',
        body: normalizeText(item.body) || '',
        byline: normalizeText(item.byline) || '',
        credit: normalizeText(item.credit) || '',
        reference_link: normalizeText(item.reference_link) || '',
        poster_url: normalizeText(item.poster_url) || '',
        startup_name: normalizeText(item.startup_name) || '',
        product_name: normalizeText(item.product_name) || '',
        startup_sector: normalizeText(item.startup_sector) || '',
        startup_stage: normalizeText(item.startup_stage) || '',
      })
    );
    window.location.href = '/news-detail';
  };

  return (
    <section
      id="startups"
      className="border-b py-12 md:py-20"
      style={{ backgroundColor: '#F8C21B', borderColor: '#6F450E' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={t('Startups & innovation')}
          title={t('The livestock-tech founders to watch.')}
          link={t('View More')}
          href="/startups"
        />
        <div className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [scrollbar-width:none] [-ms-overflow-style:none] md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:pb-0 md:snap-none lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
          {cards.map((s, index) => {
            const isSubmission =
              'product_name' in s ||
              'startup_name' in s ||
              'startup_sector' in s ||
              'startup_stage' in s;
            const productName = isSubmission ? s.product_name || s.title || 'Startup' : t(s.name);
            const startupSector = isSubmission ? s.startup_sector || 'Startup sector' : t(s.tag);
            const startupSectorLabel = isSubmission ? limitWords(startupSector, 2) : startupSector;
            const headline = isSubmission ? s.title || '' : '';
            const startupStage = isSubmission ? s.startup_stage || '' : '';
            const startupName = isSubmission ? s.startup_name || '' : '';

            return (
              <article
                key={isSubmission ? `${productName}-${index}` : `startup-${index}`}
                className="group flex min-h-[320px] h-auto w-[92vw] max-w-[420px] flex-shrink-0 flex-col rounded-xl border p-6 transition-all hover:-translate-y-1 hover:shadow-lg snap-start sm:w-[420px] md:w-auto md:max-w-none md:flex-shrink-0 md:snap-none"
                style={{ borderColor: '#6F450E', backgroundColor: '#9DBB0B' }}
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <span
                    className="rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] md:px-1.5 md:text-[9px]"
                    style={{ backgroundColor: '#F8C21B', color: '#6F450E' }}
                  >
                    {startupSectorLabel}
                  </span>
                  {startupStage ? (
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]"
                      style={{ backgroundColor: '#F8C21B', color: '#6F450E' }}
                    >
                      {startupStage}
                    </span>
                  ) : null}
                </div>

                <h3 className="font-serif text-2xl leading-tight text-[#6F450E]">{productName}</h3>
                {headline ? <p className="mt-2 text-sm text-[#6F450E]">{headline}</p> : null}
                <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                  <ShareMenu title={productName} />
                  {isSubmission ? (
                    <button
                      type="button"
                      onClick={() => openStartupDetail(s as NewsItem)}
                      className="rounded-full bg-[#6F450E] px-4 py-2 text-sm font-semibold uppercase tracking-widest text-[#F8C21B] transition hover:bg-[#5e3d0b]"
                    >
                      {t('Read More')}
                    </button>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- editorial ------------------------------- */

type EditorialModalItem = {
  title: string;
  body: string;
  subheading?: string;
  image?: string;
  author?: string;
  role?: string;
};

function EditorialSection({ acceptedEditorialNews = [] }: { acceptedEditorialNews?: NewsItem[] }) {
  const t = useTranslate();
  const [selectedEditorial, setSelectedEditorial] = useState<EditorialModalItem | null>(null);
  const pieces = [
    {
      author: 'Dr. Meera Iyer',
      role: 'Dairy scientist, NDRI',
      title: 'The carbon ledger of high-yield dairy: what farmers can actually do',
      img: newsAgritech,
    },
    {
      author: 'Arjun Varma',
      role: 'Veterinary epidemiologist',
      title: 'Tele-medicine for livestock is finally working — three field lessons from Telangana',
      img: newsGoat,
    },
    {
      author: 'Sara Khan',
      role: 'Agri-economist',
      title: "Why milk solids will define India's next dairy decade, not litres",
      img: heroDairy,
    },
  ];

  return (
    <section
      id="editorial"
      className="border-b py-12 md:py-20"
      style={{ backgroundColor: '#F8C21B', borderColor: '#6F450E' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          eyebrow={t('Editorial & analysis')}
          title={t('Sharp voices from the sector.')}
          link={t('All columns')}
          href="/editorial"
          tight
        />

        <div className="flex items-start gap-4 overflow-x-auto overflow-y-visible scroll-smooth snap-x snap-mandatory pb-2 [scrollbar-width:none] [-ms-overflow-style:none] lg:grid lg:grid-cols-3 lg:items-start lg:gap-8 lg:overflow-visible lg:pb-0 lg:snap-none [&::-webkit-scrollbar]:hidden">
          {acceptedEditorialNews.map((item) => (
            <article
              key={`editorial-${item.title}`}
              className="group flex h-[560px] w-[85vw] max-w-[320px] flex-shrink-0 flex-col overflow-visible rounded-xl border bg-[#9DBB0B] p-6 transition-all hover:-translate-y-1 hover:shadow-lg snap-start sm:w-[320px] lg:w-auto lg:max-w-none lg:flex-shrink-0 lg:snap-none"
              style={{ borderColor: '#6F450E' }}
            >
              {item.poster_url ? (
                <img
                  src={item.poster_url}
                  alt={item.title}
                  className="h-48 w-full rounded-lg object-cover"
                />
              ) : null}
              <div className="mt-4 flex items-center justify-between gap-3">
                <span
                  className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
                  style={{ backgroundColor: '#6F450E', color: '#F8C21B' }}
                >
                  {t(item.editor_name || 'Editorial')}
                </span>
                {item.editor_designation || item.editor_affiliation ? (
                  <span className="text-xs font-semibold text-[#6F450E]">
                    {[item.editor_designation, item.editor_affiliation].filter(Boolean).join(' · ')}
                  </span>
                ) : null}
              </div>
              <h3 className="mt-3 line-clamp-2 font-serif text-xl leading-snug text-[#6F450E]">
                {t(item.title)}
              </h3>
              {item.subheading ? (
                <p className="mt-2 line-clamp-2 font-serif text-base text-[#6F450E]">
                  {t(item.subheading)}
                </p>
              ) : null}
              <EditorialDescription
                text={t(item.body || item.excerpt)}
                onReadMore={() =>
                  setSelectedEditorial({
                    title: item.title,
                    body: item.body || item.excerpt,
                    subheading: item.subheading,
                    image: item.poster_url,
                    author: item.editor_name,
                    role: [item.editor_designation, item.editor_affiliation]
                      .filter(Boolean)
                      .join(' · '),
                  })
                }
              />
              <div className="mt-auto flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedEditorial({
                      title: item.title,
                      body: item.body || item.excerpt,
                      subheading: item.subheading,
                      image: item.poster_url,
                      author: item.editor_name,
                      role: [item.editor_designation, item.editor_affiliation]
                        .filter(Boolean)
                        .join(' · '),
                    })
                  }
                  className="inline-flex rounded-full bg-[#F8C21B] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#6F450E] transition hover:opacity-90"
                >
                  {t('Read More')}
                </button>
                <ShareMenu title={item.title} />
              </div>
            </article>
          ))}
          {pieces.map((p) => (
            <article
              key={p.title}
              className="group flex h-[560px] w-[85vw] max-w-[320px] flex-shrink-0 flex-col overflow-visible rounded-xl border bg-[#9DBB0B] p-0 transition-all hover:-translate-y-1 hover:shadow-lg snap-start sm:w-[320px] lg:w-auto lg:max-w-none lg:flex-shrink-0 lg:snap-none"
              style={{ borderColor: '#6F450E' }}
            >
              <figure
                className="overflow-hidden rounded-xl border"
                style={{ borderColor: '#6F450E' }}
              >
                <img
                  src={p.img}
                  alt={p.title}
                  width={800}
                  height={600}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </figure>
              <div className="mt-5 flex flex-1 flex-col gap-4 p-6">
                <p
                  className="font-mono text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: '#6f450e' }}
                >
                  <span
                    style={{
                      backgroundColor: '#6F450E',
                      color: '#F8C21B',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '9999px',
                      display: 'inline-block',
                    }}
                  >
                    {p.author}
                  </span>{' '}
                  <span style={{ color: '#6F450E' }}>· {t(p.role)}</span>
                </p>
                <h3
                  className="mt-5 font-serif text-xl leading-snug text-balance transition-colors group-hover:opacity-90"
                  style={{ color: '#6f450e' }}
                >
                  {t(p.title)}
                </h3>
                <div className="mt-auto flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedEditorial({
                        title: p.title,
                        body: p.title,
                        image: p.img,
                        author: p.author,
                        role: p.role,
                      })
                    }
                    className="inline-flex rounded-full bg-[#F8C21B] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#6F450E] transition hover:opacity-90"
                  >
                    {t('Read more')}
                  </button>
                  <ShareMenu title={p.title} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      {selectedEditorial ? (
        <EditorialModal item={selectedEditorial} onClose={() => setSelectedEditorial(null)} />
      ) : null}
    </section>
  );
}

function EditorialModal({ item, onClose }: { item: EditorialModalItem; onClose: () => void }) {
  const t = useTranslate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2f1f0ecc] p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={t('Editorial detail')}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <article className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-[#6F450E] bg-[#fffbe4] p-5 text-[#6F450E] shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-[#6F450E] px-3 py-1 text-lg leading-none text-[#F8C21B]"
          aria-label={t('Close')}
        >
          ×
        </button>
        <div className="flex flex-col gap-7">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="aspect-[16/7] w-full rounded-xl object-cover object-center"
            />
          ) : null}
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#9DBB0B]">
              {t('Editorial & analysis')}
            </p>
            {item.author ? (
              <p className="mt-3 text-xs font-bold uppercase tracking-widest text-[#6F450E]">
                {t(item.author)}
                {item.role ? ` · ${t(item.role)}` : ''}
              </p>
            ) : null}
            <h2 className="mt-4 pr-8 font-serif text-3xl leading-tight sm:text-4xl">
              {t(item.title)}
            </h2>
            {item.subheading ? (
              <p className="mt-4 font-serif text-lg leading-relaxed">{t(item.subheading)}</p>
            ) : null}
            <div className="mt-6 space-y-4 whitespace-pre-line font-body text-base leading-7">
              {t(item.body)}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

/* ------------------------------ newsletter ------------------------------ */

function NewsletterSection() {
  const t = useTranslate();
  const [email, setEmail] = useState('');
  const [schemes, setSchemes] = useState(true);
  const [market, setMarket] = useState(true);
  const [hindi, setHindi] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    try {
      const res = await fetch((import.meta.env.VITE_API_BASE || '') + '/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, schemes, market, hindi }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to subscribe.');
        return;
      }

      setMessage('Thank you! You are now subscribed.');
      setEmail('');
      setSchemes(true);
      setMarket(true);
      setHindi(false);
    } catch (err) {
      setError('Network error while subscribing.');
    }
  };

  return (
    <section id="newsletter" style={{ backgroundColor: '#6f450e', color: '#fffdf7' }}>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 py-14 md:py-20 md:grid-cols-2 md:items-stretch">
        <div className="flex h-full flex-col justify-center">
          <h2 className="mt-4 font-serif text-4xl leading-tight text-balance md:text-3xl lg:text-5xl text-[#F8C21B]">
            {t('Empowering PashuSevaks with Knowledge and Compassion.')}
            <span style={{ color: '#f8c21b', fontStyle: 'italic' }}></span>
          </h2>
          <p className="mt-5 max-w-md font-body text-base" style={{ color: '#9DBB0B' }}>
            {t('Stay updated, stay informed, and turn your care into powerful action.')}
          </p>
          {message ? <div className="mt-4 text-green-200">{message}</div> : null}
          {error ? <div className="mt-4 text-red-200">{error}</div> : null}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex h-full flex-col gap-2 rounded-2xl p-4 md:gap-2 md:p-4 lg:gap-3 lg:p-6"
          style={{
            backgroundColor: '#fffdf70d',
            border: '1px solid #6F450E15',
          }}
        >
          <label
            className="font-mono text-[10px] font-bold uppercase tracking-widest"
            style={{ color: '#fffdf7a0' }}
          >
            {t('Email address')}
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@dairy.coop"
            className="w-full rounded-md border px-4 py-3 font-sans text-base"
            style={{
              borderColor: '#6F450E20',
              backgroundColor: '#fffdf712',
              color: '#fffdf7',
            }}
          />
          <div
            className="flex flex-wrap gap-2 pt-1 font-mono text-[10px] uppercase tracking-widest"
            style={{ color: '#fffdf7a0' }}
          >
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={schemes}
                onChange={(e) => setSchemes(e.target.checked)}
                style={{ accentColor: '#f8c21b' }}
              />{' '}
              {t('Schemes')}
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={market}
                onChange={(e) => setMarket(e.target.checked)}
                style={{ accentColor: '#f8c21b' }}
              />{' '}
              {t('Market')}
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={hindi}
                onChange={(e) => setHindi(e.target.checked)}
                style={{ accentColor: '#f8c21b' }}
              />{' '}
              {t('Hindi edition')}
            </label>
          </div>
          <button
            type="submit"
            className="mt-2 rounded-md px-6 py-3 font-sans text-sm font-bold uppercase tracking-widest transition-transform hover:-translate-y-px"
            style={{ backgroundColor: '#f8c21b', color: '#6f450e' }}
          >
            {t('Subscribe Now')}
          </button>
        </form>
      </div>
    </section>
  );
}

/* --------------------------------- footer --------------------------------- */

function SiteFooter() {
  const t = useTranslate();
  const { t: staticT } = useTranslation();

  return (
    <>
      <div
        className="w-full px-4 sm:px-6 py-4 flex justify-center"
        style={{ backgroundColor: '#9DBB0B' }}
      >
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#6F450E] text-[#F8C21B] shadow-lg transition duration-200 hover:-translate-y-1"
          style={{ border: '1px solid rgba(255,255,255,0.15)' }}
          aria-label="Scroll to top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-7 w-7"
            aria-hidden="true"
          >
            <path
              d="M6 14.5l6-6 6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <footer style={{ backgroundColor: '#9DBB0B', color: '#fffdf7' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 md:py-6">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-2">
            <div>
              <div className="flex items-center gap-3">
                <img
                  src={logo}
                  alt="PashuSevak Vaani logo"
                  className="h-16 w-16 shrink-0 rounded-md object-contain p-1"
                  style={{ backgroundColor: '#fffdf7' }}
                />
                <div className="leading-tight">
                  <p className="font-hi text-2xl font-bold" style={{ color: '#F8C21B' }}>
                    पशुसेवक वाणी
                  </p>
                  <p
                    className="font-mono text-[10px] uppercase tracking-widest"
                    style={{ color: '#F8C21B' }}
                  >
                    PashuSevak Vaani
                  </p>
                </div>
              </div>
              <p className="mt-5 max-w-xs font-body text-lg" style={{ color: '#6F450E' }}>
                {t(
                  "A sector-specific digital newsroom for India's animal husbandry community — built in service of the people who feed the country."
                )}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <a
                  href="https://wa.me/message/ZY2LBKYLE37BK1"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#F8C21B] text-green-600 shadow-sm transition hover:bg-[#f0e6c1]"
                  aria-label="WhatsApp"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.671.149-.198.297-.768.967-.942 1.165-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.787-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.173.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.671-1.612-.92-2.207-.242-.579-.487-.5-.671-.51l-.571-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.412.248-.694.248-1.289.173-1.414-.074-.124-.272-.198-.57-.347z" />
                    <path
                      d="M12.004 2.002C6.476 2.002 2 6.478 2 12.006c0 1.989.518 3.843 1.418 5.427L2 22l4.7-1.232A9.981 9.981 0 0012.004 22c5.528 0 10.004-4.476 10.004-9.994 0-5.528-4.476-9.994-10.004-9.994z"
                      opacity="0.2"
                    />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/pashusevakpragatikendra/?hl=en"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#F8C21B] text-[#6F450E] shadow-sm transition hover:bg-[#f0e6c1]"
                  aria-label="Instagram"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                    <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5A4.25 4.25 0 0020.5 16.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5z" />
                    <path d="M12 7.25a4.75 4.75 0 110 9.5 4.75 4.75 0 010-9.5zm0 1.5a3.25 3.25 0 100 6.5 3.25 3.25 0 000-6.5z" />
                    <circle cx="17.5" cy="6.5" r="1" />
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/@PashuSevakPragatiKendra"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#F8C21B] text-[#6F450E] shadow-sm transition hover:bg-[#f0e6c1]"
                  aria-label="YouTube"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                    <path d="M21.8 8.001a2.43 2.43 0 00-1.713-1.716C18.29 6 12 6 12 6s-6.29 0-8.087.285A2.43 2.43 0 002.2 8.001 25.48 25.48 0 002 12a25.48 25.48 0 00.2 3.999 2.43 2.43 0 001.713 1.716C5.71 18 12 18 12 18s6.29 0 8.087-.285A2.43 2.43 0 0021.8 15.999 25.48 25.48 0 0022 12a25.48 25.48 0 00-.2-3.999zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#F8C21B] text-[#6F450E] shadow-sm transition hover:bg-[#f0e6c1]"
                  aria-label="Twitter"
                >
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                    <path d="M22.162 5.656c-.793.352-1.645.59-2.538.697a4.49 4.49 0 001.97-2.48 8.988 8.988 0 01-2.846 1.088 4.478 4.478 0 00-7.63 4.083 12.72 12.72 0 01-9.237-4.685 4.478 4.478 0 001.387 5.973 4.448 4.448 0 01-2.028-.56v.056a4.48 4.48 0 003.587 4.392 4.49 4.49 0 01-2.022.077 4.479 4.479 0 004.18 3.108 8.98 8.98 0 01-5.565 1.918c-.361 0-.718-.021-1.071-.062a12.68 12.68 0 006.883 2.016c8.26 0 12.777-6.847 12.777-12.787 0-.195-.005-.39-.013-.583A9.144 9.144 0 0024 4.557a8.97 8.97 0 01-2.588.708z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="flex flex-row gap-12 md:gap-14 justify-start">
              <FooterCol
                title={staticT('Newsroom')}
                links={[
                  staticT('News'),
                  staticT('Schemes'),
                  staticT('Startups'),
                  staticT('Editorial'),
                ]}
              />
              <FooterCol
                title={staticT('Organisation')}
                links={[
                  staticT('About Us'),
                  staticT('Editorial standards'),
                  staticT('Contact desk'),
                ]}
              />
            </div>
          </div>

          <div
            className="mt-14 flex flex-col items-start justify-between gap-4 border-t pt-6 font-mono text-[10px] uppercase tracking-widest md:flex-row md:items-center"
            style={{ borderColor: '#fffdf715', color: '#6F450E' }}
          >
            <span className="font-bold normal-case tracking-normal text-sm">
              © 2026 पशुसेवक वाणी · सत्यमेव जयते
            </span>
            <div className="flex gap-6">
              <a
                href="#"
                className="inline-flex rounded-full px-3 py-1.5"
                style={{ backgroundColor: '#6F450E', color: '#F8C21B' }}
              >
                {t('Privacy')}
              </a>
              <a
                href="#"
                className="inline-flex rounded-full px-3 py-1.5"
                style={{ backgroundColor: '#6F450E', color: '#F8C21B' }}
              >
                {t('Terms')}
              </a>
              <a
                href="#"
                className="inline-flex rounded-full px-3 py-1.5"
                style={{ backgroundColor: '#6F450E', color: '#F8C21B' }}
              >
                {t('Code of ethics')}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4
        className="inline-flex items-center font-mono text-[10px] font-bold uppercase tracking-[0.22em] rounded-full px-3 py-1.5"
        style={{ backgroundColor: '#6F450E', color: '#F8C21B' }}
      >
        {title}
      </h4>
      <ul className="mt-5 space-y-3 font-sans text-sm font-bold" style={{ color: '#fffdf785' }}>
        {links.map((l) => (
          <li key={l}>
            {(() => {
              const isContact = /contact/i.test(l);
              const href = isContact ? '/contact' : '#';
              return (
                <a href={href} style={{ color: '#6F450E' }}>
                  {l}
                </a>
              );
            })()}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* --------------------------------- shared --------------------------------- */

function SectionHeading({
  eyebrow,
  title,
  link,
  href,
  tight,
}: {
  eyebrow: string;
  title: string;
  link?: string;
  href?: string;
  tight?: boolean;
}) {
  return (
    <div
      className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b-2"
      style={{ borderColor: '#6F450E' }}
    >
      <div>
        <p className="inline-flex items-center gap-2 rounded-full bg-[#9DBB0B] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#6F450E]">
          <span className="inline-block h-2 w-2 rounded-full bg-[#F8C21B] animate-pulse" />
          {eyebrow}
        </p>
        <h2
          className={`${tight ? 'mt-1' : 'mt-2'} font-serif text-3xl text-balance md:text-4xl`}
          style={{ color: '#6f450e', paddingBottom: '10px' }}
        >
          {title}
        </h2>
      </div>
      {link ? (
        <a
          href={href || '#'}
          className="inline-flex items-center gap-2 rounded-full bg-[#9DBB0B] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#6F450E] transition hover:opacity-90"
          style={{ marginBottom: '10px' }}
        >
          <span className="inline-block h-2 w-2 rounded-full bg-[#F8C21B] animate-pulse" />
          {link}
          <span>→</span>
        </a>
      ) : null}
    </div>
  );
}
