"use client";

import * as XLSX from "xlsx";

export async function mergeExcelFiles(
  primaryFile: File,
  secondaryFile: File,
): Promise<Blob> {
  // Чтение и парсинг файлов
  const [primaryWorkbook, secondaryWorkbook] = await Promise.all([
    readExcelFile(primaryFile),
    readExcelFile(secondaryFile),
  ]);

  // Извлечение данных
  const primarySheet = primaryWorkbook.Sheets[primaryWorkbook.SheetNames[0]];
  const secondarySheet =
    secondaryWorkbook.Sheets[secondaryWorkbook.SheetNames[0]];

  // Преобразование в JSON с учетом структуры
  const primaryData =
    XLSX.utils.sheet_to_json<Record<string, any>>(primarySheet); // не знаю, какой тип использовать кроме any
  const secondaryData =
    XLSX.utils.sheet_to_json<Record<string, any>>(secondarySheet);

  // Проверка структуры
  if (!primaryData.length || !secondaryData.length) {
    throw new Error("Один из файлов не содержит данных");
  }

  // Получаем заголовки из первого файла и нормализуем названия первых трех столбцов
  const primaryHeaders = [];
  const range = XLSX.utils.decode_range(primarySheet["!ref"] || "A1:Z1");
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cell = primarySheet[XLSX.utils.encode_cell({ r: range.s.r, c: C })];
    if (cell && cell.v) {
      // Для первых трех столбцов задаем конкретные названия
      if (C === range.s.c) {
        primaryHeaders.push("Поле для комментария");
      } else if (C === range.s.c + 1) {
        primaryHeaders.push("Поле для комментария_1");
      } else if (C === range.s.c + 2) {
        primaryHeaders.push("Поле для комментария_2");
      } else {
        primaryHeaders.push(cell.v);
      }
    }
  }

  // Создание карты для быстрого поиска по ключевым полям
  const primaryMap = new Map<string, any>();
  primaryData.forEach((row) => {
    const key = `${row["Регистрационный номер"]}_${row["СНИЛС"]}`;
    primaryMap.set(key, row);
  });

  // Объединение данных
  const mergedData = [...primaryData];

  secondaryData.forEach((secondaryRow) => {
    const key = `${secondaryRow["Регистрационный номер"]}_${secondaryRow["СНИЛС"]}`;

    if (!primaryMap.has(key)) {
      // Создаем новую запись с правильной структурой
      const newRow: Record<string, any> = {
        "Поле для комментария": "",
        "Поле для комментария_1": "",
        "Поле для комментария_2": "",
      };

      // Копируем остальные поля из secondaryRow
      for (const key in secondaryRow) {
        if (
          key !== "Поле для комментария" &&
          key !== "Поле для комментария_1" &&
          key !== "Поле для комментария_2"
        ) {
          newRow[key] = secondaryRow[key];
        }
      }

      mergedData.push(newRow);
    }
  });

  // Создание нового файла с сохранением порядка столбцов
  const newWorkbook = XLSX.utils.book_new();

  // Создаем новый лист с указанием заголовков
  const newSheet = XLSX.utils.json_to_sheet(mergedData, {
    header: primaryHeaders, // Явно указываем порядок столбцов
  });

  XLSX.utils.book_append_sheet(newWorkbook, newSheet, "Объединенные данные");

  // Генерация Blob
  const excelBuffer = XLSX.write(newWorkbook, {
    bookType: "xlsx",
    type: "array",
  });
  return new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

// Фунцкия для чтения файлов
async function readExcelFile(file: File): Promise<XLSX.WorkBook> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, {
          type: "array",
          cellStyles: true,
          sheetStubs: true,
        });
        resolve(workbook);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
