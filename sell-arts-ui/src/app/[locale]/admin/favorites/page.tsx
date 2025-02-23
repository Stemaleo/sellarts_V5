import { getFavStats } from "@/actions/fav";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const FavouritesPage = async () => {
  const res = await getFavStats();

  if (!res.success) {
    return <div>Unable to load</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">Favorite Artworks</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Artworks</TableHead>
              <TableHead>Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {res.data.map((val) => {
              return (
                <TableRow key={val.artwork.id}>
                  <TableCell>{val.artwork.title}</TableCell>
                  <TableCell>{val.count}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FavouritesPage;
