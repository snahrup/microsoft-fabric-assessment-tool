import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="fabric-header">
      <div className="container">
        <h1 className="text-3xl font-bold mb-2">Microsoft Fabric Suitability Assessment</h1>
        <p className="text-xl">
          Discover if Microsoft Fabric is the right solution for your organization's 
          analytics and data management needs
        </p>
      </div>
    </header>
  );
};

export default Header;