import { useEffect, useState } from 'react'

const formatMoney = (n) => n.toLocaleString(undefined, { style: 'currency', currency: 'USD' })

export default function KPIHeader() {
  const [summary, setSummary] = useState({ total_revenue: 0, total_expenses: 0, total_salaries: 0, profit: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const res = await fetch(`${base}/api/summary`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setSummary(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const card = (title, value, accent) => (
    <div className="flex-1 bg-slate-800/60 border border-slate-700 rounded-xl p-5">
      <p className="text-slate-300 text-sm mb-1">{title}</p>
      <p className={`text-2xl font-semibold ${accent}`}>{loading ? '—' : formatMoney(value)}</p>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white text-2xl font-semibold">Financial Overview</h2>
        <button onClick={load} className="px-3 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-500 text-white">Refresh</button>
      </div>
      {error && <div className="mb-4 text-sm text-red-300 bg-red-900/30 border border-red-800 rounded p-2">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {card('Revenue', summary.total_revenue, 'text-emerald-300')}
        {card('Expenses', summary.total_expenses, 'text-rose-300')}
        {card('Salaries', summary.total_salaries, 'text-amber-300')}
        {card('Profit', summary.profit, summary.profit >= 0 ? 'text-emerald-300' : 'text-rose-300')}
      </div>
    </div>
  )
}
