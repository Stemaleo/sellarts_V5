"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, ShoppingCart, DollarSign, MessageCircle, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTranslations } from "next-intl";
import { getAnalyticsForArtistAndGallery } from "@/actions/analytics";
import FloatingMessageButton from "@/components/ui/floatingMessageButton";
import { useCurrency } from "@/context/CurrencyContext";
import { convertPrice } from "@/actions/currencyConverter";

// Define the types for analytics data
interface ArtworkData {
  id: string;
  title: string;
  artistName: string;
}

interface TopSellingArtwork {
  artwork: ArtworkData;
  count: number;
}

interface AdminAnalyticsDTO {
  totalRevenue: number;
  thisMonthRevenueGrowth: number;
  totalOrders: number;
  totalOrdersThisMonth: number;
  averageOrderValue: number;
  averageOrderValueThisMonth: number;
  totalArtworks: number;
  totalArtworksThisMonth: number;
  topSellingArtworks: TopSellingArtwork[];
}

const ArtistApp = () => {
  const [analyticsData, setAnalyticsData] = useState<AdminAnalyticsDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const t = useTranslations();
  const { currency } = useCurrency();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAnalyticsForArtistAndGallery();
        if (res.success) {
          // Convert string totalRevenue to number before setting state
          setAnalyticsData({
            ...res.data,
            totalRevenue: parseFloat(res.data.totalRevenue)
          });
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
       <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your analytics...</p>
        </div>
    );
  }

  if (error || !analyticsData) {
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
            <div className="text-2xl font-bold">{convertPrice(analyticsData.totalRevenue, currency)} {currency}</div>
            <p className="text-xs text-muted-foreground">{analyticsData.thisMonthRevenueGrowth}%{t("from-last-month")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("total-orders")}</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalOrders} {currency}</div>
            <p className="text-xs text-muted-foreground">+{analyticsData.totalOrdersThisMonth} {t("this-month")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("average-order-value")}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{convertPrice(analyticsData.averageOrderValue, currency)} {currency}</div>
            <p className="text-xs text-muted-foreground">{convertPrice(analyticsData.averageOrderValueThisMonth, currency)} {currency} {t("last-month")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("artworks-listed")}</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalArtworks}</div>
            <p className="text-xs text-muted-foreground">+{analyticsData.totalArtworksThisMonth} {t("this-month")}</p>
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
              {analyticsData.topSellingArtworks.map((artwork) => (
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
