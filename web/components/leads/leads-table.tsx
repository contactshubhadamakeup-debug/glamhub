// components/leads/leads-table.tsx
export function LeadsTable() {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-semibold text-gray-700">Client Name</th>
            <th className="px-4 py-3 font-semibold text-gray-700">Email</th>
            <th className="px-4 py-3 font-semibold text-gray-700">Service Interest</th>
            <th className="px-4 py-3 font-semibold text-gray-700">Status</th>
            <th className="px-4 py-3 font-semibold text-gray-700">Score</th>
            <th className="px-4 py-3 font-semibold text-gray-700">Created</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="px-4 py-3">Priya Sharma</td>
            <td className="px-4 py-3">priya@example.com</td>
            <td className="px-4 py-3">Bridal Makeup</td>
            <td className="px-4 py-3"><span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs">New</span></td>
            <td className="px-4 py-3">85</td>
            <td className="px-4 py-3 text-sm text-gray-500">2 hours ago</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}