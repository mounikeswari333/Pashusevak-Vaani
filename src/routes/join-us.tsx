import { createFileRoute } from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { LanguageProvider } from '../context/LanguageContext';
import useTranslate from '../hooks/useTranslate';
import { TopBar, Nav } from '../components/TopNav';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';

const heroImage = 'https://res.cloudinary.com/dxn7nethc/image/upload/v1784894587/goat_aosiib.jpg';

export const Route = createFileRoute('/join-us')({
  head: () => ({
    meta: [
      { title: 'Join Us - PashuSevak Vaani' },
      {
        name: 'description',
        content:
          'Join the PashuSevak Vaani community for field reporting, startup listings, editorial pitching, internships and accelerator collaborations.',
      },
      { property: 'og:title', content: 'Join Us - PashuSevak Vaani' },
      {
        property: 'og:description',
        content:
          "Sign up for updates, collaborate with our newsroom, and connect your livestock-tech venture with India's animal husbandry community.",
      },
      { property: 'og:image', content: heroImage },
      { name: 'twitter:image', content: heroImage },
    ],
  }),
  component: JoinUsPage,
});

const roles = [
  { value: 'volunteer', label: 'Volunteer' },
  { value: 'startups', label: 'Startups' },
  { value: 'editors', label: 'Editors' },
  { value: 'interns', label: 'Interns' },
  { value: 'incubators', label: 'Incubators/Accelerators' },
  { value: 'readers', label: 'Readers' },
];

const genders = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'others', label: 'Others' },
];

const countries = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Cape Verde',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo',
  'Costa Rica',
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'East Timor',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Grenada',
  'Guatemala',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Ivory Coast',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Kosovo',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'North Korea',
  'North Macedonia',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Palestine',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russia',
  'Rwanda',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'Sao Tome and Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Korea',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Togo',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Vatican City',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe',
];

function JoinUsPage() {
  const t = useTranslate();
  const { user, signInWithGoogle, signOut } = useSupabaseAuth();
  const [role, setRole] = useState(roles[0].value);
  const [gender, setGender] = useState(genders[0].value);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [village, setVillage] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const apiBase = import.meta.env.VITE_API_BASE || '';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (
      !fullName.trim() ||
      !email.trim() ||
      !mobileNumber.trim() ||
      !state.trim() ||
      !district.trim() ||
      !village.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setError(t('Please fill in all required fields.'));
      return;
    }

    if (!email.includes('@')) {
      setError(t('Please enter a valid email address.'));
      return;
    }

    if (mobileNumber.length !== 10) {
      setError(t('Mobile number must be exactly 10 digits.'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('Passwords do not match.'));
      return;
    }

    if (password.length < 6) {
      setError(t('Password must be at least 6 characters long.'));
      return;
    }

    try {
      const response = await fetch(`${apiBase}/api/join-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          role,
          email,
          mobile_number: mobileNumber,
          country,
          state,
          district,
          village,
          extra: {
            photo_url: profilePhotoPreview || undefined,
          },
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Failed to submit request');
        return;
      }
      localStorage.setItem('join_request_id', String(data.id));
      localStorage.setItem('join_request_email', email);
      localStorage.setItem('join_request_role', role);
      if (profilePhotoPreview) {
        localStorage.setItem('join_request_photo', profilePhotoPreview);
      }
      setSubmitted(true);
      setSuccessMessage(t('Your request has been submitted for admin approval.'));
    } catch (err) {
      setError(t('Network error. Please try again.'));
    }
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen" style={{ backgroundColor: '#fffdf7', color: '#2f1f0e' }}>
        <TopBar />
        <Nav />

        <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
          <section>
            <div>
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-[#6f450e]">
                {t('Join Us')}
              </p>
              <h1 className="mt-4 font-serif text-4xl font-semibold tracking-tight text-[#6F450E] sm:text-5xl">
                {t('Join PashuSevak Vaani')}
              </h1>

              <div className="mt-10 space-y-6 rounded-3xl border border-[#d3c69f] bg-[#fffdf7] p-6 shadow-sm">
                {error && (
                  <div className="rounded-lg border border-red-600 bg-red-50 px-4 py-3 text-red-800 text-sm">
                    {error}
                  </div>
                )}
                {successMessage && (
                  <div className="rounded-lg border border-green-600 bg-green-50 px-4 py-3 text-green-800 text-sm">
                    <p className="font-semibold">{t('Success')}</p>
                    <p className="mt-2">{successMessage}</p>
                  </div>
                )}

                {submitted ? (
                  <div className="rounded-lg border border-green-600 bg-green-50 px-4 py-3 text-green-800">
                    <p className="font-semibold">{t('Thank you for joining!')}</p>
                    <p className="mt-2 text-sm">{t('We will be in touch soon.')}</p>
                    <p className="mt-2 text-sm">
                      {t(
                        'Please return to the homepage to watch for admin approval notifications.'
                      )}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 1. Role */}
                    <div>
                      <label className="block text-sm font-medium text-[#3a250f]">
                        {t('Role')}
                      </label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="mt-2 w-full rounded-lg border border-[#d3c69f] bg-white px-4 py-2 text-[#2f1f0e] focus:border-[#6f450e] focus:outline-none"
                      >
                        {roles.map((r) => (
                          <option key={r.value} value={r.value}>
                            {t(r.label)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 2. Gender */}
                    <div>
                      <label className="block text-sm font-medium text-[#3a250f]">
                        {t('Gender')}
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="mt-2 w-full rounded-lg border border-[#d3c69f] bg-white px-4 py-2 text-[#2f1f0e] focus:border-[#6f450e] focus:outline-none"
                      >
                        {genders.map((g) => (
                          <option key={g.value} value={g.value}>
                            {t(g.label)}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 3. Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-[#3a250f]">
                        {t('Full Name')}
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={t('Full Name')}
                        className="mt-2 w-full rounded-lg border border-[#d3c69f] bg-white px-4 py-2 text-[#2f1f0e] placeholder-[#9b8968] focus:border-[#6f450e] focus:outline-none"
                      />
                    </div>

                    {/* 4. Email */}
                    <div>
                      <label className="block text-sm font-medium text-[#3a250f]">
                        {t('Email')}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('Email')}
                        className="mt-2 w-full rounded-lg border border-[#d3c69f] bg-white px-4 py-2 text-[#2f1f0e] placeholder-[#9b8968] focus:border-[#6f450e] focus:outline-none"
                      />
                    </div>

                    {/* 5. Mobile Number / WhatsApp */}
                    <div>
                      <label className="block text-sm font-medium text-[#3a250f]">
                        {t('Mobile Number / WhatsApp')}
                      </label>
                      <input
                        type="tel"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder={t('Mobile Number')}
                        className="mt-2 w-full rounded-lg border border-[#d3c69f] bg-white px-4 py-2 text-[#2f1f0e] placeholder-[#9b8968] focus:border-[#6f450e] focus:outline-none"
                      />
                    </div>

                    {/* 6. Country */}
                    <div>
                      <label className="block text-sm font-medium text-[#3a250f]">
                        {t('Country')}
                      </label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="mt-2 w-full rounded-lg border border-[#d3c69f] bg-white px-4 py-2 text-[#2f1f0e] focus:border-[#6f450e] focus:outline-none"
                      >
                        {countries.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* 7. State */}
                    <div>
                      <label className="block text-sm font-medium text-[#3a250f]">
                        {t('State')}
                      </label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder={t('State')}
                        className="mt-2 w-full rounded-lg border border-[#d3c69f] bg-white px-4 py-2 text-[#2f1f0e] placeholder-[#9b8968] focus:border-[#6f450e] focus:outline-none"
                      />
                    </div>

                    {/* 8. District */}
                    <div>
                      <label className="block text-sm font-medium text-[#3a250f]">
                        {t('District')}
                      </label>
                      <input
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder={t('District')}
                        className="mt-2 w-full rounded-lg border border-[#d3c69f] bg-white px-4 py-2 text-[#2f1f0e] placeholder-[#9b8968] focus:border-[#6f450e] focus:outline-none"
                      />
                    </div>

                    {/* 9. Village */}
                    <div>
                      <label className="block text-sm font-medium text-[#3a250f]">
                        {t('Village')}
                      </label>
                      <input
                        type="text"
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        placeholder={t('Village')}
                        className="mt-2 w-full rounded-lg border border-[#d3c69f] bg-white px-4 py-2 text-[#2f1f0e] placeholder-[#9b8968] focus:border-[#6f450e] focus:outline-none"
                      />
                    </div>

                    {/* 10. Password */}
                    <div>
                      <label className="block text-sm font-medium text-[#3a250f]">
                        {t('Password')}
                      </label>
                      <div className="relative mt-2">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder={t('Password')}
                          className="w-full rounded-lg border border-[#d3c69f] bg-white px-4 py-2 pr-12 text-[#2f1f0e] placeholder-[#9b8968] focus:border-[#6f450e] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6f450e] hover:text-[#5a361c]"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    {/* 11. Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium text-[#3a250f]">
                        {t('Confirm Password')}
                      </label>
                      <div className="relative mt-2">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder={t('Confirm Password')}
                          className="w-full rounded-lg border border-[#d3c69f] bg-white px-4 py-2 pr-12 text-[#2f1f0e] placeholder-[#9b8968] focus:border-[#6f450e] focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6f450e] hover:text-[#5a361c]"
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    {/* 12. Profile Photo (optional) */}
                    <div>
                      <label className="block text-sm font-medium text-[#3a250f]">
                        {t('Upload profile photo (optional)')}
                      </label>
                      <div className="mt-2 flex items-center gap-4">
                        <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-[#d3c69f] bg-white px-4 py-2 text-sm text-[#2f1f0e]">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0] ?? null;
                              if (!file) return;
                              setProfilePhotoFile(file);
                              const reader = new FileReader();
                              reader.onload = () => {
                                const preview = String(reader.result || '');
                                setProfilePhotoPreview(preview);
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                          <span className="text-sm font-semibold text-[#6f450e]">
                            {t('Choose file')}
                          </span>
                        </label>
                        {profilePhotoPreview ? (
                          <img
                            src={profilePhotoPreview}
                            alt="Profile preview"
                            className="h-16 w-16 rounded-full object-cover border border-[#6f450e]"
                          />
                        ) : (
                          <img
                            src="https://res.cloudinary.com/dttsqdjta/image/upload/v1785303609/Screenshot_2026-07-29_110956_nzkipz.png"
                            alt="Default avatar"
                            className="h-16 w-16 rounded-full object-cover border border-[#6f450e]"
                          />
                        )}
                      </div>
                    </div>

                    {/* 12. Submit Button */}
                    <button
                      type="submit"
                      className="w-full cursor-pointer rounded-lg bg-[#6f450e] px-4 py-3 text-[#f8c21b] font-semibold transition-colors hover:bg-[#5a361c]"
                    >
                      {t('Submit')}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </LanguageProvider>
  );
}
