import { createFileRoute, redirect } from '@tanstack/react-router';
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from 'react';
import useTranslate from '../hooks/useTranslate';
import { TopBar, Nav } from '../components/TopNav';

type RoleProfile = {
  fullName: string;
  email: string;
  role: string;
  mobile: string;
  country: string;
  state: string;
  district: string;
  village: string;
  entityName: string;
  entityAddress: string;
  photo?: string;
};

type AddNewsProps = {
  setNewsSubmitted: Dispatch<SetStateAction<boolean>>;
  profile: RoleProfile;
};

type ApplyAdProps = {
  setAdSubmitted: Dispatch<SetStateAction<boolean>>;
};

type EditProfileProps = {
  profile: RoleProfile;
  setProfile: Dispatch<SetStateAction<RoleProfile>>;
  setProfileSubmitted: Dispatch<SetStateAction<boolean>>;
};

export const Route = createFileRoute('/role-dashboard')({
  head: () => ({ meta: [{ title: 'My Portal - PashuSevak' }] }),
  loader: () => {
    const rawRequestRole = localStorage.getItem('join_request_role');
    if (rawRequestRole === 'readers') {
      throw redirect({ to: '/', throw: true });
    }
    return null;
  },
  component: RoleDashboard,
});

function RoleDashboard() {
  const t = useTranslate();
  const [tab, setTab] = useState('add-news');
  const [notification, setNotification] = useState('');
  const [status, setStatus] = useState('pending');
  const [profile, setProfile] = useState<RoleProfile>({
    fullName: '',
    email: '',
    role: 'volunteer',
    mobile: '',
    country: 'India',
    state: '',
    district: '',
    village: '',
    entityName: '',
    entityAddress: '',
  });
  const [newsSubmitted, setNewsSubmitted] = useState(false);
  const [adSubmitted, setAdSubmitted] = useState(false);
  const [profileSubmitted, setProfileSubmitted] = useState(false);
  const [schemeSubmitted, setSchemeSubmitted] = useState(false);
  const [schemeError, setSchemeError] = useState('');
  const [schemeSuccess, setSchemeSuccess] = useState('');
  const [schemeDraft, setSchemeDraft] = useState({
    name: '',
    subheading: '',
    organisation: '',
    type: 'Central Government Scheme',
    description: '',
    eligibility: '',
    deadline: '',
    benefits: '',
    apply_link: '',
    keywords: '',
    posterFile: null as File | null,
    posterPreview: '',
  });
  const [schemeSubheadingError, setSchemeSubheadingError] = useState('');

  const rawRequestId = localStorage.getItem('join_request_id');
  const rawRequestEmail = localStorage.getItem('join_request_email');
  const requestId =
    rawRequestId && rawRequestId !== 'null' && rawRequestId !== 'undefined' ? rawRequestId : null;
  const requestEmail =
    rawRequestEmail && rawRequestEmail !== 'null' && rawRequestEmail !== 'undefined'
      ? rawRequestEmail
      : null;
  const apiBase = import.meta.env.VITE_API_BASE || '';

  const handleSchemeSubmit = async () => {
    setSchemeError('');
    setSchemeSuccess('');
    if (
      !schemeDraft.name.trim() ||
      !schemeDraft.organisation.trim() ||
      !schemeDraft.description.trim()
    ) {
      setSchemeError('Name, organisation, and description are required.');
      return;
    }

    try {
      const res = await fetch(`${apiBase}/api/schemes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: schemeDraft.name,
          subheading: schemeDraft.subheading,
          organisation: schemeDraft.organisation,
          scheme_type: schemeDraft.type,
          description: schemeDraft.description,
          eligibility: schemeDraft.eligibility,
          deadline: schemeDraft.deadline,
          benefits: schemeDraft.benefits,
          apply_link: schemeDraft.apply_link,
          keywords: schemeDraft.keywords,
          poster_url: schemeDraft.posterPreview,
          author_email: requestEmail || localStorage.getItem('join_request_email') || '',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSchemeError(data.error || 'Failed to submit scheme.');
        return;
      }
      setSchemeSuccess('Scheme submitted for admin approval.');
      setSchemeSubmitted(true);
      setSchemeDraft({
        name: '',
        subheading: '',
        organisation: '',
        type: 'Central Government Scheme',
        description: '',
        eligibility: '',
        deadline: '',
        benefits: '',
        apply_link: '',
        keywords: '',
        posterFile: null,
        posterPreview: '',
      });
    } catch (err) {
      setSchemeError('Network error submitting scheme.');
    }
  };

  useEffect(() => {
    if (!requestId) return;
    fetch(`${apiBase}/api/join-requests/${requestId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.row) {
          const row = data.row;
          const extra =
            typeof row.extra === 'string' ? JSON.parse(row.extra || '{}') : row.extra || {};
          setProfile({
            fullName: row.full_name || '',
            email: row.email || requestEmail || '',
            role: row.role || 'volunteer',
            mobile: extra.mobile_number || '',
            country: extra.country || 'India',
            state: extra.state || '',
            district: extra.district || '',
            village: extra.village || '',
            entityName: extra.entityName || '',
            entityAddress: extra.entityAddress || '',
            photo:
              (typeof extra.photo_url === 'string' && extra.photo_url) ||
              localStorage.getItem('join_request_photo') ||
              '',
          });
          setStatus(row.status || 'pending');
          if (row.status === 'accept') {
            setNotification('Admin accepted your profile. You can now use the dashboard.');
          } else if (row.status === 'reject') {
            setNotification('Admin rejected your profile.');
          } else {
            setNotification('Your profile is pending admin approval.');
          }
        }
      });
  }, [apiBase, requestEmail, requestId]);

  const hasRequest = Boolean(requestId);

  return (
    <div style={{ backgroundColor: '#F8C21B', minHeight: '100vh' }}>
      <TopBar />
      <Nav />
      <main className="mx-auto max-w-4xl p-6" style={{ backgroundColor: 'transparent' }}>
        <h1 className="text-2xl font-bold">{t('My Portal')}</h1>
        {notification ? (
          <div className="mb-4 rounded-lg border border-[#6f450e] bg-[#f8f1d0] p-4 text-[#5a3c09]">
            {notification}
          </div>
        ) : null}

        {hasRequest ? (
          <>
            <div className="mb-4 rounded-lg border border-[#6f450e] bg-[#fff8dc] p-4 text-[#6f450e]">
              {status === 'pending' &&
                'Your profile is pending admin approval. You can still submit news and advertisements, or edit your details for review.'}
              {status === 'reject' &&
                'Your profile was rejected. Please update your details and resubmit for admin approval.'}
              {status === 'accept' &&
                'Your profile is accepted. Use the portal sections below to submit news, advertisement requests, or edit your profile.'}
            </div>
            {status === 'accept' ? (
              <div className="mb-4 rounded-lg border border-[#6f450e] bg-[#9DBB0B] p-4 text-[#6f450e] shadow-sm">
                <div className="flex items-center gap-4">
                  {profile.photo ? (
                    <img
                      src={profile.photo}
                      alt="Profile"
                      className="h-16 w-16 rounded-full object-cover border-2 border-white"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-300 text-gray-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="36"
                        height="36"
                        fill="#6b7280"
                      >
                        <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.866 0-7 3.134-7 7h14c0-3.866-3.134-7-7-7z" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-lg font-semibold">
                      <span>{profile.fullName || 'User'}</span>
                      {profile.role ? (
                        <span className="rounded-full bg-[#F8C21B] px-2 py-1 text-sm font-medium text-[#6F450E]">
                          {profile.role}
                        </span>
                      ) : null}
                    </div>
                    <div className="text-sm text-[#6F450E]">{profile.email}</div>
                  </div>
                </div>
              </div>
            ) : null}
            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              <button
                onClick={() => setTab('add-news')}
                className={`rounded-lg border px-4 py-3 text-left font-semibold transition bg-[#6f450e] text-[#F8C21B]`}
              >
                Add News
              </button>
              <button
                onClick={() => setTab('apply-ad')}
                className={`rounded-lg border px-4 py-3 text-left font-semibold transition bg-[#9DBB0B] text-[#6f450e]`}
              >
                Manage Advertisements
              </button>
              <button
                onClick={() => setTab('schemes')}
                className={`rounded-lg border px-4 py-3 text-left font-semibold transition bg-[#6f450e] text-[#9DBB0B]`}
              >
                Schemes / Grants
              </button>
              <button
                onClick={() => setTab('edit-profile')}
                className={`rounded-lg border px-4 py-3 text-left font-semibold transition bg-[#6f450e] text-[#F8C21B]`}
              >
                Edit Profile
              </button>
            </div>
            <section className="mt-6 space-y-6">
              {newsSubmitted ? (
                <div className="rounded border border-green-500 bg-green-50 px-4 py-3 text-green-700">
                  News submitted for admin approval.
                </div>
              ) : null}
              {adSubmitted ? (
                <div className="rounded border border-green-500 bg-green-50 px-4 py-3 text-green-700">
                  Advertisement submitted for admin approval.
                </div>
              ) : null}
              {profileSubmitted ? (
                <div className="rounded border border-green-500 bg-green-50 px-4 py-3 text-green-700">
                  Profile update submitted for admin approval.
                </div>
              ) : null}
              {schemeSubmitted ? (
                <div className="rounded border border-green-500 bg-green-50 px-4 py-3 text-green-700">
                  Scheme submitted for admin approval.
                </div>
              ) : null}
              {tab === 'add-news' && (
                <AddNews setNewsSubmitted={setNewsSubmitted} profile={profile} />
              )}
              {tab === 'apply-ad' ? (
                <div>
                  <h2 className="text-lg font-semibold">Manage Advertisements</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Submit your advertisement request with banner image and details for admin
                    review.
                  </p>
                  <ApplyAd setAdSubmitted={setAdSubmitted} />
                </div>
              ) : null}
              {tab === 'schemes' ? (
                <div className="space-y-6 rounded-xl border border-[#6f450e] bg-[#F8C21B] p-4 shadow-sm">
                  <div className="rounded-xl border border-[#6f450e] bg-[#9DBB0B] p-4 text-[#6F450E]">
                    <h2 className="text-xl font-semibold">Schemes / Grants</h2>
                    <p className="mt-2 text-sm text-[#6F450E]">
                      Submit a scheme or opportunity for admin review.
                    </p>
                  </div>
                  {schemeError ? (
                    <div className="rounded border border-red-500 bg-red-50 px-4 py-3 text-red-700">
                      {schemeError}
                    </div>
                  ) : null}
                  {schemeSuccess ? (
                    <div className="rounded border border-green-500 bg-green-50 px-4 py-3 text-green-700">
                      {schemeSuccess}
                    </div>
                  ) : null}
                  <div className="space-y-4 rounded-xl border border-[#6f450e] bg-[#F8C21B] p-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#6f450e]">
                        Name of Scheme / Opportunity
                      </label>
                      <input
                        value={schemeDraft.name}
                        onChange={(e) =>
                          setSchemeDraft((draft) => ({ ...draft, name: e.target.value }))
                        }
                        className="mt-2 w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
                        placeholder="Enter scheme or opportunity name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#6f450e]">
                        Subheading
                      </label>
                      <input
                        value={schemeDraft.subheading}
                        onChange={(e) => {
                          const words = String(e.target.value).split(/\s+/).filter(Boolean);
                          if (words.length > 30) setSchemeSubheadingError('More than 30 words');
                          else setSchemeSubheadingError('');
                          setSchemeDraft((draft) => ({
                            ...draft,
                            subheading: words.slice(0, 30).join(' '),
                          }));
                        }}
                        className="mt-2 w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
                        placeholder="Enter a short subheading"
                      />
                      {schemeSubheadingError ? (
                        <div className="mt-1 text-xs text-red-700">{schemeSubheadingError}</div>
                      ) : null}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#6f450e]">
                        Scheme type
                      </label>
                      <select
                        value={schemeDraft.type}
                        onChange={(e) =>
                          setSchemeDraft((draft) => ({ ...draft, type: e.target.value }))
                        }
                        className="mt-2 w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B]"
                      >
                        <option value="Central Government Scheme">Central Government Scheme</option>
                        <option value="State Government Scheme">State Government Scheme</option>
                        <option value="Subsidies">Subsidies</option>
                        <option value="Incubation & Acceleration">Incubation & Acceleration</option>
                        <option value="Events/Competitions">Events/Competitions</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#6f450e]">
                        Organisation Providing the Scheme
                      </label>
                      <input
                        value={schemeDraft.organisation}
                        onChange={(e) =>
                          setSchemeDraft((draft) => ({ ...draft, organisation: e.target.value }))
                        }
                        className="mt-2 w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
                        placeholder="Enter organisation name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#6f450e]">
                        Brief Description of the Scheme
                      </label>
                      <textarea
                        value={schemeDraft.description}
                        onChange={(e) =>
                          setSchemeDraft((draft) => ({ ...draft, description: e.target.value }))
                        }
                        className="mt-2 w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
                        rows={4}
                        placeholder="Enter a short description"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#6f450e]">
                        Eligibility
                      </label>
                      <textarea
                        value={schemeDraft.eligibility}
                        onChange={(e) => {
                          const words = e.target.value.split(/\s+/).filter(Boolean).slice(0, 5);
                          setSchemeDraft((draft) => ({ ...draft, eligibility: words.join(' ') }));
                        }}
                        className="mt-2 w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
                        rows={3}
                        placeholder="Enter eligibility criteria"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#6f450e]">Deadline</label>
                      <div className="mt-2 relative">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-green-600">
                          📅
                        </span>
                        <input
                          type="date"
                          value={schemeDraft.deadline}
                          onChange={(e) =>
                            setSchemeDraft((draft) => ({ ...draft, deadline: e.target.value }))
                          }
                          className="w-full rounded border border-green-600 px-10 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#6f450e]">Benefits</label>
                      <input
                        value={schemeDraft.benefits}
                        onChange={(e) =>
                          setSchemeDraft((draft) => ({ ...draft, benefits: e.target.value }))
                        }
                        className="mt-2 w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
                        placeholder="Up to 25% capital subsidy"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#6f450e]">
                        Apply link
                      </label>
                      <input
                        value={schemeDraft.apply_link}
                        onChange={(e) =>
                          setSchemeDraft((draft) => ({ ...draft, apply_link: e.target.value }))
                        }
                        className="mt-2 w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
                        placeholder="https://"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#6f450e]">Keywords</label>
                      <input
                        value={schemeDraft.keywords}
                        onChange={(e) =>
                          setSchemeDraft((draft) => ({ ...draft, keywords: e.target.value }))
                        }
                        className="mt-2 w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
                        placeholder="Enter relevant keywords"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#6f450e]">
                        Upload the Poster of the Scheme (if available)
                      </label>
                      <label className="mt-2 flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-[#9DBB0B] bg-[#fffcdf] p-5 text-center text-[#6f450e] transition hover:border-[#6f450e]">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F8C21B] text-3xl font-bold text-[#6f450e]">
                          +
                        </span>
                        <div className="text-sm font-semibold">Upload image</div>
                        <div className="text-xs text-[#6f450e]">
                          Click the button above or this area to upload your banner
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0] ?? null;
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = () => {
                              const preview = String(reader.result || '');
                              setSchemeDraft((draft) => ({
                                ...draft,
                                posterFile: file,
                                posterPreview: preview,
                              }));
                            };
                            reader.readAsDataURL(file);
                          }}
                          className="sr-only"
                        />
                      </label>
                      {schemeDraft.posterPreview ? (
                        <div className="relative mt-3">
                          <img
                            src={schemeDraft.posterPreview}
                            alt="Poster preview"
                            className="max-h-48 w-full object-contain rounded-lg border border-slate-300"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setSchemeDraft((draft) => ({
                                ...draft,
                                posterFile: null,
                                posterPreview: '',
                              }))
                            }
                            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-lg font-bold leading-none text-white"
                            aria-label="Remove poster"
                          >
                            ×
                          </button>
                        </div>
                      ) : null}
                    </div>
                    <div>
                      <button
                        onClick={handleSchemeSubmit}
                        className="rounded bg-[#6f450e] px-4 py-2 text-[#F8C21B]"
                      >
                        Submit for Registration approval
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
              {tab === 'edit-profile' && (
                <EditProfile
                  profile={profile}
                  setProfile={setProfile}
                  setProfileSubmitted={setProfileSubmitted}
                />
              )}
            </section>
          </>
        ) : (
          <section className="mt-6 rounded-lg border border-[#6f450e] bg-[#f8f1d0] p-6 text-[#5a3c09]">
            <p className="font-semibold">No profile information was found.</p>
            <p className="mt-3 text-sm text-[#5a3c09]">
              Please submit the Join Us form first from this browser so your request can be tracked
              in our portal.
            </p>
            <a
              href="/join-us"
              className="mt-4 inline-block rounded bg-[#6f450e] px-4 py-2 text-white"
            >
              Go to Join Us
            </a>
          </section>
        )}
      </main>
    </div>
  );
}

function AddNews({ setNewsSubmitted, profile }: AddNewsProps) {
  const [category, setCategory] = useState('news');
  const [newsLocation, setNewsLocation] = useState('home-side');
  const [startupName, setStartupName] = useState('');
  const [productName, setProductName] = useState('');
  const [startupSector, setStartupSector] = useState('');
  const [startupStage, setStartupStage] = useState('Idea');
  const [headline, setHeadline] = useState('');
  const [subheading, setSubheading] = useState('');
  const [byline, setByline] = useState('');
  const [editorName, setEditorName] = useState('');
  const [editorDesignation, setEditorDesignation] = useState('');
  const [editorAffiliation, setEditorAffiliation] = useState('');
  const [referenceLink, setReferenceLink] = useState('');
  const [headlineError, setHeadlineError] = useState('');
  const [subheadingError, setSubheadingError] = useState('');
  const [body, setBody] = useState('');
  const [credit, setCredit] = useState('');
  const [posterPreview, setPosterPreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const newsPlacementLinks: Record<string, string> = {
    'home-main':
      'https://res.cloudinary.com/dttsqdjta/image/upload/v1785333257/Screenshot_2026-07-29_192353_irwfjb.png',
    'home-side':
      'https://res.cloudinary.com/dttsqdjta/image/upload/v1785303587/Screenshot_2026-07-29_110932_zr4afa.png',
    'home-view-all':
      'https://res.cloudinary.com/dttsqdjta/image/upload/v1785303609/Screenshot_2026-07-29_110956_nzkipz.png',
    'home-topstory':
      'https://res.cloudinary.com/dttsqdjta/image/upload/v1785303557/Screenshot_2026-07-29_110823_ffvxjk.png',
  };
  const apiBase = import.meta.env.VITE_API_BASE || '';

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    if (!headline.trim() || !body.trim()) {
      setError('Headline and Body are required.');
      return;
    }
    try {
      const res = await fetch(`${apiBase}/api/news`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline,
          subheading,
          byline,
          editor_name: editorName || (category === 'editorial' ? profile.fullName : ''),
          editor_designation: editorDesignation,
          editor_affiliation: editorAffiliation,
          reference_link: referenceLink,
          body,
          credit,
          category,
          location:
            category === 'news'
              ? newsLocation
              : newsLocation === 'homepage'
                ? 'home-side'
                : newsLocation,
          poster_url: posterPreview,
          startup_name: startupName,
          product_name: productName,
          startup_sector: startupSector,
          startup_stage: startupStage,
          author_email: localStorage.getItem('join_request_email') || '',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to submit news');
        return;
      }
      setSuccess('News submitted for admin approval.');
      setNewsSubmitted(true);
      if (category === 'startups') {
        try {
          const saved = JSON.parse(localStorage.getItem('startup_submissions') || '[]');
          const submissions = Array.isArray(saved) ? saved : [];
          const now = new Date();
          submissions.unshift({
            category: 'startups',
            title: productName || headline,
            excerpt: headline,
            body: body || headline,
            byline: startupSector,
            time: now.toLocaleString([], {
              hour: '2-digit',
              minute: '2-digit',
              day: 'numeric',
              month: 'short',
            }),
            created_at: now.toISOString(),
            startup_name: startupName,
            product_name: productName,
            startup_sector: startupSector,
            startup_stage: startupStage,
          });
          localStorage.setItem('startup_submissions', JSON.stringify(submissions.slice(0, 6)));
        } catch {
          // Ignore local storage failures.
        }
      }
      setHeadline('');
      setSubheading('');
      setByline('');
      setEditorName('');
      setEditorDesignation('');
      setEditorAffiliation('');
      setReferenceLink('');
      setBody('');
      setCredit('');
      setStartupName('');
      setProductName('');
      setStartupSector('');
      setStartupStage('Idea');
      setNewsLocation('homepage');
      setPosterPreview('');
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded border border-red-500 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded border border-green-500 bg-green-50 px-4 py-3 text-green-700">
          {success}
        </div>
      )}
      <div>
        <label className="block text-sm">Select</label>
        <select
          value={category}
          onChange={(e) => {
            const value = e.target.value;
            setCategory(value);
            setNewsLocation(value === 'news' ? 'home-side' : 'homepage');
          }}
          className="mt-1 rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
        >
          <option value="news">News</option>
          <option value="schemes">Schemes</option>
          <option value="startups">Startups</option>
          <option value="editorial">Editorial</option>
        </select>
        <div className="mt-3">
          <label className="block text-sm">Placement on homepage</label>
          <select
            value={newsLocation}
            onChange={(e) => setNewsLocation(e.target.value)}
            className="mt-1 w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
          >
            {category === 'news' ? (
              <>
                <option value="home-main">Homepage hero</option>
                <option value="home-side">Homepage sidebar</option>
                <option value="home-view-all">Homepage view more</option>
                <option value="home-topstory">Homepage topstory</option>
                <option value="regular">Regular</option>
              </>
            ) : (
              <>
                <option value="homepage">Homepage</option>
                <option value="regular">Regular</option>
              </>
            )}
          </select>
          <div className="mt-3">
            {newsPlacementLinks[newsLocation] ? (
              <a
                href={newsPlacementLinks[newsLocation]}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full border-2 border-[#6F450E] bg-[#F8C21B] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#6F450E] transition hover:opacity-90"
              >
                View image
              </a>
            ) : null}
          </div>
        </div>
      </div>
      {category === 'startups' ? (
        <>
          <div>
            <label className="block text-sm">Startup Name</label>
            <input
              value={startupName}
              onChange={(e) => setStartupName(e.target.value)}
              className="w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
            />
          </div>
          <div>
            <label className="block text-sm">Product Name</label>
            <input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
            />
          </div>
          <div>
            <label className="block text-sm">Startup Sector</label>
            <input
              value={startupSector}
              onChange={(e) => setStartupSector(e.target.value)}
              className="w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
            />
          </div>
          <div>
            <label className="block text-sm">Startup Stage</label>
            <select
              value={startupStage}
              onChange={(e) => setStartupStage(e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B]"
            >
              <option value="Idea">Idea</option>
              <option value="Pre-Seed">Pre-Seed</option>
              <option value="Seed">Seed</option>
              <option value="Pilot Ready">Pilot Ready</option>
              <option value="Product Ready">Product Ready</option>
              <option value="Pre-Revenue">Pre-Revenue</option>
              <option value="Growth Stage">Growth Stage</option>
            </select>
          </div>
        </>
      ) : null}
      {category === 'editorial' ? (
        <>
          <div>
            <label className="block text-sm">Editor's Name</label>
            <input
              value={editorName || profile.fullName}
              onChange={(e) => setEditorName(e.target.value)}
              className="w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
            />
          </div>
          <div>
            <label className="block text-sm">Editor's Designation</label>
            <input
              value={editorDesignation}
              onChange={(e) => setEditorDesignation(e.target.value)}
              placeholder="Dairy scientist"
              className="w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
            />
          </div>
          <div>
            <label className="block text-sm">Editor's Affiliation</label>
            <input
              value={editorAffiliation}
              onChange={(e) => setEditorAffiliation(e.target.value)}
              placeholder="NDRI"
              className="w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
            />
          </div>
        </>
      ) : null}
      <div>
        <label className="block text-sm">Headline</label>
        <input
          value={headline}
          onChange={(e) => {
            const words = String(e.target.value).split(/\s+/).filter(Boolean);
            if (words.length > 15) {
              setHeadlineError('More than 15 words');
            } else {
              setHeadlineError('');
            }
            setHeadline(words.slice(0, 15).join(' '));
          }}
          className="w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
        />
        {headlineError ? <div className="mt-1 text-xs text-red-700">{headlineError}</div> : null}
      </div>
      <div>
        <label className="block text-sm">Subheading</label>
        <input
          value={subheading}
          onChange={(e) => {
            const words = String(e.target.value).split(/\s+/).filter(Boolean);
            if (words.length > 30) {
              setSubheadingError('More than 30 words');
            } else {
              setSubheadingError('');
            }
            setSubheading(words.slice(0, 30).join(' '));
          }}
          className="w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
        />
        {subheadingError ? (
          <div className="mt-1 text-xs text-red-700">{subheadingError}</div>
        ) : null}
      </div>
      <div>
        <label className="block text-sm">Byline Story</label>
        <input
          value={byline}
          onChange={(e) => setByline(e.target.value)}
          className="w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
        />
      </div>
      <div>
        <label className="block text-sm">Reference Link</label>
        <input
          value={referenceLink}
          onChange={(e) => setReferenceLink(e.target.value)}
          placeholder="https://"
          className="w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
        />
      </div>
      <div>
        <label className="block text-sm">Body</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
          rows={8}
        />
      </div>
      <div></div>
      <div>
        <label className="block text-sm">Upload poster image</label>
        <label
          className="mt-2 flex min-h-[150px] cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-[#9DBB0B] bg-[#fffcdf] p-5 text-center text-[#6f450e] transition hover:border-[#6f450e]"
          onClick={() => {}}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F8C21B] text-3xl font-bold text-[#6f450e]">
            +
          </span>
          <div className="text-sm font-semibold">Upload image</div>
          <div className="text-xs text-[#6f450e]">Select a poster to show with this news item</div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                const preview = String(reader.result || '');
                setPosterPreview(preview);
              };
              reader.readAsDataURL(file);
            }}
            className="sr-only"
          />
        </label>
        {posterPreview ? (
          <div className="relative mt-3">
            <img
              src={posterPreview}
              alt="Poster preview"
              className="max-h-48 w-full object-contain rounded-lg border border-slate-300"
            />
            <button
              type="button"
              onClick={() => setPosterPreview('')}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-lg font-bold leading-none text-white"
              aria-label="Remove poster"
            >
              ×
            </button>
          </div>
        ) : null}
      </div>
      <div>
        <label className="block text-sm">Credit Line (Name of the original source of News)</label>
        <input
          value={credit}
          onChange={(e) => setCredit(e.target.value)}
          className="w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
        />
      </div>
      <div>
        <button onClick={handleSubmit} className="rounded bg-[#6f450e] px-4 py-2 text-white">
          Submit for approval
        </button>
      </div>
    </div>
  );
}

function ApplyAd({ setAdSubmitted }: ApplyAdProps) {
  const [category, setCategory] = useState('news');
  const [headline, setHeadline] = useState('');
  const [heading, setHeading] = useState('');
  const [subheading, setSubheading] = useState('');
  const [productLink, setProductLink] = useState('');
  const [headlineError, setHeadlineError] = useState('');
  const [subheadingError, setSubheadingError] = useState('');
  const [body, setBody] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const apiBase = import.meta.env.VITE_API_BASE || '';

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError('');
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      setImageFile(null);
      setImagePreview('');
      return;
    }
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a JPG, JPEG, PNG, or WEBP banner image.');
      setImageFile(null);
      setImagePreview('');
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(String(reader.result || ''));
    };
    reader.readAsDataURL(file);
  };

  const canSubmit = Boolean(
    category && headline.trim() && body.trim() && imageFile && imagePreview
  );

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    if (!canSubmit) {
      setError('Please complete all fields and upload a banner image before submitting.');
      return;
    }
    try {
      const res = await fetch(`${apiBase}/api/ads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          headline,
          heading,
          subheading,
          body,
          product_link: productLink,
          image_url: imagePreview,
          author_email: localStorage.getItem('join_request_email') || '',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to submit advertisement');
        return;
      }
      setSuccess(
        'Your advertisement has been submitted successfully and is waiting for admin approval.'
      );
      setAdSubmitted(true);
      setCategory('news');
      setHeadline('');
      setHeading('');
      setSubheading('');
      setProductLink('');
      setBody('');
      setImageFile(null);
      setImagePreview('');
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded border border-red-500 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded border border-green-500 bg-green-50 px-4 py-3 text-green-700">
          {success}
        </div>
      )}
      <div className="space-y-4 rounded-lg border border-[#d3c69f] bg-[#F8C21B] p-4 shadow-sm">
        <div>
          <label className="block text-sm font-semibold">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-2 w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
          >
            <option value="news">News</option>
            <option value="schemes">Schemes</option>
            <option value="startups">Startups</option>
            <option value="editorial">Editorial</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold">Headline</label>
          <input
            value={headline}
            onChange={(e) => {
              const words = String(e.target.value).split(/\s+/).filter(Boolean);
              if (words.length > 15) setHeadlineError('More than 15 words');
              else setHeadlineError('');
              setHeadline(words.slice(0, 15).join(' '));
            }}
            className="mt-2 w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
          />
          {headlineError ? <div className="mt-1 text-xs text-red-700">{headlineError}</div> : null}
        </div>
        <div>
          <label className="block text-sm font-semibold">Advertisement Heading</label>
          <input
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            className="mt-2 w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold">Subheading</label>
          <input
            value={subheading}
            onChange={(e) => {
              const words = String(e.target.value).split(/\s+/).filter(Boolean);
              if (words.length > 30) setSubheadingError('More than 30 words');
              else setSubheadingError('');
              setSubheading(words.slice(0, 30).join(' '));
            }}
            className="mt-2 w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
          />
          {subheadingError ? (
            <div className="mt-1 text-xs text-red-700">{subheadingError}</div>
          ) : null}
        </div>
        <div>
          <label className="block text-sm font-semibold">Product Link</label>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <input
              value={productLink}
              onChange={(e) => setProductLink(e.target.value)}
              className="w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
              placeholder="https://"
            />
            {productLink ? (
              <a
                href={productLink}
                target="_blank"
                rel="noreferrer"
                className="rounded bg-[#6f450e] px-3 py-2 text-sm font-semibold text-[#F8C21B]"
              >
                View More
              </a>
            ) : null}
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold">Body</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="mt-2 w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
            rows={8}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold">Upload Advertisement Poster</label>
          <div
            className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-slate-500 transition hover:border-slate-400 hover:bg-slate-100"
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Advertisement preview"
                  className="max-h-48 w-full object-contain"
                />
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setImagePreview('');
                    setImageFile(null);
                  }}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-lg font-bold leading-none text-white"
                  aria-label="Remove advertisement image"
                >
                  ×
                </button>
              </div>
            ) : (
              <>
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#f6dc90] text-xl font-bold text-[#6f450e]">
                  +
                </div>
                <div className="text-sm font-semibold text-slate-700">Upload image</div>
                <div className="mt-1 text-xs text-slate-500">
                  Click the button above or this area to upload your banner
                </div>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
      {canSubmit ? (
        <div>
          <button onClick={handleSubmit} className="rounded bg-[#6f450e] px-4 py-2 text-white">
            Submit for approval
          </button>
        </div>
      ) : null}
    </div>
  );
}

function EditProfile({ profile, setProfile, setProfileSubmitted }: EditProfileProps) {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const apiBase = import.meta.env.VITE_API_BASE || '';
  const requestId = localStorage.getItem('join_request_id');

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    if (!requestId) {
      setError('No request found.');
      return;
    }
    try {
      const res = await fetch(`${apiBase}/api/join-requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: profile.fullName,
          role: profile.role,
          mobile_number: profile.mobile,
          country: profile.country,
          state: profile.state,
          district: profile.district,
          village: profile.village,
          extra: {
            entityName: profile.entityName,
            entityAddress: profile.entityAddress,
            photo_url: profile.photo || localStorage.getItem('join_request_photo') || undefined,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to submit profile update');
        return;
      }
      if (data.id) {
        localStorage.setItem('join_request_id', String(data.id));
      }
      setSuccess('Your profile update has been submitted for admin approval.');
      setProfileSubmitted(true);
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded border border-red-500 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded border border-green-500 bg-green-50 px-4 py-3 text-green-700">
          {success}
        </div>
      )}
      <div>
        <label className="block text-sm">Full Name</label>
        <input
          value={profile.fullName}
          onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))}
          className="mt-2 w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
        />
      </div>
      <div>
        <label className="block text-sm">Profile Photo</label>
        <div className="mt-2 flex items-center gap-4">
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-[#d3c69f] bg-white px-4 py-2 text-sm text-[#2f1f0e]">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  const preview = String(reader.result || '');
                  setProfile((p) => ({ ...p, photo: preview }));
                  localStorage.setItem('join_request_photo', preview);
                };
                reader.readAsDataURL(file);
              }}
            />
            <span className="text-sm font-semibold text-[#6f450e]">Choose file</span>
          </label>
          {profile.photo ? (
            <div className="flex items-center gap-2">
              <img
                src={profile.photo}
                alt="preview"
                className="h-16 w-16 rounded-full object-cover border border-[#6f450e]"
              />
              <button
                type="button"
                onClick={() => {
                  setProfile((p) => ({ ...p, photo: '' }));
                  localStorage.removeItem('join_request_photo');
                }}
                className="rounded border px-3 py-1 text-sm text-[#6f450e]"
              >
                Remove
              </button>
            </div>
          ) : (
            <img
              src="https://res.cloudinary.com/dttsqdjta/image/upload/v1785303609/Screenshot_2026-07-29_110956_nzkipz.png"
              alt="placeholder"
              className="h-16 w-16 rounded-full object-cover border border-[#6f450e]"
            />
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm">Role</label>
        <select
          value={profile.role}
          onChange={(e) => setProfile((p) => ({ ...p, role: e.target.value }))}
          className="mt-2 w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
        >
          <option value="volunteer">Volunteer</option>
          <option value="startups">Startups</option>
          <option value="editors">Editors</option>
          <option value="interns">Interns</option>
          <option value="incubators">Incubators/Accelerators</option>
        </select>
      </div>
      <div>
        <label className="block text-sm">Mobile Number</label>
        <input
          value={profile.mobile}
          onChange={(e) => setProfile((p) => ({ ...p, mobile: e.target.value }))}
          className="mt-2 w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
        />
      </div>
      <div>
        <label className="block text-sm">Country</label>
        <input
          value={profile.country}
          onChange={(e) => setProfile((p) => ({ ...p, country: e.target.value }))}
          className="mt-2 w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
        />
      </div>
      <div>
        <label className="block text-sm">State</label>
        <input
          value={profile.state}
          onChange={(e) => setProfile((p) => ({ ...p, state: e.target.value }))}
          className="mt-2 w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
        />
      </div>
      <div>
        <label className="block text-sm">District</label>
        <input
          value={profile.district}
          onChange={(e) => setProfile((p) => ({ ...p, district: e.target.value }))}
          className="mt-2 w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
        />
      </div>
      <div>
        <label className="block text-sm">Village</label>
        <input
          value={profile.village}
          onChange={(e) => setProfile((p) => ({ ...p, village: e.target.value }))}
          className="mt-2 w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
        />
      </div>
      {(profile.role === 'startups' || profile.role === 'incubators') && (
        <>
          <div>
            <label className="block text-sm">Entity Name</label>
            <input
              value={profile.entityName || ''}
              onChange={(e) => setProfile((p) => ({ ...p, entityName: e.target.value }))}
              className="mt-2 w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
            />
          </div>
          <div>
            <label className="block text-sm">Entity Address</label>
            <input
              value={profile.entityAddress || ''}
              onChange={(e) => setProfile((p) => ({ ...p, entityAddress: e.target.value }))}
              className="mt-2 w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
            />
          </div>
        </>
      )}
      <div className="mt-4">
        <button onClick={handleSubmit} className="rounded bg-[#6f450e] px-4 py-2 text-white">
          Submit for approval
        </button>
      </div>
    </div>
  );
}
