import React, { useState } from 'react';
import { AssessmentData } from '../App';
import ToolTip from './ToolTip';

interface AssessmentFormProps {
  onComplete: (data: AssessmentData) => void;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
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
    onComplete(formData);
  };

  return (
    <div className="container">
      <div className="card shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-blue-800">Assessment Questionnaire</h2>
        <p className="mb-6 text-gray-700 text-lg">
          Complete this interactive questionnaire to determine if Microsoft Fabric is the right solution 
          for your organization's data and analytics needs.
        </p>

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

        <form onSubmit={handleSubmit}>
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
            {step > 1 && (
              <button 
                type="button" 
                onClick={prevStep} 
                className="bg-gray-300 text-gray-800 py-3 px-6 rounded-lg font-medium text-lg shadow-md hover:bg-gray-400 transition-colors"
              >
                &larr; Previous
              </button>
            )}
            {step < 4 ? (
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