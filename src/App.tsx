import { useState } from 'react'
import './App.css'
import AssessmentForm from './components/AssessmentForm'
import ResultsDashboard from './components/ResultsDashboard'
import ComparisonSection from './components/ComparisonSection'
import ReportGenerator from './components/ReportGenerator'
import Header from './components/Header'
import ExecutiveSummary from './components/ExecutiveSummary'

// Define the structure of our assessment data
export interface AssessmentData {
  // Current infrastructure
  currentInfrastructure: string[];
  dataWarehouseSolution: string;
  businessIntelligenceTool: string;
  
  // Data characteristics
  dataTypes: string[];
  dataVolume: number; // 1-10 scale
  realTimeNeeds: number; // 1-10 scale
  
  // Microsoft ecosystem
  microsoftInvestments: string[];
  powerBiUsage: number; // 1-10 scale
  
  // Business requirements
  budgetConstraint: number; // 1-10 scale (10 = no constraint)
  timeToImplementation: number; // 1-10 scale (1 = need it now, 10 = can wait)
  
  // Compliance and governance
  complianceRequirements: string[];
  dataSovereigntyNeeds: number; // 1-10 scale
}

function App() {
  const [currentStep, setCurrentStep] = useState<'assessment' | 'results' | 'comparison' | 'executive' | 'report'>('assessment');
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [fabricScore, setFabricScore] = useState<number>(0);

  const handleAssessmentComplete = (data: AssessmentData) => {
    // Calculate Microsoft Fabric suitability score based on assessment data
    let score = 0;
    
    // Higher score for Microsoft investments and Power BI usage
    if (data.microsoftInvestments.includes('Azure')) score += 15;
    if (data.microsoftInvestments.includes('Power BI')) score += 15;
    if (data.microsoftInvestments.includes('Dynamics 365')) score += 10;
    if (data.microsoftInvestments.includes('Microsoft 365')) score += 5;
    
    // Power BI usage directly impacts Fabric suitability
    score += data.powerBiUsage * 2;
    
    // Real-time needs align well with Fabric capabilities
    score += data.realTimeNeeds * 1.5;
    
    // Data volume considerations (Fabric works well for medium to large)
    if (data.dataVolume >= 7) score += 15;
    else if (data.dataVolume >= 4) score += 10;
    else score += 5;
    
    // Budget considerations (lower budget = more Fabric benefit)
    score += (10 - data.budgetConstraint) * 1.5;
    
    // Normalize the score to be between 0-100
    score = Math.min(100, Math.max(0, score));
    
    setAssessmentData(data);
    setFabricScore(score);
    setCurrentStep('results');
  };

  return (
    <div className="app-container bg-gray-50 min-h-screen">
      <Header />
      
      {currentStep === 'assessment' && (
        <AssessmentForm onComplete={handleAssessmentComplete} />
      )}
      
      {currentStep === 'results' && assessmentData && (
        <ResultsDashboard 
          assessmentData={assessmentData} 
          fabricScore={fabricScore}
          onContinue={() => setCurrentStep('comparison')}
        />
      )}
      
      {currentStep === 'comparison' && assessmentData && (
        <ComparisonSection
          assessmentData={assessmentData}
          fabricScore={fabricScore}
          onContinue={() => setCurrentStep('executive')}
        />
      )}

      {currentStep === 'executive' && assessmentData && (
        <div className="container mx-auto py-8">
          <div className="flex justify-between items-center mb-6 px-4">
            <h2 className="text-2xl font-bold text-blue-800">Executive Summary</h2>
            <button
              onClick={() => setCurrentStep('report')}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300 shadow-sm"
            >
              Continue to Report
            </button>
          </div>
          <ExecutiveSummary formData={assessmentData} />
        </div>
      )}
      
      {currentStep === 'report' && assessmentData && (
        <ReportGenerator
          assessmentData={assessmentData}
          fabricScore={fabricScore}
          onRestart={() => setCurrentStep('assessment')}
        />
      )}
    </div>
  )
}

export default App