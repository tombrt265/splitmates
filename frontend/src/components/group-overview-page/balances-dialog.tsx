import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Dialog } from "../shared/dialog";
import { getBalanceOfUserInGroup } from "../../api";
import { PageLoader } from "../page-loader";
import { FiX } from "react-icons/fi";
import { ApiErrorResponse, BalanceDetailed } from "../../models";
import {
  getCachedBalanceDetails,
  setCachedBalanceDetails,
} from "../../cache/balance-details-cache";

interface BalancesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  userId: string;
  memberName: string;
}

export const BalancesDialog = ({
  isOpen,
  onClose,
  groupId,
  userId,
  memberName,
}: BalancesDialogProps) => {
  const auth0_sub = useAuth0().user?.sub;
  const [balances, setBalances] = useState<BalanceDetailed[]>([]);
  const [balanceError, setBalanceError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !userId || !auth0_sub) return;
    const cachedBalances = getCachedBalanceDetails(groupId, userId);
    if (cachedBalances) {
      setBalances(cachedBalances);
      setBalanceError("");
      setLoading(false);
      return;
    }
    const fetchBalances = async () => {
      try {
        setLoading(true);
        setBalanceError("");
        const res = await getBalanceOfUserInGroup(auth0_sub, userId, groupId);
        setBalances(res.data.balances);
        setCachedBalanceDetails(groupId, userId, res.data.balances);
      } catch (err) {
        const error = err as ApiErrorResponse;
        setBalanceError(error.error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBalances();
  }, [isOpen, userId, groupId, auth0_sub]);

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
        balanceError === "" ? (
          <p className="text-center text-primary py-4">No balances found.</p>
        ) : (
          <p className="text-center text-red-500 py-4 font-semibold">
            {balanceError}
          </p>
        )
      ) : (
        <ul className="divide-y divide-gray-200">
          {balances.map((b, idx) => (
            <li
              key={idx}
              className="flex justify-between gap-2 items-center py-3 px-2 hover:bg-secondary rounded-lg transition"
            >
              <span className="font-medium text-primary">{b.counterparty}</span>
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
