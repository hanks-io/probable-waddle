import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Google Sheets API 配置
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, 'i18n-for-loacal.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = '1Tb3-eluwOEweEjlGNCwZ_0wuMX_ue675PrD6ErQ4RG8';
const SHEET_NAME = '多语言翻译-App';

// 将扁平化的key还原为嵌套对象
function unflattenObject(flatData: Record<string, string>): Record<string, any> {
  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(flatData)) {
    const parts = key.split('.');
    let current = result;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }

    current[parts[parts.length - 1]] = value;
  }

  return result;
}

// 从表头提取语言代码（小括号内的值）
function extractLanguageCode(header: string): string {
  const match = header.match(/\(([^)]+)\)/);
  if (match && match[1]) {
    return match[1];
  }
  throw new Error(`无法从表头 "${header}" 中提取语言代码，请确保格式为 "Language (code)"`);
}

// 从表格生成语言JSON文件
async function sheetToLanguageJsonFiles() {
  try {
    // 读取Sheet数据
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:Z`, // 支持中文Sheet名称
    });

    const values = response.data.values || [];
    if (values.length === 0) {
      console.log(`Sheet ${SHEET_NAME} 为空，无数据可转换`);
      return;
    }

    const headers = values[0]; // 第一行是表头
    const rows = values.slice(1); // 后续行是数据

    if (headers[0] !== 'Key') {
      throw new Error('表格第一列必须是 "Key"');
    }

    // 为每种语言生成数据
    const languageData: Record<string, Record<string, string>> = {};
    for (let col = 1; col < headers.length; col++) {
      const language = extractLanguageCode(headers[col]);
      languageData[language] = {};
    }

    // 填充每种语言的键值对
    for (const row of rows) {
      const key = row[0];
      if (!key) continue;

      for (let col = 1; col < headers.length; col++) {
        const language = extractLanguageCode(headers[col]);
        const value = row[col] || '';
        if (value) {
          languageData[language][key] = value;
        }
      }
    }

    // 确保输出目录存在
    const outputDir = path.join(__dirname, 'locales');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 为每种语言生成JSON文件
    for (const [language, flatData] of Object.entries(languageData)) {
      if (Object.keys(flatData).length === 0) {
        console.log(`语言 ${language} 无数据，跳过`);
        continue;
      }

      const nestedData = unflattenObject(flatData);
      const outputFile = path.join(outputDir, `${language}.json`);
      fs.writeFileSync(outputFile, JSON.stringify(nestedData, null, 2), 'utf-8');
      console.log(`成功生成JSON文件：${outputFile}`);
    }

  } catch (error) {
    console.error('生成JSON失败：', error);
  }
}

// 执行
sheetToLanguageJsonFiles();
