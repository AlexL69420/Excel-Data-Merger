"use client";
import { FileProvider } from "./contexts/FileContext";
import { TableInput } from "./components/FileInput";
import ProcessButton from "./components/ProcessButton";

export default function App() {
  return (
    <FileProvider>
      <main className="flex min-h-screen flex-col items-center gap-2 bg-sky-200 p-4 dark:bg-sky-950">
        <h1 className="text-2xl font-bold text-sky-800 dark:text-sky-200">
          Обновление базы данных абитуриентов
        </h1>

        <div className="flex w-full max-w-4xl flex-col gap-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-sky-700 dark:text-sky-300">
              Исходная база данных
            </h2>
            <TableInput regime="primary" />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-sky-700 dark:text-sky-300">
              Новая выгрузка данных
            </h2>
            <TableInput regime="secondary" />
          </div>

          <ProcessButton />
        </div>
      </main>
    </FileProvider>
  );
}
