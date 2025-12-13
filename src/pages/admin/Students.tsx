// src/pages/admin/students.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { ChevronLeft, Search } from "lucide-react";

const DUMMY_STUDENTS = [
  { id: "stu_riya", name: "Riya Sharma", email: "riya@example.com", boughtOn: "2025-11-30", amount: 2499, course: "React Mastery" },
  { id: "stu_aman", name: "Aman Singh", email: "aman@example.com", boughtOn: "2025-11-28", amount: 4999, course: "Fullstack Bootcamp" },
  { id: "stu_sneha", name: "Sneha Roy", email: "sneha@example.com", boughtOn: "2025-11-22", amount: 999, course: "Git & Open Source" },
];

function formatCurrency(v: number) {
  return Number(v).toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
}

export default function StudentsPage() {
  const [query, setQuery] = useState("");
  const filtered = DUMMY_STUDENTS.filter((s) =>
    (s.name + " " + s.email + " " + (s.course || "")).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/adminDashboard" className="flex items-center gap-2 text-sm text-gray-600 hover:underline">
            <ChevronLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <h1 className="text-xl font-bold text-gray-800">All Students / Purchases</h1>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          <div className="relative flex-1 sm:flex-none w-full sm:w-72">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search students by name, email or course..."
              className="pl-10 pr-3 py-2 rounded-lg border border-gray-200 bg-white w-full"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="grid gap-4">
          {filtered.length === 0 && <p className="text-sm text-gray-500">No students found.</p>}

          {filtered.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-semibold">
                  {s.name?.split(" ")[0]?.[0] || "S"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{s.name}</p>
                  <p className="text-xs text-gray-500 truncate">{s.email}</p>
                </div>
              </div>

              <div className="ml-auto flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">{formatCurrency(s.amount)}</p>
                  <p className="text-xs text-gray-500">Amount</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">{s.boughtOn}</p>
                  <p className="text-xs text-gray-500">Bought</p>
                </div>

                <div>
                  <button
                    onClick={() => alert(`Student details\n\nName: ${s.name}\nEmail: ${s.email}\nCourse: ${s.course}\nAmount: ${formatCurrency(s.amount)}\nDate: ${s.boughtOn}`)}
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
          This is the students page using demo data. Replace with your Firestore `recentPurchases` collection for production.
        </div>
      </div>
    </div>
  );
}
