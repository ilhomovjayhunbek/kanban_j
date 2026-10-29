export function getStatus(p) {
  if (Number(p.quantity) === 0) return { key: 'out', label: 'Out of stock' }
  if (Number(p.quantity) <= Number(p.threshold)) return { key: 'low', label: 'Low stock' }
  return { key: 'in', label: 'In- stock' }
}

// 2022-12-11 -> 11/12/22
export function fmtDate(iso) {
  if (!iso) return '-'
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y.slice(2)}`
}

export function downloadFile(name, content, type = 'text/csv') {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  URL.revokeObjectURL(url)
}