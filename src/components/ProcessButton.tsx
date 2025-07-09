"use client";

import { useState } from "react";
import { useFileContext } from "../contexts/FileContext";
import { mergeExcelFiles } from "../services/excelMerger";

export default function ProcessButton() {
  const { primaryFile, secondaryFile } = useFileContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProcess = async () => {
    if (!primaryFile || !secondaryFile) {
      setError("Пожалуйста, загрузите оба файла");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Используем нашу функцию для объединения
      const mergedFile = await mergeExcelFiles(primaryFile, secondaryFile);

      // Создаем URL для скачивания файла
      const url = window.URL.createObjectURL(mergedFile);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "processed_data.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Ошибка при обработке файлов:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleProcess}
        disabled={isLoading || !primaryFile || !secondaryFile}
        className={`w-full rounded-lg px-4 py-2 font-medium text-white ${
          isLoading || !primaryFile || !secondaryFile
            ? "cursor-not-allowed bg-gray-400"
            : "bg-sky-600 hover:bg-sky-700 dark:bg-sky-800 dark:hover:bg-sky-900"
        }`}
      >
        {isLoading ? "Обработка..." : "Обновить базу данных"}
      </button>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
