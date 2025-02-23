import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Calendar } from "lucide-react";
import { format } from "date-fns";

interface InfoCardProps {
  title: string;

  author: string;
  date: Date;
  duration: number;
  avatarUrl?: string;
}

export default function InfoCard({ title, author, date, duration, avatarUrl }: InfoCardProps) {
  const formattedDate = format(date, "MMMM d, yyyy");
  const formattedTime = format(date, "h:mm a");

  return (
    <Card className="w-full max-w-md">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4 line-clamp-2">{title}</h2>
        <div className="flex items-center mb-4">
          <div>
            <p className="text-sm font-medium">{author}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <span>{duration} min Read</span>
          </div>
          <span>{formattedTime}</span>
        </div>
      </CardContent>
    </Card>
  );
}
