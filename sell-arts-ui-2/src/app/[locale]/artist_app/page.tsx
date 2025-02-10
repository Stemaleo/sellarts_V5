import { getMyArtistProfileOverView } from "@/actions/artists";
import { use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, ShoppingCart, DollarSign, MessageCircle } from "lucide-react";
import { getAllOrdersForArtist } from "@/actions/cart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { format } from "date-fns";
import { getAnalyticsForAdminDashboard, getAnalyticsForArtistAndGallery } from "@/actions/analytics";
import  FloatingMessageButton from "@/components/ui/floatingMessageButton";

const ArtistApp = () => {
  const res = use(getAnalyticsForArtistAndGallery());

  if (!res.success) {
    return <div>Unable to load</div>;
  }

  return (
    <div className="relative">
      <h1 className="text-3xl font-bold mb-6">Overview</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{res.data.totalRevenue}</div>
            <p className="text-xs text-muted-foreground">{res.data.thisMonthRevenueGrowth}% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{res.data.totalOrders}</div>
            <p className="text-xs text-muted-foreground">+{res.data.totalOrdersThisMonth} this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{res.data.averageOrderValue}</div>
            <p className="text-xs text-muted-foreground">{res.data.averageOrderValueThisMonth} last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Artworks Listed</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{res.data.totalArtworks}</div>
            <p className="text-xs text-muted-foreground">+{res.data.totalArtworksThisMonth} this month</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Top Selling Artworks</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Artwork</TableHead>
                <TableHead>Artist</TableHead>
                <TableHead>Sales</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {res.data.topSellingArtworks.map((artwork) => (
                <TableRow key={artwork.artwork.id}>
                  <TableCell className="font-medium">{artwork.artwork.title}</TableCell>
                  <TableCell>{artwork.artwork.artistName}</TableCell>
                  <TableCell>{artwork.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

       {/* Bouton Message Flottant */}
       <FloatingMessageButton />

    </div>
  );
};

export default ArtistApp;
