import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { getTickets } from "@/actions/tickets";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import CreateTicket from "./createTicket";
import DeleteButton from "./deleteButton";
import { getTranslations } from "next-intl/server";
import ViewMessagesButton from "@/components/ui/ViewMessagesButton";

export default async function TicketsScreen({ searchParams }: any) {
  const search = await searchParams;
  const res = await getTickets();
  const t = await getTranslations();

  if (!res.success) {
    return <div className="text-center text-red-500">Unable to load tickets</div>;
  }

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <Card className="md:col-span-2 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">{t("title")}</TableHead>
                  <TableHead>{t("description")}</TableHead>
                  <TableHead className="text-center">{t("common.status")}</TableHead>
                  <TableHead className="text-center">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {res.data.map((type: any) => (
                  <TableRow key={type.id} className="hover:bg-gray-100 transition-all">
                    <TableCell className="font-medium truncate w-[200px]">
                      {type?.title}
                    </TableCell>
                    <TableCell className="truncate max-w-xs">
                      {type?.description}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          type.status === "Open"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {type?.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-center flex justify-center gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the
                              ticket "{type.title}" and remove it from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <DeleteButton ticketId={type.id} />
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <ViewMessagesButton ticketId={type.id} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <CreateTicket />
    </div>
  );
}
