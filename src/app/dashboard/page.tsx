"use client";

import { useSession } from "next-auth/react";
import { FileText, Clock, CheckCircle, Plus, Loader2, Download } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const { data: session } = useSession();
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, completed: 0 });

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await fetch("/api/jobs/user");
                const data = await res.json();
                setJobs(data.jobs || []);
                setStats({
                    total: data.jobs?.length || 0,
                    completed: data.jobs?.filter((j: any) => j.status === "COMPLETED").length || 0
                });
            } catch (err) {
                console.error("Failed to fetch jobs", err);
            } finally {
                setLoading(false);
            }
        };

        if (session?.user) fetchJobs();
    }, [session]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Welcome back, {session?.user?.name || "User"}!</h1>
                    <p className="text-slate-500">Manage your PDF jobs and subscription here.</p>
                </div>
                <Link href="/" className="btn-primary">
                    <Plus className="w-5 h-5" />
                    New PDF Task
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="glass p-8 rounded-[2rem]">
                    <div className="bg-blue-100 dark:bg-blue-900/30 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                        <FileText className="text-blue-600 w-7 h-7" />
                    </div>
                    <h3 className="text-slate-500 text-sm font-semibold mb-1 uppercase tracking-wider">Total Jobs</h3>
                    <p className="text-4xl font-extrabold">{loading ? "..." : stats.total}</p>
                </div>
                <div className="glass p-8 rounded-[2rem]">
                    <div className="bg-green-100 dark:bg-green-900/30 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                        <CheckCircle className="text-green-600 w-7 h-7" />
                    </div>
                    <h3 className="text-slate-500 text-sm font-semibold mb-1 uppercase tracking-wider">Completed</h3>
                    <p className="text-4xl font-extrabold">{loading ? "..." : stats.completed}</p>
                </div>
                <div className="glass p-8 rounded-[2rem]">
                    <div className="bg-rose-100 dark:bg-rose-900/30 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                        <Clock className="text-rose-600 w-7 h-7" />
                    </div>
                    <h3 className="text-slate-500 text-sm font-semibold mb-1 uppercase tracking-wider">Queue Health</h3>
                    <p className="text-4xl font-extrabold">Optimal</p>
                </div>
            </div>

            <div className="glass rounded-[2.5rem] overflow-hidden">
                <div className="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Recent Activity</h2>
                    {loading && <Loader2 className="w-6 h-6 animate-spin text-rose-600" />}
                </div>
                <div className="p-10">
                    {jobs.length > 0 ? (
                        <div className="space-y-4">
                            {jobs.map((job) => (
                                <div key={job._id} className="flex items-center justify-between p-6 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-xl">
                                            <FileText className="text-rose-600 w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg capitalize">{job.type.replace(/_/g, " ")}</p>
                                            <p className="text-sm text-slate-500">{new Date(job.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className={`px-4 py-1 rounded-full text-xs font-bold ${job.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                                                job.status === "FAILED" ? "bg-red-100 text-red-700" :
                                                    "bg-blue-100 text-blue-700"
                                            }`}>
                                            {job.status}
                                        </span>
                                        {job.status === "COMPLETED" && (
                                            <Link
                                                href={job.downloadUrl || `/api/jobs/${job._id}`}
                                                className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg text-rose-600 transition-colors"
                                                title="Download Result"
                                            >
                                                <Download className="w-6 h-6" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 text-slate-400">
                            <div className="bg-slate-50 dark:bg-slate-900 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FileText className="w-10 h-10 opacity-20" />
                            </div>
                            <p className="mb-4 text-lg">You haven't processed any documents yet.</p>
                            <Link href="/" className="btn-primary inline-flex">Get Started Now</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
