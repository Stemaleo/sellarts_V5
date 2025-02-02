import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { getTickets } from "@/actions/tickets";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import CreateTicket from "./createTicket";
import DeleteButton from "./deleteButton";
import { getTranslations } from "next-intl/server";

export default async function TicketsScreen({ searchParams }: any) {
  const search = await searchParams;
  const res = await getTickets();
  const t = await getTranslations();

  if (!res.success) {
    return <div>Unable to load</div>;
  }

  return (
    <div className="w-full grid  lg:grid-cols-3 md:grid-cols-4 gap-4 h-full  ">
      <Card className="md:col-span-2 lg:col-span-2 col-span-3 ">
        <CardContent>
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
                <TableRow key={type.id}>
                  <TableCell className="font-medium truncate w-[200px]">{type?.title}</TableCell>
                  <TableCell className="truncate">{type?.description}</TableCell>
                  <TableCell className="text-center">{type?.status}</TableCell>
                  <TableCell className="text-center">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>This action cannot be undone. This will permanently delete the ticket "{type.title}" and remove it from our servers.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <DeleteButton ticketId={type.id} />
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <CreateTicket />
    </div>
  );
}
