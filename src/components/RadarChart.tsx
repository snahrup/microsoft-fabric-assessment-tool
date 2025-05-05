import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { AssessmentData } from '../App';
import { calculateScores } from '../utils/calculateScores';

interface RadarChartProps {
  assessmentData: AssessmentData;
  width?: number;
  height?: number;
  className?: string;
  colorScheme?: 'default' | 'blue' | 'green';
}

const RadarChart: React.FC<RadarChartProps> = ({ 
  assessmentData, 
  width = 400, 
  height = 400, 
  className = '', 
  colorScheme = 'default' 
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  
  const colorSchemes = {
    default: {
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      pointBackgroundColor: 'rgba(75, 192, 192, 1)',
      pointBorderColor: '#fff'
    },
    blue: {
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      pointBackgroundColor: 'rgba(54, 162, 235, 1)',
      pointBorderColor: '#fff'
    },
    green: {
      backgroundColor: 'rgba(75, 192, 75, 0.2)',
      borderColor: 'rgba(75, 192, 75, 1)',
      pointBackgroundColor: 'rgba(75, 192, 75, 1)',
      pointBorderColor: '#fff'
    }
  };
  
  useEffect(() => {
    if (chartRef.current) {
      // If a chart instance exists, destroy it before creating a new one
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      
      // Calculate scores from assessment data
      const scores = calculateScores(assessmentData);
      
      // Get colors from selected scheme
      const colors = colorSchemes[colorScheme];
      
      // Create the chart
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'radar',
          data: {
            labels: [
              'Data Integration',
              'Analytics Capabilities',
              'Governance Framework',
              'Organizational Culture',
              'Microsoft Ecosystem Fit',
              'Implementation Readiness'
            ],
            datasets: [{
              label: 'Fabric Readiness Assessment',
              data: [
                parseFloat(Number(scores.data).toFixed(1)),
                parseFloat(Number(scores.analytics).toFixed(1)),
                parseFloat(Number(scores.governance).toFixed(1)),
                parseFloat(Number(scores.culture).toFixed(1)),
                parseFloat(Number(calculateMicrosoftEcosystemScore(assessmentData)).toFixed(1)),
                parseFloat(Number(calculateImplementationReadinessScore(assessmentData)).toFixed(1))
              ],
              backgroundColor: colors.backgroundColor,
              borderColor: colors.borderColor,
              pointBackgroundColor: colors.pointBackgroundColor,
              pointBorderColor: colors.pointBorderColor,
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: colors.borderColor,
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: {
                top: 20,
                right: 50,
                bottom: 20,
                left: 50
              }
            },
            scales: {
              r: {
                angleLines: {
                  display: true,
                  color: 'rgba(0, 0, 0, 0.1)'
                },
                suggestedMin: 0,
                suggestedMax: 10,
                ticks: {
                  stepSize: 2,
                  backdropColor: 'rgba(255, 255, 255, 0)',
                  color: '#666'
                },
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)'
                },
                pointLabels: {
                  font: {
                    size: 12,
                    weight: 'bold' as const
                  },
                  color: '#666',
                  padding: 15, // Add more padding specifically for the point labels
                  centerPointLabels: false, // Don't center labels which can cause overlap
                  // Custom formatter to add line breaks for long labels
                  callback: (label: string) => {
                    // Insert line breaks for longer labels
                    if (label === 'Implementation Readiness') {
                      return ['Implementation', 'Readiness'];
                    }
                    if (label === 'Microsoft Ecosystem Fit') {
                      return ['Microsoft', 'Ecosystem Fit'];
                    }
                    if (label === 'Organizational Culture') {
                      return ['Organizational', 'Culture'];
                    }
                    if (label === 'Governance Framework') {
                      return ['Governance', 'Framework'];
                    }
                    if (label === 'Analytics Capabilities') {
                      return ['Analytics', 'Capabilities'];
                    }
                    if (label === 'Data Integration') {
                      return ['Data', 'Integration'];
                    }
                    return label;
                  }
                }
              }
            },
            plugins: {
              legend: {
                position: 'top' as const,
                labels: {
                  font: {
                    size: 14
                  }
                }
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `Score: ${Number(context.parsed.r).toFixed(1)}/10`;
                  },
                  title: function(context) {
                    return context[0].label;
                  }
                }
              }
            }
          }
        });
      }
    }
    
    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [assessmentData, colorScheme]);
  
  // Calculate Microsoft Ecosystem Fit score (0-10)
  const calculateMicrosoftEcosystemScore = (data: AssessmentData): number => {
    let score = 0;
    
    // Power BI usage directly contributes to ecosystem fit
    score += data.powerBiUsage / 2; // Up to 5 points
    
    // Microsoft investments
    if (data.microsoftInvestments.includes('Azure')) score += 2;
    if (data.microsoftInvestments.includes('Power BI')) score += 1;
    if (data.microsoftInvestments.includes('Microsoft 365')) score += 1;
    if (data.microsoftInvestments.includes('Dynamics 365')) score += 1;
    
    return Math.min(10, Math.max(0, score));
  };
  
  // Calculate Implementation Readiness score (0-10)
  const calculateImplementationReadinessScore = (data: AssessmentData): number => {
    let score = 5; // Start at middle point
    
    // Budget impacts readiness
    score += (data.budgetConstraint - 5) / 2; // -2.5 to +2.5 points
    
    // Time to implementation
    score += (data.timeToImplementation - 5) / 2; // -2.5 to +2.5 points
    
    // Complexity factors
    if (data.dataVolume > 8) score -= 1;
    if (data.realTimeNeeds > 8) score -= 1;
    if (data.complianceRequirements.length > 3) score -= 1;
    
    // Microsoft ecosystem boosts implementation readiness
    if (data.microsoftInvestments.length >= 3) score += 1;
    if (data.powerBiUsage >= 7) score += 1;
    
    return Math.min(10, Math.max(0, score));
  };
  
  return (
    <div className={`radar-chart-container ${className}`} style={{ width, height }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default RadarChart;
