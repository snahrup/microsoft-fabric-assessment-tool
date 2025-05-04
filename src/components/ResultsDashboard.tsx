import React, { useEffect, useRef, useState } from 'react';
import { AssessmentData } from '../App';
import Chart from 'chart.js/auto';

interface ResultsDashboardProps {
  assessmentData: AssessmentData;
  fabricScore: number;
  onContinue: () => void;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ assessmentData, fabricScore, onContinue }) => {
  const radarChartRef = useRef<HTMLCanvasElement>(null);
  const scoreGaugeRef = useRef<HTMLCanvasElement>(null);
  const [chartsReady, setChartsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Charts instances reference for cleanup
    let radarChart: Chart<'radar'> | null = null;
    let scoreChart: Chart<'doughnut'> | null = null;

    try {
      // Create radar chart for capability comparison
      if (radarChartRef.current) {
        const radarCtx = radarChartRef.current.getContext('2d');
        if (radarCtx) {
          radarChart = new Chart(radarCtx, {
            type: 'radar',
            data: {
              labels: [
                'Microsoft Ecosystem Fit',
                'Data Volume Capability',
                'Real-Time Processing',
                'Cost Efficiency',
                'Security & Compliance',
                'Integration Ease'
              ],
              datasets: [
                {
                  label: 'Your Organization',
                  data: [
                    // Microsoft Ecosystem score based on investments and Power BI usage
                    Math.min(10, (assessmentData.microsoftInvestments.length * 1.5) + (assessmentData.powerBiUsage / 2)),
                    // Data volume score
                    assessmentData.dataVolume,
                    // Real-time processing score
                    assessmentData.realTimeNeeds,
                    // Cost efficiency (inverse of budget constraint)
                    Math.max(1, 11 - assessmentData.budgetConstraint),
                    // Security & compliance based on requirements
                    Math.min(10, 5 + assessmentData.complianceRequirements.length + (assessmentData.dataSovereigntyNeeds / 2)),
                    // Integration ease (based on Microsoft products)
                    Math.min(10, assessmentData.microsoftInvestments.length + 2)
                  ],
                  backgroundColor: 'rgba(0, 120, 212, 0.2)',
                  borderColor: 'rgba(0, 120, 212, 1)',
                  pointBackgroundColor: 'rgba(0, 120, 212, 1)',
                  pointBorderColor: '#fff',
                  pointHoverBackgroundColor: '#fff',
                  pointHoverBorderColor: 'rgba(0, 120, 212, 1)'
                },
                {
                  label: 'Microsoft Fabric Capability',
                  data: [10, 9, 9, 7, 9, 10],
                  backgroundColor: 'rgba(80, 230, 255, 0.2)',
                  borderColor: 'rgba(80, 230, 255, 1)',
                  pointBackgroundColor: 'rgba(80, 230, 255, 1)',
                  pointBorderColor: '#fff',
                  pointHoverBackgroundColor: '#fff',
                  pointHoverBorderColor: 'rgba(80, 230, 255, 1)'
                }
              ]
            },
            options: {
              scales: {
                r: {
                  min: 0,
                  max: 10,
                  ticks: {
                    stepSize: 2
                  }
                }
              }
            }
          });
        }
      }

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
      setError('Could not render assessment charts. Please try again.');
    }

    // Cleanup function to destroy charts on unmount
    return () => {
      if (radarChart) radarChart.destroy();
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
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Capability Alignment</h3>
          {error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow-sm">{error}</div>
          ) : (
            <div className="h-80 w-full">
              <canvas ref={radarChartRef}></canvas>
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