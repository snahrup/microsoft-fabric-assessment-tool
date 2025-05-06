import React, { useState } from 'react';
import { AssessmentData } from '../App';
import DashboardLayout from './DashboardLayout';
import RadarChart from './RadarChart';
import { calculateScores } from '../utils/calculateScores';

interface ModernDashboardProps {
  assessmentData: AssessmentData;
  fabricScore: number;
  onContinue: () => void;
}

const ModernDashboard: React.FC<ModernDashboardProps> = ({ 
  assessmentData, 
  fabricScore, 
  onContinue 
}) => {
  // Add error handling and fallback for calculateScores
  let scores;
  try {
    scores = calculateScores(assessmentData);
  } catch (error) {
    console.error('Error calculating scores:', error);
    // Provide default scores as fallback
    scores = {
      data: assessmentData.dataVolume / 2,
      analytics: assessmentData.powerBiUsage / 2,
      governance: (10 - assessmentData.dataSovereigntyNeeds) / 2,
      culture: assessmentData.timeToImplementation / 2
    };
  }
  
  // Create risk levels for different categories based on scores
  const getRiskLevel = (score: number) => {
    if (score >= 7.5) return { level: 'Low', color: 'green' };
    if (score >= 5) return { level: 'Medium', color: 'yellow' };
    if (score >= 2.5) return { level: 'High', color: 'orange' };
    return { level: 'Extreme', color: 'red' };
  };
  
  const dataRisk = getRiskLevel(scores.data);
  const analyticsRisk = getRiskLevel(scores.analytics);
  const governanceRisk = getRiskLevel(scores.governance);
  const cultureRisk = getRiskLevel(scores.culture);
  
  const renderCharts = () => (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-sm p-5">
        <h2 className="text-lg font-semibold mb-4">Fabric Readiness Assessment</h2>
        <div className="h-80 flex justify-center items-center">
          <RadarChart 
            assessmentData={assessmentData} 
            width={360} 
            height={360} 
            colorScheme="default" 
          />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-5">
        <h2 className="text-lg font-semibold mb-4">Overall Score</h2>
        <div className="flex flex-col items-center justify-center h-72">
          <div className="relative">
            <svg className="w-56 h-56" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke="#f3f3f3" 
                strokeWidth="10" 
              />
              
              {/* Progress circle */}
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                fill="none" 
                stroke={fabricScore >= 70 ? '#107c10' : (fabricScore >= 40 ? '#ffb900' : '#d13438')} 
                strokeWidth="10" 
                strokeDasharray="283" 
                strokeDashoffset={283 - (283 * (fabricScore / 100))} 
                transform="rotate(-90 50 50)" 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold">{Math.round(fabricScore)}</span>
              <div className="mt-4 text-center">
                <h3 className="font-semibold">
                  {fabricScore >= 80 ? 'Excellent Fit' : 
                   fabricScore >= 60 ? 'Good Fit' : 
                   fabricScore >= 40 ? 'Partial Fit' : 'Not Recommended'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {fabricScore >= 70 
                    ? 'Ready for Microsoft Fabric implementation' 
                    : fabricScore >= 50 
                      ? 'Some areas need attention before full implementation' 
                      : 'Significant improvements needed'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-span-2 bg-white rounded-lg shadow-sm p-5">
        <h2 className="text-lg font-semibold mb-4">Risk Assessment by Category</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assessed Threat Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assessed Risk Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Improvement Recommendation</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Data Integration</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-${dataRisk.color === 'red' ? 'red' : dataRisk.color === 'orange' ? 'orange' : dataRisk.color === 'yellow' ? 'yellow' : 'green'}-100 text-${dataRisk.color === 'red' ? 'red' : dataRisk.color === 'orange' ? 'orange' : dataRisk.color === 'yellow' ? 'yellow' : 'green'}-800`}>
                    {dataRisk.level}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{scores.data.toFixed(1)}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{scores.data < 6 ? 'Prioritize data integration strategy and tools alignment' : 'Maintain current data integration practices'}</div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Analytics Capabilities</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-${analyticsRisk.color === 'red' ? 'red' : analyticsRisk.color === 'orange' ? 'orange' : analyticsRisk.color === 'yellow' ? 'yellow' : 'green'}-100 text-${analyticsRisk.color === 'red' ? 'red' : analyticsRisk.color === 'orange' ? 'orange' : analyticsRisk.color === 'yellow' ? 'yellow' : 'green'}-800`}>
                    {analyticsRisk.level}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{scores.analytics.toFixed(1)}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{scores.analytics < 6 ? 'Enhance analytics capabilities through training and tooling' : 'Continue developing advanced analytics use cases'}</div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Governance Framework</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-${governanceRisk.color === 'red' ? 'red' : governanceRisk.color === 'orange' ? 'orange' : governanceRisk.color === 'yellow' ? 'yellow' : 'green'}-100 text-${governanceRisk.color === 'red' ? 'red' : governanceRisk.color === 'orange' ? 'orange' : governanceRisk.color === 'yellow' ? 'yellow' : 'green'}-800`}>
                    {governanceRisk.level}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{scores.governance.toFixed(1)}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{scores.governance < 6 ? 'Establish stronger data governance policies and procedures' : 'Maintain governance practices with regular reviews'}</div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">Organizational Culture</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-${cultureRisk.color === 'red' ? 'red' : cultureRisk.color === 'orange' ? 'orange' : cultureRisk.color === 'yellow' ? 'yellow' : 'green'}-100 text-${cultureRisk.color === 'red' ? 'red' : cultureRisk.color === 'orange' ? 'orange' : cultureRisk.color === 'yellow' ? 'yellow' : 'green'}-800`}>
                    {cultureRisk.level}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{scores.culture.toFixed(1)}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{scores.culture < 6 ? 'Invest in data literacy programs and change management' : 'Continue fostering a data-driven culture'}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="col-span-2 flex justify-end mt-4">
        {/* Compare button moved to bottom */}
      </div>
    </div>
  );
  
  // Render Implementation Complexity Assessment with colors
  const renderImplementationComplexity = () => {
    const getComplexityColor = (value: number, isReversed: boolean = false): string => {
      if (isReversed) {
        return value >= 7 ? '#107c10' : value >= 4 ? '#ffb900' : '#d13438';
      }
      return value >= 7 ? '#d13438' : value >= 4 ? '#ffb900' : '#107c10';
    };

    return (
      <div className="bg-white rounded-lg shadow-sm p-5">
        <h2 className="text-lg font-semibold mb-4">Implementation Complexity Assessment</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="mb-2 text-sm font-medium text-gray-600">Data Complexity:</div>
                <div className="font-semibold text-gray-900 px-3 py-1 rounded-md inline-block" 
                  style={{ backgroundColor: getComplexityColor(assessmentData.dataVolume) + '30' }}>
                  {assessmentData.dataVolume >= 7 ? 'High' : assessmentData.dataVolume >= 4 ? 'Medium' : 'Low'}
                </div>
              </div>
              
              <div>
                <div className="mb-2 text-sm font-medium text-gray-600">Technical Fit:</div>
                <div className="font-semibold text-gray-900 px-3 py-1 rounded-md inline-block" 
                  style={{ backgroundColor: getComplexityColor(assessmentData.microsoftInvestments.length, true) + '30' }}>
                  {assessmentData.microsoftInvestments.length >= 3 ? 'Strong' : assessmentData.microsoftInvestments.length >= 1 ? 'Moderate' : 'Limited'}
                </div>
              </div>
              
              <div>
                <div className="mb-2 text-sm font-medium text-gray-600">Time Constraint:</div>
                <div className="font-semibold text-gray-900 px-3 py-1 rounded-md inline-block" 
                  style={{ backgroundColor: getComplexityColor(assessmentData.timeToImplementation, true) + '30' }}>
                  {assessmentData.timeToImplementation >= 7 ? 'Flexible' : assessmentData.timeToImplementation >= 4 ? 'Moderate' : 'Urgent'}
                </div>
              </div>
              
              <div>
                <div className="mb-2 text-sm font-medium text-gray-600">Budget:</div>
                <div className="font-semibold text-gray-900 px-3 py-1 rounded-md inline-block" 
                  style={{ backgroundColor: getComplexityColor(assessmentData.budgetConstraint, true) + '30' }}>
                  {assessmentData.budgetConstraint >= 7 ? 'Adequate' : assessmentData.budgetConstraint >= 4 ? 'Moderate' : 'Limited'}
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">Implementation Timeframe Estimate:</p>
              <p className="text-lg font-bold text-gray-800" style={{ color: assessmentData.microsoftInvestments.length > 2 ? '#107c10' : '#d13438' }}>
                {assessmentData.microsoftInvestments.length > 2 && assessmentData.powerBiUsage > 7 
                  ? '3-6 months' 
                  : assessmentData.microsoftInvestments.length > 0 
                    ? '6-9 months' 
                    : '9-12 months'}
              </p>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
            <h3 className="font-semibold mb-3">Migration Complexity Factors</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Data Volume</span>
                  <span className="text-sm font-medium text-gray-500">{assessmentData.dataVolume.toFixed(1)}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full" 
                    style={{ 
                      width: `${assessmentData.dataVolume * 10}%`,
                      backgroundColor: getComplexityColor(assessmentData.dataVolume)
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Real-time Requirements</span>
                  <span className="text-sm font-medium text-gray-500">{assessmentData.realTimeNeeds.toFixed(1)}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full" 
                    style={{ 
                      width: `${assessmentData.realTimeNeeds * 10}%`,
                      backgroundColor: getComplexityColor(assessmentData.realTimeNeeds)
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Compliance Requirements</span>
                  <span className="text-sm font-medium text-gray-500">{assessmentData.complianceRequirements.length}/8</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full" 
                    style={{ 
                      width: `${(assessmentData.complianceRequirements.length / 8) * 100}%`,
                      backgroundColor: getComplexityColor(assessmentData.complianceRequirements.length * 1.25)
                    }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Microsoft Ecosystem Integration</span>
                  <span className="text-sm font-medium text-gray-500">{assessmentData.microsoftInvestments.length}/4</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full" 
                    style={{ 
                      width: `${(assessmentData.microsoftInvestments.length / 4) * 100}%`,
                      backgroundColor: getComplexityColor(10 - (assessmentData.microsoftInvestments.length * 2.5))
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout 
      title="Microsoft Fabric Assessment" 
      assessmentData={assessmentData}
      fabricScore={fabricScore}
      noTabs={true}
    >
      <div className="space-y-8 pb-20">
        {renderCharts()}
        {renderImplementationComplexity()}
        <div className="mt-8 flex justify-center">
          <button
            onClick={onContinue}
            className="px-6 py-3 bg-gray-600 text-white rounded-md flex items-center hover:bg-gray-700 transition-colors shadow-sm font-medium"
          >
            Compare with Alternatives →
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ModernDashboard;
