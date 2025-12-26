import React, { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { Activity, AlertTriangle, Layers } from 'lucide-react';

const DashboardCard = ({ title, icon: Icon, children, className = "" }) => (
    <div className={`bg-[#1E293B]/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 flex flex-col ${className}`}>
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20">
                <Icon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>
        <div className="flex-1 min-h-0">
            {children}
        </div>
    </div>
);

// Mock Data Generators
const generateYieldTrend = (currentYield) => {
    const data = [];
    let y = currentYield * 100;
    for (let i = 1; i <= 20; i++) {
        // Random walk around current yield
        y = y + (Math.random() - 0.5) * 5;
        y = Math.min(Math.max(y, 0), 100);
        data.push({ lot: `L-${1000 + i}`, yield: y.toFixed(1) });
    }
    // Make last point equal to current simulation
    data[data.length - 1].yield = (currentYield * 100).toFixed(1);
    return data;
};

const generatePareto = (model) => {
    // Distribution changes slightly based on model
    if (model === 'poisson') {
        return [
            { name: 'Random Particles', value: 65, color: '#f59e0b' }, // Amber
            { name: 'Scratch', value: 20, color: '#ef4444' }, // Red
            { name: 'Parametric', value: 10, color: '#3b82f6' }, // Blue
            { name: 'Other', value: 5, color: '#94a3b8' }, // Slate
        ];
    }
    // Murphy/NB imply clustering or complexity
    return [
        { name: 'Edge Effect', value: 40, color: '#8b5cf6' }, // Violet
        { name: 'Random Particles', value: 30, color: '#f59e0b' },
        { name: 'Mask Defect', value: 20, color: '#ec4899' }, // Pink
        { name: 'Parametric', value: 10, color: '#3b82f6' },
    ];
};

const OverviewTab = ({ stats, params }) => {

    const trendData = useMemo(() => generateYieldTrend(stats.yieldRate), [stats.yieldRate]);
    const paretoData = useMemo(() => generatePareto(params.model), [params.model]);

    // Wafer Gallery (Mocked current state x 5 for visual structure, ideally would store history)
    // To make it look "alive", we'll just show the current map in 5 variations or placeholder
    // Real implementation: Global state stores last 5 parameter sets.
    // For this tasks scope, we will create a visual placeholder grid that implies history.

    return (
        <div className="space-y-6 animate-in fade-in duration-500">

            {/* Top Row: KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-[#1E293B]/50 p-6 rounded-2xl border border-white/5">
                    <div className="text-gray-400 text-sm font-medium mb-1">Current Yield</div>
                    <div className="text-3xl font-bold font-mono text-blue-400">{(stats.yieldRate * 100).toFixed(2)}%</div>
                </div>
                <div className="bg-[#1E293B]/50 p-6 rounded-2xl border border-white/5">
                    <div className="text-gray-400 text-sm font-medium mb-1">Throughput</div>
                    <div className="text-3xl font-bold font-mono text-green-400">140 <span className="text-base font-sans text-gray-500">WPH</span></div>
                </div>
                <div className="bg-[#1E293B]/50 p-6 rounded-2xl border border-white/5">
                    <div className="text-gray-400 text-sm font-medium mb-1">Process Capability</div>
                    <div className="text-3xl font-bold font-mono text-purple-400">1.33 <span className="text-base font-sans text-gray-500">Cpk</span></div>
                </div>
                <div className="bg-[#1E293B]/50 p-6 rounded-2xl border border-white/5">
                    <div className="text-gray-400 text-sm font-medium mb-1">Utilization</div>
                    <div className="text-3xl font-bold font-mono text-orange-400">92%</div>
                </div>
            </div>

            {/* Middle Row: Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">

                <DashboardCard title="Yield Trend (Last 20 Lots)" icon={Activity}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trendData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="lot" stroke="#94a3b8" tick={{ fontSize: 12 }} interval={4} />
                            <YAxis stroke="#94a3b8" domain={[0, 100]} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Line type="monotone" dataKey="yield" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#1e293b', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </DashboardCard>

                <DashboardCard title="Defect Pareto Analysis" icon={AlertTriangle}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={paretoData} layout="vertical" margin={{ left: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                            <XAxis type="number" stroke="#94a3b8" />
                            <YAxis dataKey="name" type="category" stroke="#94a3b8" width={100} tick={{ fontSize: 12 }} />
                            <Tooltip cursor={{ fill: '#ffffff10' }} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                                {paretoData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </DashboardCard>

            </div>

            {/* Bottom Row: Wafer Gallery */}
            <DashboardCard title="Wafer History Gallery" icon={Layers}>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="aspect-square bg-black/40 rounded-xl border border-white/5 flex flex-col items-center justify-center relative overflow-hidden group hover:border-blue-500/50 transition-colors">
                            {/* Placeholder visual - In real app, render small canvas or SVG */}
                            <div className="w-[70%] h-[70%] rounded-full border border-gray-700 bg-gray-900 input-pattern flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity">
                                <div className="w-[80%] h-[80%] rounded-full opacity-20 bg-gradient-to-tr from-green-500/0 via-green-500/50 to-red-500/50"></div>
                            </div>
                            <div className="absolute bottom-2 text-[10px] sm:text-xs text-gray-500 font-mono">Lot #{2450 - i}</div>
                        </div>
                    ))}
                </div>
            </DashboardCard>

        </div>
    );
};

export default OverviewTab;
