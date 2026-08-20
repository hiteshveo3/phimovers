const xlsx = require('xlsx');
const workbook = xlsx.readFile('PHI_Movers_SEO_Keyword_Intelligence_Database.xlsx');

function dumpFull(sheetName) {
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  console.log(`\n=== ${sheetName} ===`);
  data.forEach((row, i) => {
    console.log(`${i+1}: ${row[0]} | ${row[1]} | ${row[2]} | ${row[3]} | ${row[4]}`);
  });
}

dumpFull("09 New Service Opps");
