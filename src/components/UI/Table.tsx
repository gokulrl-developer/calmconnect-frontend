
export interface Column<T> {
  key: keyof T | string; 
  header: string; 
  render?: (row: T) => React.ReactNode; 
  className?: string; 
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string | number;
}

export function DataTable<T>({
  data,
  columns,
  rowKey,
}: DataTableProps<T>) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-200 dark:border-gray-700">
          {columns.map((col) => (
            <th
              key={String(col.key)}
              className={`text-left p-4 text-sm font-medium text-gray-600 dark:text-gray-400 ${col.className || ""}`}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr
            key={rowKey(row)}
            className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200"
          >
            {columns.map((col) => (
              <td key={String(col.key)} className="p-4">
                {col.render
                  ? col.render(row) 
                  : (row[col.key as keyof T] as any)} 
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
