import { useEffect, useState } from "react";
import { FoodItem } from "../types/food";
import { Recipe, getRecipesByIngredients } from "../services/recipeService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ExternalLink, ChefHat } from "lucide-react";

interface RecipeSuggestionsProps {
  expiringItems: FoodItem[];
}

export function RecipeSuggestions({ expiringItems }: RecipeSuggestionsProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (expiringItems.length === 0) {
      setRecipes([]);
      return;
    }

    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const suggestedRecipes = await getRecipesByIngredients(expiringItems);
        setRecipes(suggestedRecipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [expiringItems]);

  if (expiringItems.length === 0) {
    return null;
  }

  return (
    <Card className="border-expiring/20 bg-gradient-to-r from-expiring/5 to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-expiring">
          <ChefHat className="h-5 w-5" />
          Recipe Suggestions
          <Badge variant="secondary" className="ml-2">
            {expiringItems.length} items expiring soon
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Use your expiring ingredients before they go bad!
        </p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-expiring"></div>
          </div>
        ) : recipes.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <Card key={recipe.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-sm mb-2 line-clamp-2">
                    {recipe.title}
                  </h4>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {recipe.readyInMinutes}min
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {recipe.servings}
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    {recipe.usedIngredients.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-fresh mb-1">Using:</p>
                        <div className="flex flex-wrap gap-1">
                          {recipe.usedIngredients.slice(0, 2).map((ingredient, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {ingredient}
                            </Badge>
                          ))}
                          {recipe.usedIngredients.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{recipe.usedIngredients.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {recipe.missedIngredients.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Need:</p>
                        <div className="flex flex-wrap gap-1">
                          {recipe.missedIngredients.slice(0, 2).map((ingredient, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {ingredient}
                            </Badge>
                          ))}
                          {recipe.missedIngredients.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{recipe.missedIngredients.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <Button size="sm" variant="outline" className="w-full" asChild>
                    <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Recipe
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No recipes found for your expiring ingredients. Try adding more items to your pantry!
          </p>
        )}
      </CardContent>
    </Card>
  );
}