import React from 'react';
import ControlPanel from '../ControlPanel';
import KPICards from '../KPICards';
import WaferMap from '../WaferMap';

const SimulatorTab = ({ params, setParams, stats }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
            {/* Left Column: Controls (4 cols) */}
            <div className="lg:col-span-4 xl:col-span-3 space-y-6">
                <ControlPanel params={params} setParams={setParams} />
            </div>

            {/* Right Column: Visualization & KPIs (8 cols) */}
            <div className="lg:col-span-8 xl:col-span-9 flex flex-col h-full gap-6">

                <KPICards
                    yieldRate={stats.yieldRate}
                    totalDies={stats.totalDies}
                    goodDies={stats.goodDies}
                    efficiency={stats.efficiency}
                />

                <div className="flex-1 min-h-[500px] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/5 bg-[#020617]">
                    <WaferMap
                        diameter={params.diameter}
                        dieArea={params.dieArea}
                        yieldRate={stats.yieldRate}
                    />
                </div>
            </div>
        </div>
    );
};

export default SimulatorTab;
