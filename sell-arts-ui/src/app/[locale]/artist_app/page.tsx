import { getMyArtistProfileOverView } from "@/actions/artists";
import { use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, ShoppingCart, DollarSign, MessageCircle } from "lucide-react";
import { getAllOrdersForArtist } from "@/actions/cart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { getAnalyticsForAdminDashboard, getAnalyticsForArtistAndGallery } from "@/actions/analytics";
import  FloatingMessageButton from "@/components/ui/floatingMessageButton";
import { useCurrency } from "@/context/CurrencyContext";
import { convertPrice } from "@/actions/currencyConverter";

const ArtistApp = () => {
  const res = use(getAnalyticsForArtistAndGallery());
  const t = useTranslations();
  const { currency } = useCurrency();
  if (!res.success) {
    return <div>Unable to load</div>;
  }

  return (
    <div className="relative">
      <h1 className="text-3xl font-bold mb-6">{t("overview")}</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("revenu-total")}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{res.data.totalRevenue}</div>
            <p className="text-xs text-muted-foreground">{res.data.thisMonthRevenueGrowth}%{t("from-last-month")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("total-orders")}</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{res.data.totalOrders} {currency}</div>
            <p className="text-xs text-muted-foreground">+{res.data.totalOrdersThisMonth} {t("this-month")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("average-order-value")}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{convertPrice(res.data.averageOrderValue, currency)} {currency}</div>
            <p className="text-xs text-muted-foreground">{convertPrice(res.data.averageOrderValueThisMonth, currency)} {currency} {t("last-month")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("artworks-listed")}</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{res.data.totalArtworks}</div>
            <p className="text-xs text-muted-foreground">+{res.data.totalArtworksThisMonth} {t("this-month")}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{t("top-selling-artworks")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("artistsPage.Artists")}</TableHead>
                <TableHead>{t("artistsPage.Artworks")}</TableHead>
                <TableHead>{t("sales")}</TableHead>
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
