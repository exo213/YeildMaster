import React from 'react';
import { Cpu, BarChart3, Settings, Download } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'simulator', label: 'Simulator' },
        { id: 'strategies', label: 'Strategies' }
    ];

    return (
        <nav className="sticky top-0 z-50 w-full bg-[#0E1528]/80 backdrop-blur-md border-b border-white/5">
            <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2 text-blue-500">
                    <Cpu className="w-6 h-6" />
                    <span className="text-white font-bold text-lg tracking-tight">YieldMaster PRO</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-1 bg-[#1E293B] p-1 rounded-lg">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${activeTab === tab.id
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/10 transition-colors">
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Export</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
