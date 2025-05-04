import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="fabric-header shadow-lg">
      <div className="container">
        <h1 className="text-4xl font-bold mb-3 drop-shadow-md">Microsoft Fabric Suitability Assessment</h1>
        <p className="text-xl font-medium drop-shadow-sm">
          Discover if Microsoft Fabric is the right solution for your organization's 
          analytics and data management needs
        </p>
      </div>
    </header>
  );
};

export default Header;