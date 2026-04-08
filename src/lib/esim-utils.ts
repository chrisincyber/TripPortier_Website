/** Parse a data string like "1 GB", "500 MB", "Unlimited" into a sortable number */
export function parseData(dataStr: string): number {
  if (!dataStr) return 0
  const lower = dataStr.toLowerCase()
  if (lower.includes('unlimited')) return 9999
  const match = lower.match(/(\d+\.?\d*)\s*(gb|mb|tb)/)
  if (!match) return 0
  const amount = parseFloat(match[1])
  if (match[2] === 'tb') return amount * 1000
  if (match[2] === 'gb') return amount
  if (match[2] === 'mb') return amount / 1000
  return 0
}

interface PackageWithData {
  id: string
  data: string
  price: number
  isUnlimited?: boolean
}

export interface DataGroup<T> {
  label: string
  sortValue: number
  packages: T[]
}

/** Group packages by their data amount, sorted by data size ascending, price within each group */
export function groupByData<T extends PackageWithData>(packages: T[]): DataGroup<T>[] {
  const groups = new Map<string, T[]>()

  for (const pkg of packages) {
    const label = pkg.isUnlimited ? 'Unlimited' : (pkg.data || 'Other')
    if (!groups.has(label)) groups.set(label, [])
    groups.get(label)!.push(pkg)
  }

  // Sort packages within each group by price
  for (const pkgs of groups.values()) {
    pkgs.sort((a, b) => a.price - b.price)
  }

  // Sort groups by data size
  return Array.from(groups.entries())
    .map(([label, pkgs]) => ({
      label,
      sortValue: parseData(label),
      packages: pkgs,
    }))
    .sort((a, b) => a.sortValue - b.sortValue)
}
