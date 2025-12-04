import { ChartDataPoint, ContractType, InflationScenario } from "./types";

export const generateTrendData = (
  contractType: ContractType,
  baseVal: number, 
  carveOutVal: number,
  inflation: InflationScenario,
  clauseImpact: number
): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Base Baseline per contract type
  let baseline = 0;
  if (contractType === 'hospital') baseline = 2000; // $2M monthly
  if (contractType === 'anesthesia') baseline = 450; // $450k monthly
  if (contractType === 'home_health') baseline = 180; // $180k monthly

  const inflationMap = { low: 1.01, med: 1.03, high: 1.06 };
  const trendFactor = inflationMap[inflation];

  months.forEach((month, index) => {
    const timeDecay = 1 + (index * ((trendFactor - 1) / 12));
    const seasonality = 1 + (Math.sin(index / 2) * 0.08); // General curve
    
    // Calculate Spend based on Type logic
    let totalProjected = 0;

    if (contractType === 'hospital') {
        // Logic: Base % Increase applied to volume
        const baseSpend = (baseline) * (1 + (baseVal/100));
        const orthoImpact = (baseline * 0.3) * (carveOutVal/100); 
        totalProjected = (baseSpend + orthoImpact) * seasonality * timeDecay;
    } else if (contractType === 'anesthesia') {
        // Logic: Unit Rate * Volume
        // baseVal here is $, not %
        const units = 8000; // monthly units
        const rateIncreaseImpact = (units * baseVal) / 1000; // in k
        const modImpact = rateIncreaseImpact * (carveOutVal/100);
        totalProjected = (rateIncreaseImpact + modImpact) * seasonality * timeDecay;
    } else {
        // Logic: Per Visit
        // baseVal here is $
        const visits = 1200; // monthly visits
        const visitSpend = (visits * baseVal) / 1000; // in k
        const ruralImpact = visitSpend * (carveOutVal/100);
        totalProjected = (visitSpend + ruralImpact) * seasonality * timeDecay;
    }

    // Apply Clause Impact
    totalProjected = totalProjected + (clauseImpact * seasonality);

    // Market Benchmark (Static logic for demo)
    const marketBenchmark = (totalProjected * 0.95) + (Math.random() * 10);

    data.push({
      name: month,
      Proposed: Math.round(totalProjected),
      MarketAvg: Math.round(marketBenchmark),
    });
  });
  return data;
};