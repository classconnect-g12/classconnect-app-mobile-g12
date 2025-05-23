import React, { createContext, useContext, useState, ReactNode } from "react";

type Variant = "success" | "error" | "info";

interface SnackbarState {
  visible: boolean;
  message: string;
  variant?: Variant;
  showSnackbar: (message: string, variant: Variant) => void;
  hideSnackbar: () => void;
}

const SnackbarContext = createContext<SnackbarState | undefined>(undefined);

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState<Variant>("info");

  const showSnackbar = (msg: string, varnt: Variant) => {
    setMessage(msg);
    setVariant(varnt);
    setVisible(true);
  };

  const hideSnackbar = () => {
    setVisible(false);
  };

  return (
    <SnackbarContext.Provider
      value={{ visible, message, variant, showSnackbar, hideSnackbar }}
    >
      {children}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};
