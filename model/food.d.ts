interface INutrition {
  calories: number;
  protein: number;
  fat: number;
  saturated: number;
  unsaturated: number;
  trans: number;
  carbs: number;
  sugar: number;
  fiber: number;
  salt: number;
  potassium: number;
  calcium: number;
  iron: number;
  vitaminA: number;
  vitaminC: number;
  sodium: number;
}

interface IFood {
  name: string;
  creator: string;
  image: string;
  nutrition: Nutrition;
}