'use client';

// Link no rodapé pra reabrir o tour guiado (dispara o evento que o TourGuiado escuta).
export function TourReopen() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('msf:tour'))}
      className="text-inksoft hover:text-ink underline focusring"
    >
      Rever introdução
    </button>
  );
}
