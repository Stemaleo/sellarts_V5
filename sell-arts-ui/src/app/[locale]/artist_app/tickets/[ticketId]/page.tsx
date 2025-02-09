import TicketConversation from "@/components/TicketConversation";

export default function TicketPage({ params }: { params: { ticketId: string } }) {
  return <TicketConversation ticketId={params.ticketId} />;
}
