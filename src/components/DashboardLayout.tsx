import React, { ReactNode, useState } from 'react';
import { AssessmentData } from '../App';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  assessmentData?: AssessmentData;
  fabricScore?: number;
  noTabs?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  title, 
  assessmentData, 
  fabricScore,
  noTabs = false
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // No tabs or tab switching functionality anymore

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      {sidebarOpen && (
        <div className="w-80 bg-white shadow-md z-10">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Fabric Assessment</h2>
              {/* Sidebar toggle button removed */}
            </div>
          </div>
          
          <div className="p-4">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Assessment Summary</h3>
              <div className="space-y-4">
                {assessmentData?.industry && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Industry</div>
                    <div className="font-medium text-gray-800 capitalize bg-gray-50 px-3 py-2 rounded-md">
                      {assessmentData.industry === 'financial-services' ? 'Financial Services' : 
                       assessmentData.industry === 'public-sector' ? 'Public Sector' : 
                       assessmentData.industry.charAt(0).toUpperCase() + assessmentData.industry.slice(1)}
                    </div>
                  </div>
                )}
                
                {fabricScore !== undefined && (
                  <div className="pt-2">
                    <div className="text-xs text-gray-500 mb-2">Overall Score</div>
                    <div className="w-full">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-lg font-bold" 
                          style={{ color: fabricScore >= 70 ? '#107c10' : (fabricScore >= 40 ? '#ffb900' : '#d13438') }}>
                          {Math.round(fabricScore)}
                        </span>
                        <span className="text-sm font-medium">
                          {fabricScore >= 80 ? 'Excellent Fit' : 
                           fabricScore >= 60 ? 'Good Fit' : 
                           fabricScore >= 40 ? 'Partial Fit' : 'Not Recommended'}
                        </span>
                      </div>
                      
                      {/* Score gauge */}
                      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mt-1 mb-2">
                        <div className="h-full rounded-full" 
                          style={{ 
                            width: `${fabricScore}%`,
                            backgroundColor: fabricScore >= 70 ? '#107c10' : (fabricScore >= 40 ? '#ffb900' : '#d13438')
                          }}>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 italic">
                        {fabricScore >= 70 
                          ? 'Ready for Microsoft Fabric implementation' 
                          : fabricScore >= 50 
                            ? 'Some areas need attention' 
                            : 'Significant improvements needed'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {assessmentData && (
              <>
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Infrastructure</h3>
                  <div className="p-3 bg-gray-50 rounded-md">
                    {assessmentData.currentInfrastructure.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {assessmentData.currentInfrastructure.map((item, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-200 text-gray-800">
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">No infrastructure specified</span>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Key Metrics</h3>
                  <div className="space-y-4 p-3 bg-gray-50 rounded-md">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">Power BI Usage</span>
                        <span className="text-xs font-medium">{assessmentData.powerBiUsage}/10</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full" 
                          style={{ 
                            width: `${(assessmentData.powerBiUsage / 10) * 100}%`,
                            backgroundColor: assessmentData.powerBiUsage >= 7 ? '#107c10' : (assessmentData.powerBiUsage >= 4 ? '#ffb900' : '#d13438')
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">Data Volume</span>
                        <span className="text-xs font-medium">{assessmentData.dataVolume}/10</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full" 
                          style={{ 
                            width: `${(assessmentData.dataVolume / 10) * 100}%`,
                            backgroundColor: assessmentData.dataVolume >= 7 ? '#d13438' : (assessmentData.dataVolume >= 4 ? '#ffb900' : '#107c10')
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">Compliance Needs</span>
                        <span className="text-xs font-medium">{assessmentData.complianceRequirements.length}/8</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full" 
                          style={{ 
                            width: `${(assessmentData.complianceRequirements.length / 8) * 100}%`,
                            backgroundColor: assessmentData.complianceRequirements.length >= 6 ? '#d13438' : (assessmentData.complianceRequirements.length >= 3 ? '#ffb900' : '#107c10')
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Microsoft Ecosystem</h3>
                  <div className="p-3 bg-gray-50 rounded-md">
                    {assessmentData.microsoftInvestments.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {assessmentData.microsoftInvestments.map((item, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-200 text-gray-800">
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">No Microsoft products</span>
                    )}
                    
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">Implementation Estimate</div>
                      <div className="font-medium" style={{ 
                        color: assessmentData.microsoftInvestments.length > 2 ? '#107c10' : (assessmentData.microsoftInvestments.length > 0 ? '#ffb900' : '#d13438')
                      }}>
                        {assessmentData.microsoftInvestments.length > 2 && assessmentData.powerBiUsage > 7 
                          ? '3-6 months' 
                          : assessmentData.microsoftInvestments.length > 0 
                            ? '6-9 months' 
                            : '9-12 months'}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm">
          <div className="flex justify-between items-center p-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                className="px-4 py-2 border border-gray-300 bg-white text-gray-800 rounded-lg flex items-center text-sm hover:bg-gray-50 transition-colors shadow-sm font-medium"
                onClick={() => window.print()}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Export Report
              </button>
              
              {/* User button removed */}
            </div>
          </div>
          
          {/* Simple border separator */}
          <div className="border-b border-gray-200"></div>
        </header>
        
        {/* Main Content Area */}
        <main className="bg-gray-100 p-6 pb-16 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
