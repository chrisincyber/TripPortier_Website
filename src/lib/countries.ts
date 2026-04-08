export interface Country {
  code: string
  name: string
  flag: string
  region: string
}

export const COUNTRIES: Country[] = [
  // East Asia
  { code: 'JP', name: 'Japan', flag: '🇯🇵', region: 'east-asia' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', region: 'east-asia' },
  { code: 'CN', name: 'China', flag: '🇨🇳', region: 'east-asia' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼', region: 'east-asia' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', region: 'east-asia' },
  { code: 'MO', name: 'Macau', flag: '🇲🇴', region: 'east-asia' },
  { code: 'MN', name: 'Mongolia', flag: '🇲🇳', region: 'east-asia' },
  // Southeast Asia
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', region: 'southeast-asia' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', region: 'southeast-asia' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', region: 'southeast-asia' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', region: 'southeast-asia' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', region: 'southeast-asia' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', region: 'southeast-asia' },
  { code: 'KH', name: 'Cambodia', flag: '🇰🇭', region: 'southeast-asia' },
  { code: 'LA', name: 'Laos', flag: '🇱🇦', region: 'southeast-asia' },
  { code: 'MM', name: 'Myanmar', flag: '🇲🇲', region: 'southeast-asia' },
  { code: 'BN', name: 'Brunei', flag: '🇧🇳', region: 'southeast-asia' },
  // South Asia
  { code: 'IN', name: 'India', flag: '🇮🇳', region: 'south-asia' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', region: 'south-asia' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵', region: 'south-asia' },
  { code: 'MV', name: 'Maldives', flag: '🇲🇻', region: 'south-asia' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', region: 'south-asia' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', region: 'south-asia' },
  // Middle East
  { code: 'AE', name: 'UAE', flag: '🇦🇪', region: 'middle-east' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', region: 'middle-east' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', region: 'middle-east' },
  { code: 'OM', name: 'Oman', flag: '🇴🇲', region: 'middle-east' },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭', region: 'middle-east' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', region: 'middle-east' },
  { code: 'JO', name: 'Jordan', flag: '🇯🇴', region: 'middle-east' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', region: 'middle-east' },
  { code: 'LB', name: 'Lebanon', flag: '🇱🇧', region: 'middle-east' },
  // Western Europe
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', region: 'europe' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', region: 'europe' },
  { code: 'FR', name: 'France', flag: '🇫🇷', region: 'europe' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', region: 'europe' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', region: 'europe' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', region: 'europe' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', region: 'europe' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', region: 'europe' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', region: 'europe' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', region: 'europe' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺', region: 'europe' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', region: 'europe' },
  { code: 'MC', name: 'Monaco', flag: '🇲🇨', region: 'europe' },
  // Northern Europe
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', region: 'europe' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', region: 'europe' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', region: 'europe' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', region: 'europe' },
  { code: 'IS', name: 'Iceland', flag: '🇮🇸', region: 'europe' },
  { code: 'EE', name: 'Estonia', flag: '🇪🇪', region: 'europe' },
  { code: 'LV', name: 'Latvia', flag: '🇱🇻', region: 'europe' },
  { code: 'LT', name: 'Lithuania', flag: '🇱🇹', region: 'europe' },
  // Central & Eastern Europe
  { code: 'PL', name: 'Poland', flag: '🇵🇱', region: 'europe' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', region: 'europe' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺', region: 'europe' },
  { code: 'SK', name: 'Slovakia', flag: '🇸🇰', region: 'europe' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴', region: 'europe' },
  { code: 'BG', name: 'Bulgaria', flag: '🇧🇬', region: 'europe' },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷', region: 'europe' },
  { code: 'SI', name: 'Slovenia', flag: '🇸🇮', region: 'europe' },
  { code: 'RS', name: 'Serbia', flag: '🇷🇸', region: 'europe' },
  { code: 'BA', name: 'Bosnia', flag: '🇧🇦', region: 'europe' },
  { code: 'ME', name: 'Montenegro', flag: '🇲🇪', region: 'europe' },
  { code: 'MK', name: 'North Macedonia', flag: '🇲🇰', region: 'europe' },
  { code: 'AL', name: 'Albania', flag: '🇦🇱', region: 'europe' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', region: 'europe' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', region: 'europe' },
  { code: 'CY', name: 'Cyprus', flag: '🇨🇾', region: 'europe' },
  { code: 'MT', name: 'Malta', flag: '🇲🇹', region: 'europe' },
  { code: 'GE', name: 'Georgia', flag: '🇬🇪', region: 'europe' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦', region: 'europe' },
  // Americas
  { code: 'US', name: 'United States', flag: '🇺🇸', region: 'americas' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', region: 'americas' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', region: 'americas' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', region: 'americas' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', region: 'americas' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', region: 'americas' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', region: 'americas' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', region: 'americas' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨', region: 'americas' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾', region: 'americas' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷', region: 'americas' },
  { code: 'PA', name: 'Panama', flag: '🇵🇦', region: 'americas' },
  { code: 'DO', name: 'Dominican Republic', flag: '🇩🇴', region: 'americas' },
  { code: 'PR', name: 'Puerto Rico', flag: '🇵🇷', region: 'americas' },
  { code: 'JM', name: 'Jamaica', flag: '🇯🇲', region: 'americas' },
  { code: 'CU', name: 'Cuba', flag: '🇨🇺', region: 'americas' },
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹', region: 'americas' },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴', region: 'americas' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾', region: 'americas' },
  // Africa
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', region: 'africa' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', region: 'africa' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', region: 'africa' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', region: 'africa' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', region: 'africa' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', region: 'africa' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', region: 'africa' },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳', region: 'africa' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳', region: 'africa' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', region: 'africa' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', region: 'africa' },
  { code: 'MU', name: 'Mauritius', flag: '🇲🇺', region: 'africa' },
  { code: 'SC', name: 'Seychelles', flag: '🇸🇨', region: 'africa' },
  // Oceania
  { code: 'AU', name: 'Australia', flag: '🇦🇺', region: 'oceania' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', region: 'oceania' },
  { code: 'FJ', name: 'Fiji', flag: '🇫🇯', region: 'oceania' },
  // Central Asia
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿', region: 'central-asia' },
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿', region: 'central-asia' },
]

/** Region display info for the upsell cards */
export const REGION_INFO: Record<string, { name: string; emoji: string; desc: string; countries: string }> = {
  'europe':         { name: 'Europe',       emoji: '🇪🇺',  desc: 'One plan for 40+ European countries',          countries: '40+ countries' },
  'asia':           { name: 'Asia',         emoji: '🌏',   desc: 'Cover East, Southeast, and South Asia',        countries: '30+ countries' },
  'middle-east':    { name: 'Middle East',  emoji: '🕌',   desc: 'UAE, Saudi Arabia, Qatar, and more',           countries: '15+ countries' },
  'americas':       { name: 'Americas',     emoji: '🌎',   desc: 'USA, Canada, Latin America, and Caribbean',    countries: '25+ countries' },
  'africa':         { name: 'Africa',       emoji: '🌍',   desc: 'South Africa, Kenya, Egypt, and more',         countries: '20+ countries' },
  'oceania':        { name: 'Oceania',      emoji: '🏝️',   desc: 'Australia, New Zealand, Fiji, and more',       countries: '10+ countries' },
}

/** Map country regions to the broader upsell region key */
export function getUpsellRegion(countryRegion: string): string {
  if (['east-asia', 'southeast-asia', 'south-asia', 'central-asia'].includes(countryRegion)) return 'asia'
  return countryRegion
}

/** Group countries by their display region for browsing */
export const BROWSE_REGIONS = [
  { key: 'europe', label: 'Europe', emoji: '🇪🇺' },
  { key: 'asia', label: 'Asia', emoji: '🌏', regionSlugs: ['east-asia', 'southeast-asia', 'south-asia', 'central-asia'] },
  { key: 'middle-east', label: 'Middle East', emoji: '🕌' },
  { key: 'americas', label: 'Americas', emoji: '🌎' },
  { key: 'africa', label: 'Africa', emoji: '🌍' },
  { key: 'oceania', label: 'Oceania', emoji: '🏝️' },
]

export function getCountriesByBrowseRegion(regionKey: string): Country[] {
  const browseRegion = BROWSE_REGIONS.find(r => r.key === regionKey)
  if (!browseRegion) return []
  const slugs = browseRegion.regionSlugs || [regionKey]
  return COUNTRIES.filter(c => slugs.includes(c.region)).sort((a, b) => a.name.localeCompare(b.name))
}
