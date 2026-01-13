import { useParams, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { PageLayout } from "../components/page-layout";
import { PageLoader } from "../components/page-loader";
import { API_BASE } from "../api";
import { GroupMetadata } from "../components/group-overview-page/group-metadata";
import { GroupSpendings } from "../components/group-overview-page/group-spendings";
import { Carousel } from "../components/shared/carousel";
import { DebtByCategoryChart } from "../components/group-overview-page/stat-debt-by-category";

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
      const res = await fetch(`${API_BASE}/api/groups/${groupId}/overview`);
      if (!res.ok) throw new Error("Failed to fetch group overview");
      const data = await res.json();
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
      const res = await fetch(`${API_BASE}/api/groups/${groupId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete group");
      navigate("/groups");
    } catch (err) {
      console.error(err);
      alert("Error deleting group");
    }
  };

  const handleCreateLink = async () => {
    if (!groupId) return;
    try {
      const res = await fetch(`${API_BASE}/api/groups/${groupId}/invite`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to create invite link");
      const data = await res.json();
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

  /** === Derived Data === */
  let categoryStats = [{ category: "", totalCents: 0 }];
  if (group) {
    const expensesByCategory = group.expenses.reduce<Record<string, number>>(
      (acc, expense) => {
        acc[expense.category] =
          (acc[expense.category] ?? 0) + expense.amount_cents;
        return acc;
      },
      {}
    );

    categoryStats = Object.entries(expensesByCategory).map(
      ([category, totalCents]) => ({
        category,
        totalCents,
      })
    );
    categoryStats.sort((a, b) => b.totalCents - a.totalCents);
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
            <DebtByCategoryChart stats={categoryStats} />
            <div></div>
          </Carousel>
        ) : (
          <PageLoader page={false} />
        )}
      </div>
    </PageLayout>
  );
};
