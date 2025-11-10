import React from 'react';

export function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  emptyText = 'No data to display',
}: {
  columns: { key: keyof T; header: string; render?: (value: T[keyof T], row: T) => React.ReactNode }[];
  rows: T[];
  emptyText?: string;
}) {
  if (!rows.length) {
    return (
      <div className="ui-card">
        <div className="ui-card-pad text-center text-sm text-gray-600">{emptyText}</div>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead className="sticky top-0 z-10">
          <tr>
            {columns.map((c) => (
              <th key={String(c.key)}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 ? 'bg-gray-50/40' : ''}>
              {columns.map((c) => (
                <td key={String(c.key)}>
                  {c.render ? c.render(row[c.key], row) : String(row[c.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
