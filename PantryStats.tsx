import { FoodItem, getExpiryStatus } from "../types/food";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface PantryStatsProps {
  items: FoodItem[];
}

export function PantryStats({ items }: PantryStatsProps) {
  const stats = items.reduce((acc, item) => {
    const status = getExpiryStatus(item.expiryDate);
    acc[status]++;
    acc.total++;
    return acc;
  }, { fresh: 0, expiring: 0, expired: 0, total: 0 });

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-card to-muted/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            in your pantry
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-fresh/5 to-fresh/10 border-fresh/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Fresh</CardTitle>
          <CheckCircle className="h-4 w-4 text-fresh" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-fresh">{stats.fresh}</div>
          <p className="text-xs text-muted-foreground">
            items still fresh
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-expiring/5 to-expiring/10 border-expiring/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
          <AlertTriangle className="h-4 w-4 text-expiring" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-expiring">{stats.expiring}</div>
          <p className="text-xs text-muted-foreground">
            use within 3 days
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-expired/5 to-expired/10 border-expired/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expired</CardTitle>
          <XCircle className="h-4 w-4 text-expired" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-expired">{stats.expired}</div>
          <p className="text-xs text-muted-foreground">
            should be removed
          </p>
        </CardContent>
      </Card>
    </div>
  );
}