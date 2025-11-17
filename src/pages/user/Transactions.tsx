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
import {
  downloadTransactionReceiptAPI,
  getUserTransactionsAPI,
  getUserWalletAPI,
} from "../../services/userService";
import Table from "../../components/UI/Table";
import { produce } from "immer";
import { useGetQueryParams } from "../../hooks/useGetQueryParams";
import { useUpdateQueryParams } from "../../hooks/useUpdateQueryParams";

const Transactions: React.FC = () => {
  const [type, setType] = useState<"debit" | "credit" | undefined>(undefined);
  const [referenceType, setReferenceType] = useState<
    "booking" | "refund" | undefined
  >(undefined);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [walletBalance, setWalletBalance] = useState<WalletData["balance"]>(0);
  const [paginationData, setPaginationData] = useState<paginationData>({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    pageSize: 10,
  });

  useEffect(() => {
    handleFetchTransactions();
    handleFetchWallet();
  }, [paginationData.currentPage, type, referenceType, date]);
  useEffect(() => {
    handleFetchWallet();
  }, []);

  const [transactions, setTransactions] = useState<TransactionListItem[]>(
    [] as TransactionListItem[]
  );
  const { updateQueryParams } = useUpdateQueryParams();
  const queryParams = useGetQueryParams();

  async function handleFetchWallet() {
    try {
      const result = await getUserWalletAPI();
      if (result.data) {
        setWalletBalance(result.data.wallet.balance);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleFetchTransactions() {
    try {
      console.log("page state", paginationData.currentPage);
      const page = queryParams["page"];
      const currentPage = page ? Number(page) : 1;
      const filter: TransactionListingPayload = {
        page: currentPage,
        limit: paginationData.pageSize,
        ...(type && { type }),
        ...(referenceType && { referenceType }),
        ...(date && { date: date.toISOString() }),
      };
      const result = await getUserTransactionsAPI(filter);
      if (result.data) {
        setTransactions(result.data.transactions);
        setPaginationData((prev) =>
          produce(prev, (draft) => {
            draft.totalItems = result.data.paginationData.totalItems;
            draft.totalPages = result.data.paginationData.totalPages;
          })
        );
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
  const handlePageChange = (newPage: number) => {
    updateQueryParams({ page: newPage });
    setPaginationData((prev) => ({ ...prev, currentPage: newPage }));
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
            onChange={(e) => {
              updateQueryParams({ page: 1 });
              setType(
                e.target.value === "all"
                  ? undefined
                  : (e.target.value as "debit" | "credit")
              );
              setPaginationData((prev) => ({ ...prev, currentPage: 1 }));
            }}
            className="px-3 py-2 rounded-lg glass-card border border-white/20 dark:border-gray-600/20 text-sm text-gray-800 dark:text-white"
          >
            <option value="all">All Types</option>
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>
          {/* Purpose Filter */}
          <select
            value={referenceType ?? "all"}
            onChange={(e) => {
              updateQueryParams({ page: 1 });
              setReferenceType(
                e.target.value === "all"
                  ? undefined
                  : (e.target.value as "booking" | "refund")
              );
              setPaginationData((prev) => ({ ...prev, currentPage: 1 }));
            }}
            className="px-3 py-2 rounded-lg glass-card border border-white/20 dark:border-gray-600/20 text-sm text-gray-800 dark:text-white"
          >
            <option value="all">All Purposes</option>
            <option value="booking">Booking</option>
            <option value="refund">Refund</option>
          </select>
          {/* Date Filter */}
          <input
            type="date"
            value={date ? date.toISOString().split("T")[0] : ""}
            onChange={(e) => {
              updateQueryParams({ page: 1 });
              setDate(e.target.value ? new Date(e.target.value) : undefined);
              setPaginationData((prev) => ({ ...prev, currentPage: 1 }));
            }}
            className="px-3 py-2 rounded-lg glass-card border border-white/20 dark:border-gray-600/20 text-sm text-gray-800 dark:text-white"
          />
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <Table<TransactionListItem, "transactionId">
            keyField="transactionId"
            data={transactions}
            loading={false}
            columns={[
              {
                header: "Transaction ID",
                accessor: "transactionId",
                render: (value) => `#${(value as string).slice(-4)}`,
              },
              {
                header: "Type",
                accessor: "type",
                render: (value) => (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                      value as "credit" | "debit"
                    )}`}
                  >
                    {(value as string).charAt(0).toUpperCase() +
                      (value as string).slice(1)}
                  </span>
                ),
              },
              {
                header: "Amount",
                accessor: "amount",
                render: (value) => `₹${value!.toLocaleString()}`,
              },
              {
                header: "Purpose",
                accessor: "referenceType",
                render: (value) =>
                  value
                    ? (value as string)
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (s) => s.toUpperCase())
                    : "N/A",
              },
              {
                header: "Date & Time",
                accessor: "createdAt",
                render: (value) =>
                  new Intl.DateTimeFormat("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  }).format(new Date(value!)),
              },
              {
                header: "Actions",
                render: (_, row) => (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleReceiptDownload(row!.transactionId)}
                  >
                    <ArrowDownTrayIcon className="w-4 h-4 mr-1" />
                    Receipt
                  </Button>
                ),
              },
            ]}
          />
        </div>

        {/* Pagination */}
        <Pagination
          paginationData={paginationData}
          setCurrentPage={(page: number) => handlePageChange(page)}
        />
      </Card>
    </div>
  );
};

export default Transactions;
