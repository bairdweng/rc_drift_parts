import siteMetadata from '@/data/siteMetadata'
import { genPageMetadata } from 'app/seo'
import Link from '@/components/Link'

export const metadata = genPageMetadata({
  title: 'RC Drift Parts Upgrade Guides',
  description:
    'RC drift parts upgrade guides, setup tips and buying advice. Helping RC drift drivers choose the right upgrades.',
})

export default function Home() {
  return (
    <>
      <main className="mx-auto max-w-3xl px-4 py-16">
        {/* Title */}
        <h1 className="mb-6 text-3xl font-bold">RC Drift Parts Upgrade Guides</h1>

        {/* Introduction */}
        <p className="mb-8 text-lg text-gray-600">
          Dedicated RC drift car upgrade guides, parts selection advice and real-world testing
          comparisons. Helping you avoid common mistakes and choose the right RC upgrades that
          actually work.
        </p>

        {/* Three Entry Points */}
        <section className="space-y-6">
          <Link
            href="/guides?tag=performance-upgrades"
            className="block rounded-lg p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <div>
              <h2 className="text-xl font-semibold">🚗 Vehicle-Specific Upgrade Guides</h2>
              <p className="text-gray-600">
                Complete upgrade paths tailored for specific RC drift models including Tamiya TT02,
                Traxxas Slash, MST RMX, Yokomo YD-2, and more.
              </p>
            </div>
          </Link>

          <Link
            href="/guides?tag=electronics-tuning"
            className="block rounded-lg p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <div>
              <h2 className="text-xl font-semibold">⚙️ Component Selection by Function</h2>
              <p className="text-gray-600">
                Expert guidance on choosing performance parts: suspension systems, tire selection,
                steering upgrades, electronic components, and chassis tuning.
              </p>
            </div>
          </Link>

          <Link
            href="/guides?tag=beginner-guides"
            className="block rounded-lg p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <div>
              <h2 className="text-xl font-semibold">📘 Skill-Based Learning Paths</h2>
              <p className="text-gray-600">
                Progressive learning from beginner fundamentals to advanced techniques, including
                setup optimization, maintenance, and competition-level tuning.
              </p>
            </div>
          </Link>
        </section>
      </main>
    </>
  )
}
