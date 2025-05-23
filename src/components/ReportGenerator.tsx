import React, { useRef } from 'react';
import { AssessmentData } from '../App';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
                    : <li>No infrastructure specified</li>
                  }
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Data Characteristics</h3>
                <ul className="list-disc pl-5">
                  <li>Data Types: {assessmentData.dataTypes.length > 0 
                    ? assessmentData.dataTypes.join(', ')
                    : 'None specified'
                  }</li>
                  <li>Data Volume: {assessmentData.dataVolume}/10</li>
                  <li>Real-time Needs: {assessmentData.realTimeNeeds}/10</li>
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
                  <li>Power BI Usage: {assessmentData.powerBiUsage}/10</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Requirements & Compliance</h3>
                <ul className="list-disc pl-5">
                  <li>Budget Constraint: {assessmentData.budgetConstraint}/10</li>
                  <li>Data Sovereignty: {assessmentData.dataSovereigntyNeeds}/10</li>
                  <li>Compliance: {assessmentData.complianceRequirements.length > 0 
                    ? assessmentData.complianceRequirements.join(', ')
                    : 'None specified'
                  }</li>
                </ul>
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