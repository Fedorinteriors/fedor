import Link from 'next/link'
import { ArrowRightIcon, ScanIcon, WandSparklesIcon, FileTextIcon } from 'lucide-react'

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: <ScanIcon className="w-6 h-6" />,
    title: 'Upload skice',
    description:
      'Nacrta osnovu prostorije rukom, upiši dimenzije zidova i uploaduj fotografiju. AI analizira geometriju i dimenzije.',
  },
  {
    step: '02',
    icon: <WandSparklesIcon className="w-6 h-6" />,
    title: '5 varijanti kuhinje',
    description:
      'AI generiše 5 stilskih varijanti — moderni, skandinavski, industrijski, klasični, zen. Svaka s kompletnim specifikacijama i renderom.',
  },
  {
    step: '03',
    icon: <FileTextIcon className="w-6 h-6" />,
    title: 'PDF za klijenta',
    description:
      'Odaberi varijante i generiši profesionalni PDF sa renderima, opisima, detaljnom kalkulacijom i dinamikom izrade.',
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-stone-900 rounded-lg flex items-center justify-center">
              <span className="text-amber-400 font-bold text-sm">F</span>
            </div>
            <span className="font-semibold text-stone-900 tracking-tight">Fedor Interiors</span>
          </div>
          <Link
            href="/design"
            className="flex items-center gap-2 bg-stone-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-stone-800 transition-colors"
          >
            Počni dizajn
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <WandSparklesIcon className="w-3.5 h-3.5" />
            Pokreće Claude AI + DALL·E 3
          </div>
          <h1
            className="text-5xl md:text-6xl font-bold text-stone-900 leading-[1.1] mb-6"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Od skice do
            <br />
            <span className="text-amber-600">5 varijanti kuhinje</span>
            <br />
            za 2 minute
          </h1>
          <p className="text-lg text-stone-600 mb-8 leading-relaxed max-w-xl">
            Uploaduj rukom nacrtanu osnovu prostorije s dimenzijama. AI analizira prostor i
            generiše 5 različitih dizajna kuhinje — sa renderima, kalkulacijom i PDF-om za klijenta.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/design"
              className="flex items-center gap-2 bg-stone-900 text-white font-medium px-6 py-3.5 rounded-xl hover:bg-stone-800 transition-all active:scale-[0.98] shadow-lg shadow-stone-900/10"
            >
              Uploaduj skicu
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <span className="text-sm text-stone-400">Bez registracije · Odmah</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-stone-100">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-stone-900 mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>
              Kako radi
            </h2>
            <p className="text-stone-500">3 koraka od skice do prezentacije klijentu</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((item, i) => (
              <div key={i} className="relative">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center text-stone-600 shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-600 mb-1">{item.step}</div>
                    <h3 className="font-semibold text-stone-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-stone-500 leading-relaxed">{item.description}</p>
                  </div>
                </div>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-full w-8 border-t-2 border-dashed border-stone-200 -translate-x-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              icon: '🏠',
              title: '5 stilova kuhinje',
              desc: 'Moderni, skandinavski, industrijski, klasični i zen stil — svaki prilagođen tačnim dimenzijama tvoje prostorije.',
            },
            {
              icon: '🎨',
              title: 'Fotorealistični renderi',
              desc: 'DALL·E 3 generiše fotorealistične vizualizacije za svaku varijantu na osnovu tačnih specifikacija.',
            },
            {
              icon: '💰',
              title: 'Detaljna kalkulacija',
              desc: 'Stavkasto prikazana cijena: korpusi, frontovi, radna ploča, ugradbeni uređaji, rasvjeta, ugradnja — sa PDV-om.',
            },
            {
              icon: '📅',
              title: 'Dinamika izrade',
              desc: 'Timeline projekta po fazama: projektovanje, narudžba, izrada, montaža — s realnim vremenskim okvirima.',
            },
            {
              icon: '📄',
              title: 'Profesionalni PDF',
              desc: 'Generiši PDF sa naslovnom stranicom, renderima, opisima i kalkulacijom. Spreman za slanje klijentu.',
            },
            {
              icon: '✏️',
              title: 'Korekcija dimenzija',
              desc: 'AI prepoznaje dimenzije sa skice, ali možeš lako korigovati svaku mjeru prije generisanja varijanti.',
            },
          ].map((f, i) => (
            <div key={i} className="flex gap-4 p-5 bg-white rounded-2xl border border-stone-100">
              <span className="text-2xl">{f.icon}</span>
              <div>
                <h3 className="font-semibold text-stone-900 mb-1">{f.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-stone-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
            Spreman za prvu skicu?
          </h2>
          <p className="text-stone-400 mb-8 max-w-md mx-auto">
            Nacrta prostoriju, uploaduj i za 2 minute imaš 5 varijanti kuhinje sa kompletnom dokumentacijom.
          </p>
          <Link
            href="/design"
            className="inline-flex items-center gap-2 bg-amber-500 text-stone-900 font-semibold px-8 py-4 rounded-xl hover:bg-amber-400 transition-all"
          >
            Počni odmah
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-sm text-stone-400">
          <span>© 2025 Fedor Interiors</span>
          <span>Pokreće Claude AI + DALL·E 3</span>
        </div>
      </footer>
    </main>
  )
}
