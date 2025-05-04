import React, { useState, useEffect } from 'react';

interface IndustrySelectorProps {
  onIndustrySelect: (industry: string) => void;
  selectedIndustry: string;
}

interface IndustryInfo {
  name: string;
  description: string;
  keyFabricBenefits: string[];
  specificConsiderations: string[];
  icon: string; // Font Awesome class
  color: string; // Tailwind color class
}

const IndustrySelector: React.FC<IndustrySelectorProps> = ({ onIndustrySelect, selectedIndustry }) => {
  // Define industry-specific information
  const industries: Record<string, IndustryInfo> = {
    'financial-services': {
      name: 'Financial Services',
      description: 'Banking, insurance, investment management, and fintech companies.',
      keyFabricBenefits: [
        'Compliance oversight and governance',
        'Fraud detection through advanced analytics',
        'Real-time transaction data processing',
        'Customer 360 and personalization'
      ],
      specificConsiderations: [
        'Strict regulatory compliance and data sovereignty',
        'Transaction processing performance',
        'Risk management integration',
        'Legacy system integration'
      ],
      icon: 'fa-landmark',
      color: 'bg-indigo-100 border-indigo-300 text-indigo-800'
    },
    'healthcare': {
      name: 'Healthcare',
      description: 'Hospitals, clinics, medical research, pharmaceutical, and health insurance organizations.',
      keyFabricBenefits: [
        'Integration of clinical and operational data',
        'Protected health information (PHI) security',
        'Patient population analytics',
        'Medical research data warehousing'
      ],
      specificConsiderations: [
        'HIPAA compliance and patient privacy',
        'Integration with healthcare systems (Epic, Cerner)',
        'Clinical data taxonomies and terminologies',
        'Longitudinal patient data analytics'
      ],
      icon: 'fa-hospital',
      color: 'bg-red-100 border-red-300 text-red-800'
    },
    'manufacturing': {
      name: 'Manufacturing',
      description: 'Industrial manufacturing, equipment, consumer goods, and production companies.',
      keyFabricBenefits: [
        'IoT and sensor data processing',
        'Predictive maintenance analytics',
        'Supply chain optimization',
        'Quality control through data insights'
      ],
      specificConsiderations: [
        'OT/IT integration challenges',
        'Real-time monitoring requirements',
        'Machine learning for predictive maintenance',
        'Geographically distributed facilities'
      ],
      icon: 'fa-industry',
      color: 'bg-blue-100 border-blue-300 text-blue-800'
    },
    'retail': {
      name: 'Retail',
      description: 'Retail chains, e-commerce, consumer products, and distribution companies.',
      keyFabricBenefits: [
        'Customer behavior analysis',
        'Inventory and supply chain optimization',
        'Personalized marketing',
        'Omnichannel customer experience'
      ],
      specificConsiderations: [
        'Point of sale (POS) integration',
        'Seasonal data variability',
        'Customer journey analytics',
        'Multi-channel data integration'
      ],
      icon: 'fa-shopping-cart',
      color: 'bg-green-100 border-green-300 text-green-800'
    },
    'public-sector': {
      name: 'Public Sector',
      description: 'Government agencies, municipalities, educational institutions, and non-profits.',
      keyFabricBenefits: [
        'Citizen service optimization',
        'Transparent reporting and analytics',
        'Cross-agency data sharing',
        'Resource allocation optimization'
      ],
      specificConsiderations: [
        'Data sovereignty and security classification',
        'Compliance with government standards (FedRAMP)',
        'Legacy system integration',
        'Budget constraints and procurement cycles'
      ],
      icon: 'fa-university',
      color: 'bg-gray-100 border-gray-300 text-gray-800'
    },
    'energy': {
      name: 'Energy & Utilities',
      description: 'Oil & gas, electric utilities, renewable energy, and energy service companies.',
      keyFabricBenefits: [
        'Smart grid data analytics',
        'Energy consumption forecasting',
        'Asset performance optimization',
        'Regulatory compliance reporting'
      ],
      specificConsiderations: [
        'SCADA system integration',
        'IoT sensor data volume and velocity',
        'Geographical distribution of assets',
        'Energy market compliance requirements'
      ],
      icon: 'fa-bolt',
      color: 'bg-yellow-100 border-yellow-300 text-yellow-800'
    },
    'general': {
      name: 'General Business',
      description: 'Cross-industry standard assessment for organizations without specific industry requirements.',
      keyFabricBenefits: [
        'Unified data analytics platform',
        'Business intelligence integration',
        'Collaborative data environment',
        'Reduced total cost of ownership'
      ],
      specificConsiderations: [
        'Standard data integration patterns',
        'Business process optimization',
        'General compliance requirements',
        'IT alignment with business objectives'
      ],
      icon: 'fa-building',
      color: 'bg-purple-100 border-purple-300 text-purple-800'
    }
  };
  
  return (
    <div className="industry-selector p-6 bg-white rounded-xl shadow-md mb-8">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Select Your Industry</h2>
      <p className="text-gray-600 mb-6">
        Customize your Microsoft Fabric assessment to your specific industry's needs and priorities.
        This helps generate more targeted recommendations and accurate value estimations.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {Object.entries(industries).map(([key, industry]) => (
          <div 
            key={key}
            onClick={() => onIndustrySelect(key)}
            className={`cursor-pointer p-4 rounded-lg border-2 transition-all transform hover:scale-105 
                      ${selectedIndustry === key ? 'ring-2 ring-blue-500 border-blue-400' : 'border-gray-200'} 
                      ${industry.color}`}
          >
            <div className="flex items-center mb-2">
              <i className={`fas ${industry.icon} mr-2`}></i>
              <h3 className="font-semibold">{industry.name}</h3>
            </div>
          </div>
        ))}
      </div>
      
      {selectedIndustry && industries[selectedIndustry] && (
        <div className="selected-industry-details mt-6 p-5 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold mb-3">{industries[selectedIndustry].name} Considerations</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Key Microsoft Fabric Benefits</h4>
              <ul className="list-disc pl-5 space-y-1">
                {industries[selectedIndustry].keyFabricBenefits.map((benefit, index) => (
                  <li key={index} className="text-gray-700">{benefit}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Industry-Specific Considerations</h4>
              <ul className="list-disc pl-5 space-y-1">
                {industries[selectedIndustry].specificConsiderations.map((consideration, index) => (
                  <li key={index} className="text-gray-700">{consideration}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-500">
            <p>
              The assessment will adjust scoring and recommendations based on your industry selection.
              For example, {industries[selectedIndustry].name.toLowerCase()} organizations typically
              place higher emphasis on {industries[selectedIndustry].specificConsiderations[0].toLowerCase()}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndustrySelector;
