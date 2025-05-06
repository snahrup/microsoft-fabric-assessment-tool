import React, { useRef, useState, useEffect } from 'react';
import { AssessmentData } from '../App';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { calculateScores } from '../utils/calculateScores';
import RadarChart from './RadarChart';

interface ReportGeneratorProps {
  assessmentData: AssessmentData;
  fabricScore: number;
  onRestart: () => void;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ assessmentData, fabricScore, onRestart }) => {
  const reportRef = useRef<HTMLDivElement>(null);

  // Generate PDF report
  const generatePDF = async () => {
    if (!reportRef.current) return;
    
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate aspect ratio to fit the report in the PDF
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      
      pdf.addImage(imgData, 'PNG', imgX, 10, imgWidth * ratio, imgHeight * ratio);
      pdf.save('Microsoft_Fabric_Assessment_Report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  // Get industry-specific recommendation text
  const getIndustryInsight = () => {
    const industry = assessmentData.industry || 'general';
    
    // Industry-specific insights
    const insights = {
      'financial-services': {
        title: 'Financial Services Insight',
        content: 'Microsoft Fabric provides significant value for financial institutions through enhanced data governance, risk analytics, and customer intelligence capabilities. With built-in compliance features, it can help address regulatory requirements while enabling faster time-to-insight.',
        keyConsideration: fabricScore >= 70 ? 'Prioritize data governance and security implementation phases' : 'Consider a staged approach, starting with regulatory reporting use cases'
      },
      'healthcare': {
        title: 'Healthcare Insight',
        content: 'Microsoft Fabric offers healthcare organizations a unified platform for clinical, operational, and financial analytics. Its ability to integrate structured and unstructured data can deliver a comprehensive view of patient care while maintaining PHI security and HIPAA compliance.',
        keyConsideration: fabricScore >= 70 ? 'Focus on interoperability with clinical systems and patient data security' : 'Begin with operational analytics before expanding to clinical use cases'
      },
      'manufacturing': {
        title: 'Manufacturing Insight',
        content: 'For manufacturing organizations, Microsoft Fabric excels at integrating IoT and operational data with business analytics. This enables predictive maintenance, supply chain optimization, and quality improvement through a single unified data platform.',
        keyConsideration: fabricScore >= 70 ? 'Leverage real-time analytics for shop floor integration' : 'Start with supply chain analytics before expanding to IoT data sources'
      },
      'retail': {
        title: 'Retail Insight',
        content: 'Retail organizations can leverage Microsoft Fabric to create a unified view of customers, inventory, and operations. This enables improved demand forecasting, personalized marketing, and optimized inventory management in an increasingly competitive marketplace.',
        keyConsideration: fabricScore >= 70 ? 'Integrate both online and in-store data sources for a complete customer view' : 'Focus on inventory optimization as an initial high-ROI use case'
      },
      'public-sector': {
        title: 'Public Sector Insight',
        content: 'Microsoft Fabric helps government agencies and educational institutions break down data silos while maintaining strict security and sovereignty requirements. FedRAMP compliance capabilities ensure sensitive data remains protected while enabling cross-agency analytics.',
        keyConsideration: fabricScore >= 70 ? 'Prioritize data classification and security controls during implementation' : 'Consider starting with a bounded, high-value pilot project'
      },
      'energy': {
        title: 'Energy & Utilities Insight',
        content: 'For energy companies, Microsoft Fabric provides the scale and performance needed for large-scale sensor data analytics, grid optimization, and regulatory reporting. Its integration with Azure services supports comprehensive IoT analytics and operational dashboards.',
        keyConsideration: fabricScore >= 70 ? 'Implement real-time analytics for operational monitoring' : 'Begin with compliance reporting scenarios for quick wins'
      },
      'general': {
        title: 'Business Value Insight',
        content: 'Microsoft Fabric offers organizations a comprehensive data platform that eliminates the need for siloed tools and reduces total cost of ownership. By unifying data integration, storage, and analytics, it enables faster insights and improved decision-making across the organization.',
        keyConsideration: fabricScore >= 70 ? 'Plan for a phased approach to transition from existing systems' : 'Start with a focused pilot project to demonstrate value'
      }
    };
    
    // Return insight for the selected industry, defaulting to general if not found
    return insights[industry as keyof typeof insights] || insights.general;
  };
  
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

  // Get next steps based on score
  const getNextSteps = () => {
    if (fabricScore >= 70) {
      return [
        "Schedule a Microsoft Fabric demonstration with a Microsoft representative",
        "Identify a small pilot project to test Fabric capabilities",
        "Evaluate current data assets for migration to Microsoft Fabric",
        "Review Microsoft Fabric pricing and licensing options",
        "Develop a phased implementation plan"
      ];
    } else if (fabricScore >= 50) {
      return [
        "Conduct a deeper technical evaluation of Microsoft Fabric against specific use cases",
        "Compare Microsoft Fabric with alternative solutions for your priority scenarios",
        "Consider a hybrid approach using Fabric alongside existing solutions",
        "Identify skill gaps and training needs for potential Fabric adoption",
        "Evaluate total cost of ownership for a partial Fabric implementation"
      ];
    } else {
      return [
        "Explore alternative data platforms that better match your requirements",
        "Consider Microsoft Fabric only for specific use cases where it excels",
        "Maintain awareness of Microsoft Fabric roadmap for future re-evaluation",
        "Evaluate how to better leverage your existing data platform investments",
        "Consider consulting with a data platform specialist for targeted recommendations"
      ];
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Microsoft Fabric Assessment Report</h2>
        <p className="mb-6">
          Below is your detailed assessment report. You can download this as a PDF to share with your team.
        </p>
        
        <div className="flex justify-end mb-6">
          <button onClick={generatePDF} className="bg-accent text-white py-2 px-4 rounded flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF Report
          </button>
        </div>
        
        <div ref={reportRef} className="report-content bg-white p-8 rounded-lg">
          <div className="report-header mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Microsoft Fabric Suitability Assessment</h1>
            <p className="text-gray-500">
              Generated on {new Date().toLocaleDateString()} | Confidential
            </p>
          </div>
          
          <div className="executive-summary mb-8 pb-6 border-b">
            <h2 className="text-2xl font-bold mb-4">Executive Summary</h2>
            <div className="flex items-center mb-4">
              <div className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold text-white"
                   style={{ 
                     backgroundColor: fabricScore >= 70 ? '#107c10' : (fabricScore >= 40 ? '#ffb900' : '#d13438')
                   }}>
                {Math.round(fabricScore)}
              </div>
              <div className="ml-6">
                <h3 className="text-xl font-semibold">
                  {fabricScore >= 80 ? 'Excellent Fit' : 
                   fabricScore >= 60 ? 'Good Fit' : 
                   fabricScore >= 40 ? 'Partial Fit' : 'Not Recommended'}
                </h3>
                <p className="text-gray-700 mt-2">{getRecommendation()}</p>
              </div>
            </div>
          </div>
          
          <div className="organization-profile mb-8 pb-6 border-b">
            <h2 className="text-2xl font-bold mb-4">Organization Profile</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Current Infrastructure</h3>
                <ul className="list-disc pl-5">
                  {assessmentData.currentInfrastructure.length > 0 
                    ? assessmentData.currentInfrastructure.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))
                    : <li>No current infrastructure specified</li>
                  }
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Data Characteristics</h3>
                <ul className="list-disc pl-5">
                  <li>Data Warehouse: {assessmentData.dataWarehouseSolution || 'Not specified'}</li>
                  <li>BI Tool: {assessmentData.businessIntelligenceTool || 'Not specified'}</li>
                  <li>Data Types: {assessmentData.dataTypes.length > 0 
                    ? assessmentData.dataTypes.join(', ')
                    : 'None specified'
                  }</li>
                  <li>Data Volume: {assessmentData.dataVolume.toFixed(1)}/10</li>
                </ul>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <h3 className="font-semibold mb-2">Microsoft Ecosystem</h3>
                <ul className="list-disc pl-5">
                  {assessmentData.microsoftInvestments.length > 0 
                    ? assessmentData.microsoftInvestments.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))
                    : <li>No Microsoft products specified</li>
                  }
                  <li>Power BI Usage: {assessmentData.powerBiUsage.toFixed(1)}/10</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Requirements & Compliance</h3>
                <ul className="list-disc pl-5">
                  <li>Budget Constraint: {assessmentData.budgetConstraint.toFixed(1)}/10</li>
                  <li>Data Sovereignty: {assessmentData.dataSovereigntyNeeds.toFixed(1)}/10</li>
                  <li>Compliance: {assessmentData.complianceRequirements.length > 0 
                    ? assessmentData.complianceRequirements.join(', ')
                    : 'None specified'
                  }</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Fabric Readiness Visualization - Added Section */}
          <div className="readiness-visualization mb-8 pb-6 border-b">
            <h2 className="text-2xl font-bold mb-4">Fabric Readiness Assessment</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="visualization-card bg-white p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-center mb-3">Readiness Dimensions</h3>
                <div className="flex justify-center h-80">
                  {/* Radar chart visualization */}
                  <RadarChart 
                    assessmentData={assessmentData} 
                    width={360} 
                    height={360} 
                    colorScheme="blue" 
                  />
                </div>
              </div>
              
              <div className="implementation-complexity p-4 rounded-lg">
                <h3 className="font-semibold text-lg text-center mb-3">Implementation Complexity</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="mb-4 grid grid-cols-2 gap-3">
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
          
          <div className="key-findings mb-8 pb-6 border-b">
            <h2 className="text-2xl font-bold mb-4">Key Assessment Findings</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="finding-card bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-primary mb-2">Microsoft Ecosystem Alignment</h3>
                <p>
                  {assessmentData.microsoftInvestments.length > 2 
                    ? 'Your organization has significant Microsoft investments, which enhances the value proposition of Microsoft Fabric.' 
                    : 'Your organization has limited Microsoft investments, which may reduce the immediate benefits of Microsoft Fabric.'}
                </p>
              </div>
              
              <div className="finding-card bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-primary mb-2">Data Volume Considerations</h3>
                <p>
                  {assessmentData.dataVolume > 7 
                    ? 'Your high data volume requirements align well with Microsoft Fabric\'s scalable architecture.' 
                    : assessmentData.dataVolume > 4 
                      ? 'Your moderate data volume needs can be effectively addressed by Microsoft Fabric.'
                      : 'Your lower data volume needs might be served by simpler solutions than Microsoft Fabric.'}
                </p>
              </div>
              
              <div className="finding-card bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-primary mb-2">Real-time Analytics Needs</h3>
                <p>
                  {assessmentData.realTimeNeeds > 7 
                    ? 'Your significant real-time analytics requirements match well with Microsoft Fabric\'s streaming capabilities.' 
                    : 'Your moderate to low real-time analytics needs can be met by Microsoft Fabric, though this may not be a decisive factor.'}
                </p>
              </div>
              
              <div className="finding-card bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-primary mb-2">Compliance & Governance</h3>
                <p>
                  {assessmentData.complianceRequirements.length > 3 
                    ? 'Your extensive compliance requirements can be addressed by Microsoft Fabric\'s governance capabilities.' 
                    : 'Your compliance requirements appear manageable within Microsoft Fabric\'s framework.'}
                  {assessmentData.dataSovereigntyNeeds > 8 
                    ? ' High data sovereignty needs may require careful consideration of Microsoft\'s regional datacenter availability.'
                    : ''}
                </p>
              </div>
            </div>
          </div>
          
          <div className="executive-summary mb-8 pb-6 border-b bg-blue-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-blue-900">Executive Summary</h2>
            
            {/* Executive Summary Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                {/* Overall Readiness */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Overall Readiness</h3>
                  {(() => {
                    const scores = calculateScores(assessmentData);
                    const totalScore = scores.data + scores.analytics + scores.governance + scores.culture;
                    const maxScore = 40; // Assuming 10 points max per category
                    const overallPercentage = Math.round((totalScore / maxScore) * 100);
                    
                    let readinessLevel, readinessColor;
                    if (overallPercentage >= 80) {
                      readinessLevel = 'High';
                      readinessColor = 'text-green-600';
                    } else if (overallPercentage >= 60) {
                      readinessLevel = 'Medium';
                      readinessColor = 'text-yellow-600';
                    } else {
                      readinessLevel = 'Low';
                      readinessColor = 'text-red-600';
                    }
                    
                    return (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Fabric Readiness:</span>
                        <span className={`text-xl font-bold ${readinessColor}`}>
                          {readinessLevel} ({overallPercentage}%)
                        </span>
                      </div>
                    );
                  })()} 
                </div>
              </div>
              
              <div>
                {/* Expected Business Impact */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Business Impact</h3>
                  <p className="text-gray-700">
                    {fabricScore >= 75 
                      ? 'High ROI potential within 6-12 months' 
                      : fabricScore >= 50 
                        ? 'Moderate ROI potential within 12-18 months'
                        : 'Long-term ROI potential, 18+ months with proper implementation'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Key Strengths & Opportunities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-50 p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Key Strengths</h3>
                {(() => {
                  const scores = calculateScores(assessmentData);
                  const categories = [
                    { name: 'Data Integration', score: scores.data },
                    { name: 'Analytics Capabilities', score: scores.analytics },
                    { name: 'Governance Framework', score: scores.governance },
                    { name: 'Organizational Culture', score: scores.culture }
                  ];
                  
                  const topStrength = categories.sort((a, b) => b.score - a.score)[0];
                  
                  return (
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Top Area:</span>
                        <span className="font-medium text-green-600">{topStrength.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Score:</span>
                        <span className="font-medium">{topStrength.score.toFixed(1)}/10</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-amber-800 mb-2">Key Opportunities</h3>
                {(() => {
                  const scores = calculateScores(assessmentData);
                  const categories = [
                    { name: 'Data Integration', score: scores.data },
                    { name: 'Analytics Capabilities', score: scores.analytics },
                    { name: 'Governance Framework', score: scores.governance },
                    { name: 'Organizational Culture', score: scores.culture }
                  ];
                  
                  const topOpportunity = categories.sort((a, b) => a.score - b.score)[0];
                  
                  return (
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Focus Area:</span>
                        <span className="font-medium text-amber-600">{topOpportunity.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Current Score:</span>
                        <span className="font-medium">{parseFloat(topOpportunity.score.toFixed(1))}/10</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
          
          {/* Industry-Specific Insights Section */}
          <div className="industry-insights mb-8 pb-6 border-b">
            <h2 className="text-2xl font-bold mb-4">Industry-Specific Insights</h2>
            
            {(() => {
              const insight = getIndustryInsight();
              return (
                <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                  <h3 className="text-xl font-semibold text-blue-800 mb-3">{insight.title}</h3>
                  <p className="mb-4 text-gray-700">{insight.content}</p>
                  
                  <div className="flex items-start mt-3">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-blue-800">Key Consideration</h4>
                      <p className="text-sm text-blue-700">{insight.keyConsideration}</p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
          
          <div className="recommendations mb-8 pb-6 border-b">
            <h2 className="text-2xl font-bold mb-4">Recommendations</h2>
            <p className="mb-4">{getRecommendation()}</p>
            
            <h3 className="text-xl font-semibold mb-3">Suggested Next Steps</h3>
            <ol className="list-decimal pl-5">
              {getNextSteps().map((step, index) => (
                <li key={index} className="mb-2">{step}</li>
              ))}
            </ol>
          </div>
          
          {/* Value Proposition Section */}
          <div className="value-proposition mb-8 pb-6 border-b">
            <h2 className="text-2xl font-bold mb-4">Business Value Proposition</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">Financial Impact</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-1 border-b border-blue-100">
                    <span className="text-gray-600">Est. Annual Cost Savings:</span>
                    <span className="font-bold text-blue-700">
                      {(() => {
                        // Calculate estimated cost savings
                        let costSavingsPercent = 0.15; // Base 15% savings
                        if (fabricScore >= 80) costSavingsPercent = 0.25;
                        else if (fabricScore >= 60) costSavingsPercent = 0.20;
                        
                        const costSavings = 500000 * costSavingsPercent;
                        return new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          maximumFractionDigits: 0,
                        }).format(costSavings);
                      })()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-1 border-b border-blue-100">
                    <span className="text-gray-600">3-Year ROI Potential:</span>
                    <span className="font-bold text-green-600">
                      {(() => {
                        let roiEstimate = 150; // Base 150% ROI
                        if (fabricScore >= 80) roiEstimate = 250;
                        else if (fabricScore >= 60) roiEstimate = 200;
                        else if (fabricScore < 40) roiEstimate = 100;
                        return `${roiEstimate}%`;
                      })()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                <h3 className="text-xl font-semibold text-indigo-800 mb-3">Implementation Benefits</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-1 border-b border-indigo-100">
                    <span className="text-gray-600">Time to Value:</span>
                    <span className="font-bold text-indigo-700">
                      {(() => {
                        let timeToValue = 12; // Baseline
                        
                        // Adjust for implementation factors
                        if (assessmentData.microsoftInvestments.includes('Azure')) timeToValue -= 2;
                        if (assessmentData.microsoftInvestments.includes('Power BI')) timeToValue -= 1;
                        if (assessmentData.powerBiUsage > 7) timeToValue -= 2;
                        
                        // Adjust for complexity
                        if (assessmentData.dataVolume > 8) timeToValue += 2;
                        if (assessmentData.realTimeNeeds > 8) timeToValue += 1;
                        if (assessmentData.complianceRequirements.length > 3) timeToValue += 2;
                        
                        timeToValue = Math.max(3, timeToValue); // Minimum 3 months
                        return `${timeToValue} months`;
                      })()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between py-1 border-b border-indigo-100">
                    <span className="text-gray-600">Productivity Improvement:</span>
                    <span className="font-bold text-indigo-700">
                      {(() => {
                        // Productivity score from 1-5
                        let prodScore = 3; // Default
                        if (fabricScore >= 80) prodScore = 5;
                        else if (fabricScore >= 60) prodScore = 4;
                        else if (fabricScore < 40) prodScore = 2;
                        return `${prodScore}/5`;
                      })()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="fabric-benefits">
            <h2 className="text-2xl font-bold mb-4">Microsoft Fabric Key Benefits</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="benefit-card p-3 bg-gray-50 rounded-lg text-center">
                <h3 className="font-semibold mb-2">Unified Platform</h3>
                <p className="text-sm">Single integrated experience for all data and analytics needs</p>
              </div>
              
              <div className="benefit-card p-3 bg-gray-50 rounded-lg text-center">
                <h3 className="font-semibold mb-2">Power BI Integration</h3>
                <p className="text-sm">Seamless connection to industry-leading BI capabilities</p>
              </div>
              
              <div className="benefit-card p-3 bg-gray-50 rounded-lg text-center">
                <h3 className="font-semibold mb-2">OneLake Architecture</h3>
                <p className="text-sm">Simplified data management with a unified data lake</p>
              </div>
              
              <div className="benefit-card p-3 bg-gray-50 rounded-lg text-center">
                <h3 className="font-semibold mb-2">AI-Ready Platform</h3>
                <p className="text-sm">Built-in ML and AI capabilities for advanced analytics</p>
              </div>
              
              <div className="benefit-card p-3 bg-gray-50 rounded-lg text-center">
                <h3 className="font-semibold mb-2">SaaS Simplicity</h3>
                <p className="text-sm">Reduced maintenance and infrastructure management</p>
              </div>
              
              <div className="benefit-card p-3 bg-gray-50 rounded-lg text-center">
                <h3 className="font-semibold mb-2">Microsoft Ecosystem</h3>
                <p className="text-sm">Deep integration with Microsoft 365, Azure, and other services</p>
              </div>
            </div>
          </div>
          
          <div className="report-footer mt-8 pt-6 border-t text-center text-gray-500 text-sm">
            <p>This assessment is provided as guidance only and should be verified with a Microsoft Fabric specialist.</p>
            <p>© 2025 Microsoft Fabric Assessment Tool</p>
          </div>
        </div>
        
        <div className="flex justify-between mt-8">
          <button onClick={onRestart} className="bg-gray-500 text-white py-2 px-4 rounded">
            Start New Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;