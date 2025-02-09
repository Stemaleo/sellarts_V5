import TicketConversation from "@/components/TicketConversation";

export default async function TicketPage({
  params,
}: {
  params: Promise<{ locale: string; ticketId: string }>;
}) {
  const { ticketId } = await params;
  return <TicketConversation ticketId={ticketId} />;
}
