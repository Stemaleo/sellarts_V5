'use client';

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Users, Palette, ShoppingCart, TrendingUp, Loader2 } from "lucide-react";
import { getAnalyticsForAdminDashboard } from "@/actions/analytics";
import { useCurrency } from "@/context/CurrencyContext";
import { convertPrice } from '@/actions/currencyConverter';
import { useTranslations } from "next-intl";

export default function AdminDashboardStats() {
  const [analyticsData, setAnalyticsData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [loadingStats, setLoadingStats] = React.useState(true);
  const { currency } = useCurrency();
  const t = useTranslations("adminDashboard");

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAnalyticsForAdminDashboard();
        if (res) {
          setAnalyticsData(res);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
        // Simulate loading for individual sections
        setTimeout(() => setLoadingStats(false), 1000);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="animate-spin w-8 h-8 mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (!analyticsData || !analyticsData.success || !analyticsData.data) {
    return <div>Unable to load</div>;
  }

  const data = analyticsData.data;

  const LoadingCard = () => (
    <div className="animate-pulse">
      <div className="h-20 bg-gray-200 rounded-lg"></div>
    </div>
  );

  return (
    <div className="space-y-4 p-4 md:space-y-6 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold">{t('admin-dashboard')}</h1>
      
      {/* Stats Section */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:gap-4">
        {loadingStats ? Array(4).fill(0).map((_, i) => <LoadingCard key={i} />) : (
          <>
            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('total-users')}</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{data.userTotal}</div>
                <p className="text-xs text-muted-foreground">+{data.userThisMonth} {t('this-month')}</p>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('total-artists')}</CardTitle>
                <Palette className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{data.artistTotal}</div>
                <p className="text-xs text-muted-foreground">+{data.artistLastMonth} {t('this-month')}</p>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('total-revenue')}</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{convertPrice(Number(data.totalRevenue), currency)} {currency}</div>
                <p className="text-xs text-muted-foreground">{data.thisMonthRevenueGrowth}% {t('from-last-month')}</p>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('total-orders')}</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{data.totalOrders}</div>
                <p className="text-xs text-muted-foreground">+{data.totalOrdersThisMonth} {t('this-month')}</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Additional Stats Section */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 md:gap-4">
        {loadingStats ? Array(2).fill(0).map((_, i) => <LoadingCard key={i} />) : (
          <>
            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('average-order-value')}</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{convertPrice(data.averageOrderValue, currency)} {currency}</div>
                <p className="text-xs text-muted-foreground">{data.averageOrderValueThisMonth} {t('from-last-month')}</p>
              </CardContent>
            </Card>

            <Card className="transition-all duration-300 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('artworks-listed')}</CardTitle>
                <Palette className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-xl md:text-2xl font-bold">{data.totalArtworks}</div>
                <p className="text-xs text-muted-foreground">+{data.totalArtworksThisMonth} {t('this-month')}</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Top Selling Artworks Section */}
      <Card className="overflow-x-auto transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <CardTitle>{t('top-selling-artworks')}</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingStats ? (
            <div className="animate-pulse space-y-4">
              {Array(5).fill(0).map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('artwork')}</TableHead>
                  <TableHead>{t('artist')}</TableHead>
                  <TableHead>{t('sales')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.topSellingArtworks?.map((artwork: any) => (
                  <TableRow key={artwork.artwork.id} className="transition-colors hover:bg-gray-100">
                    <TableCell className="font-medium">{artwork.artwork.title}</TableCell>
                    <TableCell>{artwork.artwork.artistName}</TableCell>
                    <TableCell>{artwork.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
