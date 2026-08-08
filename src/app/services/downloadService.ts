import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export const downloadService = {
  downloadPDF: (
    data: any[],
    columns: { header: string; field: string }[],
    fileName: string
  ) => {
    const doc = new jsPDF();
    doc.text(fileName, 14, 10);

    const tableColumn = columns.map((col) => col.header);
    const tableRows = data.map((row) =>
      columns.map((col) => row[col.field] ?? "")
    );

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save(`${fileName}.pdf`);
  },

  downloadExcel: (
    data: any[],
    columns: { header: string; field: string }[],
    fileName: string
  ) => {
    const excelData = data.map((row) => {
      const obj: any = {};
      columns.forEach((col) => {
        obj[col.header] = row[col.field];
      });
      return obj;
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  },
};
