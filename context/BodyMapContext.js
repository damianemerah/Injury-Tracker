"use client";

import { createContext, useState, useContext, useEffect } from "react";

const InjuryContext = createContext();

const InjuryProvider = ({ children }) => {
  const [injuries, setInjuries] = useState([]);

  useEffect(() => {}, []);

  const addInjury = (injury) => {
    setInjuries([...injuries, injury]);
  };

  const deleteInjury = (id) => {
    setInjuries(injuries.filter((injury) => injury.id !== id));
  };

  const updateInjury = (id, updatedInjury) => {
    setInjuries(
      injuries.map((injury) => (injury.id === id ? updatedInjury : injury))
    );
  };

  return (
    <InjuryContext.Provider value={{ addInjury, deleteInjury, updateInjury }}>
      {children}
    </InjuryContext.Provider>
  );
};

function useInjury() {
  const context = useContext(InjuryContext);
  if (context === undefined) {
    throw new Error("useInjury must be used within a InjuryProvider");
  }
  return context;
}

export { useInjury, InjuryProvider };
