import { Perfume } from '@/types/perfumes'

export default function NotePyramid({ perfume }: { perfume: Perfume }) {
  const noteCategories = [
    { label: 'Top Notes', notes: perfume.notes?.top ?? [] },
    { label: 'Middle Notes', notes: perfume.notes?.middle ?? [] },
    { label: 'Base Notes', notes: perfume.notes?.base ?? [] },
  ]

  return (
    <section className="mb-16 px-4 sm:px-6 max-w-xl mx-auto md:max-w-none">
      <h2 className="font-headline text-xl sm:text-2xl text-primary mb-8 uppercase tracking-widest text-center">
        Note Pyramid
      </h2>

      {/* On mobile: grid-cols-1 (Vertical Stack) with gap-10 for breathing room
        On desktop: md:grid-cols-3 (Horizontal columns) 
      */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 text-center">
        {noteCategories.map(({ label, notes }) => (
          <div key={label} className="space-y-4 md:space-y-3 flex flex-col items-center">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-secondary font-bold">
              {label}
            </h3>

            {/* Center the notes inside each tier flexbox */}
            <div className="flex flex-wrap justify-center gap-2 max-w-sm md:max-w-none">
              {notes.length > 0 ? (
                notes.map((note) => (
                  <span
                    key={note}
                    className="px-4 py-2 bg-primary border border-outline-variant/20 text-[10px] sm:text-[11px] uppercase tracking-widest text-background font-medium"
                  >
                    {note}
                  </span>
                ))
              ) : (
                <span className="text-xs text-outline italic font-body">None</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}