import React, { useState } from "react";
import { seedIntelligenceData } from "../../utils/seedIntelligenceData";
import { Database } from "lucide-react";

/**
 * Data Seeder Button Component
 * Use this to populate Firebase with sample data for testing
 */

const DataSeederButton = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSeed = async () => {
    if (!window.confirm("Are you sure you want to seed sample data? This will add test data to your database.")) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const result = await seedIntelligenceData();
      if (result.success) {
        setMessage("✅ Sample data added successfully!");
      } else {
        setMessage(`❌ Error: ${result.message}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        onClick={handleSeed}
        disabled={loading}
        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl shadow-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Database size={18} />
        <span className="text-sm font-bold">
          {loading ? "Seeding Data..." : "Seed Sample Data"}
        </span>
      </button>
      
      {message && (
        <div className="mt-3 p-3 bg-white rounded-xl shadow-lg border border-slate-200">
          <p className="text-xs font-bold text-slate-700">{message}</p>
        </div>
      )}
    </div>
  );
};

export default DataSeederButton;
