"use client";

import React from "react";
import { StatementEntry, GroupedStatement, CurrencyInfo } from "@/app/types/statementType";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";

interface StatementTableProps {
  data: StatementEntry[];
  currency: CurrencyInfo;
  openingBalance: number;
  closingBalance: number;
}

export default function StatementTable({
  data,
  currency,
  openingBalance,
  closingBalance
}: StatementTableProps) {

  // Group transactions by date
  const groupByDate = (entries: StatementEntry[]): GroupedStatement[] => {
    const grouped: { [key: string]: StatementEntry[] } = {};

    entries.forEach(entry => {
      if (!grouped[entry.date]) {
        grouped[entry.date] = [];
      }
      grouped[entry.date].push(entry);
    });

    // Convert to array and calculate opening/closing balances for each date
    const result: GroupedStatement[] = [];
    const sortedDates = Object.keys(grouped).sort((a, b) =>
      new Date(a).getTime() - new Date(b).getTime()
    );

    sortedDates.forEach(date => {
      const transactions = grouped[date];
      const opening = transactions[0]?.balance -
        (transactions[0]?.credit || 0) +
        (transactions[0]?.debit || 0);
      const closing = transactions[transactions.length - 1]?.balance;

      result.push({
        date,
        opening_balance: opening,
        closing_balance: closing,
        transactions
      });
    });

    return result;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    if (amount === 0) return "—";
    return `${currency.symbol} ${amount.toLocaleString()}`;
  };

  const groupedData = groupByDate(data);

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">

            {/* Currency Info Header */}
            <div className="bg-[var(--color2)] text-white px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">Account Statement</h2>
                  <p className="text-sm  mt-1">Currency: {currency.currency} ({currency.symbol}) - {currency.country}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">Opening Balance</p>
                  <p className="text-2xl font-bold">{formatAmount(openingBalance)}</p>
                </div>
              </div>
            </div>

            <Table className="min-w-[800px]">
              <TableHead className="bg-gray-50">
                <TableRow>
                  <TableHeadCell className="text-sm font-semibold">Date</TableHeadCell>
                  <TableHeadCell className="text-sm font-semibold">Particulars</TableHeadCell>
                  <TableHeadCell className="text-sm font-semibold text-right">Credit (+)</TableHeadCell>
                  <TableHeadCell className="text-sm font-semibold text-right">Debit (−)</TableHeadCell>
                  <TableHeadCell className="text-sm font-semibold text-right">Balance</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody className="divide-y">
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center font-medium text-gray-500 py-8"
                    >
                      No transactions found for the selected period
                    </TableCell>
                  </TableRow>
                ) : (
                  groupedData.map((group, groupIndex) => (
                    <React.Fragment key={`group-${group.date}-${groupIndex}`}>
                      {/* Date Header Row */}
                      <TableRow className="bg-[var(--color1)] border-t-2 border-[var(--color2)] text-white">
                        <TableCell colSpan={5} className="py-3">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-white text-white rounded-full text-sm font-bold">
                              📅
                            </span>
                            <span className="text-base font-bold">
                              Date: {formatDate(group.date)}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>

                      {/* Opening Balance Row */}
                      <TableRow className="bg-green-50">
                        <TableCell className="text-sm text-gray-600">{formatDate(group.date)}</TableCell>
                        <TableCell className="font-semibold text-gray-800">Opening Balance</TableCell>
                        <TableCell className="text-right">—</TableCell>
                        <TableCell className="text-right">—</TableCell>
                        <TableCell className="text-right font-bold text-green-700">
                          {formatAmount(group.opening_balance)}
                        </TableCell>
                      </TableRow>

                      {/* Transaction Rows */}
                      {group.transactions.map((entry, index) => (
                        <TableRow
                          key={`${entry.id}-${index}`}
                          className="bg-white hover:bg-gray-50 transition-colors"
                        >
                          <TableCell className="text-sm text-gray-600">
                            {formatDate(entry.date)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">{entry.description}</span>
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${entry.type.toLowerCase() === 'income'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                                }`}>
                                {entry.type}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-semibold text-green-600">
                            {entry.credit > 0 ? formatAmount(entry.credit) : "—"}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-red-600">
                            {entry.debit > 0 ? formatAmount(entry.debit) : "—"}
                          </TableCell>
                          <TableCell className={`text-right font-bold ${entry.balance >= 0 ? 'text-green-700' : 'text-red-700'
                            }`}>
                            {entry.type.toLowerCase() === 'expense' && entry.balance !== 0 ? '- ' : ''}{formatAmount(entry.balance)}
                          </TableCell>
                        </TableRow>
                      ))}

                      {/* Closing Balance Row */}
                      <TableRow className="bg-yellow-50 border-b-2 border-yellow-200">
                        <TableCell className="text-sm text-gray-600"></TableCell>
                        <TableCell className="font-semibold text-gray-800">Closing Balance</TableCell>
                        <TableCell className="text-right">—</TableCell>
                        <TableCell className="text-right">—</TableCell>
                        <TableCell className="text-right font-bold text-yellow-700">
                          {formatAmount(group.closing_balance)}
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Footer with Final Closing Balance */}
            {data.length > 0 && (
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-green-100">Final Closing Balance</p>
                    <p className="text-xs text-green-200 mt-1">As of {formatDate(groupedData[groupedData.length - 1]?.date || new Date().toISOString())}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold">{formatAmount(closingBalance)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-6">
        {/* Currency Info Card */}
        <div className="bg-gradient-to-r from-[var(--color2)] to-yellow-600 text-white rounded-lg shadow-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-bold">Account Statement</h2>
              <p className="text-xs text-yellow-100 mt-1">{currency.currency} ({currency.symbol})</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-yellow-100">Opening</p>
              <p className="text-xl font-bold">{formatAmount(openingBalance)}</p>
            </div>
          </div>
        </div>

        {data.length === 0 ? (
          <div className="text-center font-medium text-gray-500 py-8 bg-white rounded-lg shadow-sm">
            No transactions found for the selected period
          </div>
        ) : (
          groupedData.map((group, groupIndex) => (
            <div key={`mobile-group-${group.date}`} className="space-y-3">
              {/* Date Header */}
              <div className="bg-yellow-50 border-l-4 border-[var(--color2)] rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📅</span>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{formatDate(group.date)}</p>
                    <p className="text-xs text-gray-600">Opening: {formatAmount(group.opening_balance)}</p>
                  </div>
                </div>
              </div>

              {/* Transactions */}
              {group.transactions.map((entry, index) => (
                <div
                  key={`mobile-${entry.id}-${index}`}
                  className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-gray-200 hover:border-yellow-400 transition-colors"
                >
                  {/* Type Badge and Description */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 text-sm">{entry.description}</p>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${entry.type.toLowerCase() === 'income'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {entry.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Credit/Debit and Balance */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Credit</p>
                      <p className="text-sm font-bold text-green-600">
                        {entry.credit > 0 ? formatAmount(entry.credit) : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Debit</p>
                      <p className="text-sm font-bold text-red-600">
                        {entry.debit > 0 ? formatAmount(entry.debit) : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Balance</p>
                      <p className={`text-sm font-bold ${entry.balance >= 0 ? 'text-green-700' : 'text-red-700'
                        }`}>
                        {entry.type.toLowerCase() === 'expense' && entry.balance !== 0 ? '- ' : ''}{formatAmount(entry.balance)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Closing Balance */}
              <div className="bg-yellow-50 rounded-lg p-3 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Closing Balance</span>
                  <span className="text-base font-bold text-yellow-700">
                    {formatAmount(group.closing_balance)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Final Closing Balance Card */}
        {data.length > 0 && (
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-green-100">Final Closing Balance</p>
                <p className="text-xs text-green-200 mt-1">
                  As of {formatDate(groupedData[groupedData.length - 1]?.date || new Date().toISOString())}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{formatAmount(closingBalance)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}