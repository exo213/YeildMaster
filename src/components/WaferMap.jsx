import React, { useRef, useEffect, useState } from 'react';

const WaferMap = ({ diameter, dieArea, yieldRate }) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);

    // Grid size in mm
    const dieSize = Math.sqrt(dieArea);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: false });

        // Resize handling
        const resizeCanvas = () => {
            const parent = containerRef.current;
            if (parent) {
                // Handle High DPI
                const dpr = window.devicePixelRatio || 1;
                // Use clientWidth/Height to get inner content box (excluding borders)
                // Since we ignore padding with absolute positioning, we need to be careful?
                // Actually, let's look at the container. It has padding p-4.
                // We want the canvas to be inside the padding? Or full container?
                // If absolute inset-0, it ignores padding unless we do something else.
                // Let's remove p-4 from container and use margin in sizing if needed, or just fill.
                // Given the design, "p-4" creates a frame. 
                // We can just use the parent's logic width, but simplest is:

                const rect = parent.getBoundingClientRect();

                // Update Internal Resolution
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;

                // Scale context
                ctx.scale(dpr, dpr);

                // NOTE: We do NOT set style.width/height here. 
                // CSS 'w-full h-full' handles the visual size.
                // This decouples layout from logic.

                draw(rect.width, rect.height);
            }
        };

        const draw = (width, height) => {
            // Clear background
            ctx.fillStyle = '#020617'; // Match container bg
            ctx.fillRect(0, 0, width, height);

            const centerX = width / 2;
            const centerY = height / 2;

            // Calculate Scale to fit Wafer in Canvas
            // Wafer Diameter (mm) -> Canvas Pixels
            const margin = 20;
            const scale = (Math.min(width, height) - margin * 2) / diameter;

            const radiusPx = (diameter / 2) * scale;

            // Draw Wafer Outline
            ctx.beginPath();
            ctx.arc(centerX, centerY, radiusPx, 0, 2 * Math.PI);
            ctx.fillStyle = '#1E293B'; // Dark Slate
            ctx.fill();
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw Dies
            const dieSizePx = dieSize * scale;

            // Optimization: No stroke for dies, just fill
            const gap = dieSizePx > 4 ? 1 : 0;
            const drawSize = dieSizePx - gap;

            // Grid bounds (mm coordinates relative to center)
            const radiusMm = diameter / 2;

            // Start from top-left of the bounding box
            // Optimization: limit loop to bounding circle
            const start = -radiusMm;
            const end = radiusMm;

            // Colors
            const colorGood = '#22C55E'; // Green-500
            const colorBad = '#EF4444'; // Red-500

            // Iterate grid
            for (let xMm = start; xMm < end; xMm += dieSize) {
                for (let yMm = start; yMm < end; yMm += dieSize) {
                    // Center of the die
                    const cxMm = xMm + dieSize / 2;
                    const cyMm = yMm + dieSize / 2;

                    // Distance from center
                    const dist = Math.sqrt(cxMm * cxMm + cyMm * cyMm);

                    // Check if inside wafer
                    // Check if the grid cell center is within the wafer radius (as per original prompt)
                    if (dist <= radiusMm) {
                        const isGood = Math.random() < yieldRate;

                        // Convert mm to pixels
                        const px = centerX + xMm * scale;
                        const py = centerY + yMm * scale;

                        ctx.fillStyle = isGood ? colorGood : colorBad;
                        ctx.fillRect(px, py, drawSize, drawSize);
                    }
                }
            }
        };

        // Initial draw
        resizeCanvas();

        // Debounce resize? No, simpler to just listen.
        window.addEventListener('resize', resizeCanvas);
        return () => window.removeEventListener('resize', resizeCanvas);
    }, [diameter, dieArea, yieldRate]);

    return (
        <div
            ref={containerRef}
            className="w-full h-[500px] lg:h-full min-h-[500px] bg-[#020617] rounded-2xl border border-white/5 relative overflow-hidden shadow-inner"
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full block"
            />

            {/* Label Overlay */}
            <div className="absolute bottom-4 right-4 bg-black/40 backdrop-blur text-xs text-gray-400 px-3 py-1 rounded-full border border-white/5 font-mono pointer-events-none">
                Map Simulation
            </div>
        </div>
    );
};

export default WaferMap;
