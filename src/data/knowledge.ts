import { GlossaryEntry, TipEntry, FAQEntry } from '../types';

export const glossary: GlossaryEntry[] = [
  {
    id: 'neat',
    term: 'NEAT',
    definition: 'Non-Exercise Activity Thermogenesis. Calories burned through daily activities that aren\'t formal exercise - walking, fidgeting, standing, climbing stairs, etc. Increasing NEAT is a powerful way to boost calorie expenditure without additional gym time.',
    category: 'general',
  },
  {
    id: 'zone2',
    term: 'Zone 2 Cardio',
    definition: 'Low-intensity cardio performed at 60-70% of max heart rate (typically 120-140 BPM). You should be able to hold a conversation. This builds aerobic base, improves fat oxidation, and enhances recovery.',
    category: 'training',
  },
  {
    id: 'rpe',
    term: 'RPE',
    definition: 'Rate of Perceived Exertion. A 1-10 scale measuring how hard a set feels. RPE 7 = 3 reps left in tank. RPE 8 = 2 reps left. RPE 9 = 1 rep left. RPE 10 = maximum effort.',
    category: 'training',
  },
  {
    id: 'metcon',
    term: 'MetCon',
    definition: 'Metabolic Conditioning. High-intensity circuit training that elevates heart rate and challenges both cardiovascular and muscular systems simultaneously.',
    category: 'training',
  },
  {
    id: 'hiit',
    term: 'HIIT',
    definition: 'High-Intensity Interval Training. Alternating periods of intense effort with rest or low-intensity recovery. Effective for improving cardiovascular fitness and burning calories in less time.',
    category: 'training',
  },
  {
    id: 'deficit',
    term: 'Calorie Deficit',
    definition: 'Consuming fewer calories than your body burns. Required for fat loss. A moderate deficit of 300-500 calories daily leads to sustainable weight loss of about 0.5-1 kg per week.',
    category: 'nutrition',
  },
  {
    id: 'macros',
    term: 'Macros',
    definition: 'Macronutrients: protein, carbohydrates, and fats. Each provides calories (protein: 4 cal/g, carbs: 4 cal/g, fat: 9 cal/g) and serves different functions in the body.',
    category: 'nutrition',
  },
  {
    id: 'protein-target',
    term: 'Protein Target',
    definition: 'For fat loss while preserving muscle, aim for 1.6-2.2g protein per kg bodyweight (0.7-1g per lb). Higher protein increases satiety and supports muscle retention in a deficit.',
    category: 'nutrition',
  },
  {
    id: 'progressive-overload',
    term: 'Progressive Overload',
    definition: 'Gradually increasing the demands on your muscles over time - through more weight, reps, sets, or decreased rest. This is the fundamental driver of strength and muscle gains.',
    category: 'training',
  },
  {
    id: 'deload',
    term: 'Deload',
    definition: 'A planned reduction in training volume or intensity (usually 40-60% reduction) to allow recovery. Typically done every 4-8 weeks or when fatigue accumulates.',
    category: 'recovery',
  },
  {
    id: 'sleep-hygiene',
    term: 'Sleep Hygiene',
    definition: 'Practices that promote quality sleep: consistent sleep schedule, cool dark room, limiting screens before bed, avoiding caffeine after 2pm, and establishing a wind-down routine.',
    category: 'recovery',
  },
  {
    id: 'tdee',
    term: 'TDEE',
    definition: 'Total Daily Energy Expenditure. The total calories you burn in a day, including BMR (basal metabolic rate), exercise, and NEAT. Your calorie target for fat loss should be below your TDEE.',
    category: 'nutrition',
  },
];

export const tips: TipEntry[] = [
  {
    id: 'tip-1',
    title: 'Habit Stacking',
    content: 'Link new habits to existing ones. Example: "After I pour my morning coffee, I will drink a glass of water." This uses existing neural pathways to build new behaviors more easily.',
    category: 'mindset',
  },
  {
    id: 'tip-2',
    title: 'Front-Load Protein',
    content: 'Eat more protein earlier in the day. A high-protein breakfast (30-40g) reduces cravings and helps control hunger throughout the day.',
    category: 'nutrition',
  },
  {
    id: 'tip-3',
    title: 'Walk After Meals',
    content: 'A 10-15 minute walk after meals improves blood sugar control, aids digestion, and adds to your daily NEAT. This is one of the easiest fat loss accelerators.',
    category: 'activity',
  },
  {
    id: 'tip-4',
    title: 'Prep Wins the Week',
    content: 'Spending 2-3 hours on Sunday prepping meals removes daily decision fatigue. When healthy food is ready to eat, you\'ll eat healthy food.',
    category: 'nutrition',
  },
  {
    id: 'tip-5',
    title: 'Sleep is Gains',
    content: 'Poor sleep increases hunger hormones (ghrelin up, leptin down), reduces willpower, impairs recovery, and can stall fat loss. Prioritize 7.5-8.5 hours.',
    category: 'recovery',
  },
  {
    id: 'tip-6',
    title: 'Stress Management',
    content: 'Chronic stress elevates cortisol, which can increase appetite and promote fat storage, especially around the midsection. Include daily stress-relief practices: breathwork, walks, journaling.',
    category: 'mindset',
  },
  {
    id: 'tip-7',
    title: 'Track to Learn',
    content: 'You don\'t need to track forever, but tracking food for 2-4 weeks builds awareness of portion sizes and calorie density that lasts a lifetime.',
    category: 'nutrition',
  },
  {
    id: 'tip-8',
    title: 'Progress Photos > Scale',
    content: 'The scale fluctuates daily due to water, food volume, and more. Progress photos every 2 weeks show body composition changes the scale can\'t capture.',
    category: 'progress',
  },
];

export const faqs: FAQEntry[] = [
  {
    id: 'faq-1',
    question: 'What if I lose weight too fast?',
    answer: 'If you lose more than 0.8 kg (1.75 lbs) per week for two consecutive weeks, increase your daily calories by 100 kcal. Rapid loss often means muscle loss and metabolic slowdown. Sustainable is better than fast.',
  },
  {
    id: 'faq-2',
    question: 'What if my weight plateaus?',
    answer: 'If weight doesn\'t change (±0.2 kg) for two weeks despite consistent adherence: 1) Check if you\'re accurately tracking food, 2) Reduce calories by 100 kcal, OR 3) Add 10 minutes of cardio. Plateaus are normal - your body is adapting.',
  },
  {
    id: 'faq-3',
    question: 'Can I drink alcohol?',
    answer: 'Limit alcohol to 1-2 drinks maximum per week. Alcohol provides empty calories, impairs recovery, disrupts sleep, and can increase appetite. If you drink, account for the calories and avoid binge drinking.',
  },
  {
    id: 'faq-4',
    question: 'What if I miss a workout?',
    answer: 'Don\'t try to "make up" missed workouts by doubling up. Simply continue with the next scheduled session. Consistency over time matters more than perfection. One missed session won\'t derail progress.',
  },
  {
    id: 'faq-5',
    question: 'How much water should I really drink?',
    answer: 'Target 3 liters (100 oz) daily, more if sweating heavily. Adequate hydration supports metabolism, reduces false hunger signals, and improves workout performance. Spread intake throughout the day.',
  },
  {
    id: 'faq-6',
    question: 'Should I eat back exercise calories?',
    answer: 'Generally no. Calorie burn estimates are often inflated. Your deficit is already calculated with exercise in mind. If you\'re very active and feeling depleted, add 100-200 calories on training days only.',
  },
  {
    id: 'faq-7',
    question: 'What about cheat meals?',
    answer: 'Instead of "cheat meals," think "flexible meals." Plan occasional higher-calorie meals (not days) that fit your lifestyle. One meal won\'t ruin progress, but regular binges will. Stay within weekly targets.',
  },
  {
    id: 'faq-8',
    question: 'When should I expect visible results?',
    answer: 'You\'ll likely feel better (energy, sleep) within 1-2 weeks. Clothes may fit differently by week 3-4. Visible changes in photos typically appear around week 4-6. The scale shows progress sooner, but body recomposition takes time.',
  },
];

export const recoveryChecklist = [
  { id: 'recovery-1', label: 'Sleep 7.5-8.5 hours', completed: false },
  { id: 'recovery-2', label: 'Evening wind-down routine', completed: false },
  { id: 'recovery-3', label: 'No screens 30 min before bed', completed: false },
  { id: 'recovery-4', label: '5-10 min breathwork or meditation', completed: false },
  { id: 'recovery-5', label: 'Mobility/stretching routine', completed: false },
  { id: 'recovery-6', label: 'Limited alcohol (≤2 drinks/week)', completed: false },
  { id: 'recovery-7', label: 'Journaling or reflection', completed: false },
];
