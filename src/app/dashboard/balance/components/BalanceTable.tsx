"use client";

import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { getBalancesService } from "../../../services/balanceService";
import { BalanceResponse } from "../../../types/balanceType";

import { useBalanceVisibility } from "@/app/context/BalanceHideShowContext";
import { useCurrency } from "@/app/context/CurrencyContext";
import { maskAmount } from "@/app/utils/maskAmount";

export default function BalanceTable({
  refreshTrigger,
}: {
  refreshTrigger?: number;
}) {
  const [balances, setBalances] = useState<BalanceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const { isVisible } = useBalanceVisibility();
  const { currency } = useCurrency();

  useEffect(() => {
    const fetchBalances = async () => {
      setLoading(true);

      try {
        const balance = await getBalancesService();

        // Convert single object to array for map()
        setBalances(balance ? [balance] : []);
      } catch (error) {
        console.error("Error fetching balances:", error);
        setBalances([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, [refreshTrigger]);

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <Table hoverable>
          <TableHead className="bg-gray-100 dark:bg-gray-700">
            <TableRow>
              <TableHeadCell>ID</TableHeadCell>
              <TableHeadCell>Master Opening Balance</TableHeadCell>
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
                <TableCell
                  colSpan={5}
                  className="text-center font-medium text-gray-500"
                >
                  No balances found
                </TableCell>
              </TableRow>
            ) : (
              balances.map((row) => (
                <TableRow
                  key={row.sn}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {row.sn}
                  </TableCell>

                  <TableCell>
                    {maskAmount(
                      Number(row.master_opening_balance),
                      isVisible,
                      currency,
                    )}
                  </TableCell>

                  <TableCell>
                    {maskAmount(
                      Number(row.opening_balance),
                      isVisible,
                      currency,
                    )}
                  </TableCell>

                  <TableCell>
                    {maskAmount(
                      Number(row.closing_balance),
                      isVisible,
                      currency,
                    )}
                  </TableCell>

                  <TableCell>{row.date}</TableCell>
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
              key={row.sn}
              className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 flex flex-col gap-3"
            >
              {/* Row 1: ID */}
              <div className="text-xs font-bold uppercase tracking-wider text-gray-800">
                ID {row.sn}
              </div>

              {/* Row 2: Date */}
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Date
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {row.date}
                </span>
              </div>

              {/* Row 3: Master Opening Balance */}
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Master Opening
                </span>
                <span className="text-sm font-bold text-gray-700">
                  {maskAmount(
                    Number(row.master_opening_balance),
                    isVisible,
                    currency,
                  )}
                </span>
              </div>

              {/* Row 4: Opening Balance */}
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Opening Balance
                </span>
                <span className="text-sm font-bold text-gray-800">
                  {maskAmount(Number(row.opening_balance), isVisible, currency)}
                </span>
              </div>

              {/* Row 5: Closing Balance */}
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <span className="text-xs font-semibold text-gray-500 uppercase">
                  Closing Balance
                </span>
                <span className="text-sm font-bold text-[#FFAA00]">
                  {maskAmount(Number(row.closing_balance), isVisible, currency)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
