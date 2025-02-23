import { TabsNav } from "@/components/ui/nav-tabs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReactNode } from "react";

const ArtistLayout = async ({ children, params }: { children: ReactNode; params: any }) => {
  const paramData = await params;
  const tabs = [
    { label: "Profile", href: `/admin/users/${paramData.id}` },
    { label: "Orders", href: `/admin/users/${paramData.id}/orders` },
    { label: "Transactions", href: `/admin/users/${paramData.id}/transactions` },
  ];

  return (
    <div>
      <TabsNav tabs={tabs} />
      <div className="mt-6">{children}</div>
    </div>
  );
};

export default ArtistLayout;
