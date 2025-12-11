
import React, { createContext, useState, useContext, ReactNode } from 'react';

export type ModuleKey = 'market' | 'franchise' | 'invest' | 'jobs' | 'logistics' | 'insurance' | 'cpd' | 'events' | 'trade_assurance';

interface ModuleContextType {
  modules: Record<ModuleKey, boolean>;
  toggleModule: (key: ModuleKey) => void;
}

const DEFAULT_MODULES: Record<ModuleKey, boolean> = {
  market: true,
  franchise: true,
  invest: true,
  jobs: true,
  logistics: true,
  insurance: true,
  cpd: true,
  events: true,
  trade_assurance: true
};

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export const ModuleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modules, setModules] = useState<Record<ModuleKey, boolean>>(() => {
    try {
      const saved = localStorage.getItem('site_modules');
      return saved ? JSON.parse(saved) : DEFAULT_MODULES;
    } catch (e) {
      return DEFAULT_MODULES;
    }
  });

  const toggleModule = (key: ModuleKey) => {
    setModules(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem('site_modules', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <ModuleContext.Provider value={{ modules, toggleModule }}>
      {children}
    </ModuleContext.Provider>
  );
};

export const useModules = () => {
  const context = useContext(ModuleContext);
  if (!context) {
    throw new Error('useModules must be used within a ModuleProvider');
  }
  return context;
};
