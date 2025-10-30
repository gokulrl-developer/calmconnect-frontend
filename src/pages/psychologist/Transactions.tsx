import React, { useEffect, useState } from "react";
import { ArrowDownTrayIcon, WalletIcon } from "@heroicons/react/24/outline";
import Card from "../../components/UI/Card";
import Button from "../../components/UI/Button";
import type paginationData from "../../types/pagination.types";
import Pagination from "../../components/Pagination";
import type {
  TransactionListingPayload,
  TransactionListItem,
  WalletData,
} from "../../types/api/shared.types";
import { downloadTransactionReceiptAPI, getPsychTransactionsAPI, getPsychWalletAPI } from "../../services/psychologistService";

const Transactions: React.FC = () => {
  const [type, setType] = useState<"debit" | "credit" | undefined>(undefined);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [walletBalance, setWalletBalance] = useState<WalletData["balance"]>(0);
  const [paginationData, setPagingationData] = useState<paginationData>({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 10,
  });

  useEffect(() => {
    handleFetchTransactions();
    handleFetchWallet();
  }, [paginationData.currentPage, type, date]);
  useEffect(() => {
    handleFetchWallet();
  }, []);

  const [transactions, setTransactions] = useState<TransactionListItem[]>(
    [] as TransactionListItem[]
  );

  async function handleFetchWallet() {
    try {
      const result = await getPsychWalletAPI();
      if (result.data) {
        setWalletBalance(result.data.wallet.balance);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleFetchTransactions() {
    try {
      const filter: TransactionListingPayload = {
        page: paginationData.currentPage,
        limit: paginationData.pageSize,
        ...(type && { type }),
        ...(date && { date: date.toISOString() }),
      };
      const result = await getPsychTransactionsAPI(filter);
      if (result.data) {
        setTransactions(result.data.transactions);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleReceiptDownload(transactionId: string) {
    try {
      const result = await downloadTransactionReceiptAPI(transactionId);
      if (result.data) {
        const blob = new Blob([result.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");

        const disposition = result.headers["content-disposition"];
        let filename = "receipt.pdf";

        if (disposition && disposition.includes("filename=")) {
          const match = disposition.match(/filename=([^;]+)$/i);
          if (match && match[1]) filename = match[1].trim();
        }
        a.href = url;
        a.download = filename;
        a.click();

        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.log(err);
    }
  }
  const getTypeColor = (type: "credit" | "debit") => {
    return type === "credit"
      ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
      : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Wallet & Transactions
        </h1>
      </div>

      {/* Wallet Balance Card */}
      <Card className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-3">
          <WalletIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Wallet Balance
          </h2>
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">
          ₹{walletBalance}
        </div>
      </Card>

      {/* Filter Controls */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Transactions
        </h2>
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0 mb-6">
          <select
            value={type ?? "all"}
            onChange={(e) =>
              setType(
                e.target.value === "all"
                  ? undefined
                  : (e.target.value as "debit" | "credit")
              )
            }
            className="px-3 py-2 rounded-lg glass-card border border-white/20 dark:border-gray-600/20 text-sm text-gray-800 dark:text-white"
          >
            <option value="all">All Types</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>
          {/* Date Filter */}
          <input
            type="date"
            value={date ? date.toISOString().split("T")[0] : ""}
            onChange={(e) =>
              setDate(e.target.value ? new Date(e.target.value) : undefined)
            }
            className="px-3 py-2 rounded-lg glass-card border border-white/20 dark:border-gray-600/20 text-sm text-gray-800 dark:text-white"
          />
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left p-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Transaction ID
                </th>
                <th className="text-left p-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Type
                </th>
                <th className="text-left p-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Amount
                </th>
                <th className="text-left p-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Purpose
                </th>
                <th className="text-left p-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Date & Time
                </th>
                <th className="text-left p-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((txn) => (
                <tr
                  key={txn.transactionId}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                >
                  <td className="p-6 text-gray-800 dark:text-white">
                    {"#" + txn.transactionId.split("").slice(-4).join("")}
                  </td>
                  <td className="p-6">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                        txn.type
                      )}`}
                    >
                      {txn.type.charAt(0).toUpperCase() + txn.type.slice(1)}
                    </span>
                  </td>
                  <td className="p-6 text-gray-800 dark:text-white">
                    ₹{txn.amount.toLocaleString()}
                  </td>
                  <td className="p-6 text-gray-800 dark:text-white">
                    {txn.referenceType
                      ? txn.referenceType
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (s) => s.toUpperCase())
                      : "N/A"}
                  </td>
                  <td className="p-6 text-gray-800 dark:text-white">
                    {new Intl.DateTimeFormat("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    }).format(new Date(txn.createdAt))}
                  </td>
                  <td className="p-6 flex space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleReceiptDownload(txn.transactionId)}
                    >
                      <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                      Receipt
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          paginationData={paginationData}
          setCurrentPage={(page: number) =>
            setPagingationData((prev) => ({ ...prev, currentPage: page }))
          }
        />
      </Card>
    </div>
  );
};

export default Transactions;
