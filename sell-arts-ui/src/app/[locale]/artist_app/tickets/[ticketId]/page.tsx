import TicketConversation from "@/components/TicketConversation";
import { PageProps } from 'next';

export default function TicketPage({ params }: PageProps<{ ticketId: string }>) {
  return <TicketConversation ticketId={params.ticketId} />;
}
