import { useState } from "react";
import { FoodItem, getExpiryStatus } from "../types/food";
import { FoodItemCard } from "./FoodItemCard";
import { AddFoodForm } from "./AddFoodForm";
import { PantryStats } from "./PantryStats";
import { SearchBar } from "./SearchBar";
import { RecipeSuggestions } from "./RecipeSuggestions";
import { Button } from "@/components/ui/button";
import { Plus, Package } from "lucide-react";

export function PantryDashboard() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([
    {
      id: "1",
      name: "Greek Yogurt",
      category: "Dairy",
      expiryDate: "2024-09-25",
      addedDate: "2024-09-18"
    },
    {
      id: "2", 
      name: "Whole Milk",
      category: "Dairy",
      expiryDate: "2024-09-22",
      addedDate: "2024-09-15"
    },
    {
      id: "3",
      name: "Fresh Spinach",
      category: "Vegetables",
      expiryDate: "2024-09-28",
      addedDate: "2024-09-19"
    }
  ]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(foodItems.map(item => item.category)))];

  const filteredItems = foodItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get items that are expiring soon (status is expiring or expired)
  const expiringItems = foodItems.filter(item => {
    const status = getExpiryStatus(item.expiryDate);
    return status === "expiring" || status === "expired";
  });

  const addFoodItem = (newItem: Omit<FoodItem, "id" | "addedDate">) => {
    const foodItem: FoodItem = {
      ...newItem,
      id: Date.now().toString(),
      addedDate: new Date().toISOString().split("T")[0]
    };
    setFoodItems(prev => [...prev, foodItem]);
    setShowAddForm(false);
  };

  const deleteFoodItem = (id: string) => {
    setFoodItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Package className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Smart Pantry
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Keep track of your food items and never waste food again
          </p>
        </div>

        {/* Stats */}
        <PantryStats items={foodItems} />

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-fresh hover:bg-fresh/90 text-fresh-foreground shadow-lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Food Item
          </Button>
        </div>

        {/* Recipe Suggestions */}
        {expiringItems.length > 0 && (
          <RecipeSuggestions expiringItems={expiringItems} />
        )}

        {/* Add Food Form */}
        {showAddForm && (
          <AddFoodForm
            onAdd={addFoodItem}
            onCancel={() => setShowAddForm(false)}
          />
        )}

        {/* Food Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <FoodItemCard
                key={item.id}
                item={item}
                onDelete={deleteFoodItem}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">
                No food items found
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {searchTerm || selectedCategory !== "All" 
                  ? "Try adjusting your search filters"
                  : "Add your first food item to get started"
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}