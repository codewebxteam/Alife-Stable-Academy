import { X, TrendingUp, TrendingDown } from "lucide-react";

interface CourseInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: {
    name: string;
    totalSales: number;
    revenue: number;
    peakMonth: string;
    trend: "up" | "down";
    salesByMonth: { month: string; count: number }[];
  } | null;
}

export default function CourseInsightsModal({ isOpen, onClose, course }: CourseInsightsModalProps) {
  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-6">{course.name}</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500">Total Sales</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{course.totalSales}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              {course.revenue.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              })}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500">Peak Sales Month</p>
            <p className="text-lg font-bold text-gray-800 mt-1">{course.peakMonth}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500">Trend</p>
            <div className="flex items-center gap-2 mt-1">
              {course.trend === "up" ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-500" />
              )}
              <p className={`text-lg font-bold ${course.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                {course.trend === "up" ? "Growing" : "Declining"}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Sales by Month</h3>
          <div className="space-y-2">
            {course.salesByMonth.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-20">{item.month}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                  <div
                    className="bg-gradient-to-r from-orange-400 to-orange-600 h-6 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${(item.count / Math.max(...course.salesByMonth.map(s => s.count))) * 100}%` }}
                  >
                    <span className="text-xs text-white font-semibold">{item.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-gradient-to-r from-orange-400 to-orange-600 text-white py-2 rounded-lg font-semibold hover:opacity-90"
        >
          Close
        </button>
      </div>
    </div>
  );
}
