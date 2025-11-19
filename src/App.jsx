import { useState } from 'react'
import KPIHeader from './components/KPIHeader'
import RecordForm from './components/RecordForm'
import RecordsTable from './components/RecordsTable'

function App() {
  const [reloadFlag, setReloadFlag] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Simple CRM</h1>
            <a href="/test" className="text-sm text-slate-300 hover:text-white underline">System check</a>
          </div>
          <p className="text-slate-400 mt-2">Track revenue, expenses, salaries and profit in one place.</p>
        </header>

        <KPIHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-1">
            <RecordForm onAdded={() => setReloadFlag((v)=>v+1)} />
          </div>
          <div className="lg:col-span-2">
            <RecordsTable reloadFlag={reloadFlag} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
