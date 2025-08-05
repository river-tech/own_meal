export interface IMealCard {
  id: number;
  date: string; // YYYY-MM-DD
  mealName: string;
  currentKcal: number;
  targetKcal: number;
  currentProtein: number;
  targetProtein: number;
  currentCarbs: number;
  targetCarbs: number;
  currentFat: number;
  targetFat: number;
  foodList?: IFoodItem[]; // Optional list of food items for the meal
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

