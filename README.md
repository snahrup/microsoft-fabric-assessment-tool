# Microsoft Fabric Assessment Tool

A comprehensive web-based tool to evaluate if Microsoft Fabric is the right solution for your organization's data and analytics needs. This tool analyzes your current infrastructure, data characteristics, Microsoft ecosystem investments, and business requirements to provide personalized recommendations.

## 📋 Overview

Microsoft Fabric is an all-in-one analytics solution that combines data engineering, data integration, data warehousing, and data science. This assessment tool helps organizations determine if Microsoft Fabric is the right fit for their specific needs by providing:

- A detailed suitability score
- Comparative analysis with alternative solutions
- Custom recommendations based on your specific situation
- Exportable reports for stakeholder presentations

## ✨ Features

- **Interactive Assessment Questionnaire**: Four-step evaluation process to gather all relevant information
- **Smart Scoring Algorithm**: Calculates a fabric suitability score based on 12+ factors
- **Results Dashboard**: Visual representation of your assessment results
- **Comparison Section**: Side-by-side comparison with alternative solutions
- **Report Generator**: Create and export detailed PDF reports
- **Modern UI**: Clean, responsive interface with Microsoft design language

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/microsoft-fabric-assessment-tool.git
cd microsoft-fabric-assessment-tool

# Install dependencies
npm install
```

### Running the App

```bash
npm run dev
```

This will start the development server at http://localhost:3000

### Building for Production

```bash
npm run build
```

The built application will be in the `dist` directory

## 🛠️ Project Structure

```
├── public/                 # Static assets
├── src/                    # Source code
│   ├── components/         # React components
│   │   ├── AssessmentForm.tsx     # Multi-step assessment form
│   │   ├── ComparisonSection.tsx  # Solution comparison component
│   │   ├── Header.tsx             # Application header
│   │   ├── ReportGenerator.tsx    # PDF report generator
│   │   ├── ResultsDashboard.tsx   # Results visualization
│   │   └── ToolTip.tsx            # Tooltip helper component
│   ├── App.css            # Application styles
│   ├── App.tsx            # Main application component
│   ├── index.css          # Global styles with Tailwind
│   └── main.tsx           # Application entry point
├── .gitignore             # Git ignore file
├── package.json           # Project dependencies and scripts
├── postcss.config.js      # PostCSS configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
└── README.md              # Project documentation
```

## 📊 Assessment Process

The assessment tool evaluates your organization on four key areas:

1. **Current Infrastructure**: Analyzes your existing data storage, processing, and infrastructure stack
2. **Data Characteristics**: Evaluates your data volume, variety, and processing requirements
3. **Microsoft Ecosystem**: Assesses your current Microsoft technology investments
4. **Business Requirements**: Reviews your budget constraints, time-to-value needs, and compliance requirements

## 🔧 Technologies Used

- React
- TypeScript
- Tailwind CSS
- Chart.js (for data visualization)
- HTML2Canvas & jsPDF (for report generation)
- Vite (for build tooling)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Microsoft Fabric documentation and resources
- React and TypeScript communities
