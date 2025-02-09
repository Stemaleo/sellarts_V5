import TicketConversation from "@/components/TicketConversation";

export default async function TicketPage(params) {
  return <TicketConversation ticketId={params.ticketId} />;
}

