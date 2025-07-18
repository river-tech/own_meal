import { EUserGoal } from "app/Profile/Personal";


export enum EUserDietType {
  Custom = "Custom",
  Balanced = "Balanced", // 50%C–30%F–20%P
  HighProtein = "HighProtein", // 40%C–30%F–30%P
  LowCarb = "LowCarb", // 25%C–35%F–40%P
  LowFat = "LowFat", // 60%C–15%F–25%P
  HighCarb = "HighCarb", // 65%C–20%F–15%P
}

export interface IUser {
  id: int;
  username: string;
  email: string;
  name: string;
  avatar_url: string;
  notification_enable: string;
}

export interface Imacros {
  height: number;
  height_unit: string;
  weight: number;
  weight_unit: string;
 
  gender: string;

  goal: EUserGoal;

  body_fat: number;

  activity_level: number;

  bmi: number;

  bmr: number;

  calories: number;
}

export interface ImacroDetails {
  
  diet_type : EUserDietType;
  carb_percent: number;
  protein_percent: number;
  fat_percent: number;
  water_target_ml: number;
  meal_number: number;
  meals : IMealDefine[];
}

export interface IMealDefine {
  meal_name : string;
  meal_time: string;
  percent_calories: number;
}
