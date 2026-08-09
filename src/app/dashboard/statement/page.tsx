"use client";

import { useState } from "react";
import { Home } from "lucide-react";
import { toast } from "react-toastify";

import SimpleDateFilter from "./components/SimpleDateFilter";
import StatementTable from "./components/StatementTable";
import { getStatementByDateRangeService } from "@/app/services/statementService";
import {
  StatementEntry,
  StatementResponse,
  CurrencyInfo,
} from "@/app/types/statementType";
import { downloadService } from "@/app/services/downloadService";

function StatementOfAccount() {
  const [statementData, setStatementData] = useState<StatementEntry[]>([]);
  const [currency, setCurrency] = useState<CurrencyInfo>({
    country: "Nepal",
    currency: "NPR",
    symbol: "रु",
  });
  const [openingBalance, setOpeningBalance] = useState<number>(0);
  const [closingBalance, setClosingBalance] = useState<number>(0);

  const handleFilter = async (
    data: any,
    startDate?: string,
    endDate?: string,
  ) => {
    // The data parameter will be the full StatementResponse from the service
    if (data && typeof data === "object" && "data" in data) {
      const response = data as StatementResponse;
      setStatementData(response.data || []);
      setCurrency(response.currency);
      setOpeningBalance(response.opening_balance);
      setClosingBalance(response.closing_balance);
    }
  };

  // Prepare data for download (flatten the structure)
  const prepareDownloadData = () => {
    return statementData.map((entry) => ({
      date: entry.date,
      description: entry.description,
      type: entry.type,
      credit: entry.credit,
      debit: entry.debit,
      balance: entry.balance,
    }));
  };

  return (
    <div className="">
      <div className="flex items-center gap-1 text-md mb-1 md:mb-4 mt-4">
        <Home className="w-4 h-4" />
        <span>/Statement of Account</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h1 className="text-2xl font-bold">Statement of Account</h1>
      </div>

      <SimpleDateFilter
        initialFrom={
          new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
        initialTo={new Date()}
        fetchService={getStatementByDateRangeService}
        onFilter={handleFilter}
        onDownloadPDF={() => {
          if (statementData.length === 0) {
            toast.warning(
              "No data to download. Please apply filters or wait for data to load.",
            );
            return;
          }
          const downloadData = prepareDownloadData();
          downloadService.downloadPDF(
            downloadData,
            [
              { header: "Date", field: "date" },
              { header: "Description", field: "description" },
              { header: "Type", field: "type" },
              { header: "Credit", field: "credit" },
              { header: "Debit", field: "debit" },
              { header: "Balance", field: "balance" },
            ],
            "Statement_of_Account",
          );
        }}
        onDownloadExcel={() => {
          if (statementData.length === 0) {
            toast.warning(
              "No data to download. Please apply filters or wait for data to load.",
            );
            return;
          }
          const downloadData = prepareDownloadData();
          downloadService.downloadExcel(
            downloadData,
            [
              { header: "Date", field: "date" },
              { header: "Description", field: "description" },
              { header: "Type", field: "type" },
              { header: "Credit", field: "credit" },
              { header: "Debit", field: "debit" },
              { header: "Balance", field: "balance" },
            ],
            "Statement_of_Account",
          );
        }}
      />

      <StatementTable
        data={statementData}
        currency={currency}
        openingBalance={openingBalance}
        closingBalance={closingBalance}
      />
    </div>
  );
}

export default StatementOfAccount;
