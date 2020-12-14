import XLSX from "xlsx";

export default function exportExcel(data) {
  var ws = XLSX.utils.json_to_sheet(data);
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "People");
  XLSX.writeFile(wb, "sheetjs.xlsx");
}
