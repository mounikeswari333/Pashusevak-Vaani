import { createFileRoute } from '@tanstack/react-router';
import useTranslate from '../../hooks/useTranslate';
import { TopBar, Nav } from '../../components/TopNav';

export default function ContactPage() {
  const t = useTranslate();
  return (
    <div style={{ backgroundColor: '#F8C21B', minHeight: '100vh' }}>
      <TopBar />
      <Nav />
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="text-2xl font-bold">Contact</h1>
        <div className="mt-6 space-y-6 rounded-lg border border-[#6f450e] bg-[#fff8dc] p-6 text-[#6f450e]">
          <section>
            <h2 className="font-semibold">Join Community</h2>
            <p className="mt-2 text-sm">A dynamic platform for dialogue and collaboration</p>
            <div className="mt-3">
              <a
                href="/join-us"
                className="inline-flex rounded bg-[#6f450e] px-4 py-2 text-[#F8C21B]"
              >
                Start Conversation
              </a>
            </div>
          </section>

          <section>
            <h2 className="font-semibold">Email us</h2>
            <p className="mt-2 text-sm">info@pashusevakpragatikendra.com</p>
          </section>

          <section>
            <h2 className="font-semibold">Reach out to us</h2>
            <p className="mt-2 text-sm">
              Mahendragarh, Anaj Mandi, H.No. -51/01, Ward No. - 1, Haryana -123029, Haryana
            </p>
            <p className="mt-2 text-sm">
              WhatsApp:{' '}
              <a
                href="https://wa.me/message/ZY2LBKYLE37BK1"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 text-[#6f450e] no-underline hover:underline"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.671.149-.198.297-.768.967-.942 1.165-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.787-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.173.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.671-1.612-.92-2.207-.242-.579-.487-.5-.671-.51l-.571-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.412.248-.694.248-1.289.173-1.414-.074-.124-.272-.198-.57-.347z" />
                  <path
                    d="M12.004 2.002C6.476 2.002 2 6.478 2 12.006c0 1.989.518 3.843 1.418 5.427L2 22l4.7-1.232A9.981 9.981 0 0012.004 22c5.528 0 10.004-4.476 10.004-9.994 0-5.528-4.476-9.994-10.004-9.994z"
                    opacity="0.2"
                  />
                </svg>
                WhatsApp
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

export const Route = createFileRoute('/contact/')({
  head: () => ({ meta: [{ title: 'Contact - PashuSevak' }] }),
  component: ContactPage,
});
