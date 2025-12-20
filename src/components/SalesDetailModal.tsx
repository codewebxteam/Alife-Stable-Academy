import { X } from "lucide-react";

interface SalesDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: {
    studentName: string;
    email: string;
    course: string;
    amount: number;
    purchaseDate: string;
    expiryDate: string;
    validityDays: number;
  } | null;
}

export default function SalesDetailModal({ isOpen, onClose, sale }: SalesDetailModalProps) {
  if (!isOpen || !sale) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-6">Purchase Details</h2>

        <div className="space-y-4">
          <div>
            <p className="text-xs text-gray-500">Student Name</p>
            <p className="text-sm font-semibold text-gray-800 mt-1">{sale.studentName}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="text-sm font-semibold text-gray-800 mt-1">{sale.email}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Course</p>
            <p className="text-sm font-semibold text-gray-800 mt-1">{sale.course}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Payment Amount</p>
              <p className="text-sm font-semibold text-gray-800 mt-1">
                {sale.amount.toLocaleString("en-IN", {
                  style: "currency",
                  currency: "INR",
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Validity</p>
              <p className="text-sm font-semibold text-gray-800 mt-1">{sale.validityDays} days</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Purchase Date</p>
              <p className="text-sm font-semibold text-gray-800 mt-1">{sale.purchaseDate}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Expiry Date</p>
              <p className="text-sm font-semibold text-gray-800 mt-1">{sale.expiryDate}</p>
            </div>
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
