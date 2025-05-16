import React, { createContext, useContext, useState, ReactNode } from "react";

type ModuleContextType = {
  moduleTitle: string;
  setModuleTitle: (title: string) => void;
};

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export const ModuleProvider = ({ children }: { children: ReactNode }) => {
  const [moduleTitle, setModuleTitle] = useState("");

  return (
    <ModuleContext.Provider value={{ moduleTitle, setModuleTitle }}>
      {children}
    </ModuleContext.Provider>
  );
};

export const useModule = () => {
  const context = useContext(ModuleContext);
  if (!context) {
    throw new Error("useModule must be used within a ModuleProvider");
  }
  return context;
};
