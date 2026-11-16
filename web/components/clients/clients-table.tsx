// components/clients/clients-table.tsx
export function ClientsTable() {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 font-semibold text-gray-700">Name</th>
            <th className="px-4 py-3 font-semibold text-gray-700">Email</th>
            <th className="px-4 py-3 font-semibold text-gray-700">Phone</th>
            <th className="px-4 py-3 font-semibold text-gray-700">Bookings</th>
            <th className="px-4 py-3 font-semibold text-gray-700">Spent (₹)</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="px-4 py-3">Aisha Khan</td>
            <td className="px-4 py-3">aisha@example.com</td>
            <td className="px-4 py-3">+91 98765 43210</td>
            <td className="px-4 py-3">3</td>
            <td className="px-4 py-3">4,500</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}