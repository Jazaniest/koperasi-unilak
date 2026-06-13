// import { useEffect, useState } from 'react'
// import { DashboardLayout } from '../../components/layout/DashboardLayout'
// import { StatCard, Card } from '../../components/ui/Card'
// import { Badge } from '../../components/ui/Badge'
// import { IconHome, IconServer, IconDatabase } from '../../components/ui/Icons'
// import { getMockServerMetrics, getServerConfig } from '../../services/configService'
// import { getDatabase } from '../../services/dbService'
// import { formatDateTime } from '../../utils/format'

// const nav = [
//   { to: '/super', label: 'Server', icon: IconHome, end: true },
//   { to: '/super/database', label: 'Database', icon: IconDatabase },
// ]

// export function SuperDashboard() {
//   const [metrics, setMetrics] = useState(getMockServerMetrics())
//   const config = getServerConfig()
//   const db = getDatabase()

//   useEffect(() => {
//     const t = setInterval(() => setMetrics(getMockServerMetrics()), 5000)
//     return () => clearInterval(t)
//   }, [])

//   return (
//     <DashboardLayout
//       title="Developer Console"
//       subtitle="Monitoring server & sistem (mock — siap API)"
//       navItems={nav}
//     >
//       <div className="mb-6 flex items-center gap-3">
//         <Badge
//           status={metrics.status === 'online' ? 'active' : 'pending'}
//           label={metrics.status === 'maintenance' ? 'Maintenance' : metrics.status}
//         />
//         {config.maintenanceMode && (
//           <span className="text-sm font-medium text-warning">Mode maintenance aktif</span>
//         )}
//       </div>

//       <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
//         <StatCard title="CPU" value={`${metrics.cpu}%`} accent="primary" icon={IconServer} />
//         <StatCard title="Memory" value={`${metrics.memory}%`} accent="accent" icon={IconServer} />
//         <StatCard title="Req/menit" value={metrics.requestsPerMin} accent="success" icon={IconServer} />
//         <StatCard title="DB Connections" value={metrics.dbConnections} accent="warning" icon={IconDatabase} />
//       </div>

//       <div className="mt-6 grid gap-6 lg:grid-cols-2">
//         <Card>
//           <h3 className="font-medium text-text-primary">Konfigurasi API</h3>
//           <dl className="mt-5 space-y-3 text-sm">
//             <div className="flex justify-between gap-4">
//               <dt className="text-text-muted">Base URL</dt>
//               <dd className="font-mono text-xs text-text-primary">{config.apiBaseUrl}</dd>
//             </div>
//             <div className="flex justify-between gap-4">
//               <dt className="text-text-muted">Uptime</dt>
//               <dd className="font-medium text-text-primary">{metrics.uptime}</dd>
//             </div>
//             <div className="flex justify-between gap-4">
//               <dt className="text-text-muted">DB Version</dt>
//               <dd className="font-medium text-text-primary">{db.version}</dd>
//             </div>
//             <div className="flex justify-between gap-4">
//               <dt className="text-text-muted">Terakhir update DB</dt>
//               <dd className="font-medium text-text-primary">{formatDateTime(db.updatedAt)}</dd>
//             </div>
//           </dl>
//         </Card>

//         <Card>
//           <h3 className="font-medium text-text-primary">Ringkasan Tabel</h3>
//           <ul className="mt-5 space-y-2 text-sm">
//             {['users', 'members', 'savings', 'loans', 'loanApplications', 'systemLogs'].map((table) => (
//               <li key={table} className="flex justify-between rounded-xl border border-gray-100 bg-surface px-4 py-2.5">
//                 <span className="font-mono text-text-primary">{table}</span>
//                 <span className="font-medium text-text-muted">{(db[table] || []).length} rows</span>
//               </li>
//             ))}
//           </ul>
//         </Card>
//       </div>

//       <Card className="mt-6">
//         <h3 className="font-medium text-text-primary">System Logs</h3>
//         <ul className="mt-5 max-h-64 space-y-2 overflow-y-auto font-mono text-xs">
//           {(db.systemLogs || []).slice(0, 15).map((log) => (
//             <li
//               key={log.id}
//               className="flex gap-3 rounded-xl border border-gray-100 bg-primary px-4 py-2.5 text-white/90"
//             >
//               <span
//                 className={
//                   log.level === 'error'
//                     ? 'text-danger'
//                     : log.level === 'warn'
//                       ? 'text-accent'
//                       : 'text-accent-light'
//                 }
//               >
//                 [{log.level}]
//               </span>
//               <span className="min-w-0 flex-1">{log.message}</span>
//               <span className="shrink-0 text-white/40">{formatDateTime(log.createdAt)}</span>
//             </li>
//           ))}
//         </ul>
//       </Card>
//     </DashboardLayout>
//   )
// }
