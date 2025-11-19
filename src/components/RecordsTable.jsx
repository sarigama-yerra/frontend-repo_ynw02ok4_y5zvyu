import { useEffect, useState } from 'react'

const fmt = (n) => n.toLocaleString(undefined, { style: 'currency', currency: 'USD' })

export default function RecordsTable({ reloadFlag }) {
  const [items, setItems] = useState([])
  const [type, setType] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const qs = type ? `?record_type=${type}` : ''
      const res = await fetch(`${base}/api/records${qs}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setItems(data.items || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [type, reloadFlag])

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-semibold">Recent Records</h3>
        <select value={type} onChange={(e)=>setType(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200">
          <option value="">All</option>
          <option value="revenue">Revenue</option>
          <option value="expense">Expense</option>
          <option value="salary">Salary</option>
        </select>
      </div>
      {error && <div className="text-sm text-red-300 mb-3">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-slate-300">
              <th className="text-left py-2 pr-4">Date</th>
              <th className="text-left py-2 pr-4">Type</th>
              <th className="text-left py-2 pr-4">Category</th>
              <th className="text-left py-2 pr-4">Description</th>
              <th className="text-right py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="py-6 text-slate-400" colSpan={5}>Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td className="py-6 text-slate-400" colSpan={5}>No records</td></tr>
            ) : (
              items.map((r) => (
                <tr key={r.id} className="border-t border-slate-700/70 text-slate-200">
                  <td className="py-2 pr-4">{r.date ? new Date(r.date).toLocaleDateString() : ''}</td>
                  <td className="py-2 pr-4 capitalize">{r.type}</td>
                  <td className="py-2 pr-4">{r.category || '—'}</td>
                  <td className="py-2 pr-4">{r.description || '—'}</td>
                  <td className="py-2 text-right font-medium">{fmt(r.amount || 0)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
