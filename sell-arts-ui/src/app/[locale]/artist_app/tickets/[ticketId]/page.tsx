import TicketConversation from "@/components/TicketConversation";

export default async function TicketPage({ params }: { params: { ticketId: string } }) {
  return <TicketConversation ticketId={params.ticketId} />;
}
