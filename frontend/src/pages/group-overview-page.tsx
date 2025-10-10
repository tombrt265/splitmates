import { useParams } from "react-router-dom";
import { GroupCard } from "../components/groupCard/group-card";
import { GroupMembers } from "../components/groupCard/group-members";
import { PageLayout } from "../components/page-layout";
import { useEffect, useState } from "react";


export const GroupOverviewPage = () => {

  const { groupId } = useParams();

  // States für die geladenen Daten
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!groupId) return;
    setLoading(true);
    fetch(`/api/groups/${groupId}/overview`)
      .then((res) => res.json())
      .then((data) => {
        setGroup(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [groupId]);

  if (loading) return <PageLayout>Lädt...</PageLayout>;
  if (!group) return <PageLayout>Gruppe nicht gefunden</PageLayout>;

  // Daten für die Komponenten aufbereiten
  const groupName = group.name;
  const creationDate = new Date(group.created_at).toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const category = group.category;
  const expenses = (group.expenses || []).map((e: any) => ({
    id: e.id,
    description: e.description,
    amount: e.amount_cents / 100, // falls du Euro willst
    paidBy: e.paidBy,
    date: new Date(e.created_at).toLocaleDateString("de-DE"),
  }));
  const groupMembers = (group.members || []).map((m: any) => ({
    name: m.name,
    icon: m.name?.[0] || "?", // Initiale als Icon
  }));


  return (
    <PageLayout>
      <div className="h-full p-4 grid gap-4 md:grid-cols-[4fr_1fr] md:grid-rows-1">
        <GroupCard expenses={expenses} />
        <GroupMembers members={groupMembers} name={groupName} category={category} date={creationDate}/>
      </div>
    </PageLayout>
  );
};
