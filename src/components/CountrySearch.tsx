'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { COUNTRIES } from '@/lib/countries'

interface CountrySearchProps {
  placeholder?: string
  targetPath: string // e.g. '/esim' or '/visa'
  paramName?: string // e.g. 'country' → /esim?country=JP
  className?: string
  buttonLabel?: string
}

export function CountrySearch({ placeholder = 'Search country...', targetPath, paramName = 'country', className = '', buttonLabel = 'Search' }: CountrySearchProps) {
  const [query, setQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<typeof COUNTRIES[0] | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const filtered = query.length > 0
    ? COUNTRIES.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.code.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : []

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) && inputRef.current !== e.target) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSelect = (country: typeof COUNTRIES[0]) => {
    setSelectedCountry(country)
    setQuery(country.name)
    setShowDropdown(false)
  }

  const handleSearch = () => {
    if (selectedCountry) {
      router.push(`${targetPath}?${paramName}=${selectedCountry.code}`)
    } else if (query.length > 0) {
      const match = COUNTRIES.find((c) => c.name.toLowerCase().startsWith(query.toLowerCase()))
      if (match) {
        router.push(`${targetPath}?${paramName}=${match.code}`)
      } else {
        router.push(targetPath)
      }
    } else {
      router.push(targetPath)
    }
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      <div className="relative flex-1">
        <div className="flex items-center gap-2 px-4 py-3.5 bg-white/[0.06] rounded-xl border border-white/[0.08] focus-within:border-indigo-500/50 focus-within:bg-white/[0.1] transition-all">
          <Search className="w-4 h-4 text-white/40 shrink-0" />
          {selectedCountry && <span className="text-lg shrink-0">{selectedCountry.flag}</span>}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedCountry(null); setShowDropdown(true) }}
            onFocus={() => query.length > 0 && setShowDropdown(true)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/40"
          />
        </div>

        {showDropdown && filtered.length > 0 && (
          <div ref={dropdownRef} className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a3e] border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/40 z-50 max-h-64 overflow-y-auto">
            {filtered.map((country) => (
              <button
                key={country.code}
                onClick={() => handleSelect(country)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              >
                <span className="text-lg">{country.flag}</span>
                <span className="font-medium">{country.name}</span>
                <span className="text-white/30 text-xs ml-auto">{country.code}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleSearch}
        className="px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 font-semibold rounded-xl transition-all text-sm whitespace-nowrap shadow-lg shadow-indigo-500/25"
      >
        {buttonLabel}
      </button>
    </div>
  )
}
