"use client";

import { FileInput, Label } from "flowbite-react";
import { useFileContext } from "../contexts/FileContext";

interface TableInputProps {
  regime: "primary" | "secondary";
  onFileUploaded?: (file: File) => void;
  className?: string;
}

export function TableInput({
  regime,
  onFileUploaded,
  className = "",
}: TableInputProps) {
  const { setPrimaryFile, setSecondaryFile } = useFileContext();

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      if (!file.name.endsWith(".xlsx")) {
        throw new Error("Только файлы .XLSX поддерживаются");
      }

      if (regime === "primary") {
        setPrimaryFile(file);
      } else {
        setSecondaryFile(file);
      }

      onFileUploaded?.(file);
    } catch (err) {
      alert(`Ошибка: ${err instanceof Error ? err.message : String(err)}`);
      event.target.value = "";
    }
  };

  const getUploadText = () => {
    return regime === "primary"
      ? "Загрузите исходную базу данных"
      : "Загрузите новую выгрузку данных";
  };

  return (
    <div className={`flex w-full items-center justify-center ${className}`}>
      <Label
        htmlFor={`dropzone-file-${regime}`}
        className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            className="mb-4 size-8 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">{getUploadText()}</span>
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Только .XLSX (Excel)
          </p>
        </div>
        <FileInput
          id={`dropzone-file-${regime}`}
          className="hidden"
          accept=".xlsx"
          onChange={handleFileChange}
        />
      </Label>
    </div>
  );
}
