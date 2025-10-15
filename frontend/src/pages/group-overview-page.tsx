import { useParams } from "react-router-dom";
import { GroupCard } from "../components/groupCard/group-card";
import { GroupMembers } from "../components/groupCard/group-members";
import { PageLayout } from "../components/page-layout";
import { useCallback, useEffect, useState } from "react";
import { API_BASE } from "../api";
import { PageLoader } from "../components/page-loader";

interface Group {
  id: string;
  name: string;
  category: string;
  avatarUrl: string;
  created_at: string;
  members: { name: string; avatarUrl: string; userID: string }[];
  expenses: {
    id: number;
    description: string;
    amount_cents: number;
    paidBy: string;
    debtors: { name: string; avatarUrl: string; userID: string }[];
    created_at: string;
  }[];
}

export const GroupOverviewPage = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchGroupInfo = useCallback(async () => {
    const res = await fetch(`${API_BASE}/api/groups/${groupId}/overview`);
    if (!res.ok) throw new Error("Fehler beim Laden der Gruppendaten");
    const data = await res.json();
    setGroup(data);
    setLoading(false);
    console.log(data);
  }, [groupId]);

  useEffect(() => {
    fetchGroupInfo();
  }, [fetchGroupInfo]);

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

  const groupName = group.name;
  const creationDate = new Date(group.created_at).toLocaleDateString("en-EN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const category = group.category;
  const expenses = (group.expenses || []).map((e: any) => ({
    id: e.id,
    description: e.description,
    amount: e.amount_cents / 100,
    paidBy: e.paidBy,
    date: new Date(e.created_at).toLocaleDateString("en-EN"),
  }));
  const groupMembers = group.members || [];

  return (
    <PageLayout>
      <div className="h-full p-4 grid gap-4 md:grid-cols-[4fr_1fr] md:grid-rows-1">
        <GroupCard
          expenses={expenses}
          updateExpenses={fetchGroupInfo}
          members={groupMembers}
        />
        <GroupMembers
          members={groupMembers}
          name={groupName}
          category={category}
          date={creationDate}
        />
      </div>
    </PageLayout>
  );
};
