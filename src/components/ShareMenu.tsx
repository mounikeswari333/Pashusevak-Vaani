import { useEffect, useRef, useState } from 'react';

type ShareMenuProps = {
  title: string;
  url?: string;
};

export function ShareMenu({ title, url }: ShareMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (open && rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, [open]);

  const shareText = `${title}${url ? `\n\nRead more: ${url}` : ''}`;

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
    setOpen(false);
  };

  const handleCopy = async () => {
    try {
      // Copy the composed share text (title + optional URL) so users get the news content
      await navigator.clipboard.writeText(shareText);
    } catch (err) {
      console.error('Copy failed', err);
    }
    setOpen(false);
  };

  return (
    <div className="relative inline-flex" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2 rounded-full border border-[#6f450e] bg-[#6F450E] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F8C21B] transition hover:bg-[#5e3d0b]"
      >
        Share
      </button>
      {open ? (
        <div className="absolute right-0 top-full z-50 mt-2 min-w-[11rem] overflow-hidden rounded-2xl border bg-white shadow-lg">
          <button
            type="button"
            onClick={handleWhatsApp}
            className="w-full px-4 py-3 text-left text-sm font-semibold uppercase tracking-[0.12em] text-[#107c24] transition hover:bg-[#f0fdf4]"
          >
            WhatsApp
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="w-full px-4 py-3 text-left text-sm font-semibold uppercase tracking-[0.12em] text-[#6f450e] transition hover:bg-[#f7f0d4]"
          >
            Copy link
          </button>
        </div>
      ) : null}
    </div>
  );
}
