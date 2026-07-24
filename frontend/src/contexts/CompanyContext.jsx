import React, { createContext, useContext, useState } from 'react';

const CompanyContext = createContext(null);

export const CompanyProvider = ({ children }) => {
  const [companyInfo, setCompanyInfo] = useState(null);

  const updateCompanyInfo = (info) => {
    setCompanyInfo((prev) => ({ ...prev, ...info }));
  };

  return (
    <CompanyContext.Provider value={{ companyInfo, setCompanyInfo, updateCompanyInfo }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompanyContext = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompanyContext must be used within a CompanyProvider');
  }
  return context;
};
