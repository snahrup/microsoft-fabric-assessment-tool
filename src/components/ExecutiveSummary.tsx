import React, { useRef } from 'react';
import { AssessmentData } from '../App';
import { calculateScores } from '../utils/calculateScores';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface ExecutiveSummaryProps {
  formData: AssessmentData;
}

const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ formData }) => {
  const summaryRef = useRef<HTMLDivElement>(null);
  const scores = calculateScores(formData);
  
  const totalScore = scores.data + scores.analytics + scores.governance + scores.culture;
  const maxScore = 40; // Assuming 10 points max per category
  const overallPercentage = Math.round((totalScore / maxScore) * 100);
  
  // Determine readiness level
  const getReadinessLevel = (percentage: number) => {
    if (percentage >= 80) return { level: 'High', color: 'text-green-600' };
    if (percentage >= 60) return { level: 'Medium', color: 'text-yellow-600' };
    return { level: 'Low', color: 'text-red-600' };
  };
  
  const readiness = getReadinessLevel(overallPercentage);
  
  // Determine key strengths and opportunities
  const getTopStrength = () => {
    const categories = [
      { name: 'Data Integration', score: scores.data },
      { name: 'Analytics Capabilities', score: scores.analytics },
      { name: 'Governance Framework', score: scores.governance },
      { name: 'Organizational Culture', score: scores.culture }
    ];
    
    return categories.sort((a, b) => b.score - a.score)[0];
  };
  
  const getTopOpportunity = () => {
    const categories = [
      { name: 'Data Integration', score: scores.data },
      { name: 'Analytics Capabilities', score: scores.analytics },
      { name: 'Governance Framework', score: scores.governance },
      { name: 'Organizational Culture', score: scores.culture }
    ];
    
    return categories.sort((a, b) => a.score - b.score)[0];
  };
  
  const topStrength = getTopStrength();
  const topOpportunity = getTopOpportunity();
  
  // Calculate expected ROI and timeline
  const getROIEstimate = () => {
    if (overallPercentage >= 75) return 'High ROI potential within 6-12 months';
    if (overallPercentage >= 50) return 'Moderate ROI potential within 12-18 months';
    return 'Long-term ROI potential, 18+ months with proper implementation';
  };
  
  // Generate recommendations
  const getKeyRecommendations = () => {
    const recommendations = [];
    
    if (scores.data < 7) {
      recommendations.push('Enhance data integration capabilities through Microsoft Fabric\'s Data Factory and lakehouse architecture');
    }
    
    if (scores.analytics < 7) {
      recommendations.push('Implement Power BI reporting and Synapse Analytics to strengthen analytical capabilities');
    }
    
    if (scores.governance < 7) {
      recommendations.push('Establish robust data governance utilizing Microsoft Purview integration with Fabric');
    }
    
    if (scores.culture < 7) {
      recommendations.push('Develop a data culture transformation program with skill development tracks');
    }
    
    return recommendations.length > 0 ? recommendations : ['Focus on optimizing Microsoft Fabric implementation to maintain current excellence'];
  };
  
  const exportToPDF = async () => {
    if (!summaryRef.current) return;
    
    const canvas = await html2canvas(summaryRef.current, {
      scale: 2,
      logging: false,
      useCORS: true,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save('Microsoft_Fabric_Executive_Summary.pdf');
  };
  
  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-blue-900">Executive Summary</h2>
        <button
          onClick={exportToPDF}
          className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 shadow-sm"
        >
          Export to PDF
        </button>
      </div>
      
      <div ref={summaryRef} className="space-y-8 p-4">
        <div className="border-b border-gray-300 pb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Microsoft Fabric Readiness Assessment</h3>
          <p className="text-gray-600 mb-6">
            This executive summary provides an overview of your organization's readiness for Microsoft Fabric adoption,
            key findings, and strategic recommendations to maximize your data and analytics transformation.
          </p>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Overall Readiness:</span>
              <span className={`text-xl font-bold ${readiness.color}`}>{readiness.level} ({overallPercentage}%)</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-xl font-semibold text-blue-800 mb-3">Key Strengths</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Top Performing Area:</span>
                <span className="font-medium text-green-600">{topStrength.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Score:</span>
                <span className="font-medium">{topStrength.score}/10</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Leverage your strength in {topStrength.name.toLowerCase()} to accelerate Microsoft Fabric adoption.
              </p>
            </div>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg">
            <h4 className="text-xl font-semibold text-amber-800 mb-3">Key Opportunities</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Focus Area:</span>
                <span className="font-medium text-amber-600">{topOpportunity.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Current Score:</span>
                <span className="font-medium">{parseFloat(topOpportunity.score.toFixed(1))}/10</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Prioritize improvements in {topOpportunity.name.toLowerCase()} to unlock full Microsoft Fabric potential.
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-300 pt-6">
          <h4 className="text-xl font-semibold text-gray-800 mb-4">Strategic Recommendations</h4>
          <ul className="space-y-3 list-disc pl-5">
            {getKeyRecommendations().map((recommendation, index) => (
              <li key={index} className="text-gray-700">{recommendation}</li>
            ))}
          </ul>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-300 pt-6">
          <div>
            <h4 className="text-xl font-semibold text-gray-800 mb-3">Expected Business Impact</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">ROI Timeline:</span>
                <span className="font-medium">{getROIEstimate()}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Microsoft Fabric implementation is expected to drive efficiency gains in data processing,
                analysis time reduction, and improved decision-making capabilities.
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="text-xl font-semibold text-gray-800 mb-3">Next Steps</h4>
            <ol className="space-y-1 list-decimal pl-5">
              <li className="text-gray-700">Review detailed assessment findings</li>
              <li className="text-gray-700">Develop Microsoft Fabric implementation roadmap</li>
              <li className="text-gray-700">Identify pilot project opportunities</li>
              <li className="text-gray-700">Establish metrics for success measurement</li>
            </ol>
          </div>
        </div>
        
        <div className="border-t border-gray-300 pt-6 text-center text-sm text-gray-500">
          <p>Assessment Date: {new Date().toLocaleDateString()}</p>
          <p>This assessment provides directional guidance based on current state analysis.</p>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveSummary;
