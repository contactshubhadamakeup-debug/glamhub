// components/quotes/quotes-table.tsx
export function QuotesTable() {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-semibold text-gray-700">Title</th>
            <th className="px-4 py-3 font-semibold text-gray-700">Client</th>
            <th className="px-4 py-3 font-semibold text-gray-700">Amount (₹)</th>
            <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
            <th className="px-4 py-3 font-semibold text-gray-700">Created</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="px-4 py-3">Bridal Makeup Package</td>
            <td className="px-4 py-3">Priya Sharma</td>
            <td className="px-4 py-3">15,000</td>
            <td className="px-4 py-3"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">Draft</span></td>
            <td className="px-4 py-3 text-sm text-gray-500">Today</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}