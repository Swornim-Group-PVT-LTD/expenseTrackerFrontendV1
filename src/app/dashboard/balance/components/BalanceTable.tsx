"use client";

import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { getBalancesService } from "../../../services/balanceService";
import { BalanceResponse } from "../../../types/balanceType";

export default function BalanceTable({ refreshTrigger }: { refreshTrigger?: number }) {
  const [balances, setBalances] = useState<BalanceResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalances = async () => {
      setLoading(true);
      try {
        const data = await getBalancesService(); // returns BalanceResponse[]
        setBalances(data);
      } catch (error) {
        console.error("Error fetching balances:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, [refreshTrigger]);

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <Table striped>
          <TableHead className="text-lg">
            <TableRow>
              <TableHeadCell>ID</TableHeadCell>
              <TableHeadCell>Balance</TableHeadCell>
              <TableHeadCell>Opening Balance</TableHeadCell>
              <TableHeadCell>Closing Balance</TableHeadCell>
              <TableHeadCell>Date</TableHeadCell>
            </TableRow>
          </TableHead>

          <TableBody className="divide-y">
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center font-medium text-gray-500"
                >
                  <ClipLoader size={22} color="#000000" />
                </TableCell>
              </TableRow>
            ) : balances.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center font-medium text-gray-500">
                  No balances found
                </TableCell>
              </TableRow>
            ) : (
              balances.map((row) => (
                <TableRow
                  key={row.id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {row.sn}
                  </TableCell>
                  <TableCell>{row.currency?.symbol} {Number(row.total_balance).toLocaleString()}</TableCell>
                  <TableCell>{row.currency?.symbol} {Number(row.add_opening_balance).toLocaleString()}</TableCell>
                  <TableCell>{row.currency?.symbol} {Number(row.closing_balance).toLocaleString()}</TableCell>
                  <TableCell>{row.created_date}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {loading ? (
          <div className="text-center font-medium text-gray-500">
            <ClipLoader size={22} color="#000000" />
          </div>
        ) : balances.length === 0 ? (
          <div className="text-center font-medium text-gray-500">
            No balances found
          </div>
        ) : (
          balances.map((row) => (
            <div
              key={row.id}
              className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 flex flex-col gap-2"
            >
              {/* Row 1: ID and Date */}
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                <span className="text-gray-800">
                  ID {row.sn}
                </span>
                <span className="text-gray-500">
                  {row.created_date}
                </span>
              </div>

              {/* Row 2: Opening Balance and Total Balance */}
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 font-semibold uppercase">Opening</span>
                  <span className="text-sm font-bold text-gray-700">
                    {row.currency?.symbol} {Number(row.add_opening_balance).toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-gray-400 font-semibold uppercase">Total Balance</span>
                  <span className="text-sm font-bold text-gray-800">
                    {row.currency?.symbol} {Number(row.total_balance).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Row 3: Closing Balance */}
              <div className="flex justify-end pt-1 border-t border-gray-50">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] text-gray-400 font-semibold uppercase">Closing</span>
                  <span className="text-sm font-bold text-[#FFAA00]">
                    {row.currency?.symbol} {Number(row.closing_balance).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
