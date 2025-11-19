import { useState } from 'react'

export default function RecordForm({ onAdded }) {
  const [type, setType] = useState('revenue')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      const res = await fetch(`${base}/api/records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, amount: Number(amount), category, description })
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setAmount(''); setCategory(''); setDescription('')
      onAdded && onAdded()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
      <h3 className="text-white font-semibold mb-3">Add Record</h3>
      {error && <div className="text-sm text-red-300 mb-3">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <select value={type} onChange={(e) => setType(e.target.value)} className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200">
          <option value="revenue">Revenue</option>
          <option value="expense">Expense</option>
          <option value="salary">Salary</option>
        </select>
        <input required type="number" step="0.01" min="0" value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="Amount" className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500"/>
        <input value={category} onChange={(e)=>setCategory(e.target.value)} placeholder="Category" className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500"/>
        <input value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Description" className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500"/>
      </div>
      <div className="mt-3 flex justify-end">
        <button disabled={saving} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50">{saving ? 'Saving...' : 'Add'}</button>
      </div>
    </form>
  )
}
