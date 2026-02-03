import { MealPrepItem, GroceryItem } from '../types';

export const defaultMacroTargets = {
  calories: 2200, // Mid-range of 2100-2300
  protein: 180, // ~0.8-1g per lb bodyweight
  carbs: 200,
  fat: 70,
};

export const sampleMealPlan = {
  breakfast: {
    name: 'Protein Oatmeal',
    description: 'Oats with protein powder, berries, and nut butter',
    calories: 450,
    protein: 35,
    carbs: 55,
    fat: 12,
    ingredients: ['1 cup oats', '1 scoop protein powder', '1 cup berries', '1 tbsp almond butter'],
  },
  lunch: {
    name: 'Chicken & Rice Bowl',
    description: 'Grilled chicken with rice and vegetables',
    calories: 550,
    protein: 45,
    carbs: 55,
    fat: 15,
    ingredients: ['6oz chicken breast', '1 cup brown rice', '2 cups mixed vegetables', '1 tbsp olive oil'],
  },
  snack1: {
    name: 'Greek Yogurt & Fruit',
    description: 'High protein snack',
    calories: 200,
    protein: 20,
    carbs: 25,
    fat: 2,
    ingredients: ['1 cup Greek yogurt', '1/2 cup mixed fruit', '1 tbsp honey'],
  },
  dinner: {
    name: 'Salmon with Sweet Potato',
    description: 'Omega-3 rich dinner',
    calories: 600,
    protein: 45,
    carbs: 45,
    fat: 25,
    ingredients: ['6oz salmon fillet', '1 medium sweet potato', '2 cups roasted broccoli', '1 tbsp olive oil'],
  },
  snack2: {
    name: 'Casein Shake',
    description: 'Pre-bed protein',
    calories: 150,
    protein: 25,
    carbs: 5,
    fat: 2,
    ingredients: ['1 scoop casein protein', '8oz water or almond milk'],
  },
};

export const defaultMealPrepItems: MealPrepItem[] = [
  { id: 'prep-1', name: 'Cook 2 lbs chicken breast', completed: false },
  { id: 'prep-2', name: 'Prep 4 cups brown rice', completed: false },
  { id: 'prep-3', name: 'Chop vegetables for the week', completed: false },
  { id: 'prep-4', name: 'Portion overnight oats (4 servings)', completed: false },
  { id: 'prep-5', name: 'Hard boil 12 eggs', completed: false },
  { id: 'prep-6', name: 'Wash and prep salad greens', completed: false },
  { id: 'prep-7', name: 'Portion snacks into containers', completed: false },
  { id: 'prep-8', name: 'Make protein balls (optional)', completed: false },
];

export const defaultGroceryList: GroceryItem[] = [
  // Proteins
  { id: 'g-1', name: 'Chicken breast', quantity: '3 lbs', category: 'Protein', checked: false },
  { id: 'g-2', name: 'Salmon fillets', quantity: '1.5 lbs', category: 'Protein', checked: false },
  { id: 'g-3', name: 'Eggs', quantity: '2 dozen', category: 'Protein', checked: false },
  { id: 'g-4', name: 'Greek yogurt', quantity: '32 oz', category: 'Protein', checked: false },
  { id: 'g-5', name: 'Lean ground beef', quantity: '1 lb', category: 'Protein', checked: false },

  // Carbs
  { id: 'g-6', name: 'Brown rice', quantity: '2 lbs', category: 'Carbs', checked: false },
  { id: 'g-7', name: 'Oats (rolled)', quantity: '42 oz', category: 'Carbs', checked: false },
  { id: 'g-8', name: 'Sweet potatoes', quantity: '4 medium', category: 'Carbs', checked: false },
  { id: 'g-9', name: 'Whole wheat bread', quantity: '1 loaf', category: 'Carbs', checked: false },

  // Vegetables
  { id: 'g-10', name: 'Broccoli', quantity: '2 heads', category: 'Vegetables', checked: false },
  { id: 'g-11', name: 'Spinach', quantity: '2 bags', category: 'Vegetables', checked: false },
  { id: 'g-12', name: 'Bell peppers', quantity: '4', category: 'Vegetables', checked: false },
  { id: 'g-13', name: 'Zucchini', quantity: '3', category: 'Vegetables', checked: false },
  { id: 'g-14', name: 'Mixed salad greens', quantity: '2 containers', category: 'Vegetables', checked: false },

  // Fruits
  { id: 'g-15', name: 'Bananas', quantity: '1 bunch', category: 'Fruits', checked: false },
  { id: 'g-16', name: 'Berries (frozen or fresh)', quantity: '2 lbs', category: 'Fruits', checked: false },
  { id: 'g-17', name: 'Apples', quantity: '6', category: 'Fruits', checked: false },

  // Fats & Condiments
  { id: 'g-18', name: 'Olive oil', quantity: '1 bottle', category: 'Fats', checked: false },
  { id: 'g-19', name: 'Almond butter', quantity: '1 jar', category: 'Fats', checked: false },
  { id: 'g-20', name: 'Avocados', quantity: '4', category: 'Fats', checked: false },

  // Supplements
  { id: 'g-21', name: 'Whey protein powder', quantity: '1 container', category: 'Supplements', checked: false },
  { id: 'g-22', name: 'Casein protein powder', quantity: '1 container', category: 'Supplements', checked: false },
];

export const adjustmentLogic = {
  tooFastLoss: {
    condition: 'Weekly weight loss > 0.8 kg for 2 consecutive weeks',
    action: 'Increase daily calories by 100 kcal',
    reason: 'Losing weight too quickly can lead to muscle loss and metabolic adaptation',
  },
  plateau: {
    condition: 'Weight change ≤ 0.2 kg for 2 consecutive weeks',
    action: 'Decrease daily calories by 100 kcal OR add 10 min cardio',
    reason: 'Your body has adapted - time to create a new deficit',
  },
};
