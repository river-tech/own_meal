import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ImacroDetails, IMealDefine } from 'model/user';
import useAuth from './useAuth';



const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface UseMacroReturn {
  macros: ImacroDetails | null;
  meal : IMealDefine[];
  loading: boolean;
  error  : string | null;

  /* actions */
  fetchAll   : () => Promise<void>;
  saveMacros : (payload: ImacroDetails, meals: IMealDefine[]) => Promise<boolean>;
  calcMacroDetail: (totalCal: number, c: number, p: number, f: number) => {
    name: string;
    gram: number;
    calories: number;
    color: string;
  }[];
}

export default function useMacroSettings(): UseMacroReturn {
  const { getToken } = useAuth();
  const [macros, setMacros] = useState<ImacroDetails | null>(null);
  const [meal, setMeal] = useState<IMealDefine[]>([
    { mealName: "Meal 1", mealTime: "07:00", percentCalories: 40 },
    { mealName: "Meal 2", mealTime: "12:00", percentCalories: 35 },
    { mealName: "Meal 3", mealTime: "19:00", percentCalories: 25 },
  ]);
  const [loading, setLoading] = useState(false);
  const [error  , setError  ] = useState<string | null>(null);

  /* ---------- 1. GET từ API / cache ---------- */
  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      /* 1a. lấy cache trước */
      const [macroStr, mealStr] = await Promise.all([
        AsyncStorage.getItem('macroDetails'),
        AsyncStorage.getItem('mealDetails'),
      ]);
      if (macroStr) setMacros(JSON.parse(macroStr));
      if (mealStr ) setMeal(JSON.parse(mealStr ));

      /* 1b. gọi API song song */
      const token = await getToken();
      if (!token) throw new Error('No token');

      const [macroRes, mealRes] = await Promise.all([
        axios.get(`${API_URL}/users/view/macro`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/meals/macro`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      /* 1c. set lại state + cache */
      if (macroRes.data) {
        setMacros(macroRes.data);
        await AsyncStorage.setItem('macroDetails', JSON.stringify(macroRes.data));
      }
      if (mealRes.data?.length) {
        setMeal(mealRes.data);
        await AsyncStorage.setItem('mealDetails', JSON.stringify(mealRes.data));
      }
    } catch (err: any) {
      console.log('fetchAll macro error', err);
      setError('Cannot load macros');
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  /* ---------- 2. POST / PUT ---------- */
  const saveMacros = useCallback(
    async (payload: ImacroDetails, mealsPayload: IMealDefine[]) => {
      try {
        setLoading(true);
        const token = await getToken();
        if (!token) throw new Error('No token');

        /* xác định create hay edit dựa caloriesTarget null / 0 */
        const isCreate = !macros || !macros.caloriesTarget;

        /* call macro */
        await axios.request({
          url   : `${API_URL}/users/${isCreate ? 'create' : 'edit'}/macro`,
          method: isCreate ? 'post' : 'put',
          data  : payload,
          headers: { Authorization: `Bearer ${token}` },
        });

        /* call meal */
        await axios.post(`${API_URL}/meals/create-update`, mealsPayload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        /* cập nhật local */
        setMacros(payload);
        setMeal(mealsPayload);
        await AsyncStorage.setItem('macroDetails', JSON.stringify(payload));
        await AsyncStorage.setItem('mealDetails' , JSON.stringify(mealsPayload));

        return true;
      } catch (e) {
        console.log('saveMacros error', e);
        setError('Save failed');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [getToken],
  );

  /* ---------- 3. Tính gram / kcal cho Carb-Protein-Fat ---------- */
  const calcMacroDetail = useCallback((totalCal: number, c: number, p: number, f: number) => {
    const carbCal    = (c / 100) * totalCal;
    const proteinCal = (p / 100) * totalCal;
    const fatCal     = (f / 100) * totalCal;

    return [
      {
        name: "Carb",
        gram: Math.round(carbCal / 4),
        calories: Math.round(carbCal),
        color: "#FFA500",
      },
      {
        name: "Protein",
        gram: Math.round(proteinCal / 4),
        calories: Math.round(proteinCal),
        color: "#B22222",
      },
      {
        name: "Fat",
        gram: Math.round(fatCal / 9),
        calories: Math.round(fatCal),
        color: "#FFA500",
      },
    ];
  }, []);

  /* auto fetch once */
  useEffect(() => { fetchAll(); }, []);

  return { macros, meal, loading, error, fetchAll, saveMacros, calcMacroDetail };
}
