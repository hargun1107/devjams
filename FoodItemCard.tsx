import { FoodItem, getExpiryStatus, getDaysUntilExpiry } from "../types/food";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Calendar, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface FoodItemCardProps {
  item: FoodItem;
  onDelete: (id: string) => void;
}

export function FoodItemCard({ item, onDelete }: FoodItemCardProps) {
  const expiryStatus = getExpiryStatus(item.expiryDate);
  const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
  
  const statusConfig = {
    fresh: {
      color: "bg-fresh text-fresh-foreground",
      text: daysUntilExpiry > 7 ? `${daysUntilExpiry} days left` : `${daysUntilExpiry} days left`,
      cardBorder: "border-fresh/20"
    },
    expiring: {
      color: "bg-expiring text-expiring-foreground",
      text: daysUntilExpiry === 0 ? "Expires today!" : `${daysUntilExpiry} days left`,
      cardBorder: "border-expiring/30"
    },
    expired: {
      color: "bg-expired text-expired-foreground",
      text: `Expired ${Math.abs(daysUntilExpiry)} days ago`,
      cardBorder: "border-expired/30"
    }
  };

  const config = statusConfig[expiryStatus];

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-lg",
      config.cardBorder,
      expiryStatus === "expired" && "opacity-75"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-card-foreground">
            {item.name}
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            <Tag className="w-3 h-3 mr-1" />
            {item.category}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Expires: {new Date(item.expiryDate).toLocaleDateString()}</span>
          </div>
          
          <Badge className={cn("text-xs font-medium", config.color)}>
            {config.text}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(item.id)}
          className="w-full text-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Remove Item
        </Button>
      </CardFooter>
    </Card>
  );
}