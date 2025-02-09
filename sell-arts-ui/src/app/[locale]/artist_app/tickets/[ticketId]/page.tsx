import TicketConversation from "@/components/TicketConversation";

export default async function TicketPage({
  params,
}: {
  params: { ticketId: string } | Promise<{ ticketId: string }>;
}) {
  const resolvedParams = await params;
    return <TicketConversation ticketId={resolvedParams.ticketId} />;
}
