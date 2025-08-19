import { PageLayout } from "../components/page-layout";

export const GuardedPage = () => {
  return (
    <PageLayout>
      <p>
        This is a protected page. Only authenticated users can see this content.
      </p>
    </PageLayout>
  );
};
