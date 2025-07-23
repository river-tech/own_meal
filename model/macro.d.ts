export interface NutrientInfo {
  target: number;
  consumed: number;
}

export interface DailyOverview {
    id: number; // Unique identifier for the overview entry
  date: string; // YYYY-MM-DD
  calories_today: number;
  carb: NutrientInfo;
  protein: NutrientInfo;
  fat: NutrientInfo;
  total_calories_consumed: number;
}

export interface IWaterIntake {
    id : number;
    date: string; // YYYY-MM-DD
    water_intake: number; // in ml
    water_goal: number; // in ml
}


