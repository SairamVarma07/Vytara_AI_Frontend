export const estimateCalories = (mealType, mealName) => {
  const base = {
    Breakfast: 300,
    Lunch: 500,
    Dinner: 600,
    Snack: 150,
  };
  const length = mealName.length;
  return base[mealType] + Math.floor(length * 5);
};

export const estimateMacros = (calories) => {
  return {
    protein: Math.floor((calories * 0.3) / 4),
    carbs: Math.floor((calories * 0.4) / 4),
    fats: Math.floor((calories * 0.3) / 9),
  };
};
