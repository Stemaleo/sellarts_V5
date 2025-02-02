import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { use } from "react";
import { getAllUsers } from "@/actions/auth";
import moment from "moment";
import Link from "next/link";
import TypeSelect from "./TypeSelect";

export default async function Component({ searchParams }: any) {
  const search = await searchParams;

  const res = await getAllUsers(search["page"] || 0, search["type"] || "all");
  if (!res.success) {
    return <div>Unable to load</div>;
  }

  const users = res.data;

  return (
    <div className="">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold mb-4">User List</h1>

            <div className="mb-4">
              <TypeSelect />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Registered Since</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.content.map((user) => {
                return (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.type}</TableCell>
                    <TableCell>{moment(user.registeredAt).format("D MMM Y")}</TableCell>
                    <TableCell>
                      {user.type == "ARTIST" && (
                        <Link href={`/admin/users/${user.id}`}>
                          <Button variant={"outline"}>View Artist</Button>
                        </Link>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="w-full">
          <div className="flex justify-between items-center mt-4 w-full">
            <Button variant="outline" disabled={res.data.page.number == 0} className="mx-2">
              <Link className="flex items-center" href={"/admin/users?page=" + (res.data.page.number - 1)}>
                <ChevronLeftIcon className="h-4 w-4 mr-2" />
                Previous
              </Link>
            </Button>
            <span>
              Page {users.page.number + 1} of {users.page.totalPages}
            </span>
            <Button variant="outline" disabled={res.data.page.number >= res.data.page.totalPages - 1} className="mx-2">
              <Link className="flex items-center" href={"/admin/users?page=" + (res.data.page.number + 1)}>
                Next
                <ChevronRightIcon className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
