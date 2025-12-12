// src/pages/admin/partners.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { ChevronLeft, Search } from "lucide-react";

const DUMMY_PARTNERS = [
  { id: "partner_a", name: "Partner A", partnersId: "P-001", coursesResold: 120, revenue: 458000, contact: "partnerA@example.com", phone: "+91-9123456780" },
  { id: "partner_b", name: "Partner B", partnersId: "P-014", coursesResold: 95, revenue: 320400, contact: "partnerB@example.com", phone: "+91-9123456781" },
  { id: "partner_c", name: "Partner C", partnersId: "P-021", coursesResold: 62, revenue: 164200, contact: "partnerC@example.com", phone: "+91-9123456782" },
];

function formatCurrency(v: number) {
  return Number(v).toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
}

export default function PartnersPage() {
  const [query, setQuery] = useState("");
  const filtered = DUMMY_PARTNERS.filter((p) =>
    (p.name + " " + p.partnersId + " " + (p.contact || "")).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/adminDashboard" className="flex items-center gap-2 text-sm text-gray-600 hover:underline">
            <ChevronLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <h1 className="text-xl font-bold text-gray-800">All Partners</h1>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          <div className="relative flex-1 sm:flex-none w-full sm:w-72">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search partners by name, id or contact..."
              className="pl-10 pr-3 py-2 rounded-lg border border-gray-200 bg-white w-full"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="grid gap-4">
          {filtered.length === 0 && <p className="text-sm text-gray-500">No partners found.</p>}

          {filtered.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                  {p.name?.split(" ")[0]?.[0] || "P"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
                  <p className="text-xs text-gray-500 truncate">{p.partnersId} • {p.contact}</p>
                </div>
              </div>

              <div className="ml-auto flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">{formatCurrency(p.revenue)}</p>
                  <p className="text-xs text-gray-500">Revenue</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">{p.coursesResold}</p>
                  <p className="text-xs text-gray-500">Courses resold</p>
                </div>
                <div>
                  <button
                    onClick={() =>
                      alert(`Partner details\n\nName: ${p.name}\nID: ${p.partnersId}\nContact: ${p.contact}\nPhone: ${p.phone}`)
                    }
                    className="text-xs text-orange-600 hover:underline"
                  >
                    View details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-sm text-gray-500">
          This is the partners page using demo data. In production, fetch the collection from Firestore (e.g. `partners`) and map the results here.
        </div>
      </div>
    </div>
  );
}
