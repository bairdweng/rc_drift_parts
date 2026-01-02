import siteMetadata from '@/data/siteMetadata'
import { genPageMetadata } from 'app/seo'
import Link from '@/components/Link'

export const metadata = genPageMetadata({ 
  title: 'RC Drift Parts Upgrade Guides', 
  description: 'RC drift parts upgrade guides, setup tips and buying advice. Helping RC drift drivers choose the right upgrades.' 
})

export default function Home() {
  return (
    <>
      <main className="mx-auto max-w-3xl px-4 py-16"> 
        {/* Title */} 
        <h1 className="mb-6 text-3xl font-bold"> 
          RC Drift Parts Upgrade Guides 
        </h1> 
 
        {/* Introduction */} 
        <p className="mb-8 text-lg text-gray-600"> 
          Dedicated RC drift car upgrade guides, parts selection advice and real-world testing comparisons. 
          Helping you avoid common mistakes and choose the right RC upgrades that actually work. 
        </p> 
 
        {/* Three Entry Points */} 
        <section className="space-y-6"> 
          <Link href="/guides" className="block hover:bg-gray-50 dark:hover:bg-gray-800 p-4 rounded-lg transition-colors"> 
            <div> 
              <h2 className="text-xl font-semibold"> 
                🚗 Upgrade by Vehicle Model 
              </h2> 
              <p className="text-gray-600"> 
                Detailed upgrade paths for popular RC drift models like TT02, YD-2, RMX, and more. 
              </p> 
            </div> 
          </Link> 
 
          <Link href="/guides" className="block hover:bg-gray-50 dark:hover:bg-gray-800 p-4 rounded-lg transition-colors"> 
            <div> 
              <h2 className="text-xl font-semibold"> 
                ⚙️ Parts Selection by Function 
              </h2> 
              <p className="text-gray-600"> 
                Expert advice on selecting key components: suspension, tires, steering, gyros, and more. 
              </p> 
            </div> 
          </Link> 
 
          <Link href="/guides" className="block hover:bg-gray-50 dark:hover:bg-gray-800 p-4 rounded-lg transition-colors"> 
            <div> 
              <h2 className="text-xl font-semibold"> 
                📘 Beginner & Advanced Guides 
              </h2> 
              <p className="text-gray-600"> 
                Complete RC drift setup and upgrade strategies from entry level to advanced techniques. 
              </p> 
            </div> 
          </Link> 
        </section> 
      </main> 
    </>
  )
}
