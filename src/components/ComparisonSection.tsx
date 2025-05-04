import React, { useState } from 'react';
import { AssessmentData } from '../App';

interface ComparisonSectionProps {
  assessmentData: AssessmentData;
  fabricScore: number;
  onContinue: () => void;
}

interface CompetitorScore {
  name: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
}

const ComparisonSection: React.FC<ComparisonSectionProps> = ({ assessmentData, fabricScore, onContinue }) => {
  // Calculate competitor scores based on assessment data
  const calculateCompetitorScores = (): CompetitorScore[] => {
    // AWS score calculation
    let awsScore = 65; // Base score
    if (assessmentData.currentInfrastructure.includes('AWS')) awsScore += 15;
    if (assessmentData.dataWarehouseSolution === 'AWS Redshift') awsScore += 10;
    if (assessmentData.realTimeNeeds > 7) awsScore += 5;
    if (assessmentData.microsoftInvestments.length < 2) awsScore += 10;
    awsScore = Math.min(100, Math.max(0, awsScore));
    
    // Snowflake score calculation
    let snowflakeScore = 70; // Base score
    if (assessmentData.dataVolume > 7) snowflakeScore += 10;
    if (assessmentData.dataWarehouseSolution === 'Snowflake') snowflakeScore += 15;
    if (assessmentData.budgetConstraint > 7) snowflakeScore += 5; // Higher budget = better for Snowflake
    if (assessmentData.microsoftInvestments.length < 3) snowflakeScore += 5;
    snowflakeScore = Math.min(100, Math.max(0, snowflakeScore));
    
    // Databricks score calculation
    let databricksScore = 60; // Base score
    if (assessmentData.dataTypes.includes('Semi-structured (JSON, XML)')) databricksScore += 10;
    if (assessmentData.dataTypes.includes('Unstructured (documents, emails)')) databricksScore += 10;
    if (assessmentData.realTimeNeeds > 8) databricksScore += 10;
    if (assessmentData.budgetConstraint > 6) databricksScore += 5; // Higher budget = better for Databricks
    databricksScore = Math.min(100, Math.max(0, databricksScore));
    
    // On-premise solution score calculation
    let onPremiseScore = 40; // Base score
    if (assessmentData.currentInfrastructure.includes('On-premises servers')) onPremiseScore += 15;
    if (assessmentData.dataSovereigntyNeeds > 8) onPremiseScore += 15;
    if (assessmentData.complianceRequirements.length > 3) onPremiseScore += 10;
    if (assessmentData.budgetConstraint < 4) onPremiseScore -= 10; // Lower budget = worse for on-premise
    onPremiseScore = Math.min(100, Math.max(0, onPremiseScore));
    
    return [
      {
        name: 'AWS',
        score: awsScore,
        strengths: [
          'Comprehensive cloud ecosystem',
          'Strong market presence',
          'Wide range of specialized services',
          'Global infrastructure'
        ],
        weaknesses: [
          'Less integrated with Microsoft products',
          'Can require more specialized skills',
          'Potential higher costs for complex scenarios',
          'Less unified experience than Fabric'
        ]
      },
      {
        name: 'Snowflake',
        score: snowflakeScore,
        strengths: [
          'Excellent data warehouse solution',
          'Cloud-agnostic deployment',
          'Separation of storage and compute',
          'Strong data sharing capabilities'
        ],
        weaknesses: [
          'Less integrated with Microsoft products',
          'Not a comprehensive analytics platform',
          'Can be expensive at scale',
          'Limited native ETL capabilities'
        ]
      },
      {
        name: 'Databricks',
        score: databricksScore,
        strengths: [
          'Excellent for complex data science',
          'Strong Spark-based processing',
          'Good for unstructured data',
          'Advanced ML capabilities'
        ],
        weaknesses: [
          'Steeper learning curve',
          'Can be more expensive',
          'Less integrated with Microsoft ecosystem',
          'Less comprehensive than Fabric'
        ]
      },
      {
        name: 'On-Premise',
        score: onPremiseScore,
        strengths: [
          'Complete data sovereignty control',
          'Can be more cost-effective long-term',
          'No internet dependency',
          'Potential for higher security'
        ],
        weaknesses: [
          'Higher upfront investment',
          'Maintenance overhead',
          'Scaling difficulties',
          'Less modern capabilities'
        ]
      }
    ];
  };
  
  const [competitors] = useState<CompetitorScore[]>(calculateCompetitorScores());
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>('AWS');
  
  // Get the selected competitor details
  const getSelectedCompetitor = () => {
    return competitors.find(c => c.name === selectedCompetitor) || competitors[0];
  };
  
  // Get recommendation text based on comparison
  const getComparisonRecommendation = () => {
    const selected = getSelectedCompetitor();
    
    if (fabricScore > selected.score + 15) {
      return `Microsoft Fabric appears to be a significantly better fit than ${selected.name} for your specific needs, primarily due to your existing Microsoft investments and requirements alignment.`;
    } else if (fabricScore > selected.score) {
      return `Microsoft Fabric appears to be a somewhat better fit than ${selected.name} for your organization, though the difference is not dramatic. Consider evaluating specific capabilities that are most important to you.`;
    } else if (fabricScore + 15 < selected.score) {
      return `${selected.name} appears to be a significantly better fit than Microsoft Fabric for your specific needs. Consider your specific use cases and long-term strategy when making a decision.`;
    } else {
      return `Both Microsoft Fabric and ${selected.name} could work for your organization with similar expected outcomes. Your specific priorities and use cases should guide your final decision.`;
    }
  };
  
  return (
    <div className="container">
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Comparative Analysis</h2>
        <p className="mb-6">
          Compare Microsoft Fabric with alternative solutions based on your organization's specific needs.
        </p>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Solution Fit Scores</h3>
          <div className="relative h-24 bg-gray-200 rounded-lg">
            {/* Score comparison bars */}
            <div className="absolute left-0 top-0 h-full bg-primary text-white"
                 style={{ width: `${fabricScore}%` }}>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 font-bold">
                Microsoft Fabric: {Math.round(fabricScore)}
              </div>
            </div>
            
            {/* Competitor scores - these are positioned below the main score */}
            {competitors.map((competitor, index) => (
              <div key={competitor.name} 
                   className={`absolute left-0 ${selectedCompetitor === competitor.name ? 'bg-accent' : 'bg-gray-400'} text-white transition-all duration-300`}
                   style={{ width: `${competitor.score}%`, top: `${index * 6 + 24}px`, height: '24px' }}
                   onClick={() => setSelectedCompetitor(competitor.name)}>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm font-bold">
                  {competitor.name}: {Math.round(competitor.score)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center space-x-4 mt-4">
            {competitors.map(competitor => (
              <button 
                key={competitor.name}
                className={`px-4 py-2 rounded ${selectedCompetitor === competitor.name ? 'bg-accent text-white' : 'bg-gray-200'}`}
                onClick={() => setSelectedCompetitor(competitor.name)}>
                {competitor.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Microsoft Fabric */}
          <div className="comparison-card shadow-md rounded-lg p-6 bg-white">
            <h3 className="text-xl font-semibold mb-3 text-primary">Microsoft Fabric</h3>
            <div className="text-center text-4xl font-bold mb-3">{Math.round(fabricScore)}</div>
            
            <h4 className="font-semibold text-success mb-2">Strengths</h4>
            <ul className="list-disc pl-5 mb-4">
              <li>Unified analytics platform</li>
              <li>Seamless Power BI integration</li>
              <li>Microsoft ecosystem synergy</li>
              <li>OneLake data storage efficiency</li>
              <li>Simplified governance</li>
            </ul>
            
            <h4 className="font-semibold text-danger mb-2">Challenges</h4>
            <ul className="list-disc pl-5">
              <li>Relatively new platform</li>
              <li>Microsoft-centric approach</li>
              <li>Evolving feature set</li>
              <li>Cloud-only solution</li>
            </ul>
          </div>
          
          {/* Selected competitor */}
          <div className="comparison-card shadow-md rounded-lg p-6 bg-white">
            <h3 className="text-xl font-semibold mb-3 text-accent">{getSelectedCompetitor().name}</h3>
            <div className="text-center text-4xl font-bold mb-3">{Math.round(getSelectedCompetitor().score)}</div>
            
            <h4 className="font-semibold text-success mb-2">Strengths</h4>
            <ul className="list-disc pl-5 mb-4">
              {getSelectedCompetitor().strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
            
            <h4 className="font-semibold text-danger mb-2">Challenges</h4>
            <ul className="list-disc pl-5">
              {getSelectedCompetitor().weaknesses.map((weakness, index) => (
                <li key={index}>{weakness}</li>
              ))}
            </ul>
          </div>
          
          {/* Recommendation */}
          <div className="recommendation-card shadow-md rounded-lg p-6 bg-gray-50">
            <h3 className="text-xl font-semibold mb-3">Analysis</h3>
            <p className="mb-4">{getComparisonRecommendation()}</p>
            
            <h4 className="font-semibold mb-2">Consider Microsoft Fabric if:</h4>
            <ul className="list-disc pl-5 mb-4">
              <li>You have significant Microsoft investments</li>
              <li>Power BI is central to your analytics</li>
              <li>You want a unified platform experience</li>
              <li>You need simplified governance</li>
              <li>You prefer a single vendor solution</li>
            </ul>
            
            <h4 className="font-semibold mb-2">Consider {getSelectedCompetitor().name} if:</h4>
            <ul className="list-disc pl-5">
              {getSelectedCompetitor().name === 'AWS' && (
                <>
                  <li>You're already heavily invested in AWS</li>
                  <li>You need specialized AWS services</li>
                  <li>You prefer more granular service selection</li>
                </>
              )}
              {getSelectedCompetitor().name === 'Snowflake' && (
                <>
                  <li>You need a cloud-agnostic solution</li>
                  <li>Data sharing is a primary requirement</li>
                  <li>You need pure data warehouse performance</li>
                </>
              )}
              {getSelectedCompetitor().name === 'Databricks' && (
                <>
                  <li>Advanced ML/AI is your primary focus</li>
                  <li>You need deep data science capabilities</li>
                  <li>You're heavily invested in Spark</li>
                </>
              )}
              {getSelectedCompetitor().name === 'On-Premise' && (
                <>
                  <li>Data sovereignty is non-negotiable</li>
                  <li>You have strict air-gap requirements</li>
                  <li>You have existing datacenter investments</li>
                </>
              )}
            </ul>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button onClick={onContinue} className="bg-primary text-white py-2 px-4 rounded">
            Generate Detailed Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComparisonSection;