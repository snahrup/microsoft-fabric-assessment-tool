import React, { useState } from 'react';
import { AssessmentData } from '../App';
import ToolTip from './ToolTip';
import IndustrySelector from './IndustrySelector';

interface ConsultantNote {
  title: string;
  content: string;
  keyPoints?: string[];
  industryNotes?: Record<string, {
    content: string;
    keyPoints: string[];
  }>;
}

interface AssessmentFormProps {
  onComplete: (data: AssessmentData) => void;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({ onComplete }) => {
  const [showConsultantNotes, setShowConsultantNotes] = useState<boolean>(false);
  const [step, setStep] = useState(0);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('general');
  const [formData, setFormData] = useState<AssessmentData>({
    currentInfrastructure: [],
    dataWarehouseSolution: '',
    businessIntelligenceTool: '',
    dataTypes: [],
    dataVolume: 5,
    realTimeNeeds: 5,
    microsoftInvestments: [],
    powerBiUsage: 5,
    budgetConstraint: 5,
    timeToImplementation: 5,
    complianceRequirements: [],
    dataSovereigntyNeeds: 5
  });

  const handleCheckboxChange = (field: keyof AssessmentData, value: string) => {
    const array = formData[field] as string[];
    if (array.includes(value)) {
      setFormData({
        ...formData,
        [field]: array.filter(item => item !== value)
      });
    } else {
      setFormData({
        ...formData,
        [field]: [...array, value]
      });
    }
  };

  const handleSliderChange = (field: keyof AssessmentData, value: number) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleInputChange = (field: keyof AssessmentData, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Include the selected industry in the assessment data
    onComplete({
      ...formData,
      industry: selectedIndustry
    });
  };

  // Consultant guidance notes for each step
  const consultantGuidance: Record<number, ConsultantNote> = {
    0: {
      title: 'Industry Selection Guidance',
      content: 'The industry selection helps tailor recommendations and ROI calculations to the client\'s specific vertical. Each industry has unique Microsoft Fabric adoption patterns and considerations.',
      keyPoints: [
        'Select the client\'s primary industry to tailor the assessment',
        'Pay attention to industry-specific regulatory requirements',
        'Consider hybrid or multi-industry scenarios for conglomerates',
        'Competitive landscape varies significantly by industry'
      ],
      industryNotes: {
        'financial-services': {
          content: 'Financial institutions face unique challenges with data governance, regulatory compliance, and fraud detection. Microsoft Fabric offers significant advantages for these high-priority areas.',
          keyPoints: [
            'Regulatory requirement mapping: FINRA, SEC, Basel III, Dodd-Frank, PCI DSS',
            'Fraud detection capabilities through ML services and real-time analytics',
            'Customer 360 opportunities: cross-selling, risk assessment, personalization',
            'Legacy system integration challenges with mainframes and proprietary systems',
            'Data sovereignty requirements across global operations',
            'Typical implementation timeline: 8-12 months for full deployment'
          ]
        },
        'healthcare': {
          content: 'Healthcare organizations need to balance data accessibility with strict privacy regulations. Microsoft Fabric provides robust security features while enabling clinical analytics.',
          keyPoints: [
            'HIPAA, HITECH compliance requirements integrated with Microsoft cloud certification',
            'Integration challenges with EHR systems (Epic, Cerner, Meditech)',
            'Clinical data standardization (FHIR, HL7)',
            'Patient journey analytics and population health opportunities',
            'Research data warehousing and collaboration capabilities',
            'Typical implementation timeline: 10-14 months with phased approach'
          ]
        },
        'manufacturing': {
          content: 'Manufacturing companies have complex data ecosystems spanning operational technology (OT) and information technology (IT). Microsoft Fabric can unify these for predictive maintenance and supply chain optimization.',
          keyPoints: [
            'OT/IT integration patterns with industrial IoT data',
            'Real-time monitoring and predictive maintenance use cases',
            'Supply chain visibility and inventory optimization',
            'Quality control analytics and root cause analysis',
            'Integration with MES and ERP systems',
            'Typical implementation timeline: 6-10 months with focused use cases'
          ]
        },
        'retail': {
          content: 'Retail organizations need to analyze large volumes of customer and inventory data across multiple channels. Microsoft Fabric provides the scale and flexibility needed for modern retail analytics.',
          keyPoints: [
            'Omnichannel data integration (online, in-store, mobile, social)',
            'Customer behavior analysis and personalization opportunities',
            'Inventory and supply chain optimization use cases',
            'Point of sale (POS) integration patterns',
            'Seasonal data variability and planning analytics',
            'Typical implementation timeline: 6-9 months with phased rollout'
          ]
        },
        'public-sector': {
          content: 'Government agencies and educational institutions have strict security and procurement requirements. Microsoft Fabric offers FedRAMP compliance and secure data sharing capabilities.',
          keyPoints: [
            'FedRAMP, CJIS, and other government compliance requirements',
            'Cross-agency data sharing opportunities and challenges',
            'Legacy system integration (often 10-15+ years old)',
            'Long procurement cycles requiring detailed justification',
            'Budget constraints and fiscal year alignment',
            'Typical implementation timeline: 12-18 months with multiple approval stages'
          ]
        },
        'energy': {
          content: 'Energy companies generate massive volumes of data from equipment sensors and operations. Microsoft Fabric provides the scale and specialized analytics needed for this industry.',
          keyPoints: [
            'SCADA system integration patterns',
            'Real-time monitoring of grid performance and outage prediction',
            'Regulatory reporting automation opportunities',
            'Geographical data integration and visualization',
            'Sustainability analytics and carbon footprint reduction',
            'Typical implementation timeline: 8-12 months with phased approach'
          ]
        },
        'general': {
          content: 'For organizations spanning multiple industries or with unique needs, a general assessment provides flexibility while still identifying key Microsoft Fabric adoption areas.',
          keyPoints: [
            'Focus on common data platform needs across business units',
            'Identify specific departmental use cases for initial pilots',
            'Consider industry-specific modules as extension points',
            'Map Microsoft Fabric capabilities to organizational data maturity',
            'Cross-industry benchmarking opportunities',
            'Typical implementation timeline: 8-10 months with agile approach'
          ]
        }
      }
    },
    1: {
      title: 'Infrastructure Assessment Guidance',
      content: 'Understanding the client\'s current infrastructure helps identify migration paths and potential challenges. Microsoft Fabric adoption is typically smoother for organizations already using Microsoft technologies.',
      keyPoints: [
        'SQL Server users will find direct migration paths to Fabric',
        'Azure customers can leverage existing investments',
        'Competitor platforms may require more complex migration strategies',
        'Identify potential integration challenges early'
      ]
    },
    2: {
      title: 'Data Characteristics Guidance',
      content: 'This section helps assess the complexity and scale of the client\'s data landscape. Microsoft Fabric excels with diverse data types and high volumes but implementation complexity increases with data variety.',
      keyPoints: [
        'High data volumes may require phased migration approach',
        'Real-time needs align well with Fabric\'s streaming capabilities',
        'Unstructured data may require additional lakehouse configurations',
        'Consider data growth projections for the next 2-3 years'
      ]
    },
    3: {
      title: 'Microsoft Ecosystem Guidance',
      content: 'Existing Microsoft investments significantly impact Fabric adoption success. Power BI usage is a particularly strong indicator of Fabric readiness as it integrates seamlessly with Fabric.',
      keyPoints: [
        'Power BI users have shorter learning curves for Fabric adoption',
        'Existing Azure services can be integrated with minimal disruption',
        'Microsoft 365 offers collaboration advantages with Fabric',
        'Identify potential champions among existing Microsoft tool users'
      ]
    },
    4: {
      title: 'Business Requirements Guidance',
      content: 'Understanding business constraints helps set realistic implementation timelines and budget expectations. This information is crucial for creating a phased implementation approach.',
      keyPoints: [
        'Budget constraints may indicate starting with specific Fabric workloads',
        'Urgent timelines might suggest a minimal viable product approach',
        'Compliance requirements may necessitate specific configurations',
        'Data sovereignty needs impact datacenter region selection'
      ]
    }
  };
  
  return (
    <div className="container">
      <div className="card shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-blue-800">Assessment Questionnaire</h2>
          <div className="flex items-center">
            <div>
              <label className="inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={showConsultantNotes}
                  onChange={() => setShowConsultantNotes(!showConsultantNotes)}
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-700">Consultant View</span>
              </label>
            </div>
            {/* Only show print button on pages with assessment data (not on first page) */}
            {step > 0 && (
              <button 
                className="ml-4 px-3 py-1.5 bg-blue-600 text-white rounded flex items-center text-sm hover:bg-blue-700 transition-colors shadow-sm"
                onClick={() => window.print()}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Assessment
              </button>
            )}
          </div>
        </div>
        
        {step === 0 ? (
          <>
            <p className="mb-4 text-gray-700 text-lg">
              Select your industry below to tailor this assessment to your organization's specific needs and priorities.
            </p>
            
            {/* Industry Selector Component - Always appears first on step 0 */}
            <div className="slide-in mb-6">
              <IndustrySelector 
                onIndustrySelect={(industry) => {
                  setFormData({ ...formData, industry: industry });
                  setSelectedIndustry(industry);
                }}
                selectedIndustry={selectedIndustry}
              />
            </div>
            
            {/* Consultant Notes Panel - Below Industry Selector when shown */}
            {showConsultantNotes && (
              <div className="consultant-notes p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                <div className="flex items-center mb-3">
                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-lg font-semibold text-blue-800">{consultantGuidance[0]?.title}</h3>
                </div>
                
                {/* Industry-specific guidance when industry is selected */}
                {formData.industry && consultantGuidance[0]?.industryNotes && consultantGuidance[0].industryNotes[formData.industry] ? (
                  <div>
                    <div className="bg-white p-3 rounded-lg shadow-sm mb-4 border-l-4 border-blue-500">
                      <h4 className="font-semibold text-blue-800 mb-2">
                        {formData.industry === 'financial-services' ? 'Financial Services' :
                         formData.industry === 'public-sector' ? 'Public Sector' : 
                         formData.industry.charAt(0).toUpperCase() + formData.industry.slice(1)} Industry Guidance
                      </h4>
                      <p className="text-gray-700 mb-3">{consultantGuidance[0].industryNotes[formData.industry].content}</p>
                      
                      <div className="mt-3">
                        <h5 className="font-medium text-blue-700 mb-2">Industry-Specific Considerations:</h5>
                        <ul className="list-disc pl-5 space-y-1">
                          {consultantGuidance[0].industryNotes[formData.industry].keyPoints.map((point, index) => (
                            <li key={index} className="text-gray-700">{point}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-500 italic mb-3">
                      Note: The assessment questions and scoring will be tailored based on {formData.industry === 'financial-services' ? 'Financial Services' :
                         formData.industry === 'public-sector' ? 'Public Sector' : 
                         formData.industry.charAt(0).toUpperCase() + formData.industry.slice(1)} industry priorities.
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-700 mb-3">{consultantGuidance[0]?.content}</p>
                    
                    {consultantGuidance[0]?.keyPoints && (
                      <div>
                        <h4 className="font-medium text-blue-700 mb-2">Key Discussion Points:</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {consultantGuidance[0]?.keyPoints?.map((point, index) => (
                            <li key={index} className="text-gray-700">{point}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <p className="mb-6 text-gray-700 text-lg">
              Complete this interactive questionnaire to determine if Microsoft Fabric is the right solution 
              for your organization's data and analytics needs.
            </p>
            
            {/* Consultant Notes Panel for steps other than industry selection */}
            {showConsultantNotes && step <= 4 && (
              <div className="consultant-notes mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center mb-3">
                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-lg font-semibold text-blue-800">{consultantGuidance[step]?.title}</h3>
                </div>
                <p className="text-gray-700 mb-3">{consultantGuidance[step]?.content}</p>
                
                {consultantGuidance[step]?.keyPoints && (
                  <div>
                    <h4 className="font-medium text-blue-700 mb-2">Key Discussion Points:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {consultantGuidance[step]?.keyPoints?.map((point, index) => (
                        <li key={index} className="text-gray-700">{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {step > 0 && (
          <div className="progress-bar mb-8 bg-gray-100 p-4 rounded-lg shadow-sm">
            <div className="flex justify-between text-sm mb-1 font-medium text-gray-700">
              <span>Infrastructure</span>
              <span>Data</span>
              <span>Microsoft Tech</span>
              <span>Requirements</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full">
              <div 
                className="h-3 bg-blue-600 rounded-full transition-all shadow-sm" 
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Industry selection step has been moved to the top of the form */}
          {step === 1 && (
            <div className="slide-in bg-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Current Infrastructure</h3>
              
              <div className="mb-4">
                <label className="block mb-2 font-semibold text-gray-800">
                  Which technologies are currently part of your data infrastructure?
                  <ToolTip text="Select all platforms and services you currently use" />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {['SQL Server', 'Oracle', 'Azure', 'AWS', 'Google Cloud', 'On-premises servers', 'Hadoop/Spark', 'MongoDB'].map(tech => (
                    <div key={tech} className="flex items-center">
                      <input
                        type="checkbox"
                        id={tech}
                        checked={formData.currentInfrastructure.includes(tech)}
                        onChange={() => handleCheckboxChange('currentInfrastructure', tech)}
                        className="mr-2 w-5 h-5 accent-blue-600"
                      />
                      <label htmlFor={tech} className="text-gray-700 font-medium">{tech}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-semibold text-gray-800">
                  What is your primary data warehouse solution?
                  <ToolTip text="The main system where you store and analyze structured data" />
                </label>
                <select
                  value={formData.dataWarehouseSolution}
                  onChange={(e) => handleInputChange('dataWarehouseSolution', e.target.value)}
                  className="w-full p-3 bg-white border-gray-300 text-gray-800 font-medium shadow-sm"
                >
                  <option value="">Select an option</option>
                  <option value="Azure Synapse">Azure Synapse</option>
                  <option value="SQL Server">SQL Server</option>
                  <option value="Snowflake">Snowflake</option>
                  <option value="AWS Redshift">AWS Redshift</option>
                  <option value="Google BigQuery">Google BigQuery</option>
                  <option value="Oracle">Oracle</option>
                  <option value="None">None</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-semibold text-gray-800">
                  What business intelligence tool do you primarily use?
                  <ToolTip text="The main tool used to visualize and analyze data" />
                </label>
                <select
                  value={formData.businessIntelligenceTool}
                  onChange={(e) => handleInputChange('businessIntelligenceTool', e.target.value)}
                  className="w-full p-3 bg-white border-gray-300 text-gray-800 font-medium shadow-sm"
                >
                  <option value="">Select an option</option>
                  <option value="Power BI">Power BI</option>
                  <option value="Tableau">Tableau</option>
                  <option value="Qlik">Qlik</option>
                  <option value="Looker">Looker</option>
                  <option value="Excel">Excel</option>
                  <option value="SAP BusinessObjects">SAP BusinessObjects</option>
                  <option value="None">None</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="slide-in bg-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Data Characteristics</h3>
              
              <div className="mb-4">
                <label className="block mb-2 font-semibold text-gray-800">
                  What types of data does your organization work with?
                  <ToolTip text="Select all that apply to your organization" />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {['Structured (relational databases)', 'Semi-structured (JSON, XML)', 'Unstructured (documents, emails)', 'IoT/sensor data', 'Images/video', 'Audio', 'Social media data', 'Log files'].map(type => (
                    <div key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        id={type}
                        checked={formData.dataTypes.includes(type)}
                        onChange={() => handleCheckboxChange('dataTypes', type)}
                        className="mr-2 w-5 h-5 accent-blue-600"
                      />
                      <label htmlFor={type} className="text-gray-700 font-medium">{type}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-semibold text-gray-800">
                  How would you rate your data volume?
                  <ToolTip text="1 = Low (GBs), 10 = Very high (PBs+)" />
                </label>
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-700">Small</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.dataVolume}
                    onChange={(e) => handleSliderChange('dataVolume', parseInt(e.target.value))}
                    className="mx-4 flex-grow"
                  />
                  <span className="font-medium text-gray-700">Large</span>
                </div>
                <div className="text-center font-semibold">
                  {formData.dataVolume}
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-semibold text-gray-800">
                  How important is real-time data processing for your organization?
                  <ToolTip text="1 = Not important, 10 = Critical" />
                </label>
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-700">Not important</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.realTimeNeeds}
                    onChange={(e) => handleSliderChange('realTimeNeeds', parseInt(e.target.value))}
                    className="mx-4 flex-grow"
                  />
                  <span className="font-medium text-gray-700">Critical</span>
                </div>
                <div className="text-center font-semibold">
                  {formData.realTimeNeeds}
                </div>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="slide-in bg-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Microsoft Ecosystem</h3>
              
              <div className="mb-4">
                <label className="block mb-2 font-semibold text-gray-800">
                  Which Microsoft products does your organization currently use?
                  <ToolTip text="Select all Microsoft technologies your organization has invested in" />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {['Azure', 'Power BI', 'Office/Microsoft 365', 'Dynamics 365', 'SQL Server', 'Azure Synapse Analytics', 'Azure Data Factory', 'SharePoint'].map(tech => (
                    <div key={tech} className="flex items-center">
                      <input
                        type="checkbox"
                        id={tech}
                        checked={formData.microsoftInvestments.includes(tech)}
                        onChange={() => handleCheckboxChange('microsoftInvestments', tech)}
                        className="mr-2 w-5 h-5 accent-blue-600"
                      />
                      <label htmlFor={tech} className="text-gray-700 font-medium">{tech}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-semibold text-gray-800">
                  If you use Power BI, how central is it to your analytics strategy?
                  <ToolTip text="1 = Not used, 10 = Essential" />
                </label>
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-700">Not used</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.powerBiUsage}
                    onChange={(e) => handleSliderChange('powerBiUsage', parseInt(e.target.value))}
                    className="mx-4 flex-grow"
                  />
                  <span className="font-medium text-gray-700">Essential</span>
                </div>
                <div className="text-center font-semibold">
                  {formData.powerBiUsage}
                </div>
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="slide-in bg-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Business Requirements & Compliance</h3>
              
              <div className="mb-4">
                <label className="block mb-2 font-semibold text-gray-800">
                  How significant are budget constraints for your data platform?
                  <ToolTip text="1 = Extremely tight budget, 10 = Budget is not a concern" />
                </label>
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-700">Very limited</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.budgetConstraint}
                    onChange={(e) => handleSliderChange('budgetConstraint', parseInt(e.target.value))}
                    className="mx-4 flex-grow"
                  />
                  <span className="font-medium text-gray-700">No constraints</span>
                </div>
                <div className="text-center font-semibold">
                  {formData.budgetConstraint}
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-semibold text-gray-800">
                  What compliance requirements affect your data strategy?
                  <ToolTip text="Select all compliance standards that your organization must adhere to" />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {['GDPR', 'HIPAA', 'CCPA', 'SOX', 'PCI DSS', 'ISO 27001', 'FedRAMP', 'Industry-specific'].map(req => (
                    <div key={req} className="flex items-center">
                      <input
                        type="checkbox"
                        id={req}
                        checked={formData.complianceRequirements.includes(req)}
                        onChange={() => handleCheckboxChange('complianceRequirements', req)}
                        className="mr-2 w-5 h-5 accent-blue-600"
                      />
                      <label htmlFor={req} className="text-gray-700 font-medium">{req}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-semibold text-gray-800">
                  How important is data sovereignty for your organization?
                  <ToolTip text="1 = Not important, 10 = Critical. This refers to needing data to reside in specific geographic regions." />
                </label>
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-700">Not important</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.dataSovereigntyNeeds}
                    onChange={(e) => handleSliderChange('dataSovereigntyNeeds', parseInt(e.target.value))}
                    className="mx-4 flex-grow"
                  />
                  <span className="font-medium text-gray-700">Critical</span>
                </div>
                <div className="text-center font-semibold">
                  {formData.dataSovereigntyNeeds}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            {step > 0 && (
              <button 
                type="button" 
                onClick={prevStep} 
                className="bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-medium text-lg shadow-md hover:bg-gray-400 transition-colors"
              >
                &larr; Previous
              </button>
            )}
            {step < 5 ? (
              <button 
                type="button" 
                onClick={nextStep} 
                className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium text-lg shadow-md hover:bg-blue-700 transition-colors ml-auto"
              >
                Next &rarr;
              </button>
            ) : (
              <button 
                type="submit" 
                className="bg-green-600 text-white py-3 px-6 rounded-lg font-medium text-lg shadow-md hover:bg-green-700 transition-colors ml-auto"
              >
                Complete Assessment
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssessmentForm;