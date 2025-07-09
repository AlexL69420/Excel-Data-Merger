"use client";

import { createContext, useContext, useState } from "react";

type FileContextType = {
  primaryFile: File | null;
  secondaryFile: File | null;
  setPrimaryFile: (file: File | null) => void;
  setSecondaryFile: (file: File | null) => void;
  clearFiles: () => void;
};

const FileContext = createContext<FileContextType | undefined>(undefined);

export function FileProvider({ children }: { children: React.ReactNode }) {
  const [primaryFile, setPrimaryFile] = useState<File | null>(null);
  const [secondaryFile, setSecondaryFile] = useState<File | null>(null);

  const clearFiles = () => {
    setPrimaryFile(null);
    setSecondaryFile(null);
  };

  return (
    <FileContext.Provider
      value={{
        primaryFile,
        secondaryFile,
        setPrimaryFile,
        setSecondaryFile,
        clearFiles,
      }}
    >
      {children}
    </FileContext.Provider>
  );
}

export function useFileContext() {
  const context = useContext(FileContext);
  if (context === undefined) {
    throw new Error("useFileContext must be used within a FileProvider");
  }
  return context;
}
