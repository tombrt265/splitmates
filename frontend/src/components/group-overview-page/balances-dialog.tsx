import { useEffect, useState } from "react";
import { Dialog } from "../shared/dialog";
import { API_BASE } from "../../api";
import { PageLoader } from "../page-loader";

interface BalancesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  userId: string;
  memberName: string;
}

interface Balance {
  direction: "incoming" | "outgoing";
  counterparty: string;
  amount: string;
  currency: string;
}

export const BalancesDialog = ({
  isOpen,
  onClose,
  groupId,
  userId,
  memberName,
}: BalancesDialogProps) => {
  const [balances, setBalances] = useState<Balance[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !userId) return;
    const fetchBalances = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${API_BASE}/api/groups/${groupId}/balances/${userId}`
        );
        if (!res.ok) throw new Error("Failed to load balances");
        const data = await res.json();
        setBalances(data.balances);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBalances();
  }, [isOpen, userId, groupId]);

  return (
    <Dialog
      isDialogOpen={isOpen}
      closeDialog={onClose}
      className="p-6 w-full max-w-md bg-white rounded-2xl shadow-xl"
    >
      <h3 className="text-2xl font-semibold mb-4 text-center">
        {memberName}'s balances
      </h3>

      {loading ? (
        <PageLoader />
      ) : balances.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No balances found.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {balances.map((b, idx) => (
            <li
              key={idx}
              className="flex justify-between gap-2 items-center py-3 px-2 hover:bg-gray-50 rounded-lg transition"
            >
              <span className="font-medium text-gray-700">
                {b.counterparty}
              </span>
              <span
                className={`text-[1.6rem] font-semibold ${
                  b.direction === "incoming" ? "text-green-600" : "text-red-500"
                }`}
              >
                {b.direction === "incoming" ? "+" : "-"}
                {b.amount} {b.currency}
              </span>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={onClose}
        className="mt-6 w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg py-3 transition"
      >
        Close
      </button>
    </Dialog>
  );
};
