/**
 * YieldMaster PRO - Math Utilities
 * Enhanced with: Edge Exclusion, Critical Area, Systematic Yield, Fab Utilization
 */

/**
 * Calculates yield based on the selected model.
 * Now supports patternDensity (Critical Area) and processMaturity (Systematic Yield).
 * 
 * @param {string} model - 'poisson', 'murphy', 'nb'
 * @param {number} d0 - Defect Density (per cm²)
 * @param {number} areaMm2 - Die Area (mm²)
 * @param {number} alpha - Cluster Factor (for Negative Binomial)
 * @param {number} patternDensity - Critical Area ratio (0-1), default 1.0
 * @param {number} processMaturity - Systematic yield cap (0-1), default 1.0
 * @returns {number} Yield percentage (0-1)
 */
export const calculateYield = (model, d0, areaMm2, alpha, patternDensity = 1.0, processMaturity = 1.0) => {
    // Apply Critical Area: only sensitive area matters for defects
    const criticalAreaMm2 = areaMm2 * patternDensity;
    
    // Convert Area from mm² to cm²
    const A = criticalAreaMm2 / 100;

    // D0 is already in /cm²
    const product = d0 * A;

    let randomYield;
    switch (model) {
        case 'poisson':
            randomYield = Math.exp(-product);
            break;

        case 'murphy':
            if (product === 0) {
                randomYield = 1;
            } else {
                // Approximation: Y = (1 / (1 + D0 * A))^2
                randomYield = Math.pow(1 / (1 + product), 2);
            }
            break;

        case 'nb':
            // Negative Binomial: Y = (1 + (D0 * A) / alpha)^(-alpha)
            randomYield = Math.pow(1 + product / alpha, -alpha);
            break;

        default:
            randomYield = 0;
    }

    // Apply Systematic Yield cap (process maturity limits max achievable yield)
    return randomYield * processMaturity;
};

/**
 * Estimates total gross dies on the wafer.
 * Now supports edge exclusion.
 * 
 * @param {number} diameterMm - Wafer diameter in mm
 * @param {number} dieAreaMm2 - Die area in mm²
 * @param {number} edgeExclusionMm - Edge exclusion in mm (default 0)
 * @returns {number}
 */
export const calculateGrossDies = (diameterMm, dieAreaMm2, edgeExclusionMm = 0) => {
    // Effective diameter after subtracting edge exclusion from both sides
    const effectiveDiameter = diameterMm - (2 * edgeExclusionMm);
    if (effectiveDiameter <= 0) return 0;
    
    const radius = effectiveDiameter / 2;
    const waferArea = Math.PI * Math.pow(radius, 2);
    return Math.floor(waferArea / dieAreaMm2);
};

export const calculateGoodDies = (totalDies, yieldRate) => {
    return Math.floor(totalDies * yieldRate);
};

/**
 * Calculates wafer area efficiency.
 * Ratio of Total Die Area to Wafer Area.
 * Now accounts for edge exclusion.
 * 
 * @param {number} grossDies 
 * @param {number} dieAreaMm2 
 * @param {number} diameterMm 
 * @param {number} edgeExclusionMm - Edge exclusion in mm (default 0)
 * @returns {number} Efficiency (0-1)
 */
export const calculateEfficiency = (grossDies, dieAreaMm2, diameterMm, edgeExclusionMm = 0) => {
    const effectiveDiameter = diameterMm - (2 * edgeExclusionMm);
    if (effectiveDiameter <= 0) return 0;
    
    const radius = effectiveDiameter / 2;
    const waferArea = Math.PI * Math.pow(radius, 2);
    if (waferArea === 0) return 0;
    return (grossDies * dieAreaMm2) / waferArea;
};

/**
 * Calculates Cost Per Good Die (CPGD)
 * Now supports fab utilization factor.
 * 
 * @param {number} waferCost - Base wafer cost
 * @param {number} goodDies - Number of good dies
 * @param {number} fabUtilization - Fab utilization (0-1), default 1.0
 * @returns {number}
 */
export const calculateEconomics = (waferCost, goodDies, fabUtilization = 1.0) => {
    if (goodDies <= 0) return 0;
    // When utilization is low, fixed costs are spread over fewer wafers, increasing effective cost
    const effectiveWaferCost = fabUtilization > 0 ? waferCost / fabUtilization : waferCost;
    return effectiveWaferCost / goodDies;
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
