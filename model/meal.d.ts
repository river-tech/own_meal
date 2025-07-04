export  interface IMealCard {
  mealId: number;
  mealName: string;
  currentKcal: number;
  targetKcal: number;
  currentProtein: number;
  targetProtein: number;
  currentCarbs: number;
  targetCarbs: number;
  currentFat: number;
  targetFat: number;
}
interface IFoodItem {
  id: number;
  name: string;
  quantity: number;
  carb: number;
  protein: number;
  fat: number;
  total: number;
}

interface IMeal {
  id: number;
  mealName: string;
  foodList: FoodItem[];
}
