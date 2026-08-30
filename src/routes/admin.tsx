import { createFileRoute, redirect } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import useTranslate from '../hooks/useTranslate';
import { TopBar, Nav } from '../components/TopNav';

type AdminRequest = {
  id: number;
  full_name?: string;
  email?: string;
  role?: string;
  status?: string;
  created_at?: string;
  extra?: string | Record<string, string>;
};

type AdminNews = {
  id: number;
  headline?: string;
  byline?: string;
  subheading?: string;
  body?: string;
  credit?: string;
  reference_link?: string;
  editor_name?: string;
  editor_designation?: string;
  editor_affiliation?: string;
  category?: string;
  author_email?: string;
  author_name?: string;
  status?: string;
  title?: string;
  location?: string;
  poster_url?: string;
  created_at?: string;
};

type AdminAd = {
  id: number;
  title?: string;
  heading?: string;
  body?: string;
  category?: string;
  product_link?: string;
  author_email?: string;
  author_name?: string;
  status?: string;
  created_at?: string;
  image_url?: string;
};

type AdminScheme = {
  id: number;
  name?: string;
  organisation?: string;
  scheme_type?: string;
  description?: string;
  eligibility?: string;
  subheading?: string;
  deadline?: string;
  benefits?: string;
  apply_link?: string;
  keywords?: string;
  poster_url?: string;
  status?: string;
  created_at?: string;
  author_email?: string;
};

export const Route = createFileRoute('/admin')({
  head: () => ({ meta: [{ title: 'Admin - PashuSevak' }] }),
  loader: async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) throw redirect({ to: '/admin-login', throw: true });
    try {
      const res = await fetch((import.meta.env.VITE_API_BASE || '') + '/api/auth/verify', {
        headers: { Authorization: 'Bearer ' + token },
      });
      if (!res.ok) throw redirect({ to: '/admin-login', throw: true });
    } catch (e) {
      throw redirect({ to: '/admin-login', throw: true });
    }
    return null;
  },
  component: AdminPage,
});

function AdminPage() {
  const t = useTranslate();
  const apiBase = import.meta.env.VITE_API_BASE || '';
  const [tab, setTab] = useState('approvals');
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [expandedRequestId, setExpandedRequestId] = useState<number | null>(null);
  const [newsList, setNewsList] = useState<AdminNews[]>([]);
  const [adsList, setAdsList] = useState<AdminAd[]>([]);
  const [adsView, setAdsView] = useState<'approvals' | 'add'>('approvals');
  const [editingAdId, setEditingAdId] = useState<number | null>(null);
  const [editingAdDraft, setEditingAdDraft] = useState({
    category: 'news',
    headline: '',
    heading: '',
    subheading: '',
    body: '',
    product_link: '',
    image_url: '',
  });
  const [newAdDraft, setNewAdDraft] = useState({
    category: 'news',
    headline: '',
    heading: '',
    subheading: '',
    body: '',
    product_link: '',
    image_url: '',
  });
  const [newAdImagePreview, setNewAdImagePreview] = useState('');
  const [newAdErrors, setNewAdErrors] = useState({
    headline: '',
    subheading: '',
    productLink: '',
  });
  const newAdFileInputRef = useRef<HTMLInputElement | null>(null);
  const [editingNewsId, setEditingNewsId] = useState<number | null>(null);
  const [editingNewsDraft, setEditingNewsDraft] = useState({
    category: 'news',
    headline: '',
    subheading: '',
    byline: '',
    reference_link: '',
    body: '',
    credit: '',
    location: 'home-side',
    poster_url: '',
  });
  const [schemeDraft, setSchemeDraft] = useState({
    name: '',
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
  const [subscribersList, setSubscribersList] = useState<any[]>([]);
  const [schemesView, setSchemesView] = useState<'add' | 'approvals'>('add');
  const [schemesList, setSchemesList] = useState<AdminScheme[]>([]);
  const [message, setMessage] = useState('');
  const [editingErrors, setEditingErrors] = useState({
    adHeadline: '',
    adSubheading: '',
    newsHeadline: '',
    newsSubheading: '',
  });

  const dedupeByEmail = (items: AdminRequest[]) => {
    const seen = new Map<string, AdminRequest>();
    items.forEach((item) => {
      const key = item.email ? String(item.email) : String(item.id ?? '');
      const existing = seen.get(key);
      if (!existing) {
        seen.set(key, item);
      } else if (new Date(item.created_at || 0) > new Date(existing.created_at || 0)) {
        seen.set(key, item);
      }
    });
    return Array.from(seen.values());
  };

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(apiBase + '/api/admin/join-requests', {
        headers: { Authorization: 'Bearer ' + token },
      });
      if (res.ok) {
        const j = await res.json();
        setRequests(dedupeByEmail(j.rows || []));
      } else {
        console.error('Failed to fetch');
      }

      try {
        const nres = await fetch((import.meta.env.VITE_API_BASE || '') + '/api/news/admin/all', {
          headers: { Authorization: 'Bearer ' + token },
        });
        if (nres.ok) setNewsList((await nres.json()).rows || []);
      } catch (e) {
        console.error('Failed to fetch news list', e);
      }
      try {
        const ares = await fetch((import.meta.env.VITE_API_BASE || '') + '/api/ads/admin/all', {
          headers: { Authorization: 'Bearer ' + token },
        });
        if (ares.ok) setAdsList((await ares.json()).rows || []);
      } catch (e) {
        console.error('Failed to fetch ad list', e);
      }
      try {
        const sres = await fetch((import.meta.env.VITE_API_BASE || '') + '/api/schemes/admin/all', {
          headers: { Authorization: 'Bearer ' + token },
        });
        if (sres.ok) setSchemesList((await sres.json()).rows || []);
      } catch (e) {
        // schemes endpoint may not exist yet — log and continue
        console.error('Failed to fetch schemes list', e);
      }
      try {
        const subRes = await fetch((import.meta.env.VITE_API_BASE || '') + '/api/subscribers', {
          headers: { Authorization: 'Bearer ' + token },
        });
        if (subRes.ok) setSubscribersList((await subRes.json()).rows || []);
      } catch (e) {
        // no subscribers endpoint yet — ignore
        console.error('Failed to fetch subscribers', e);
      }
    })();
  }, []);

  const decide = async (id: number, action: string) => {
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(
        (import.meta.env.VITE_API_BASE || '') + `/api/admin/join-requests/${id}/decide`,
        {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
          body: JSON.stringify({ action }),
        }
      );
      if (!res.ok) {
        const json = await res.json();
        setMessage(json.error || 'Failed to update request');
        return;
      }
      setRequests((r) => r.map((x) => (x.id === id ? { ...x, status: action } : x)));
      setMessage(`Request ${action === 'accept' ? 'accepted' : 'rejected'} successfully.`);
    } catch (err) {
      setMessage('Network error while updating request.');
    }
  };

  const deleteRequest = async (id: number) => {
    const token = localStorage.getItem('admin_token');
    try {
      await fetch((import.meta.env.VITE_API_BASE || '') + `/api/admin/join-requests/${id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token },
      });
      setRequests((r) => r.filter((x: AdminRequest) => x.id !== id));
      setMessage('Request removed successfully.');
    } catch (err) {
      setMessage('Failed to remove request.');
    }
  };

  const decideNews = async (id: number, action: string) => {
    const token = localStorage.getItem('admin_token');
    // find the item so we can include placement info when accepting
    const item = newsList.find((x) => x.id === id);
    const payload: Record<string, any> = { action };
    if (action === 'accept' && item) {
      payload.location = item.location || 'home-side';
      payload.category = item.category || 'news';
      payload.subheading = item.subheading || '';
    }

    try {
      const res = await fetch(
        (import.meta.env.VITE_API_BASE || '') + `/api/news/admin/${id}/decide`,
        {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setMessage(json.error || 'Failed to update news status');
        return;
      }
      setNewsList((n) => n.map((x) => (x.id === id ? { ...x, status: action } : x)));
    } catch (err) {
      setMessage('Network error while updating news status.');
    }
  };

  const deleteNews = async (id: number) => {
    const token = localStorage.getItem('admin_token');
    try {
      await fetch((import.meta.env.VITE_API_BASE || '') + `/api/news/${id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token },
      });
      setNewsList((n) => n.filter((x: AdminNews) => x.id !== id));
      setMessage('News removed successfully.');
    } catch (err) {
      setMessage('Failed to remove news.');
    }
  };

  const decideAd = async (id: number, action: string) => {
    const token = localStorage.getItem('admin_token');
    const body = { action };
    try {
      const res = await fetch(apiBase + `/api/ads/admin/${id}/decide`, {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage(data.error || 'Failed to update advertisement status');
        return;
      }
      setAdsList((a) => a.map((x) => (x.id === id ? { ...x, status: action } : x)));
      setMessage(
        action === 'accept'
          ? 'Advertisement accepted.'
          : action === 'reject'
            ? 'Advertisement rejected.'
            : 'Advertisement updated.'
      );
    } catch (err) {
      setMessage('Network error while updating advertisement status.');
    }
  };

  const createAd = async () => {
    setMessage('');
    setNewAdErrors({ headline: '', subheading: '', productLink: '' });
    if (!newAdDraft.headline.trim() || !newAdDraft.body.trim() || !newAdDraft.image_url.trim()) {
      setMessage('Please complete headline, body, and upload a poster image before submitting.');
      return;
    }
    try {
      const res = await fetch(apiBase + '/api/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: newAdDraft.category,
          headline: newAdDraft.headline,
          heading: newAdDraft.heading,
          subheading: newAdDraft.subheading,
          body: newAdDraft.body,
          product_link: newAdDraft.product_link,
          image_url: newAdDraft.image_url,
          author_email: localStorage.getItem('join_request_email') || 'admin@pashusevak.in',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || 'Failed to submit advertisement.');
        return;
      }
      setAdsList((prev) => [
        {
          id: data.id,
          category: newAdDraft.category,
          title: newAdDraft.headline,
          heading: newAdDraft.heading,
          subheading: newAdDraft.subheading,
          body: newAdDraft.body,
          product_link: newAdDraft.product_link,
          image_url: newAdDraft.image_url,
          status: 'pending',
          author_email: localStorage.getItem('join_request_email') || 'admin@pashusevak.in',
        },
        ...prev,
      ]);
      setMessage('Advertisement submitted successfully.');
      setNewAdDraft({
        category: 'news',
        headline: '',
        heading: '',
        subheading: '',
        body: '',
        product_link: '',
        image_url: '',
      });
      setNewAdImagePreview('');
    } catch (err) {
      setMessage('Network error while submitting advertisement.');
    }
  };

  const decideScheme = async (id: number, action: string) => {
    const token = localStorage.getItem('admin_token');
    await fetch((import.meta.env.VITE_API_BASE || '') + `/api/schemes/admin/${id}/decide`, {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });
    setSchemesList((s) => s.map((x) => (x.id === id ? { ...x, status: action } : x)));
  };

  const deleteScheme = async (id: number) => {
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch((import.meta.env.VITE_API_BASE || '') + `/api/schemes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token },
      });
      if (!res.ok) {
        setMessage('Failed to remove scheme.');
        return;
      }
      setSchemesList((schemes) => schemes.filter((scheme) => scheme.id !== id));
      setMessage('Scheme removed successfully.');
    } catch (err) {
      setMessage('Failed to remove scheme.');
    }
  };

  const deleteAd = async (id: number) => {
    const token = localStorage.getItem('admin_token');
    try {
      await fetch((import.meta.env.VITE_API_BASE || '') + `/api/ads/${id}`, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token },
      });
      setAdsList((a) => a.filter((x: AdminAd) => x.id !== id));
      setMessage('Advertisement removed successfully.');
    } catch (err) {
      setMessage('Failed to remove advertisement.');
    }
  };

  const saveAdChanges = async (id: number) => {
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(apiBase + `/api/ads/admin/${id}/decide`, {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'modify',
          category: editingAdDraft.category,
          headline: editingAdDraft.headline,
          heading: (editingAdDraft as any).heading || '',
          subheading: (editingAdDraft as any).subheading || '',
          body: editingAdDraft.body,
          product_link: (editingAdDraft as any).product_link || '',
          image_url: editingAdDraft.image_url,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || 'Failed to save advertisement');
        return;
      }
      setAdsList((a) =>
        a.map((x) =>
          x.id === id
            ? {
                ...x,
                category: editingAdDraft.category,
                title: editingAdDraft.headline,
                heading: (editingAdDraft as any).heading || '',
                subheading: (editingAdDraft as any).subheading || '',
                body: editingAdDraft.body,
                product_link: (editingAdDraft as any).product_link || '',
                image_url: editingAdDraft.image_url,
                status: 'accept',
              }
            : x
        )
      );
      setEditingAdId(null);
      setMessage('Advertisement updated and approved.');
    } catch (err) {
      setMessage('Network error while saving advertisement.');
    }
  };

  const saveNewsChanges = async (id: number) => {
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(
        (import.meta.env.VITE_API_BASE || '') + `/api/news/admin/${id}/decide`,
        {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'modify',
            category: editingNewsDraft.category,
            headline: editingNewsDraft.headline,
            byline: editingNewsDraft.byline,
            subheading: (editingNewsDraft as any).subheading || '',
            body: editingNewsDraft.body,
            credit: editingNewsDraft.credit,
            reference_link: editingNewsDraft.reference_link,
            location: editingNewsDraft.location,
            poster_url: editingNewsDraft.poster_url,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || 'Failed to save news');
        return;
      }
      setNewsList((n) =>
        n.map((x) =>
          x.id === id
            ? {
                ...x,
                category: editingNewsDraft.category,
                headline: editingNewsDraft.headline,
                byline: editingNewsDraft.byline,
                subheading: (editingNewsDraft as any).subheading || '',
                body: editingNewsDraft.body,
                credit: editingNewsDraft.credit,
                reference_link: editingNewsDraft.reference_link,
                location: editingNewsDraft.location,
                poster_url: editingNewsDraft.poster_url,
                status: 'accept',
              }
            : x
        )
      );
      setEditingNewsId(null);
      setMessage('News updated and approved.');
    } catch (err) {
      setMessage('Network error while saving news.');
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8C21B' }}>
      <TopBar />
      <Nav />
      <main className="mx-auto max-w-5xl p-6" style={{ backgroundColor: '#F8C21B' }}>
        <h1 className="text-2xl font-bold">{t('Admin Dashboard')}</h1>
        {message ? (
          <div className="my-4 rounded border border-[#6f450e] bg-[#f8f1d0] px-4 py-3 text-[#5a3c09]">
            {message}
          </div>
        ) : null}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-4 sm:gap-4">
          {[
            { id: 'approvals', label: 'Approvals' },
            { id: 'add-news', label: 'Add News' },
            { id: 'manage-ads', label: 'Manage Advertisements' },
            { id: 'news-approvals', label: 'News Approvals' },
            { id: 'schemes', label: 'Schemes / Opportunities' },
            { id: 'subscribers', label: 'Subscribers' },
          ].map((b) => {
            const active = tab === b.id;
            const bg = active ? '#6F450E' : '#9DBB0B';
            const color = active ? '#F8C21B' : '#6F450E';
            return (
              <button
                key={b.id}
                onClick={() => setTab(b.id)}
                className="w-full rounded-lg px-4 py-3 text-sm font-semibold transition-shadow"
                style={{ backgroundColor: bg, color, border: '1px solid #6F450E' }}
              >
                {b.label}
              </button>
            );
          })}
        </div>

        <section className="mt-6">
          {tab === 'approvals' && (
            <div>
              <h2 className="text-xl font-semibold">{t('Join Requests')}</h2>
              <div className="mt-4 space-y-4">
                {requests.map((r) => {
                  const extra =
                    typeof r.extra === 'string' ? JSON.parse(r.extra || '{}') : r.extra || {};
                  const expanded = expandedRequestId === r.id;
                  return (
                    <div
                      key={r.id}
                      className="relative rounded border p-3"
                      onClick={() => setExpandedRequestId(expanded ? null : r.id)}
                      style={{ cursor: 'pointer', borderColor: '#9DBB0B' }}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            deleteRequest(r.id);
                          }}
                          className="absolute -top-2 -right-2 z-10 w-6 h-6 flex items-center justify-center text-sm font-semibold text-red-600 hover:text-red-700 bg-white rounded-md border border-red-600 shadow-sm"
                          aria-label="Delete request"
                        >
                          ×
                        </button>
                        <div>
                          <div className="font-semibold">{r.full_name}</div>
                          <div className="text-sm text-gray-600">
                            {r.role} • {r.email}
                          </div>
                          {typeof r.extra === 'object' &&
                          r.extra !== null &&
                          'approval_type' in r.extra &&
                          r.extra.approval_type === 'profile-update' ? (
                            <div className="mt-1 inline-flex rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
                              Profile Update Request
                            </div>
                          ) : null}
                        </div>
                        <div className="space-x-2">
                          {r.status === 'accept' ? (
                            <button
                              className="rounded px-3 py-1 text-white"
                              style={{ backgroundColor: '#16a34a' }}
                              disabled
                            >
                              Accepted
                            </button>
                          ) : r.status === 'reject' ? (
                            <button
                              className="rounded px-3 py-1 text-white"
                              style={{ backgroundColor: '#dc2626' }}
                              disabled
                            >
                              Rejected
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  decide(r.id, 'accept');
                                }}
                                className="rounded bg-green-600 px-3 py-1 text-white"
                              >
                                Accept
                              </button>
                              <button
                                onClick={(event) => {
                                  event.stopPropagation();
                                  decide(r.id, 'reject');
                                }}
                                className="rounded bg-red-600 px-3 py-1 text-white"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      {expanded ? (
                        <div className="mt-4 rounded border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800">
                          <div className="grid gap-2 sm:grid-cols-2">
                            <div>
                              <span className="font-semibold">Email:</span> {r.email}
                            </div>
                            <div>
                              <span className="font-semibold">Role:</span> {r.role}
                            </div>
                            <div>
                              <span className="font-semibold">Status:</span> {r.status}
                            </div>
                            <div>
                              <span className="font-semibold">Created:</span>{' '}
                              {new Date(r.created_at || 0).toLocaleString()}
                            </div>
                          </div>
                          {extra.mobile_number ? (
                            <div className="mt-3">
                              <span className="font-semibold">Mobile:</span> {extra.mobile_number}
                            </div>
                          ) : null}
                          {extra.country ? (
                            <div>
                              <span className="font-semibold">Country:</span> {extra.country}
                            </div>
                          ) : null}
                          {extra.state ? (
                            <div>
                              <span className="font-semibold">State:</span> {extra.state}
                            </div>
                          ) : null}
                          {extra.district ? (
                            <div>
                              <span className="font-semibold">District:</span> {extra.district}
                            </div>
                          ) : null}
                          {extra.village ? (
                            <div>
                              <span className="font-semibold">Village:</span> {extra.village}
                            </div>
                          ) : null}
                          {extra.entityName ? (
                            <div>
                              <span className="font-semibold">Entity Name:</span> {extra.entityName}
                            </div>
                          ) : null}
                          {extra.entityAddress ? (
                            <div>
                              <span className="font-semibold">Entity Address:</span>{' '}
                              {extra.entityAddress}
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
                {requests.length === 0 && <div className="text-gray-600">No requests</div>}
              </div>
            </div>
          )}
          {tab === 'add-news' && (
            <div className="mt-4 space-y-6">
              <h3 className="font-semibold">Add News</h3>
              <AdminAddNews onCreate={(newItem) => setNewsList((prev) => [newItem, ...prev])} />
              <div>
                <h4 className="font-semibold">Existing News</h4>
                <div className="mt-3 space-y-4">
                  {newsList.map((n) => (
                    <div
                      key={n.id}
                      className="relative rounded border p-3"
                      style={{ borderColor: '#9DBB0B' }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold">{n.headline}</div>
                          {n.subheading ? (
                            <div className="text-sm text-gray-700">{n.subheading}</div>
                          ) : null}
                          <div className="text-sm text-gray-600">
                            {`${n.byline ? `${n.byline} • ` : ''}${n.created_at ? new Date(n.created_at).toLocaleString() : 'Today'}`}
                          </div>
                          <div className="text-sm text-gray-600">{n.author_email}</div>
                          <div className="mt-2 text-sm text-gray-700">{n.body?.slice(0, 200)}</div>
                        </div>
                        <button
                          onClick={() => deleteNews(n.id)}
                          className="absolute -top-2 -right-2 z-10 w-6 h-6 flex items-center justify-center text-sm font-semibold text-red-600 hover:text-red-700 bg-white rounded-md border border-red-600 shadow-sm"
                          aria-label="Delete news"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                  {newsList.length === 0 && <div className="text-gray-600">No news</div>}
                </div>
              </div>
            </div>
          )}
          {tab === 'manage-ads' && (
            <div className="mt-4 space-y-4">
              <h3 className="font-semibold">Manage Advertisements</h3>
              <div className="flex flex-wrap gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setAdsView('approvals')}
                  className={`rounded-lg px-4 py-2 font-semibold ${
                    adsView === 'approvals'
                      ? 'bg-[#6f450e] text-[#F8C21B]'
                      : 'bg-[#fff8dc] text-[#6f450e]'
                  }`}
                >
                  Manage Advertisement Approvals
                </button>
                <button
                  type="button"
                  onClick={() => setAdsView('add')}
                  className={`rounded-lg px-4 py-2 font-semibold ${
                    adsView === 'add'
                      ? 'bg-[#6f450e] text-[#F8C21B]'
                      : 'bg-[#fff8dc] text-[#6f450e]'
                  }`}
                >
                  Add Advertisement
                </button>
              </div>

              {adsView === 'add' ? (
                <div className="mt-3 space-y-4 rounded-lg border border-[#d3c69f] bg-[#F8C21B] p-4 shadow-sm">
                  <div>
                    <label className="block text-sm font-semibold">Headline</label>
                    <input
                      value={newAdDraft.headline}
                      onChange={(e) => {
                        const words = String(e.target.value).split(/\s+/).filter(Boolean);
                        if (words.length > 15) {
                          setNewAdErrors((prev) => ({ ...prev, headline: 'More than 15 words' }));
                        } else {
                          setNewAdErrors((prev) => ({ ...prev, headline: '' }));
                        }
                        setNewAdDraft((draft) => ({
                          ...draft,
                          headline: words.slice(0, 15).join(' '),
                        }));
                      }}
                      className="mt-2 w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
                    />
                    {newAdErrors.headline ? (
                      <div className="mt-1 text-xs text-red-700">{newAdErrors.headline}</div>
                    ) : null}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold">Advertisement Heading</label>
                    <input
                      value={newAdDraft.heading}
                      onChange={(e) =>
                        setNewAdDraft((draft) => ({ ...draft, heading: e.target.value }))
                      }
                      className="mt-2 w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold">Subheading</label>
                    <input
                      value={newAdDraft.subheading}
                      onChange={(e) => {
                        const words = String(e.target.value).split(/\s+/).filter(Boolean);
                        if (words.length > 30) {
                          setNewAdErrors((prev) => ({ ...prev, subheading: 'More than 30 words' }));
                        } else {
                          setNewAdErrors((prev) => ({ ...prev, subheading: '' }));
                        }
                        setNewAdDraft((draft) => ({
                          ...draft,
                          subheading: words.slice(0, 30).join(' '),
                        }));
                      }}
                      className="mt-2 w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
                    />
                    {newAdErrors.subheading ? (
                      <div className="mt-1 text-xs text-red-700">{newAdErrors.subheading}</div>
                    ) : null}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold">Body</label>
                    <textarea
                      value={newAdDraft.body}
                      onChange={(e) =>
                        setNewAdDraft((draft) => ({ ...draft, body: e.target.value }))
                      }
                      className="mt-2 w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
                      rows={6}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold">Product Link</label>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <input
                        value={newAdDraft.product_link}
                        onChange={(e) =>
                          setNewAdDraft((draft) => ({ ...draft, product_link: e.target.value }))
                        }
                        className="w-full rounded border px-3 py-2 bg-[#6f450e] text-[#F8C21B] placeholder-white"
                        placeholder="https://"
                      />
                      {newAdDraft.product_link ? (
                        <a
                          href={newAdDraft.product_link}
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
                    <label className="block text-sm font-semibold">
                      Upload Advertisement Poster
                    </label>
                    <div
                      className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-slate-500 transition hover:border-slate-400 hover:bg-slate-100"
                      onClick={() => newAdFileInputRef.current?.click()}
                    >
                      {newAdImagePreview ? (
                        <div className="relative">
                          <img
                            src={newAdImagePreview}
                            alt="Advertisement preview"
                            className="max-h-48 w-full object-contain"
                          />
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              setNewAdImagePreview('');
                              setNewAdDraft((draft) => ({ ...draft, image_url: '' }));
                            }}
                            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-lg font-bold leading-none text-white"
                            aria-label="Remove advertisement poster"
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
                            Click this area to upload your poster
                          </div>
                        </>
                      )}
                    </div>
                    <input
                      ref={newAdFileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => {
                          const preview = String(reader.result || '');
                          setNewAdImagePreview(preview);
                          setNewAdDraft((draft) => ({ ...draft, image_url: preview }));
                        };
                        reader.readAsDataURL(file);
                      }}
                      className="hidden"
                    />
                  </div>
                  <div>
                    <button
                      onClick={createAd}
                      className="rounded bg-[#6f450e] px-4 py-2 text-[#F8C21B]"
                    >
                      Submit Advertisement
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 space-y-4">
                  {adsList
                    .filter((ad) => ad.status !== 'reject')
                    .map((a) => {
                      const isEditing = editingAdId === a.id;
                      const statusLabel =
                        a.status === 'accept'
                          ? 'Accepted'
                          : a.status === 'pending'
                            ? 'Pending'
                            : a.status === 'reject'
                              ? 'Rejected'
                              : 'Unknown';
                      const statusClass =
                        a.status === 'accept'
                          ? 'text-green-700'
                          : a.status === 'pending'
                            ? 'text-yellow-700'
                            : 'text-red-700';
                      return (
                        <div
                          key={a.id}
                          className="relative rounded border p-3 bg-white"
                          style={{ borderColor: '#9DBB0B' }}
                        >
                          <div className="flex flex-col gap-3">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                              <button
                                onClick={() => deleteAd(a.id)}
                                className="absolute -top-2 -right-2 z-10 w-6 h-6 flex items-center justify-center text-sm font-semibold text-red-600 hover:text-red-700 bg-white rounded-md border border-red-600 shadow-sm"
                                aria-label="Delete advertisement"
                              >
                                ×
                              </button>
                              <div>
                                <div className="font-semibold">{a.title || 'Advertisement'}</div>
                                <div className="text-sm text-gray-600">
                                  {a.author_name || a.author_email}
                                </div>
                              </div>
                              <div className="text-sm text-slate-600">
                                {new Date(a.created_at || 0).toLocaleString()}
                              </div>
                            </div>
                            <div className="grid gap-2 sm:grid-cols-2">
                              <div>
                                <span className="font-semibold">Category:</span>{' '}
                                {a.category || 'News'}
                              </div>
                              <div>
                                <span className="font-semibold">Status:</span>{' '}
                                <span className={statusClass}>{statusLabel}</span>
                              </div>
                            </div>
                            <div>
                              <div className="font-semibold">Body</div>
                              <p className="text-sm text-gray-700">{a.body}</p>
                            </div>
                            {a.image_url ? (
                              <div className="rounded border border-slate-200 p-2">
                                <img
                                  src={a.image_url}
                                  alt="Ad banner"
                                  className="max-h-48 w-full object-contain"
                                />
                              </div>
                            ) : null}
                            {isEditing ? (
                              <div className="space-y-3 rounded border border-slate-200 bg-slate-50 p-4">
                                <div>
                                  <label className="block text-sm font-semibold">Category</label>
                                  <select
                                    value={editingAdDraft.category}
                                    onChange={(e) =>
                                      setEditingAdDraft((draft) => ({
                                        ...draft,
                                        category: e.target.value,
                                      }))
                                    }
                                    className="mt-1 w-full rounded border px-3 py-2"
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
                                    value={editingAdDraft.headline}
                                    onChange={(e) => {
                                      const words = e.target.value.split(/\s+/).filter(Boolean);
                                      if (words.length > 15) {
                                        setEditingErrors((s) => ({
                                          ...s,
                                          adHeadline: 'More than 15 words',
                                        }));
                                      } else {
                                        setEditingErrors((s) => ({ ...s, adHeadline: '' }));
                                      }
                                      setEditingAdDraft((draft) => ({
                                        ...draft,
                                        headline: words.slice(0, 15).join(' '),
                                      }));
                                    }}
                                    className="mt-1 w-full rounded border px-3 py-2"
                                  />
                                  {editingErrors.adHeadline ? (
                                    <div className="mt-1 text-xs text-red-700">
                                      {editingErrors.adHeadline}
                                    </div>
                                  ) : null}
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold">Heading</label>
                                  <input
                                    value={editingAdDraft.heading}
                                    onChange={(e) =>
                                      setEditingAdDraft((draft) => ({
                                        ...draft,
                                        heading: e.target.value,
                                      }))
                                    }
                                    className="mt-1 w-full rounded border px-3 py-2"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold">Subheading</label>
                                  <input
                                    value={editingAdDraft.subheading}
                                    onChange={(e) => {
                                      const words = e.target.value.split(/\s+/).filter(Boolean);
                                      if (words.length > 30) {
                                        setEditingErrors((s) => ({
                                          ...s,
                                          adSubheading: 'More than 30 words',
                                        }));
                                      } else {
                                        setEditingErrors((s) => ({ ...s, adSubheading: '' }));
                                      }
                                      setEditingAdDraft((draft) => ({
                                        ...draft,
                                        subheading: words.slice(0, 30).join(' '),
                                      }));
                                    }}
                                    className="mt-1 w-full rounded border px-3 py-2"
                                  />
                                  {editingErrors.adSubheading ? (
                                    <div className="mt-1 text-xs text-red-700">
                                      {editingErrors.adSubheading}
                                    </div>
                                  ) : null}
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold">
                                    Product Link
                                  </label>
                                  <input
                                    value={editingAdDraft.product_link}
                                    onChange={(e) =>
                                      setEditingAdDraft((draft) => ({
                                        ...draft,
                                        product_link: e.target.value,
                                      }))
                                    }
                                    className="mt-1 w-full rounded border px-3 py-2"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold">Body</label>
                                  <textarea
                                    value={editingAdDraft.body}
                                    onChange={(e) =>
                                      setEditingAdDraft((draft) => ({
                                        ...draft,
                                        body: e.target.value,
                                      }))
                                    }
                                    className="mt-1 w-full rounded border px-3 py-2"
                                    rows={5}
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-semibold">
                                    Banner Image URL
                                  </label>
                                  <input
                                    value={editingAdDraft.image_url}
                                    onChange={(e) =>
                                      setEditingAdDraft((draft) => ({
                                        ...draft,
                                        image_url: e.target.value,
                                      }))
                                    }
                                    className="mt-1 w-full rounded border px-3 py-2"
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => saveAdChanges(a.id)}
                                    className="rounded bg-[#6f450e] px-4 py-2 text-white"
                                  >
                                    Save and Approve
                                  </button>
                                  <button
                                    onClick={() => setEditingAdId(null)}
                                    className="rounded border border-slate-300 px-4 py-2 text-slate-700"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-wrap gap-2">
                                {a.status !== 'accept' ? (
                                  <>
                                    <button
                                      onClick={() => decideAd(a.id, 'accept')}
                                      className="rounded bg-green-600 px-3 py-1 text-white"
                                    >
                                      Accept
                                    </button>
                                    <button
                                      onClick={() => decideAd(a.id, 'reject')}
                                      className="rounded bg-red-600 px-3 py-1 text-white"
                                    >
                                      Reject
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    className="rounded bg-green-600 px-3 py-1 text-white"
                                    disabled
                                  >
                                    Accepted
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    setEditingAdId(a.id);
                                    setEditingAdDraft({
                                      category: a.category || 'news',
                                      headline: a.title || '',
                                      heading: (a as any).heading || '',
                                      subheading: (a as any).subheading || '',
                                      body: a.body || '',
                                      product_link: (a as any).product_link || '',
                                      image_url: a.image_url || '',
                                    });
                                  }}
                                  className="rounded border border-slate-300 bg-white px-3 py-1 text-slate-700"
                                >
                                  Modify
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  {adsList.length === 0 && <div className="text-gray-600">No ads</div>}
                </div>
              )}
            </div>
          )}
          {tab === 'schemes' && (
            <div className="mt-4 space-y-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSchemesView('add')}
                  className={`rounded-lg px-4 py-2 font-semibold ${schemesView === 'add' ? 'bg-[#6f450e] text-[#F8C21B]' : 'bg-[#fff8dc] text-[#6f450e]'}`}
                >
                  Schemes / Opportunities
                  <div className="text-xs font-normal">
                    Add a new scheme or opportunity for review.
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setSchemesView('approvals')}
                  className={`rounded-lg px-4 py-2 font-semibold ${schemesView === 'approvals' ? 'bg-[#6f450e] text-[#F8C21B]' : 'bg-[#fff8dc] text-[#6f450e]'}`}
                >
                  Schemes / Opportunities
                  <div className="text-xs font-normal">Approvals from users</div>
                </button>
              </div>

              {schemesView === 'add' ? (
                <div className="space-y-4 rounded-xl border border-[#6f450e] bg-[#F8C21B] p-4 shadow-sm">
                  <div className="rounded-xl border border-[#6f450e] bg-[#9DBB0B] p-4 text-[#6f450e]">
                    <h3 className="text-xl font-semibold">Schemes / Opportunities</h3>
                    <p className="mt-2 text-sm">
                      Add a new scheme or opportunity for review. Fill in the details and submit it.
                    </p>
                  </div>
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
                    <input
                      type="date"
                      value={schemeDraft.deadline}
                      onChange={(e) =>
                        setSchemeDraft((draft) => ({ ...draft, deadline: e.target.value }))
                      }
                      className="mt-2 w-full rounded border px-3 py-2 bg-[#6f450e] text-white placeholder-white"
                    />
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
                    <label className="block text-sm font-semibold text-[#6f450e]">Apply link</label>
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
                      onClick={async () => {
                        if (
                          !schemeDraft.name.trim() ||
                          !schemeDraft.organisation.trim() ||
                          !schemeDraft.description.trim()
                        ) {
                          setMessage('Name, organisation, and description are required.');
                          return;
                        }
                        try {
                          const res = await fetch(
                            (import.meta.env.VITE_API_BASE || '') + '/api/schemes',
                            {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                name: schemeDraft.name,
                                organisation: schemeDraft.organisation,
                                scheme_type: schemeDraft.type,
                                description: schemeDraft.description,
                                eligibility: schemeDraft.eligibility,
                                deadline: schemeDraft.deadline,
                                benefits: schemeDraft.benefits,
                                apply_link: schemeDraft.apply_link,
                                keywords: schemeDraft.keywords,
                                poster_url: schemeDraft.posterPreview,
                                author_email: 'admin@pashusevak',
                              }),
                            }
                          );
                          const data = await res.json();
                          if (!res.ok) {
                            setMessage(data.error || 'Failed to submit scheme.');
                            return;
                          }
                          setMessage('Scheme submitted successfully.');
                          setSchemeDraft({
                            name: '',
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
                          setMessage('Network error while submitting scheme.');
                        }
                      }}
                      className="rounded bg-[#6f450e] px-4 py-2 text-[#F8C21B]"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 space-y-4">
                  {schemesList.map((s) => (
                    <div key={s.id} className="rounded border p-3 bg-white">
                      <div className="font-semibold">{s.name}</div>
                      <div className="text-sm text-gray-600">
                        {s.organisation} • {s.author_email}
                      </div>
                      <div className="mt-2 space-y-1 text-sm text-gray-700">
                        {s.subheading ? (
                          <div>
                            <strong>Subheading:</strong> {s.subheading}
                          </div>
                        ) : null}
                        <div>
                          <strong>Description:</strong> {s.description}
                        </div>
                        <div>
                          <strong>Eligibility:</strong> {s.eligibility || 'Not specified'}
                        </div>
                        <div>
                          <strong>Deadline:</strong> {s.deadline || 'Not specified'}
                        </div>
                        <div>
                          <strong>Benefits:</strong> {s.benefits || 'Not specified'}
                        </div>
                        <div>
                          <strong>Keywords:</strong> {s.keywords || 'Not specified'}
                        </div>
                        {s.apply_link ? (
                          <div>
                            <strong>Apply link:</strong> {s.apply_link}
                          </div>
                        ) : null}
                        {s.poster_url ? (
                          <img
                            src={s.poster_url}
                            alt={s.name || 'Scheme poster'}
                            className="mt-2 max-h-48 rounded object-contain"
                          />
                        ) : null}
                      </div>
                      <div className="flex flex-wrap gap-2 pt-3">
                        {s.status === 'accept' ? (
                          <div className="flex items-center gap-2">
                            <button
                              className="rounded px-3 py-1 text-white"
                              style={{ backgroundColor: '#16a34a' }}
                              disabled
                            >
                              Accepted
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteScheme(s.id)}
                              className="flex h-8 w-8 items-center justify-center rounded bg-red-600 text-lg font-bold leading-none text-white transition hover:bg-red-700"
                              aria-label={`Remove ${s.name}`}
                              title="Remove scheme"
                            >
                              ×
                            </button>
                          </div>
                        ) : s.status === 'reject' ? (
                          <button
                            className="rounded px-3 py-1 text-white"
                            style={{ backgroundColor: '#dc2626' }}
                            disabled
                          >
                            Rejected
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => decideScheme(s.id, 'accept')}
                              className="rounded bg-green-600 px-3 py-1 text-white"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => decideScheme(s.id, 'reject')}
                              className="rounded bg-red-600 px-3 py-1 text-white"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  {schemesList.length === 0 && (
                    <div className="text-gray-600">No schemes awaiting approval</div>
                  )}
                </div>
              )}
            </div>
          )}
          {tab === 'subscribers' && (
            <div className="mt-4">
              <h3 className="font-semibold">Subscribers</h3>
              <div className="mt-3 space-y-4">
                {subscribersList.length > 0 ? (
                  subscribersList.map((s: any) => (
                    <div
                      key={s.email || s.id}
                      className="rounded border p-4 bg-white shadow-sm"
                      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                    >
                      <div className="text-lg font-semibold leading-tight text-slate-900">
                        {s.name || s.email}
                      </div>
                      <div className="mt-1 text-sm leading-relaxed text-slate-600">{s.email}</div>
                      <div className="mt-2 text-xs text-slate-500">
                        {s.created_at || s.subscribed_at || ''}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-600">No subscribers</div>
                )}
              </div>
            </div>
          )}

          {tab === 'news-approvals' && (
            <div className="mt-4 space-y-4">
              <h3 className="font-semibold">News Approvals</h3>
              <div className="mt-3 space-y-4">
                {newsList.map((n) => {
                  const isEditingNews = editingNewsId === n.id;
                  return (
                    <div
                      key={n.id}
                      className="relative rounded border p-3 bg-white"
                      style={{ borderColor: '#9DBB0B' }}
                    >
                      {isEditingNews ? (
                        <div className="space-y-4 rounded border border-slate-200 bg-slate-50 p-4">
                          <div>
                            <label className="block text-sm font-semibold">Category</label>
                            <select
                              value={editingNewsDraft.category}
                              onChange={(e) =>
                                setEditingNewsDraft((draft) => ({
                                  ...draft,
                                  category: e.target.value,
                                }))
                              }
                              className="mt-1 w-full rounded border px-3 py-2"
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
                              value={editingNewsDraft.headline}
                              onChange={(e) => {
                                const words = e.target.value.split(/\s+/).filter(Boolean);
                                if (words.length > 15) {
                                  setEditingErrors((s) => ({
                                    ...s,
                                    newsHeadline: 'More than 15 words',
                                  }));
                                } else {
                                  setEditingErrors((s) => ({ ...s, newsHeadline: '' }));
                                }
                                setEditingNewsDraft((draft) => ({
                                  ...draft,
                                  headline: words.slice(0, 15).join(' '),
                                }));
                              }}
                              className="mt-1 w-full rounded border px-3 py-2"
                            />
                            {editingErrors.newsHeadline ? (
                              <div className="mt-1 text-xs text-red-700">
                                {editingErrors.newsHeadline}
                              </div>
                            ) : null}
                          </div>
                          <div>
                            <label className="block text-sm font-semibold">Byline Story</label>
                            <input
                              value={editingNewsDraft.byline}
                              onChange={(e) =>
                                setEditingNewsDraft((draft) => ({
                                  ...draft,
                                  byline: e.target.value,
                                }))
                              }
                              className="mt-1 w-full rounded border px-3 py-2"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold">Reference Link</label>
                            <input
                              value={editingNewsDraft.reference_link}
                              onChange={(e) =>
                                setEditingNewsDraft((draft) => ({
                                  ...draft,
                                  reference_link: e.target.value,
                                }))
                              }
                              placeholder="https://"
                              className="mt-1 w-full rounded border px-3 py-2"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold">Body</label>
                            <textarea
                              value={editingNewsDraft.body}
                              onChange={(e) =>
                                setEditingNewsDraft((draft) => ({
                                  ...draft,
                                  body: e.target.value,
                                }))
                              }
                              className="mt-1 w-full rounded border px-3 py-2"
                              rows={6}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold">News placement</label>
                            <select
                              value={editingNewsDraft.location}
                              onChange={(e) =>
                                setEditingNewsDraft((draft) => ({
                                  ...draft,
                                  location: e.target.value,
                                }))
                              }
                              className="mt-1 w-full rounded border px-3 py-2"
                            >
                              <option value="home-main">Homepage top story</option>
                              <option value="home-side">Homepage sidebar</option>
                              <option value="home-view-all">Homepage view all</option>
                            </select>
                            <div className="mt-3 rounded-2xl bg-[#fff8dc] p-3 text-sm text-[#6f450e] border border-[#6f450e33]">
                              {(() => {
                                const previews: Record<string, string> = {
                                  'home-main':
                                    'https://res.cloudinary.com/dttsqdjta/image/upload/v1785303557/Screenshot_2026-07-29_110823_ffvxjk.png',
                                  'home-side':
                                    'https://res.cloudinary.com/dttsqdjta/image/upload/v1785303587/Screenshot_2026-07-29_110932_zr4afa.png',
                                  'home-view-all':
                                    'https://res.cloudinary.com/dttsqdjta/image/upload/v1785303609/Screenshot_2026-07-29_110956_nzkipz.png',
                                };
                                const src = previews[editingNewsDraft.location || 'home-side'];
                                return src ? (
                                  <a
                                    href={src}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-semibold text-[#6f450e] underline"
                                  >
                                    View location preview image
                                  </a>
                                ) : (
                                  <span>Select a placement to preview</span>
                                );
                              })()}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold">
                              Upload poster image
                            </label>
                            <label className="mt-2 flex min-h-[150px] cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-[#9DBB0B] bg-[#fffcdf] p-5 text-center text-[#6f450e] transition hover:border-[#6f450e]">
                              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F8C21B] text-3xl font-bold text-[#6f450e]">
                                +
                              </span>
                              <div className="text-sm font-semibold">Upload image</div>
                              <div className="text-xs text-[#6f450e]">
                                Select a poster to show with this news item
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
                                    setEditingNewsDraft((draft) => ({
                                      ...draft,
                                      poster_url: preview,
                                    }));
                                  };
                                  reader.readAsDataURL(file);
                                }}
                                className="sr-only"
                              />
                            </label>
                            {editingNewsDraft.poster_url ? (
                              <div className="relative mt-3">
                                <img
                                  src={editingNewsDraft.poster_url}
                                  alt="Poster preview"
                                  className="max-h-48 w-full object-contain rounded-lg border border-slate-300"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setEditingNewsDraft((draft) => ({ ...draft, poster_url: '' }))
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
                            <label className="block text-sm font-semibold">
                              Credit Line (Name of the original source of News)
                            </label>
                            <input
                              value={editingNewsDraft.credit}
                              onChange={(e) =>
                                setEditingNewsDraft((draft) => ({
                                  ...draft,
                                  credit: e.target.value,
                                }))
                              }
                              className="mt-1 w-full rounded border px-3 py-2"
                            />
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => saveNewsChanges(n.id)}
                              className="rounded bg-[#6f450e] px-4 py-2 text-white"
                            >
                              Save and Approve
                            </button>
                            <button
                              onClick={() => setEditingNewsId(null)}
                              className="rounded border border-slate-300 px-4 py-2 text-slate-700"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                              <div className="font-semibold">{n.headline}</div>
                              {n.subheading ? (
                                <div className="text-sm text-gray-700">{n.subheading}</div>
                              ) : null}
                              <div className="text-sm text-gray-600">
                                {n.byline} • {n.author_email}
                              </div>
                              <div className="mt-2 text-sm text-gray-700">
                                {n.body?.slice(0, 220)}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-3 sm:pt-0">
                              <button
                                onClick={() => {
                                  setEditingNewsId(n.id);
                                  setEditingNewsDraft({
                                    category: n.category || 'news',
                                    headline: n.headline || '',
                                    subheading: (n as any).subheading || '',
                                    byline: n.byline || '',
                                    reference_link: n.reference_link || '',
                                    body: n.body || '',
                                    credit: n.credit || '',
                                    location: n.location || 'home-side',
                                    poster_url: n.poster_url || '',
                                  });
                                }}
                                className="rounded border border-slate-300 bg-white px-3 py-1 text-slate-700"
                              >
                                Modify
                              </button>
                              {n.status === 'accept' ? (
                                <button
                                  className="rounded px-3 py-1 text-white"
                                  style={{ backgroundColor: '#16a34a' }}
                                  disabled
                                >
                                  Accepted
                                </button>
                              ) : n.status === 'reject' ? (
                                <button
                                  className="rounded px-3 py-1 text-white"
                                  style={{ backgroundColor: '#dc2626' }}
                                  disabled
                                >
                                  Rejected
                                </button>
                              ) : (
                                <>
                                  <button
                                    onClick={() => decideNews(n.id, 'accept')}
                                    className="rounded bg-green-600 px-3 py-1 text-white"
                                  >
                                    Accept
                                  </button>
                                  <button
                                    onClick={() => decideNews(n.id, 'reject')}
                                    className="rounded bg-red-600 px-3 py-1 text-white"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => deleteNews(n.id)}
                                className="absolute -top-2 -right-2 z-10 w-6 h-6 flex items-center justify-center text-sm font-semibold text-red-600 hover:text-red-700 bg-red-50 rounded-md border border-red-600 shadow-sm"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
                {newsList.length === 0 && (
                  <div className="text-gray-600">No news awaiting approval</div>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function AdminAddNews({ onCreate }: { onCreate: (row: AdminNews) => void }) {
  const [category, setCategory] = useState('news');
  const [location, setLocation] = useState('home-side');
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
  const [headline, setHeadline] = useState('');
  const [subheading, setSubheading] = useState('');
  const [byline, setByline] = useState('');
  const [startupName, setStartupName] = useState('');
  const [productName, setProductName] = useState('');
  const [startupSector, setStartupSector] = useState('');
  const [startupStage, setStartupStage] = useState('Idea');
  const [editorName, setEditorName] = useState('');
  const [editorDesignation, setEditorDesignation] = useState('');
  const [editorAffiliation, setEditorAffiliation] = useState('');
  const [referenceLink, setReferenceLink] = useState('');
  const [body, setBody] = useState('');
  const [credit, setCredit] = useState('');
  const [posterPreview, setPosterPreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const apiBase = import.meta.env.VITE_API_BASE || '';

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    if (!headline.trim() || !body.trim()) {
      setError('Headline and Body are required.');
      return;
    }
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`${apiBase}/api/news/admin`, {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline,
          subheading,
          byline,
          editor_name: editorName,
          editor_designation: editorDesignation,
          editor_affiliation: editorAffiliation,
          reference_link: referenceLink,
          body,
          credit,
          category,
          location:
            category === 'news' ? location : location === 'homepage' ? 'home-side' : location,
          poster_url: posterPreview,
          startup_name: startupName,
          product_name: productName,
          startup_sector: startupSector,
          startup_stage: startupStage,
          author_email: 'admin@example.com',
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create news');
        return;
      }
      setSuccess('News created successfully.');
      const newRow = {
        id: data.id,
        headline,
        subheading,
        byline,
        editor_name: editorName,
        editor_designation: editorDesignation,
        editor_affiliation: editorAffiliation,
        reference_link: referenceLink,
        body,
        credit,
        category,
        location,
        poster_url: posterPreview,
        author_email: 'admin@example.com',
        status: 'accept',
      };
      onCreate(newRow);
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
      setLocation('homepage');
      setPosterPreview('');
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="space-y-4 rounded-lg border border-[#6f450e] bg-white/80 p-4">
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
        <label className="block text-sm font-semibold">Category</label>
        <select
          value={category}
          onChange={(e) => {
            const value = e.target.value;
            setCategory(value);
            setLocation(value === 'news' ? 'home-side' : 'homepage');
          }}
          className="mt-1 w-full rounded border px-3 py-2"
        >
          <option value="news">News</option>
          <option value="schemes">Schemes</option>
          <option value="startups">Startups</option>
          <option value="editorial">Editorial</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold">Placement on homepage</label>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="mt-1 w-full rounded border px-3 py-2"
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
          {newsPlacementLinks[location] ? (
            <a
              href={newsPlacementLinks[location]}
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full bg-[#F8C21B] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#6F450E] transition hover:opacity-90"
            >
              View image
            </a>
          ) : null}
        </div>
      </div>
      {category === 'startups' ? (
        <>
          <div>
            <label className="block text-sm font-semibold">Startup Name</label>
            <input
              value={startupName}
              onChange={(e) => setStartupName(e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">Product Name</label>
            <input
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">Startup Sector</label>
            <input
              value={startupSector}
              onChange={(e) => setStartupSector(e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">Startup Stage</label>
            <select
              value={startupStage}
              onChange={(e) => setStartupStage(e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2"
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
      <div>
        <label className="block text-sm font-semibold">Headline</label>
        <input
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          className="mt-1 w-full rounded border px-3 py-2"
        />
      </div>
      {category === 'editorial' ? (
        <>
          <div>
            <label className="block text-sm font-semibold">Editor's Name</label>
            <input
              value={editorName}
              onChange={(e) => setEditorName(e.target.value)}
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">Editor's Designation</label>
            <input
              value={editorDesignation}
              onChange={(e) => setEditorDesignation(e.target.value)}
              placeholder="Dairy scientist"
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">Editor's Affiliation</label>
            <input
              value={editorAffiliation}
              onChange={(e) => setEditorAffiliation(e.target.value)}
              placeholder="NDRI"
              className="mt-1 w-full rounded border px-3 py-2"
            />
          </div>
        </>
      ) : null}
      <div>
        <label className="block text-sm font-semibold">Subheading</label>
        <input
          value={subheading}
          onChange={(e) => setSubheading(e.target.value)}
          className="mt-1 w-full rounded border px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold">Byline Story</label>
        <input
          value={byline}
          onChange={(e) => setByline(e.target.value)}
          className="mt-1 w-full rounded border px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold">Reference Link</label>
        <input
          value={referenceLink}
          onChange={(e) => setReferenceLink(e.target.value)}
          placeholder="https://"
          className="mt-1 w-full rounded border px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold">Body</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="mt-1 w-full rounded border px-3 py-2"
          rows={8}
        />
      </div>
      <div>
        <label className="block text-sm font-semibold">Upload poster image</label>
        <label className="mt-2 flex min-h-[150px] cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-[#9DBB0B] bg-[#fffcdf] p-5 text-center text-[#6f450e] transition hover:border-[#6f450e]">
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
        <label className="block text-sm font-semibold">
          Credit Line (Name of the original source of News)
        </label>
        <input
          value={credit}
          onChange={(e) => setCredit(e.target.value)}
          className="mt-1 w-full rounded border px-3 py-2"
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
