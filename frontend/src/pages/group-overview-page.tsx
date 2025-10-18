import { useParams, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { PageLayout } from "../components/page-layout";
import { PageLoader } from "../components/page-loader";
import { API_BASE } from "../api";
import { GroupCard } from "../components/group-overview-page/group-card";
import { GroupMembers } from "../components/group-overview-page/group-members";

interface Member {
  name: string;
  avatarUrl: string;
  userID: string;
}

interface Expense {
  id: number;
  description: string;
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
      const inviteLink = data.link;
      navigator.clipboard.writeText(inviteLink);
      alert("Invite link copied to clipboard");
    } catch (err) {
      console.error(err);
      alert("Error creating invite link");
    }
  };

  /** === Lifecycle === */
  useEffect(() => {
    fetchGroupInfo();
  }, [fetchGroupInfo]);

  /** === Derived Data === */
  if (loading)
    return (
      <div className="flex flex-col items-center h-full w-full">
        <PageLoader />
      </div>
    );

  if (!group)
    return (
      <div className="flex flex-col items-center h-full w-full">
        <span>Group not found</span>
      </div>
    );

  const formattedExpenses = group.expenses.map((e) => ({
    id: e.id,
    description: e.description,
    amount: e.amount_cents / 100,
    paidBy: e.paidBy,
    date: new Date(e.created_at).toLocaleDateString("en-EN"),
  }));

  const creationDate = new Date(group.created_at).toLocaleDateString("en-EN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  /** === Render === */
  return (
    <PageLayout>
      <div className="h-full p-4 grid gap-4 md:grid-cols-[4fr_1fr] md:grid-rows-1">
        <GroupCard
          expenses={formattedExpenses}
          updateExpenses={fetchGroupInfo}
          members={group.members}
        />
        <GroupMembers
          members={group.members}
          name={group.name}
          category={group.category}
          date={creationDate}
          groupId={group.id}
          onDelete={handleDeleteGroup}
          onCreateLink={handleCreateLink}
        />
      </div>
    </PageLayout>
  );
};
