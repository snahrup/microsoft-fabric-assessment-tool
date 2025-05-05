import React, { useEffect, useRef, useState } from 'react';
import { AssessmentData } from '../App';
import Chart from 'chart.js/auto';
import RadarChart from './RadarChart';

interface ResultsDashboardProps {
  assessmentData: AssessmentData;
  fabricScore: number;
  onContinue: () => void;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ assessmentData, fabricScore, onContinue }) => {
  const scoreGaugeRef = useRef<HTMLCanvasElement>(null);
  const [chartsReady, setChartsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<'standard' | 'detailed'>('standard');
  
  useEffect(() => {
    // Charts instances reference for cleanup
    let scoreChart: Chart<'doughnut'> | null = null;

    try {

      // Create gauge chart for overall score
      if (scoreGaugeRef.current) {
        const scoreCtx = scoreGaugeRef.current.getContext('2d');
        if (scoreCtx) {
          scoreChart = new Chart(scoreCtx, {
            type: 'doughnut',
            data: {
              datasets: [{
                data: [fabricScore, 100 - fabricScore],
                backgroundColor: [
                  fabricScore >= 70 ? '#107c10' : (fabricScore >= 40 ? '#ffb900' : '#d13438'),
                  '#f3f3f3'
                ],
                borderWidth: 0
              }]
            },
            options: {
              cutout: '80%',
              circumference: 180,
              rotation: 270,
              plugins: {
                tooltip: {
                  enabled: false
                },
                legend: {
                  display: false
                }
              }
            }
          });
        }
      }

      setChartsReady(true);
    } catch (err) {
      console.error('Error creating charts:', err);
      setError('An error occurred while creating the visualization. Please try again.');
    }

    // Cleanup function to prevent memory leaks
    return () => {
      if (scoreChart) scoreChart.destroy();
    };
  }, [assessmentData, fabricScore]);

  // Get recommendation text based on score
  const getRecommendation = () => {
    if (fabricScore >= 80) {
      return "Microsoft Fabric is an excellent fit for your organization. Your strong Microsoft ecosystem presence, data needs, and requirements align very well with Fabric's capabilities.";
    } else if (fabricScore >= 60) {
      return "Microsoft Fabric is a good fit for your organization. With some adjustments or additional considerations, Fabric could provide significant value to your data strategy.";
    } else if (fabricScore >= 40) {
      return "Microsoft Fabric might be suitable for parts of your data strategy, but you should carefully evaluate specific use cases. Consider a hybrid approach with other technologies.";
    } else {
      return "Microsoft Fabric may not be the optimal solution for your current needs. Other data platforms might better align with your requirements and existing infrastructure.";
    }
  };

  return (
    <div className="container">
      <div className="card shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-blue-800">Your Microsoft Fabric Suitability Assessment</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Score gauge */}
          <div className="score-gauge text-center bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Fabric Fit Score</h3>
            <div className="relative h-48">
              <canvas ref={scoreGaugeRef} height="200"></canvas>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl font-bold">{Math.round(fabricScore)}</span>
              </div>
            </div>
            <div className="mt-4">
              <div className={`score-label text-xl font-semibold py-2 px-4 rounded-full inline-block ${
                fabricScore >= 80 ? 'bg-green-100 text-green-800' : 
                fabricScore >= 60 ? 'bg-blue-100 text-blue-800' : 
                fabricScore >= 40 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                {fabricScore >= 80 ? 'Excellent fit' : 
                  fabricScore >= 60 ? 'Good fit' : 
                  fabricScore >= 40 ? 'Partial fit' : 'Not recommended'}
              </div>
            </div>
          </div>
          
          {/* Recommendation */}
          <div className="recommendation bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Recommendation</h3>
            <div className="p-5 bg-blue-50 rounded-lg border border-blue-100 shadow-sm">
              <p className="text-gray-800 font-medium">{getRecommendation()}</p>
            </div>
            
            <h4 className="text-lg font-semibold mt-6 mb-2 text-gray-800">Key Factors</h4>
            <ul className="list-disc pl-5 space-y-2">
              {assessmentData.microsoftInvestments.length > 0 && (
                <li className="text-gray-700"><span className="font-medium">Existing Microsoft investments:</span> {assessmentData.microsoftInvestments.join(', ')}</li>
              )}
              {assessmentData.powerBiUsage > 7 && (
                <li className="text-gray-700">Strong Power BI utilization is a significant advantage for Fabric adoption</li>
              )}
              {assessmentData.dataVolume > 7 && (
                <li className="text-gray-700">Your high data volume aligns well with Fabric's enterprise-scale capabilities</li>
              )}
              {assessmentData.realTimeNeeds > 7 && (
                <li className="text-gray-700">Your real-time analytics needs match Fabric's streaming analytics capabilities</li>
              )}
              {assessmentData.budgetConstraint < 5 && (
                <li className="text-gray-700">Microsoft Fabric could provide cost efficiencies for your budget constraints</li>
              )}
            </ul>
          </div>
        </div>
        
        <div className="radar-chart-container mt-8 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Capability Alignment</h3>
            <div className="view-toggle inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${selectedView === 'standard' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setSelectedView('standard')}
              >
                Standard View
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${selectedView === 'detailed' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setSelectedView('detailed')}
              >
                Detailed View
              </button>
            </div>
          </div>
          
          {error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow-sm">{error}</div>
          ) : (
            <div className="h-96 w-full">
              {selectedView === 'standard' ? (
                <div className="grid place-items-center h-full w-full">
                  <RadarChart 
                    assessmentData={assessmentData} 
                    width={400} 
                    height={400} 
                    colorScheme="blue" 
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 rounded-lg bg-gray-50">
                    <h4 className="text-lg font-semibold mb-3 text-blue-800">Fabric Readiness</h4>
                    <div className="grid place-items-center h-80"> {/* Increased height */}
                      <RadarChart 
                        assessmentData={assessmentData} 
                        width={360} 
                        height={360} 
                        colorScheme="blue" 
                      />
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-50">
                    <h4 className="text-lg font-semibold mb-3 text-blue-800">Implementation Complexity</h4>
                    <div className="grid place-items-center h-64">
                      <div className="p-4 bg-white rounded-lg shadow-sm">
                        <div className="mb-4 grid grid-cols-2 gap-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Data Complexity:</span>
                            <span className="text-sm font-bold text-blue-600">
                              {assessmentData.dataVolume > 8 ? 'High' : 
                               assessmentData.dataVolume > 5 ? 'Medium' : 'Low'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Technical Fit:</span>
                            <span className="text-sm font-bold text-blue-600">
                              {assessmentData.microsoftInvestments.length > 2 ? 'Excellent' : 
                               assessmentData.microsoftInvestments.length > 0 ? 'Good' : 'Limited'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Time Constraint:</span>
                            <span className="text-sm font-bold text-blue-600">
                              {assessmentData.timeToImplementation < 4 ? 'Urgent' : 
                               assessmentData.timeToImplementation < 7 ? 'Moderate' : 'Flexible'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Budget:</span>
                            <span className="text-sm font-bold text-blue-600">
                              {assessmentData.budgetConstraint < 4 ? 'Limited' : 
                               assessmentData.budgetConstraint < 7 ? 'Moderate' : 'Adequate'}
                            </span>
                          </div>
                        </div>
                        <div className="text-center pt-4 border-t border-gray-200">
                          <p className="text-sm text-gray-600">Implementation Timeframe Estimate:</p>
                          <p className="text-lg font-bold text-blue-800">
                            {assessmentData.microsoftInvestments.length > 2 && assessmentData.powerBiUsage > 7 
                              ? '3-6 months' 
                              : assessmentData.microsoftInvestments.length > 0 
                                ? '6-9 months' 
                                : '9-12 months'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex justify-end mt-8">
          <button 
            onClick={onContinue} 
            className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium text-lg shadow-md hover:bg-blue-700 transition-colors"
          >
            Compare with Alternatives &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;