import { useParams, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { PageLayout } from "../components/page-layout";
import { PageLoader } from "../components/page-loader";
import {
  createGroupInviteLinkWithIdAPI,
  deleteGroupWithIdAPI,
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

export const GroupOverviewPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);

  /** === API Calls === */
  const fetchGroupInfo = useCallback(async () => {
    if (!groupId) return;
    setLoading(true);
    try {
      const data = await getGroupWithIdAPI(groupId);
      setGroup(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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

  /** === Lifecycle === */
  useEffect(() => {
    fetchGroupInfo();
  }, [fetchGroupInfo]);

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

  /** === Template === */
  if (loading) return <PageLoader />;

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
          updateExpenses={fetchGroupInfo}
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
            {/* <BarChart title="Debt By Person [€]"/> */}
          </Carousel>
        ) : (
          <PageLoader page={false} />
        )}
      </div>
    </PageLayout>
  );
};
