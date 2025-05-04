// FormData.ts - Type definitions for assessment form data

export interface FormData {
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
