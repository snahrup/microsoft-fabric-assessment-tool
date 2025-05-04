import React, { useState, useEffect } from 'react';
import { AssessmentData } from '../App';

interface ValueCalculatorProps {
  assessmentData: AssessmentData;
  fabricScore: number;
}

interface ValueMetrics {
  costSavings: number;
  timeToValue: number;
  annualProductivityHours: number;
  threeYearROI: number;
  riskReduction: number;
  dataDrivenBenefitScore: number;
}

const ValueCalculator: React.FC<ValueCalculatorProps> = ({ assessmentData, fabricScore }) => {
  const [valueMetrics, setValueMetrics] = useState<ValueMetrics | null>(null);
  const [organizationSize, setOrganizationSize] = useState<number>(500);
  const [currentAnnualCosts, setCurrentAnnualCosts] = useState<number>(500000);
  const [averageHourlyRate, setAverageHourlyRate] = useState<number>(75);
  
  // Calculate ROI and value metrics whenever inputs change
  useEffect(() => {
    calculateValueProposition();
  }, [assessmentData, fabricScore, organizationSize, currentAnnualCosts, averageHourlyRate]);
  
  // Calculate the value proposition metrics
  const calculateValueProposition = () => {
    // Apply industry-specific multipliers
    const industryMultipliers = {
      'financial-services': {
        costSavings: 1.2,  // Financial services can see higher cost savings
        timeToValue: 0.9,  // Slightly faster implementation
        productivity: 1.1  // Slightly higher productivity gains
      },
      'healthcare': {
        costSavings: 1.15, // Healthcare has significant compliance cost savings
        timeToValue: 1.1,  // Slightly longer due to compliance
        productivity: 1.25 // High productivity gains in clinical analytics
      },
      'manufacturing': {
        costSavings: 1.1,  // Good cost savings from IoT/OT integration
        timeToValue: 1.0,  // Average implementation time
        productivity: 1.2  // Good productivity from predictive maintenance
      },
      'retail': {
        costSavings: 1.25, // High cost savings from inventory optimization
        timeToValue: 0.9,  // Faster implementation
        productivity: 1.15 // Good gains from customer analytics
      },
      'public-sector': {
        costSavings: 0.9,  // Lower due to procurement constraints
        timeToValue: 1.3,  // Longer implementation cycles
        productivity: 1.05 // Modest productivity gains
      },
      'energy': {
        costSavings: 1.15, // Good savings from operational efficiency
        timeToValue: 1.1,  // Longer due to OT integration
        productivity: 1.1  // Moderate productivity gains
      },
      'general': {
        costSavings: 1.0,  // Baseline
        timeToValue: 1.0,  // Baseline
        productivity: 1.0  // Baseline
      }
    };
    
    // Get multipliers for the selected industry, defaulting to general if not found
    const industry = assessmentData.industry || 'general';
    const multiplier = industryMultipliers[industry as keyof typeof industryMultipliers] || industryMultipliers.general;
    // Base calculations scaled by organization size and current costs
    const sizeFactor = organizationSize / 500; // Normalize to 500 employees
    const costFactor = currentAnnualCosts / 500000; // Normalize to $500k baseline
    
    // Calculate cost savings (higher for legacy systems and higher Fabric score)
    let costSavingsPercent = 0;
    if (assessmentData.dataWarehouseSolution === 'Legacy System' || 
        assessmentData.dataWarehouseSolution === 'Legacy Data Warehouse') {
      costSavingsPercent = 0.25 + (fabricScore / 400); // 25% to 50% savings
    } else if (assessmentData.dataWarehouseSolution === 'Competitor Platform' ||
               assessmentData.dataWarehouseSolution === 'Snowflake' ||
               assessmentData.dataWarehouseSolution === 'Databricks') {
      costSavingsPercent = 0.15 + (fabricScore / 500); // 15% to 35% savings
    } else {
      costSavingsPercent = 0.10 + (fabricScore / 1000); // 10% to 20% savings
    }
    
    // Adjust for Microsoft ecosystem alignment
    if (assessmentData.microsoftInvestments.includes('Azure')) {
      costSavingsPercent += 0.05;
    }
    if (assessmentData.microsoftInvestments.includes('Power BI')) {
      costSavingsPercent += 0.05;
    }
    
    // Calculate annual cost savings with industry-specific multiplier
    const costSavings = Math.round(currentAnnualCosts * costSavingsPercent * multiplier.costSavings);
    
    // Calculate time to value (in months)
    let timeToValue = 12; // Baseline implementation time
    
    // Adjust for implementation speed factors
    if (assessmentData.microsoftInvestments.includes('Azure')) timeToValue -= 2;
    if (assessmentData.microsoftInvestments.includes('Power BI')) timeToValue -= 1;
    if (assessmentData.powerBiUsage > 7) timeToValue -= 2;
    
    // Adjust for complexity
    if (assessmentData.dataVolume > 8) timeToValue += 2;
    if (assessmentData.realTimeNeeds > 8) timeToValue += 1;
    if (assessmentData.complianceRequirements.length > 3) timeToValue += 2;
    
    // Apply industry-specific time to value multiplier
    timeToValue = timeToValue * multiplier.timeToValue;
    
    // Ensure minimum of 3 months
    timeToValue = Math.max(3, Math.round(timeToValue));
    
    // Calculate productivity improvements
    // Estimating hours saved per employee per year
    let hoursPerEmployeeAnnual = 0;
    
    // Data access and analysis time savings
    if (fabricScore >= 80) {
      hoursPerEmployeeAnnual = 52; // 1 hour per week for high Fabric scores
    } else if (fabricScore >= 60) {
      hoursPerEmployeeAnnual = 26; // 30 minutes per week for moderate scores
    } else {
      hoursPerEmployeeAnnual = 13; // 15 minutes per week for lower scores
    }
    
    // Knowledge worker multiplier (assuming 30% of employees are knowledge workers who benefit)
    const knowledgeWorkerPercent = 0.3;
    const annualProductivityHours = Math.round(organizationSize * knowledgeWorkerPercent * hoursPerEmployeeAnnual * multiplier.productivity);
    
    // Productivity value in dollars
    const productivityValue = annualProductivityHours * averageHourlyRate;
    
    // Calculate three-year ROI
    const threeYearCostSavings = costSavings * 3;
    const threeYearProductivityValue = productivityValue * 3;
    
    // Estimate Fabric costs over 3 years (simplified)
    const fabricImplementationCost = currentAnnualCosts * 0.5; // Assuming 50% of annual current costs
    const fabricAnnualCost = (currentAnnualCosts - costSavings) * 0.8; // 80% of the difference
    const threeYearFabricCost = fabricImplementationCost + (fabricAnnualCost * 3);
    
    // ROI calculation
    const threeYearBenefit = threeYearCostSavings + threeYearProductivityValue;
    const threeYearROI = Math.round(((threeYearBenefit - threeYearFabricCost) / threeYearFabricCost) * 100);
    
    // Risk reduction score (1-10)
    let riskReduction = 5; // Baseline
    
    if (assessmentData.complianceRequirements.length > 2) riskReduction += 1;
    if (assessmentData.dataSovereigntyNeeds > 7) riskReduction += 1;
    if (assessmentData.microsoftInvestments.includes('Azure')) riskReduction += 1;
    if (assessmentData.microsoftInvestments.includes('Microsoft 365')) riskReduction += 1;
    if (assessmentData.powerBiUsage > 7) riskReduction += 1;
    
    riskReduction = Math.min(10, riskReduction);
    
    // Data-driven benefit score (1-10)
    let dataDrivenBenefitScore = Math.round((fabricScore / 20) + 2);
    dataDrivenBenefitScore = Math.min(10, Math.max(1, dataDrivenBenefitScore));
    
    // Update state with calculated metrics
    setValueMetrics({
      costSavings,
      timeToValue,
      annualProductivityHours,
      threeYearROI,
      riskReduction,
      dataDrivenBenefitScore
    });
  };
  
  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Calculate potential cost of doing nothing
  const getCostOfInaction = () => {
    if (!valueMetrics) return 0;
    const annualOpportunityCost = valueMetrics.costSavings + (valueMetrics.annualProductivityHours * averageHourlyRate);
    return formatCurrency(annualOpportunityCost);
  };
  
  return (
    <div className="value-calculator p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-6 border-b pb-4">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">Fabric Value Proposition Calculator</h2>
        <p className="text-gray-600">
          This calculator provides an estimate of the potential business value from implementing Microsoft Fabric 
          based on your assessment responses and organizational parameters.
        </p>
      </div>
      
      {/* Organization Parameters Form */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Customize Your Calculation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organization Size (employees)
            </label>
            <input
              type="number"
              value={organizationSize}
              onChange={(e) => setOrganizationSize(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Annual Data Platform Costs
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
              <input
                type="number"
                value={currentAnnualCosts}
                onChange={(e) => setCurrentAnnualCosts(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Average Hourly Rate ($)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
              <input
                type="number"
                value={averageHourlyRate}
                onChange={(e) => setAverageHourlyRate(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full pl-8 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Value Metrics Results */}
      {valueMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Financial Impact */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">Financial Impact</h3>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-blue-100">
                <span className="text-gray-600">Annual Cost Savings:</span>
                <span className="font-bold text-blue-700">{formatCurrency(valueMetrics.costSavings)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-blue-100">
                <span className="text-gray-600">Productivity Value:</span>
                <span className="font-bold text-blue-700">
                  {formatCurrency(valueMetrics.annualProductivityHours * averageHourlyRate)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-blue-100">
                <span className="text-gray-600">3-Year ROI:</span>
                <span className="font-bold text-green-600">{valueMetrics.threeYearROI}%</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Cost of Inaction (Annual):</span>
                <span className="font-bold text-red-600">{getCostOfInaction()}</span>
              </div>
            </div>
          </div>
          
          {/* Implementation & Benefits */}
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
            <h3 className="text-xl font-semibold text-indigo-800 mb-4">Implementation & Benefits</h3>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-indigo-100">
                <span className="text-gray-600">Estimated Time to Value:</span>
                <span className="font-bold text-indigo-700">{valueMetrics.timeToValue} months</span>
              </div>
              <div className="flex justify-between py-2 border-b border-indigo-100">
                <span className="text-gray-600">Annual Productivity Hours Saved:</span>
                <span className="font-bold text-indigo-700">
                  {valueMetrics.annualProductivityHours.toLocaleString()} hours
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-indigo-100">
                <span className="text-gray-600">Risk Reduction Score:</span>
                <span className="font-bold text-indigo-700">{valueMetrics.riskReduction}/10</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Data-Driven Business Benefit:</span>
                <span className="font-bold text-indigo-700">{valueMetrics.dataDrivenBenefitScore}/10</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Disclaimer */}
      <div className="mt-8 text-sm text-gray-500 italic">
        <p>Note: All calculations are estimates based on industry averages and your assessment inputs. 
          Actual results may vary. We recommend working with a Microsoft Fabric specialist to create 
          a detailed business case specific to your organization.</p>
      </div>
    </div>
  );
};

export default ValueCalculator;
