#!/usr/bin/env node

import { figma_orgchart_helper } from './figma-orgchart-helper.mjs';
async function readExcelFile(filePath) {
    const XLSX = await import('xlsx').then(module => module.default || module);

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    return data;
}

const excel_as_json = await readExcelFile('test-file.xlsx');

console.dir(figma_orgchart_helper(excel_as_json), { depth: null, colors: true });
