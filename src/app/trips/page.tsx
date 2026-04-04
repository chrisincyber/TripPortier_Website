import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function Page() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <Link href="/account" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Account
      </Link>
      <h1 className="font-display text-3xl font-bold text-slate-900 mb-4">Coming Soon</h1>
      <p className="text-slate-600">This feature is being migrated to the new platform. Check back soon.</p>
    </div>
  )
}
