import { useState } from "react";
import { FoodItem } from "../types/food";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save, Camera, Edit } from "lucide-react";
import { BarcodeScanner } from "./BarcodeScanner";
import { lookupProduct } from "../services/foodLookupService";
import { useToast } from "@/hooks/use-toast";

interface AddFoodFormProps {
  onAdd: (item: Omit<FoodItem, "id" | "addedDate">) => void;
  onCancel: () => void;
}

const FOOD_CATEGORIES = [
  "Dairy", "Meat", "Vegetables", "Fruits", "Grains", "Snacks", 
  "Beverages", "Condiments", "Frozen", "Canned", "Other"
];

export function AddFoodForm({ onAdd, onCancel }: AddFoodFormProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [mode, setMode] = useState<"manual" | "scan">("manual");
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && category && expiryDate) {
      onAdd({
        name: name.trim(),
        category,
        expiryDate
      });
      setName("");
      setCategory("");
      setExpiryDate("");
      setMode("manual");
    }
  };

  const handleScan = async (barcode: string) => {
    setIsScanning(false);
    setIsLoading(true);

    try {
      const productInfo = await lookupProduct(barcode);
      
      if (productInfo) {
        setName(productInfo.name);
        setCategory(productInfo.category);
        
        if (productInfo.expiryDays) {
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + productInfo.expiryDays);
          setExpiryDate(expiryDate.toISOString().split("T")[0]);
        }

        toast({
          title: "Product found!",
          description: `Added ${productInfo.name} to the form`,
        });
      } else {
        toast({
          title: "Product not found",
          description: "Please enter the details manually",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Scan failed",
        description: "Please try again or enter details manually",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get today's date for min date validation
  const today = new Date().toISOString().split("T")[0];

  if (isScanning) {
    return (
      <BarcodeScanner
        onScan={handleScan}
        onClose={() => setIsScanning(false)}
      />
    );
  }

  return (
    <Card className="border-primary/20 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Add New Food Item</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2 mt-4">
          <Button
            type="button"
            variant={mode === "manual" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("manual")}
            className="flex-1"
          >
            <Edit className="h-4 w-4 mr-2" />
            Manual Entry
          </Button>
          <Button
            type="button"
            variant={mode === "scan" ? "default" : "outline"}
            size="sm"
            onClick={() => setIsScanning(true)}
            className="flex-1"
          >
            <Camera className="h-4 w-4 mr-2" />
            Scan Barcode
          </Button>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="ml-2 text-sm text-muted-foreground">Looking up product...</span>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="name">Food Name</Label>
            <Input
              id="name"
              placeholder="e.g., Greek Yogurt, Fresh Apples..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory} required disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {FOOD_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date</Label>
            <Input
              id="expiryDate"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              min={today}
              required
              disabled={isLoading}
            />
          </div>
        </CardContent>

        <CardFooter className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-fresh hover:bg-fresh/90 text-fresh-foreground"
            disabled={!name || !category || !expiryDate || isLoading}
          >
            <Save className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}