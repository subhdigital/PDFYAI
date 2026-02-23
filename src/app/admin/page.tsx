"use client";

import { Users, Database, Activity, ShieldAlert, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/admin/stats");
                const stats = await res.json();
                setData(stats);
            } catch (err) {
                console.error("Failed to fetch admin stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-12 h-12 animate-spin text-rose-600" />
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="mb-12">
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    <ShieldAlert className="text-rose-600" />
                    Admin Control Center
                </h1>
                <p className="text-slate-500">System stats and user management</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <Users className="text-blue-600 mb-4" />
                    <h3 className="text-slate-500 text-sm">Total Users</h3>
                    <p className="text-2xl font-bold">{data.stats.totalUsers}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <Activity className="text-green-600 mb-4" />
                    <h3 className="text-slate-500 text-sm">Total Jobs</h3>
                    <p className="text-2xl font-bold">{data.stats.totalJobs}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <Database className="text-purple-600 mb-4" />
                    <h3 className="text-slate-500 text-sm">Active Jobs</h3>
                    <p className="text-2xl font-bold">{data.stats.activeJobs}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <ShieldAlert className="text-amber-600 mb-4" />
                    <h3 className="text-slate-500 text-sm">System Health</h3>
                    <p className="text-2xl font-bold text-green-500">{data.stats.health}</p>
                </div>
            </div>

            <div className="glass rounded-[2rem] p-8">
                <h2 className="text-xl font-bold mb-6">Recent System Jobs</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800">
                                <th className="pb-4 font-semibold text-slate-500 uppercase text-xs tracking-wider">Job ID</th>
                                <th className="pb-4 font-semibold text-slate-500 uppercase text-xs tracking-wider">Type</th>
                                <th className="pb-4 font-semibold text-slate-500 uppercase text-xs tracking-wider">User</th>
                                <th className="pb-4 font-semibold text-slate-500 uppercase text-xs tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.recentJobs.map((job: any) => (
                                <tr key={job._id} className="border-b border-slate-50 dark:border-slate-900 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="py-5 font-mono text-xs">{job._id}</td>
                                    <td className="py-5 font-bold capitalize">{job.type.replace(/_/g, " ")}</td>
                                    <td className="py-5 text-sm">{(job.userId as any)?.name || "Guest"}</td>
                                    <td className="py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${job.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                                                job.status === "FAILED" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                                            }`}>
                                            {job.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
