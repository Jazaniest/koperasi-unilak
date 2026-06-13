// import { useState, useEffect } from 'react'
// import { DashboardLayout } from '../../components/layout/DashboardLayout'
// import { Card } from '../../components/ui/Card'
// import { Button } from '../../components/ui/Button'
// import { Input, Textarea } from '../../components/ui/Input'
// import { IconHome, IconDatabase } from '../../components/ui/Icons'
// import {
//   getDatabase,
//   getTableNames,
//   setTableData,
//   resetDatabase,
//   exportDatabase,
//   importDatabase,
//   invalidateCache,
// } from '../../services/dbService'
// import { updateServerConfig, getServerConfig } from '../../services/configService'

// const nav = [
//   { to: '/super', label: 'Server', icon: IconHome, end: true },
//   { to: '/super/database', label: 'Database', icon: IconDatabase },
// ]

// const EDITABLE_TABLES = ['users', 'members', 'savings', 'loans', 'loanApplications', 'systemLogs']

// export function SuperDatabasePage() {
//   const [table, setTable] = useState('users')
//   const [jsonEdit, setJsonEdit] = useState('')
//   const [importText, setImportText] = useState('')
//   const [message, setMessage] = useState('')
//   const [apiUrl, setApiUrl] = useState(() => getServerConfig().apiBaseUrl)
//   const [maintenance, setMaintenance] = useState(() => getServerConfig().maintenanceMode)
//   const [, setTick] = useState(0)

//   const loadTable = (name) => {
//     setTable(name)
//     invalidateCache()
//     const data = getDatabase()[name]
//     setJsonEdit(JSON.stringify(data, null, 2))
//   }

//   useEffect(() => {
//     loadTable('users')
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [])

//   const handleSaveTable = () => {
//     try {
//       const parsed = JSON.parse(jsonEdit)
//       if (!Array.isArray(parsed)) throw new Error('Data harus berupa array')
//       setTableData(table, parsed)
//       setMessage(`Tabel ${table} berhasil disimpan`)
//       setTick((t) => t + 1)
//       loadTable(table)
//     } catch (e) {
//       setMessage(`Error: ${e.message}`)
//     }
//   }

//   const handleReset = () => {
//     if (confirm('Reset semua data ke seed demo? Session login juga akan hilang.')) {
//       resetDatabase()
//       localStorage.removeItem('koperasi_session')
//       setMessage('Database di-reset ke data demo')
//       loadTable(table)
//     }
//   }

//   const handleExport = () => {
//     const json = exportDatabase()
//     const blob = new Blob([json], { type: 'application/json' })
//     const url = URL.createObjectURL(blob)
//     const a = document.createElement('a')
//     a.href = url
//     a.download = `koperasi-db-${Date.now()}.json`
//     a.click()
//     setMessage('Database diekspor')
//   }

//   const handleImport = () => {
//     try {
//       importDatabase(importText)
//       setMessage('Import berhasil')
//       loadTable(table)
//     } catch (e) {
//       setMessage(`Import gagal: ${e.message}`)
//     }
//   }

//   const saveConfig = () => {
//     updateServerConfig({ apiBaseUrl: apiUrl, maintenanceMode: maintenance })
//     setMessage('Konfigurasi server disimpan')
//   }

//   return (
//     <DashboardLayout
//       title="Database Manager"
//       subtitle="CRUD mock database — ganti dengan API/DB nyata nanti"
//       navItems={nav}
//     >
//       {message && (
//         <p className="mb-5 rounded-xl border border-success/20 bg-success/5 px-4 py-2.5 text-sm text-success">
//           {message}
//         </p>
//       )}

//       <div className="grid gap-6 lg:grid-cols-3">
//         <div className="space-y-5">
//           <Card>
//             <h3 className="font-medium text-text-primary">Tabel</h3>
//             <ul className="mt-4 space-y-1">
//               {EDITABLE_TABLES.map((t) => (
//                 <li key={t}>
//                   <button
//                     type="button"
//                     onClick={() => loadTable(t)}
//                     className={`w-full rounded-xl px-3 py-2.5 text-left font-mono text-sm transition ${
//                       table === t
//                         ? 'bg-primary text-white shadow-sm'
//                         : 'text-text-muted hover:bg-surface hover:text-text-primary'
//                     }`}
//                   >
//                     {t}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </Card>

//           <Card>
//             <h3 className="font-medium text-text-primary">Aksi Cepat</h3>
//             <div className="mt-4 flex flex-col gap-2">
//               <Button variant="secondary" onClick={handleExport}>
//                 Export JSON
//               </Button>
//               <Button variant="danger" onClick={handleReset}>
//                 Reset ke Demo
//               </Button>
//             </div>
//           </Card>

//           <Card>
//             <h3 className="font-medium text-text-primary">Server Config</h3>
//             <div className="mt-4 space-y-4">
//               <Input label="API Base URL" value={apiUrl} onChange={(e) => setApiUrl(e.target.value)} />
//               <label className="flex items-center gap-2 text-sm text-text-primary">
//                 <input
//                   type="checkbox"
//                   checked={maintenance}
//                   onChange={(e) => setMaintenance(e.target.checked)}
//                   className="rounded border-gray-200 text-primary focus:ring-primary/20"
//                 />
//                 Maintenance mode
//               </label>
//               <Button size="sm" variant="secondary" onClick={saveConfig}>
//                 Simpan config
//               </Button>
//             </div>
//           </Card>
//         </div>

//         <Card className="lg:col-span-2">
//           <div className="flex flex-wrap items-center justify-between gap-3">
//             <h3 className="font-mono font-medium text-text-primary">{table}</h3>
//             <Button onClick={handleSaveTable}>Simpan perubahan</Button>
//           </div>
//           <textarea
//             className="mt-5 h-[420px] w-full rounded-xl border border-gray-200 bg-primary p-4 font-mono text-xs leading-relaxed text-white/90 focus:outline-none focus:ring-2 focus:ring-primary/20"
//             value={jsonEdit}
//             onChange={(e) => setJsonEdit(e.target.value)}
//             spellCheck={false}
//           />
//         </Card>
//       </div>

//       <Card className="mt-6">
//         <h3 className="font-medium text-text-primary">Import Database</h3>
//         <Textarea
//           className="mt-4 font-mono text-xs"
//           rows={6}
//           value={importText}
//           onChange={(e) => setImportText(e.target.value)}
//           placeholder="Paste JSON database di sini..."
//         />
//         <Button className="mt-4" variant="secondary" onClick={handleImport}>
//           Import
//         </Button>
//       </Card>

//       <p className="mt-6 text-xs leading-relaxed text-text-muted">
//         Tabel tersedia: {getTableNames().join(', ')}. Password disimpan plain-text hanya untuk demo.
//       </p>
//     </DashboardLayout>
//   )
// }
