import Link from 'next/link'
import { MapPin, Home, Wifi } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="relative">
          <p className="font-display text-[120px] font-bold text-slate-100 leading-none select-none">404</p>
          <div className="absolute inset-0 flex items-center justify-center">
            <MapPin className="w-16 h-16 text-indigo-400" />
          </div>
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900 mb-2">Lost in transit</h1>
          <p className="text-slate-600 text-sm">This page doesn't exist. Maybe it took a wrong turn at the airport.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors">
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link href="/esim" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors">
            <Wifi className="w-4 h-4" />
            Browse eSIMs
          </Link>
        </div>
      </div>
    </div>
  )
}
