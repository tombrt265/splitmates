import { useEffect, useState } from "react";
import { Dialog } from "../shared/dialog";
import { getBalanceOfUserInGroup } from "../../api";
import { PageLoader } from "../page-loader";
import { FiX } from "react-icons/fi";

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
        const data = await getBalanceOfUserInGroup(userId, groupId);
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
      className="p-6 w-full max-w-md bg-background rounded-2xl shadow-xl"
    >
      <h3 className="text-2xl font-semibold mb-4 text-center">
        {memberName}'s balances
      </h3>

      {loading ? (
        <PageLoader page={false} />
      ) : balances.length === 0 ? (
        <p className="text-center text-primary py-4">No balances found.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {balances.map((b, idx) => (
            <li
              key={idx}
              className="flex justify-between gap-2 items-center py-3 px-2 hover:bg-secondary rounded-lg transition"
            >
              <span className="font-medium text-primary">
                {b.counterparty}
              </span>
              <span
                className={`text-base font-semibold ${
                  b.direction === "incoming"
                    ? "text-emerald-600"
                    : "text-red-600"
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
        className="action-button action-button--danger action-button--full mt-6 text-primary"
      >
        <FiX aria-hidden="true" />
        Close
      </button>
    </Dialog>
  );
};
