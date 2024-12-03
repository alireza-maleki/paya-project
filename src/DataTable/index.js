
import { useState } from "react";
import * as XLSX from "xlsx";

// Fake data for initial display
const fakeData = [
  { ID: 1, Name: "Ali", Age: 23, City: "Tehran" },
  { ID: 2, Name: "Sara", Age: 29, City: "Isfahan" },
  { ID: 3, Name: "Reza", Age: 35, City: "Shiraz" },
  { ID: 4, Name: "Neda", Age: 27, City: "Mashhad" },
];

export default function DataTable() {
  
  const [data, setData] = useState(fakeData);
  const [filteredData, setFilteredData] = useState(fakeData);
  const [searchTerm, setSearchTerm] = useState("");
  const [columnSearch, setColumnSearch] = useState({});

  // Handle Excel Import
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setData(jsonData);
      setFilteredData(jsonData); // Update filtered data as well
    };
    reader.readAsBinaryString(file);
  };

  // Handle Excel Export
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "data.xlsx");
  };

  // General Search
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();

    setSearchTerm(term);
    const filtered = data.filter((row) =>
      Object.values(row).some((val) =>
        val.toString().toLowerCase().includes(term)
      )
    );

    setFilteredData(filtered);
  };

  // Column-Specific Search
  const handleColumnSearch = (e, columnName) => {
    const value = e.target.value.toLowerCase();

    const updatedSearch = { ...columnSearch, [columnName]: value };
    setColumnSearch(updatedSearch);

    const filtered = data.filter((row) =>
      Object.keys(row).every((key) => {
        const columnFilter = updatedSearch[key] || "";
        return row[key]
          ?.toString()
          .toLowerCase()
          .includes(columnFilter.toLowerCase());
      })
    );

    setFilteredData(filtered);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <div className="relative">
          <label
            htmlFor="file-upload"
            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
          >
            آپلود فایل اکسل
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".xlsx, .xls, .xlsm"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
        <button
          onClick={handleExport}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          دانلود فایل اکسل
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="جستجوی کلی..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 border rounded shadow-sm"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white border-collapse border">
          <thead>
            {data.length > 0 && (
              <tr>
                {Object.keys(data[0]).map((column) => (
                  <th key={column} className="border px-4 py-2 bg-gray-200">
                    <div>
                      {column}
                      <input
                        type="text"
                        placeholder={`جستجو در ${column}`}
                        value={columnSearch[column] || ""}
                        onChange={(e) => handleColumnSearch(e, column)}
                        className="mt-1 w-full p-1 border rounded shadow-sm"
                      />
                    </div>
                  </th>
                ))}
              </tr>
            )}
          </thead>
          <tbody>
            {filteredData.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-100">
                {Object.entries(row).map(([key, value], colIndex) => (
                  <td key={colIndex} className="border px-4 py-2">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
