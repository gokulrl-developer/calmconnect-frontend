import React from "react";

interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (value?: T[keyof T], row?: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T , K extends keyof T = keyof T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  keyField?: K
}

const Table = <T, K extends keyof T = keyof T>({
  columns,
  data,
  loading = false,
  keyField,
}: TableProps<T, K>) => {
  if (loading) {
    return (
      <p className="text-center text-gray-600 dark:text-gray-400">Loading...</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            {columns.map((col, i) => (
              <th
                key={i}
                className={`text-left p-4 text-sm font-medium text-gray-600 dark:text-gray-400 ${
                  col.className ?? ""
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            const keyValue = keyField
              ? (row[keyField] as string | number)
              : i;

            return (
              <tr
                key={keyValue}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200"
              >
                {columns.map((col, j) => {
                  if (col.render ) {
                    const value = col.accessor ? row[col.accessor] : undefined;
                    return (
                      <td key={j} className={`p-4 ${col.className ?? ""}`}>
                        { col.render(value, row)}
                      </td>
                    );
                  }

                  if (col.accessor) {
                    const value = row[col.accessor];
                    return (
                      <td key={j} className={`p-4 ${col.className ?? ""}`}>
                        {String(value)}
                      </td>
                    );
                  }

                  return (
                    <td key={j} className={`p-4 ${col.className ?? ""}`}></td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
