/**
 * YieldMaster PRO - Math Utilities
 */

/**
 * Calculates yield based on the selected model.
 * 
 * @param {string} model - 'poisson', 'murphy', 'nb'
 * @param {number} d0 - Defect Density (per cm²)
 * @param {number} areaMm2 - Die Area (mm²)
 * @param {number} alpha - Cluster Factor (for Negative Binomial)
 * @returns {number} Yield percentage (0-1)
 */
export const calculateYield = (model, d0, areaMm2, alpha) => {
    // Convert Area from mm² to cm²
    const A = areaMm2 / 100;

    // D0 is already in /cm²
    const product = d0 * A;

    switch (model) {
        case 'poisson':
            return Math.exp(-product);

        case 'murphy':
            if (product === 0) return 1;
            // Approximation: Y = (1 / (1 + D0 * A))^2
            return Math.pow(1 / (1 + product), 2);

        case 'nb':
            // Negative Binomial: Y = (1 + (D0 * A) / alpha)^(-alpha)
            return Math.pow(1 + product / alpha, -alpha);

        default:
            return 0;
    }
};

/**
 * Estimates total gross dies on the wafer.
 * Approximation: Floor( WaferArea / DieArea )
 * 
 * @param {number} diameterMm 
 * @param {number} dieAreaMm2 
 * @returns {number}
 */
export const calculateGrossDies = (diameterMm, dieAreaMm2) => {
    const radius = diameterMm / 2;
    const waferArea = Math.PI * Math.pow(radius, 2);
    return Math.floor(waferArea / dieAreaMm2);
};

export const calculateGoodDies = (totalDies, yieldRate) => {
    return Math.floor(totalDies * yieldRate);
};

/**
 * Calculates wafer area efficiency.
 * Ratio of Total Die Area to Wafer Area.
 * 
 * @param {number} grossDies 
 * @param {number} dieAreaMm2 
 * @param {number} diameterMm 
 * @returns {number} Efficiency (0-1)
 */
export const calculateEfficiency = (grossDies, dieAreaMm2, diameterMm) => {
    const radius = diameterMm / 2;
    const waferArea = Math.PI * Math.pow(radius, 2);
    if (waferArea === 0) return 0;
    return (grossDies * dieAreaMm2) / waferArea;
};

/**
 * Calculates Cost Per Good Die (CPGD)
 */
export const calculateEconomics = (waferCost, goodDies) => {
    if (goodDies <= 0) return 0;
    return waferCost / goodDies;
};

/**
 * Calculates Effective Yield with Repair/Redundancy
 * Simple model: Yield_eff = Yield_raw + (1 - Yield_raw) * repairable_fraction * success_rate
 * Or more accurate: P(die works) = P(0 defects) + P(defects in repairable area)
 * 
 * Let's use prompts model logic if specified, else:
 * "If a defect lands in a repairable area, the die is saved."
 * Area_repairable = DieArea * (repairPct / 100)
 * P(defect in fatal area) = D0 * (Area - Area_repairable)
 * Yield_new = e^(-D0 * A_fatal) ... for Poisson
 * 
 * Unified approach: Treat effective area as Area * (1 - repairPct)
 */
export const calculateEffectiveYield = (params, repairPct) => {
    // If repairPct is 0, return base.
    if (!repairPct || repairPct <= 0) {
        return calculateYield(params.model, params.d0, params.dieArea, params.alpha);
    }

    // Effective Area Method (Simplest for all models)
    // Reduce the "Fatal Area" by the repairable percentage.
    // New Area = Area * (1 - repairPct/100)
    // Recalculate yield with this smaller area.

    const effectiveArea = params.dieArea * (1 - repairPct / 100);

    return calculateYield(params.model, params.d0, effectiveArea, params.alpha);
};
