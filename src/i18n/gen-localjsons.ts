import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 设置 Google Sheets API
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const SPREADSHEET_ID = '1Tb3-eluwOEweEjlGNCwZ_0wuMX_ue675PrD6ErQ4RG8';
const RANGE = 'A1:Z'; // 扩大范围以包含更多列

// 定义语言映射
const languageMapping: { [key: string]: string } = {
  '中文（zh-CN）': 'zh_CN',
  '英语（en-US）': 'en_US',
  '葡萄牙语（pt-BR）': 'pt_BR',
  '印尼语（Indonesia）': 'id_ID',
  '印地语（hi-IN）': 'hi_IN',
  // 添加其他语言映射...
};

function padNumber(num: number): string {
  return num.toString().padStart(6, '0');
}

async function processSheet(sheets: any, sheetName: string) {
  console.log(`Processing sheet: ${sheetName}`);

  const fullRange = `${sheetName}!${RANGE}`;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: fullRange,
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    console.log(`No data found in sheet: ${sheetName}`);
    return {};
  }

  const languages = rows[0];
  const translations: { [lang: string]: { [key: string]: string } } = {};

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length === 0 || !row[0]) continue;

    const newKey = padNumber(i);

    for (let j = 0; j < row.length; j++) {
      const langName = languages[j];
      const lang = languageMapping[langName] || langName;
      if (!translations[lang]) {
        translations[lang] = {};
      }
      translations[lang][newKey] = row[j] || row[0];
    }
  }

  return translations;
}

async function main(sheetName?: string, scopeName?: string) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(__dirname, 'i18n-for-loacal.json'),
      scopes: SCOPES,
    });

    const sheets = google.sheets({ version: 'v4', auth });

    let allTranslations: { [lang: string]: { [key: string]: string } } = {};

    if (sheetName) {
      allTranslations = await processSheet(sheets, sheetName);
    } else {
      const sheetsResponse = await sheets.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID,
      });

      const allSheets = sheetsResponse.data.sheets;
      if (!allSheets) {
        throw new Error('No sheets found in the spreadsheet');
      }

      for (const sheet of allSheets) {
        const sheetName = sheet.properties?.title;
        if (!sheetName) continue;

        const sheetTranslations = await processSheet(sheets, sheetName);
        for (const lang in sheetTranslations) {
          if (!allTranslations[lang]) allTranslations[lang] = {};
          Object.assign(allTranslations[lang], sheetTranslations[lang]);
        }
      }
    }

    const outputDir = path.join(__dirname, 'jsons');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const localesDir = path.join(__dirname, 'locales');
    if (!fs.existsSync(localesDir)) {
      fs.mkdirSync(localesDir, { recursive: true });
    }

    for (const lang in allTranslations) {
      if (Object.keys(allTranslations[lang]).length > 0) {
        // 写入 jsons 目录
        const jsonFilename = path.join(outputDir, `${lang}.json`);
        fs.writeFileSync(jsonFilename, JSON.stringify(allTranslations[lang], null, 2));

        // 合并到 locales 目录
        const localeFilename = path.join(localesDir, `${lang}.json`);
        let existingTranslations = {};
        if (fs.existsSync(localeFilename)) {
          const existingContent = fs.readFileSync(localeFilename, 'utf-8');
          existingTranslations = JSON.parse(existingContent);
        }
        if (scopeName) {
          // 合并新旧翻译
          const mergedTranslations = { ...existingTranslations, [scopeName]: allTranslations[lang] }
          // 写入合并后的翻译
          fs.writeFileSync(localeFilename, JSON.stringify(mergedTranslations, null, 2));
          console.log(`Merged translations for ${lang} in ${localeFilename}`);
        }

      }
    }

    console.log('All translations processed and merged successfully');

  } catch (error) {
    console.error('Error:', error);
  }
}

// 从命令行参数获取 sheet 名称
const sheetName = process.argv[2];
const scopeName = process.argv[3];
main(sheetName, scopeName);
