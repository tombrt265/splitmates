import { useParams, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { PageLayout } from "../components/page-layout";
import { PageLoader } from "../components/page-loader";
import {
  createInviteLinkAPI,
  deleteGroupWithIdAPI,
  getGroupBalancesWithIdAPI,
  getGroupWithIdAPI,
} from "../api";
import { GroupMetadata } from "../components/group-overview-page/group-metadata";
import { GroupSpendings } from "../components/group-overview-page/group-spendings";
import { Carousel } from "../components/shared/carousel";
import { BarChart } from "../components/shared/bar-chart";
import { useAuth0 } from "@auth0/auth0-react";
import { ApiErrorResponse, GroupExtended } from "../models";

interface Balance {
  member_id: string;
  member_name: string;
  balance: string;
}

export const GroupOverviewPage = () => {
  const auth0_sub = useAuth0().user?.sub;
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState<GroupExtended | null>(null);
  const [balances, setBalances] = useState<Balance[] | null>(null);
  const [groupInfoLoading, setGroupInfoLoading] = useState(true);
  const [groupError, setGroupError] = useState<string>("");
  const [balancesLoading, setBalancesLoading] = useState(true);

  /** === API Calls === */
  const fetchGroupInfo = useCallback(async () => {
    if (!groupId || !auth0_sub) return;
    setGroupInfoLoading(true);
    try {
      const data = await getGroupWithIdAPI(groupId, auth0_sub);
      setGroup(data.data);
    } catch (err) {
      const error = err as ApiErrorResponse;
      setGroupError(error.error.message);
    } finally {
      setGroupInfoLoading(false);
    }
  }, [groupId]);

  const fetchGroupBalances = useCallback(async () => {
    if (!groupId) return;
    setBalancesLoading(true);
    try {
      const balances = await getGroupBalancesWithIdAPI(groupId);
      setBalances(balances);
      console.log(balances);
    } catch (err) {
      console.error(err);
    } finally {
      setBalancesLoading(false);
    }
  }, [groupId]);

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
    fetchGroupInfo;
    fetchGroupBalances;
  };

  /** === Lifecycle === */
  useEffect(() => {
    fetchGroupInfo();
  }, [fetchGroupInfo]);

  useEffect(() => {
    fetchGroupBalances();
  }, [fetchGroupBalances]);

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
            <BarChart
              title="Debt By Person [€]"
              data={debtByMember}
              maxBars={3}
            />
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
