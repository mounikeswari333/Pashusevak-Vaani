import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import useTranslate from '../hooks/useTranslate';
import { useTranslation } from 'react-i18next';
import { TopBar, Nav } from '../components/TopNav';

export const Route = createFileRoute('/admin-login')({
  head: () => ({ meta: [{ title: 'Admin Login - PashuSevak' }] }),
  component: AdminLogin,
});

function AdminLogin() {
  const t = useTranslate();
  const { t: staticT } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch((import.meta.env.VITE_API_BASE || '') + '/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const j = await res.json();
        setError(j.error || 'Login failed');
        return;
      }
      const j = await res.json();
      localStorage.setItem('admin_token', j.token);
      window.location.href = '/admin';
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div>
      <TopBar />
      <Nav />
      <main className="mx-auto max-w-2xl p-6">
        <h1 className="text-2xl font-bold">{staticT('Admin Login')}</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && <div className="text-red-600">{error}</div>}
          <div>
            <label className="block text-sm">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm">Password</label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded border px-3 py-2"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-2 top-2"
              >
                {show ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <div>
            <button className="rounded bg-[#6f450e] px-4 py-2 text-white">
              {staticT('Sign In')}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
