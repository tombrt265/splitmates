import { useParams, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { PageLayout } from "../components/page-layout";
import { PageLoader } from "../components/page-loader";
import {
  createInviteLinkAPI,
  deleteGroupWithIdAPI,
  getBalanceOfUserInGroup,
  getGroupBalancesWithIdAPI,
  getGroupWithIdAPI,
} from "../api";
import { GroupMetadata } from "../components/group-overview-page/group-metadata";
import { GroupSpendings } from "../components/group-overview-page/group-spendings";
import { Carousel } from "../components/shared/carousel";
import { BarChart } from "../components/shared/bar-chart";
import { useAuth0 } from "@auth0/auth0-react";
import { ApiErrorResponse, GroupExtended } from "../models";
import {
  clearBalanceDetailsCacheForGroup,
  hasCachedBalanceDetails,
  setCachedBalanceDetails,
} from "../cache/balance-details-cache";

interface Balance {
  member_id: string;
  member_name: string;
  balance: string;
}

const groupCache = new Map<string, GroupExtended>();
const balancesCache = new Map<string, Balance[]>();

export const GroupOverviewPage = () => {
  const auth0_sub = useAuth0().user?.sub;
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState<GroupExtended | null>(null);
  const [balances, setBalances] = useState<Balance[] | null>(null);
  const [balanceError, setBalanceError] = useState<string>("");
  const [groupInfoLoading, setGroupInfoLoading] = useState(true);
  const [groupError, setGroupError] = useState<string>("");
  const [balancesLoading, setBalancesLoading] = useState(true);

  /** === API Calls === */
  const fetchGroupInfo = useCallback(
    async (forceRefresh = false) => {
      if (!groupId || !auth0_sub) return;
      if (!forceRefresh) {
        const cachedGroup = groupCache.get(groupId);
        if (cachedGroup) {
          setGroup(cachedGroup);
          setGroupError("");
          setGroupInfoLoading(false);
          return;
        }
      }
      setGroupInfoLoading(true);
      setGroupError("");
      try {
        const data = await getGroupWithIdAPI(groupId, auth0_sub);
        setGroup(data.data);
        groupCache.set(groupId, data.data);
      } catch (err) {
        const error = err as ApiErrorResponse;
        setGroupError(error.error.message);
      } finally {
        setGroupInfoLoading(false);
      }
    },
    [groupId, auth0_sub],
  );

  const fetchGroupBalances = useCallback(
    async (forceRefresh = false) => {
      if (!groupId || !auth0_sub) return;
      if (!forceRefresh) {
        const cachedBalances = balancesCache.get(groupId);
        if (cachedBalances) {
          setBalances(cachedBalances);
          setBalanceError("");
          setBalancesLoading(false);
          return;
        }
      }
      setBalancesLoading(true);
      setBalanceError("");
      try {
        const res = await getGroupBalancesWithIdAPI(groupId, auth0_sub);
        setBalances(res.data);
        balancesCache.set(groupId, res.data);
      } catch (err) {
        const error = err as ApiErrorResponse;
        setBalanceError(error.error.message);
      } finally {
        setBalancesLoading(false);
      }
    },
    [groupId, auth0_sub],
  );

  const handleDeleteGroup = async () => {
    if (!groupId || !auth0_sub) return;
    if (!confirm("Are you sure you want to delete this group for all members?"))
      return;
    try {
      const res = await deleteGroupWithIdAPI(groupId, auth0_sub);
      navigate("/groups");
    } catch (err) {
      const error = err as ApiErrorResponse;
      alert(error.error.message);
    }
  };

  const handleCreateLink = async () => {
    if (!groupId) return;
    try {
      const res = await createInviteLinkAPI(groupId);
      const inviteLink = res.data.invite_link;
      navigator.clipboard.writeText(inviteLink);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateExpense = async () => {
    if (groupId) clearBalanceDetailsCacheForGroup(groupId);
    await fetchGroupInfo(true);
    await fetchGroupBalances(true);
  };

  /** === Lifecycle === */
  useEffect(() => {
    fetchGroupInfo();
  }, [fetchGroupInfo]);

  useEffect(() => {
    fetchGroupBalances();
  }, [fetchGroupBalances]);

  useEffect(() => {
    if (!group || !auth0_sub) return;
    const prefetchBalanceDetails = async () => {
      await Promise.all(
        group.members.map(async (member) => {
          if (hasCachedBalanceDetails(group.id, member.userID)) return;
          try {
            const res = await getBalanceOfUserInGroup(
              auth0_sub,
              member.userID,
              group.id,
            );
            setCachedBalanceDetails(group.id, member.userID, res.data.balances);
          } catch {
            // Prefetch failures are non-blocking for the UI.
          }
        }),
      );
    };
    prefetchBalanceDetails();
  }, [group, auth0_sub]);

  /** === Debt By Category === */
  let debtbyCategory = [{ label: "", value: 0 }];
  if (group) {
    const expensesByCategory = group.expenses.reduce<Record<string, number>>(
      (acc, expense) => {
        acc[expense.category] =
          (acc[expense.category] ?? 0) + expense.amount_cents;
        return acc;
      },
      {},
    );

    debtbyCategory = Object.entries(expensesByCategory).map(
      ([category, totalCents]) => ({
        label: category,
        value: totalCents / 100,
      }),
    );
  }

  /** === Money Spent in Advance === */
  let moneySpentByMember = [{ label: "", value: 0 }];
  if (group) {
    const expensesByMember = group.expenses.reduce<Record<string, number>>(
      (acc, expense) => {
        acc[expense.paidBy] = (acc[expense.paidBy] ?? 0) + expense.amount_cents;
        return acc;
      },
      {},
    );

    moneySpentByMember = Object.entries(expensesByMember).map(
      ([member, totalCents]) => ({
        label: member,
        value: totalCents / 100,
      }),
    );
  }

  /** === Debt By Member === */
  let debtByMember = [{ label: "", value: 0 }];
  if (balances) {
    debtByMember = balances
      .map((b) => ({
        label: b.member_name,
        value: parseFloat(b.balance),
      }))
      .filter((b) => b.value < 0)
      .map((b) => ({
        label: b.label,
        value: Math.abs(b.value),
      }));
  }

  /** === Template === */
  if (groupInfoLoading || balancesLoading) return <PageLoader />;

  if (!group)
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full">
        <span className="text-red-500">{groupError}</span>
      </div>
    );

  return (
    <PageLayout>
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 p-4">
        <GroupMetadata
          members={group.members}
          name={group.name}
          category={group.category}
          date={group.created_at}
          groupId={group.id}
          onDelete={handleDeleteGroup}
          onCreateLink={handleCreateLink}
        />

        <GroupSpendings
          expenses={group.expenses}
          updateExpenses={handleUpdateExpense}
          members={group.members}
        />

        {group ? (
          <Carousel>
            <BarChart title="Debt By Category [€]" data={debtbyCategory} />
            {balanceError === "" ? (
              <BarChart
                title="Debt By Person [€]"
                data={debtByMember}
                maxBars={3}
              />
            ) : (
              <div className="bg-gray-50 rounded-xl px-10 py-4 flex flex-col items-center justify-center h-80 text-red-500 font-semibold">
                {balanceError}
              </div>
            )}

            <BarChart
              title="Money Spent Upfront [€]"
              data={moneySpentByMember}
              maxBars={3}
            />
          </Carousel>
        ) : (
          <PageLoader page={false} />
        )}
      </div>
    </PageLayout>
  );
};
