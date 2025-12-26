import React, { useEffect, useState, useRef } from 'react';
import { ArrowUp, ArrowDown, Activity, Disc } from 'lucide-react';

const AnimatedValue = ({ value, formatter = v => v.toFixed(0) }) => {
    const [displayValue, setDisplayValue] = useState(value);
    const startTime = useRef(0);
    const startValue = useRef(value);
    const animationFrame = useRef(null);

    useEffect(() => {
        startValue.current = displayValue;
        startTime.current = performance.now();

        const animate = (now) => {
            const elapsed = now - startTime.current;
            const duration = 600; // ms
            const progress = Math.min(elapsed / duration, 1);

            // Easing: Out Quart
            const ease = 1 - Math.pow(1 - progress, 4);

            const current = startValue.current + (value - startValue.current) * ease;
            setDisplayValue(current);

            if (progress < 1) {
                animationFrame.current = requestAnimationFrame(animate);
            }
        };

        cancelAnimationFrame(animationFrame.current);
        animationFrame.current = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrame.current);
    }, [value]);

    return <>{formatter(displayValue)}</>;
};

const KPI = ({ title, value, formatter, subtext, type = 'default' }) => {
    const isYield = type === 'yield';
    const colorClass = isYield ? 'text-blue-500' : 'text-green-500';
    const bgClass = isYield ? 'bg-blue-500/10 border-blue-500/20' : 'bg-green-500/10 border-green-500/20';
    const Icon = isYield ? Activity : Disc;

    return (
        <div className={`p-5 rounded-xl border ${bgClass} flex items-center justify-between backdrop-blur-sm transition-all duration-300 hover:bg-opacity-20`}>
            <div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
                <div className="text-2xl font-bold font-mono text-white tracking-tight">
                    <AnimatedValue value={value} formatter={formatter} />
                </div>
                <p className="text-xs text-gray-500 mt-1">{subtext}</p>
            </div>
            <div className={`p-3 rounded-lg ${isYield ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
    );
};

const KPICards = ({ yieldRate, totalDies, goodDies, efficiency }) => {

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <KPI
                title="Projected Yield"
                value={yieldRate * 100}
                formatter={(v) => `${v.toFixed(2)}%`}
                subtext="Theoretical stochastic limit"
                type="yield"
            />
            <KPI
                title="Good Dies"
                value={goodDies}
                formatter={(v) => Math.round(v).toLocaleString()}
                subtext={`${totalDies} Gross Dies`}
                type="count"
            />
            {/* Dynamic Efficiency Metric */}
            <div className="hidden md:flex p-5 rounded-xl bg-[#1E293B]/50 border border-white/5 items-center justify-between backdrop-blur-sm">
                <div>
                    <h3 className="text-gray-400 text-sm font-medium">Efficiency</h3>
                    <div className="text-2xl font-bold font-mono text-gray-200">
                        <AnimatedValue value={efficiency ? efficiency * 100 : 0} formatter={(v) => `${v.toFixed(1)}%`} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Area Utilization</p>
                </div>
                <div className="text-gray-600">
                    <Activity className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
};

export default KPICards;
