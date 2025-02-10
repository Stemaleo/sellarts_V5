import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Users, Palette, ShoppingCart, TrendingUp } from "lucide-react";
import { getAnalyticsForAdminDashboard } from "@/actions/analytics";

const recentOrders = [
  { id: "1", customer: "John Doe", amount: 299, status: "Completed" },
  { id: "2", customer: "Jane Smith", amount: 549, status: "Processing" },
  { id: "3", customer: "Bob Johnson", amount: 799, status: "Shipped" },
  { id: "4", customer: "Alice Brown", amount: 1299, status: "Completed" },
  { id: "5", customer: "Charlie Davis", amount: 449, status: "Processing" },
];

const topSellingArtworks = [
  { id: "1", title: "Abstract Harmony", artist: "Emma Johnson", sales: 52 },
  { id: "2", title: "Serene Landscape", artist: "Michael Chen", sales: 48 },
  { id: "3", title: "Urban Rhythm", artist: "Sophia Rodriguez", sales: 45 },
  { id: "4", title: "Ethereal Dreams", artist: "David Lee", sales: 41 },
  { id: "5", title: "Vibrant Expressions", artist: "Olivia Taylor", sales: 38 },
];

export default function AdminDashboardStats() {
  const res = React.use(getAnalyticsForAdminDashboard());

  if (!res.success) {
    return <div>Unable to load</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Stats Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{res.data.userTotal}</div>
            <p className="text-xs text-muted-foreground">+{res.data.userThisMonth} this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Artists</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{res.data.artistTotal}</div>
            <p className="text-xs text-muted-foreground">+{res.data.artistLastMonth} this month</p>
          </CardContent>
        </Card>
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
      </div>

      {/* Additional Stats Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{res.data.averageOrderValue}</div>
            <p className="text-xs text-muted-foreground">{res.data.averageOrderValueThisMonth} from last month</p>
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

      {/* Top Selling Artworks Section */}
      <Card>
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
    </div>
  );
}
