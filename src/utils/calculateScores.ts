// calculateScores.ts - Utility for calculating assessment scores
import { AssessmentData } from '../App';

interface CategoryScores {
  data: number;
  analytics: number;
  governance: number;
  culture: number;
}

export const calculateScores = (formData: AssessmentData): CategoryScores => {
  // Calculate Data Integration Score (0-10)
  const dataScore = calculateDataScore(formData);
  
  // Calculate Analytics Capabilities Score (0-10)
  const analyticsScore = calculateAnalyticsScore(formData);
  
  // Calculate Governance Framework Score (0-10)
  const governanceScore = calculateGovernanceScore(formData);
  
  // Calculate Organizational Culture Score (0-10)
  const cultureScore = calculateCultureScore(formData);
  
  return {
    data: dataScore,
    analytics: analyticsScore,
    governance: governanceScore,
    culture: cultureScore
  };
};

const calculateDataScore = (formData: AssessmentData): number => {
  let score = 0;
  
  // Current data warehouse solution
  if (formData.dataWarehouseSolution === 'Azure Synapse' || 
      formData.dataWarehouseSolution === 'Azure SQL Data Warehouse') {
    score += 3;
  } else if (formData.dataWarehouseSolution === 'SQL Server') {
    score += 2;
  } else if (formData.dataWarehouseSolution === 'None' || 
             formData.dataWarehouseSolution === '') {
    score += 1;
  }
  
  // Data types compatibility
  if (formData.dataTypes.includes('Structured')) score += 1;
  if (formData.dataTypes.includes('Semi-structured')) score += 1;
  if (formData.dataTypes.includes('Unstructured')) score += 1;
  if (formData.dataTypes.includes('Real-time streaming')) score += 1;
  
  // Data volume and real-time needs
  score += Math.min(2, formData.dataVolume / 5);
  score += Math.min(2, formData.realTimeNeeds / 5);
  
  return Math.min(10, Math.max(0, score));
};

const calculateAnalyticsScore = (formData: AssessmentData): number => {
  let score = 0;
  
  // Business intelligence tool
  if (formData.businessIntelligenceTool === 'Power BI') {
    score += 3;
  } else if (formData.businessIntelligenceTool === 'SQL Server Reporting Services' || 
             formData.businessIntelligenceTool === 'Excel') {
    score += 2;
  } else if (formData.businessIntelligenceTool === 'None') {
    score += 1; // Good opportunity for Power BI
  }
  
  // Power BI usage
  score += Math.min(3, formData.powerBiUsage / 3.33);
  
  // Microsoft investments
  if (formData.microsoftInvestments.includes('Power BI')) score += 2;
  if (formData.microsoftInvestments.includes('Azure')) score += 1;
  if (formData.microsoftInvestments.includes('Dynamics 365')) score += 1;
  
  return Math.min(10, Math.max(0, score));
};

const calculateGovernanceScore = (formData: AssessmentData): number => {
  let score = 0;
  
  // Compliance requirements
  if (formData.complianceRequirements.length === 0) {
    score += 2; // Fewer compliance requirements = easier to implement
  } else {
    score += Math.max(0, 2 - formData.complianceRequirements.length * 0.5);
  }
  
  // Data sovereignty needs
  score += Math.min(3, (10 - formData.dataSovereigntyNeeds) / 3.33);
  
  // Microsoft ecosystem (governance advantages)
  if (formData.microsoftInvestments.includes('Azure')) score += 2;
  if (formData.microsoftInvestments.includes('Microsoft 365')) score += 1;
  if (formData.microsoftInvestments.includes('Dynamics 365')) score += 1;
  
  // Current infrastructure
  if (formData.currentInfrastructure.includes('Azure Data Factory')) score += 1;
  if (formData.currentInfrastructure.includes('Azure Purview')) score += 1;
  
  return Math.min(10, Math.max(0, score));
};

const calculateCultureScore = (formData: AssessmentData): number => {
  let score = 0;
  
  // Microsoft investments as a proxy for organizational culture
  const msInvestmentsCount = formData.microsoftInvestments.length;
  score += Math.min(3, msInvestmentsCount);
  
  // Power BI usage as a proxy for data culture
  score += Math.min(3, formData.powerBiUsage / 3.33);
  
  // Implementation timeline (longer = more time for culture change)
  score += Math.min(2, formData.timeToImplementation / 5);
  
  // Budget constraints (higher budget = more resources for change management)
  score += Math.min(2, formData.budgetConstraint / 5);
  
  return Math.min(10, Math.max(0, score));
};
