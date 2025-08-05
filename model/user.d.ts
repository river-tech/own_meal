import { EHeightUnit, EUserGoal } from "app/Profile/Personal";
import { EUserDietType } from "app/Profile/Personal/MacroSetting";


export interface IUser {
  userId?: number;
  username?: string | null;
  email?: string | null;
  avatar?: string | null;
  notification?: boolean | null;
}

export interface IToken {
  value: string;
  expires: string;
}


export interface IPersonalDetails {
  userId?: number;
  age: number | null;
  gender: boolean | null;
  height: number | null;
  heightUnit: EHeightUnit | null; // tương ứng với enum HeightUnit
  weight: number | null;
  weightUnit: EWeightUnit | null; // tương ứng với enum WeightUnit
  userGoal: EUserGoal | null; // tương ứng với enum UserGoal
  bodyFat: number | null;
  activityLevel: number | null;
  bmrIndex: number | null;
  bmiIndex: number | null;
  caloriesIndex: number | null;
}

export interface ImacroDetails {
  caloriesTarget:  number; // Tổng số calo cần
  mealNumber: number; // Số lượng bữa ăn
  dietType: EUserDietType; // Loại chế độ ăn
  carbPercent: number; // Tỉ lệ carb
  proteinPercent: number; // Tỉ lệ protein
  fatPercent: number; // Tỉ lệ chất béo
  waterTargetMl: number; // Mục tiêu nước (ml)
}


export interface IMealDefine {
  id?: number; // ID của bữa ăn, có thể không có nếu là bữa ăn mới
  mealName: string;
  mealTime: string;
  percentCalories: number;
}
