import { useParams, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { PageLayout } from "../components/page-layout";
import { PageLoader } from "../components/page-loader";
import {
  createGroupInviteLinkWithIdAPI,
  deleteGroupWithIdAPI,
  getGroupBalancesWithIdAPI,
  getGroupWithIdAPI,
} from "../api";
import { GroupMetadata } from "../components/group-overview-page/group-metadata";
import { GroupSpendings } from "../components/group-overview-page/group-spendings";
import { Carousel } from "../components/shared/carousel";
import { BarChart } from "../components/shared/bar-chart";

interface Member {
  name: string;
  avatarUrl: string;
  userID: string;
}

interface Expense {
  id: number;
  description: string;
  category: string;
  amount_cents: number;
  paidBy: string;
  created_at: string;
}

interface Group {
  id: string;
  name: string;
  category: string;
  avatarUrl: string;
  created_at: string;
  members: Member[];
  expenses: Expense[];
}

interface Balance {
  member_id: string;
  member_name: string;
  balance: string;
}

export const GroupOverviewPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState<Group | null>(null);
  const [balances, setBalances] = useState<Balance[] | null>(null);
  const [groupInfoLoading, setGroupInfoLoading] = useState(true);
  const [balancesLoading, setBalancesLoading] = useState(true);

  /** === API Calls === */
  const fetchGroupInfo = useCallback(async () => {
    if (!groupId) return;
    setGroupInfoLoading(true);
    try {
      const data = await getGroupWithIdAPI(groupId);
      setGroup(data);
    } catch (err) {
      console.error(err);
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
    if (!groupId) return;
    if (!confirm("Are you sure you want to delete this group?")) return;
    try {
      const res = await deleteGroupWithIdAPI(groupId);
      navigate("/groups");
    } catch (err) {
      console.error(err);
      alert("Error deleting group");
    }
  };

  const handleCreateLink = async () => {
    if (!groupId) return;
    try {
      const data = await createGroupInviteLinkWithIdAPI(groupId);
      const inviteLink = data.invite_link;
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
      {}
    );

    debtbyCategory = Object.entries(expensesByCategory)
      .map(([category, totalCents]) => ({
        label: category,
        value: totalCents / 100,
      }))
      .sort((a, b) => b.value - a.value);
  }

  /** === Money Spent in Advance === */
  let moneySpentByMember = [{ label: "", value: 0 }];
  if (group) {
    const expensesByMember = group.expenses.reduce<Record<string, number>>(
      (acc, expense) => {
        acc[expense.paidBy] = (acc[expense.paidBy] ?? 0) + expense.amount_cents;
        return acc;
      },
      {}
    );

    moneySpentByMember = Object.entries(expensesByMember)
      .map(([member, totalCents]) => ({
        label: member,
        value: totalCents / 100,
      }))
      .sort((a, b) => b.value - a.value);
  }

  /** === Debt By Member === */
  let debtByMember = [{ label: "", value: 0 }];
  if (balances) {
    debtByMember = balances.map((b) => ({
      label: b.member_name,
      value: parseFloat(b.balance),
    }));
  }

  /** === Template === */
  if (groupInfoLoading || balancesLoading) return <PageLoader />;

  if (!group)
    return (
      <div className="flex flex-col items-center h-full w-full">
        <span>Group not found</span>
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
              title="Most Generous Member By Money Spent In Advance [€]"
              data={moneySpentByMember}
              maxBars={3}
            />
            <BarChart
              title="Balances [€]"
              data={debtByMember}
              maxBars={3}
              negative={true}
            />
          </Carousel>
        ) : (
          <PageLoader page={false} />
        )}
      </div>
    </PageLayout>
  );
};
