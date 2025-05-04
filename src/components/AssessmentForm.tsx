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
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Assessment Questionnaire</h2>
        <p className="mb-6">
          Complete this interactive questionnaire to determine if Microsoft Fabric is the right solution 
          for your organization's data and analytics needs.
        </p>

        <div className="progress-bar mb-8">
          <div className="flex justify-between text-sm mb-1">
            <span>Infrastructure</span>
            <span>Data</span>
            <span>Microsoft Tech</span>
            <span>Requirements</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-primary rounded-full transition-all" 
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="slide-in">
              <h3 className="text-xl font-semibold mb-4">Current Infrastructure</h3>
              
              <div className="mb-4">
                <label className="block mb-2">
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
                        className="mr-2"
                      />
                      <label htmlFor={tech}>{tech}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-2">
                  What is your primary data warehouse solution?
                  <ToolTip text="The main system where you store and analyze structured data" />
                </label>
                <select
                  value={formData.dataWarehouseSolution}
                  onChange={(e) => handleInputChange('dataWarehouseSolution', e.target.value)}
                  className="w-full p-2"
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
                <label className="block mb-2">
                  What business intelligence tool do you primarily use?
                  <ToolTip text="The main tool used to visualize and analyze data" />
                </label>
                <select
                  value={formData.businessIntelligenceTool}
                  onChange={(e) => handleInputChange('businessIntelligenceTool', e.target.value)}
                  className="w-full p-2"
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
            <div className="slide-in">
              <h3 className="text-xl font-semibold mb-4">Data Characteristics</h3>
              
              <div className="mb-4">
                <label className="block mb-2">
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
                        className="mr-2"
                      />
                      <label htmlFor={type}>{type}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-2">
                  How would you rate your data volume?
                  <ToolTip text="1 = Low (GBs), 10 = Very high (PBs+)" />
                </label>
                <div className="flex items-center">
                  <span>Small</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.dataVolume}
                    onChange={(e) => handleSliderChange('dataVolume', parseInt(e.target.value))}
                    className="mx-4 flex-grow"
                  />
                  <span>Massive</span>
                </div>
                <div className="text-center font-semibold">
                  {formData.dataVolume}
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-2">
                  How important is real-time data processing for your organization?
                  <ToolTip text="1 = Not important, 10 = Critical" />
                </label>
                <div className="flex items-center">
                  <span>Not important</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.realTimeNeeds}
                    onChange={(e) => handleSliderChange('realTimeNeeds', parseInt(e.target.value))}
                    className="mx-4 flex-grow"
                  />
                  <span>Critical</span>
                </div>
                <div className="text-center font-semibold">
                  {formData.realTimeNeeds}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="slide-in">
              <h3 className="text-xl font-semibold mb-4">Microsoft Ecosystem</h3>
              
              <div className="mb-4">
                <label className="block mb-2">
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
                        className="mr-2"
                      />
                      <label htmlFor={tech}>{tech}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-2">
                  If you use Power BI, how central is it to your analytics strategy?
                  <ToolTip text="1 = Not used, 10 = Essential" />
                </label>
                <div className="flex items-center">
                  <span>Not used</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.powerBiUsage}
                    onChange={(e) => handleSliderChange('powerBiUsage', parseInt(e.target.value))}
                    className="mx-4 flex-grow"
                  />
                  <span>Essential</span>
                </div>
                <div className="text-center font-semibold">
                  {formData.powerBiUsage}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="slide-in">
              <h3 className="text-xl font-semibold mb-4">Business Requirements & Compliance</h3>
              
              <div className="mb-4">
                <label className="block mb-2">
                  How significant are budget constraints for your data platform?
                  <ToolTip text="1 = Extremely tight budget, 10 = Budget is not a concern" />
                </label>
                <div className="flex items-center">
                  <span>Very limited</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.budgetConstraint}
                    onChange={(e) => handleSliderChange('budgetConstraint', parseInt(e.target.value))}
                    className="mx-4 flex-grow"
                  />
                  <span>Unlimited</span>
                </div>
                <div className="text-center font-semibold">
                  {formData.budgetConstraint}
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-2">
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
                        className="mr-2"
                      />
                      <label htmlFor={req}>{req}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-2">
                  How important is data sovereignty for your organization?
                  <ToolTip text="1 = Not important, 10 = Critical. This refers to needing data to reside in specific geographic regions." />
                </label>
                <div className="flex items-center">
                  <span>Not important</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.dataSovereigntyNeeds}
                    onChange={(e) => handleSliderChange('dataSovereigntyNeeds', parseInt(e.target.value))}
                    className="mx-4 flex-grow"
                  />
                  <span>Critical</span>
                </div>
                <div className="text-center font-semibold">
                  {formData.dataSovereigntyNeeds}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button type="button" onClick={prevStep} className="bg-gray-500 text-white py-2 px-4 rounded">
                Previous
              </button>
            )}
            {step < 4 ? (
              <button type="button" onClick={nextStep} className="bg-primary text-white py-2 px-4 rounded ml-auto">
                Next
              </button>
            ) : (
              <button type="submit" className="bg-success text-white py-2 px-4 rounded ml-auto">
                Calculate Suitability
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssessmentForm;