// seed-enhanced.js
const mongoose = require('mongoose');
const connectDB = require('./db');
const Exercise = require('./models/Exercise');
require('dotenv').config();

const enhancedExercises = [
  // BODYWEIGHT - FULL BODY
  {
    name: 'Burpees',
    focus_tag: 'full_body',
    equipment_tag: 'bodyweight',
    instructions: '1. Start standing. 2. Drop into a squat with hands on ground. 3. Kick feet back to plank. 4. Do a push-up. 5. Jump feet back to squat. 6. Explode up with arms overhead.',
    difficulty: 'intermediate',
    musclesWorked: ['chest', 'legs', 'core', 'shoulders'],
    gifUrl: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmk4c3ZlbjFkcXM2c2twYmJsN250ODgwbmtqeWdneGhqOHJ3Mjh1bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2TfCCfMdDbGTe/giphy.gif'
  },
  {
    name: 'Mountain Climbers',
    focus_tag: 'full_body',
    equipment_tag: 'bodyweight',
    instructions: '1. Start in plank position. 2. Drive right knee toward chest. 3. Quickly switch legs. 4. Continue alternating at a fast pace. 5. Keep core tight and hips level.',
    difficulty: 'beginner',
    musclesWorked: ['core', 'shoulders', 'legs'],
    gifUrl: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2ZhYjdkcHAwYjRoNHk4cjI3eXoxc2tic3QybGk3anZlZWdpb2RlNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/bWYc47O3jSef6/giphy.gif'
  },
  {
    name: 'Plank',
    focus_tag: 'full_body',
    equipment_tag: 'bodyweight',
    instructions: '1. Start on forearms and toes. 2. Keep body in straight line from head to heels. 3. Engage core and squeeze glutes. 4. Hold position. 5. Breathe steadily.',
    difficulty: 'beginner',
    musclesWorked: ['core', 'shoulders', 'back'],
    gifUrl: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTc5M250Z3gydHZ6c3RxeTJ1NXQ4bXIxdTVsOGR2NGxwNDVtN2ZmbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/d3mlADRlF7SMFQRy/giphy.gif'
  },
  {
    name: 'Jumping Jacks',
    focus_tag: 'full_body',
    equipment_tag: 'bodyweight',
    instructions: '1. Start standing with feet together. 2. Jump feet out while raising arms overhead. 3. Jump back to start position. 4. Keep core engaged throughout. 5. Maintain steady rhythm.',
    difficulty: 'beginner',
    musclesWorked: ['legs', 'shoulders', 'core'],
    gifUrl: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnphaXp6c3N3eW55dzh6c21pcXI0ejhlZXpzMzY2amR4cjJsNzI2ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/RgtuKqJ8rPII4qdRjp/giphy.gif'
  },

  // BODYWEIGHT - PUSH
  {
    name: 'Push Up',
    focus_tag: 'push',
    equipment_tag: 'bodyweight',
    instructions: '1. Start in plank position with hands shoulder-width. 2. Lower chest to ground keeping elbows at 45°. 3. Push back up to start. 4. Keep core tight and body straight. 5. Breathe out on push up.',
    difficulty: 'beginner',
    musclesWorked: ['chest', 'triceps', 'shoulders'],
    gifUrl: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjhscmt5ODV4OXVpdmduODFhYjZlc2lzZThnYjlxNDJnMXlxYmVzbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/BIQjXVXfZHoOWdiTkW/giphy.gif'
  },
  {
    name: 'Diamond Push Ups',
    focus_tag: 'push',
    equipment_tag: 'bodyweight',
    instructions: '1. Start in push-up position. 2. Place hands together forming diamond with thumbs and index fingers. 3. Lower chest to hands. 4. Push back up. 5. Keep elbows close to body.',
    difficulty: 'advanced',
    musclesWorked: ['triceps', 'chest', 'shoulders'],
    gifUrl: 'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdDdvcXc3YTRxa2xpa3d5cXg2YmluMHF6cGtvZ2FvcW54NXRubndwOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/srOogZJmCOFkymR1jo/giphy.gif'
  },
  {
    name: 'Pike Push Ups',
    focus_tag: 'push',
    equipment_tag: 'bodyweight',
    instructions: '1. Start in downward dog position (hips high). 2. Bend elbows lowering head toward ground. 3. Push back up. 4. Keep legs straight. 5. Focus on shoulder engagement.',
    difficulty: 'intermediate',
    musclesWorked: ['shoulders', 'triceps', 'upper chest'],
    gifUrl: 'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExOGYzcjlsd2NkbzVxbm5oYWt4cHpoYzJwdGNlbHlkNzR2Znk4YXUyeiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/6wLz7povE9WOMzcMU4/giphy.gif'
  },
  {
    name: 'Tricep Dips',
    focus_tag: 'push',
    equipment_tag: 'bodyweight',
    instructions: '1. Sit on chair/bench edge with hands beside hips. 2. Slide forward off edge. 3. Lower body by bending elbows to 90°. 4. Push back up. 5. Keep elbows pointing back.',
    difficulty: 'beginner',
    musclesWorked: ['triceps', 'shoulders', 'chest'],
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWY5dzRvd2Z2MGc0ZmV6cTEzZXoxdHh6aDgwcnZ1ZHphdnN0cWs1MiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/IDSnnT7vSwHbbLtzOR/giphy.gif'
  },

  // BODYWEIGHT - PULL
  {
    name: 'Pull Ups',
    focus_tag: 'pull',
    equipment_tag: 'bodyweight',
    instructions: '1. Hang from bar with hands shoulder-width. 2. Pull up until chin over bar. 3. Lower with control. 4. Keep core engaged. 5. Avoid swinging.',
    difficulty: 'advanced',
    musclesWorked: ['back', 'biceps', 'forearms'],
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeXphNWw3amw5dWRoOW05cnJwYTI5ZmdkbmFkMHZvZ2gzNXRlMTQwbCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ejhGXBubaEVqKBv92g/giphy.gif'
  },
  {
    name: 'Inverted Rows',
    focus_tag: 'pull',
    equipment_tag: 'bodyweight',
    instructions: '1. Lie under low bar. 2. Grab bar with overhand grip. 3. Keep body straight. 4. Pull chest to bar. 5. Lower with control.',
    difficulty: 'intermediate',
    musclesWorked: ['back', 'biceps', 'rear shoulders'],
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzk3NmJ4dGF6a21yZTR5eTdjaDZ0bTR0dXp6ZWZpZXExYmtnOGJpaSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/GU6EZeAVC6czY4XUvv/giphy.gif'
  },
  {
    name: 'Superman Hold',
    focus_tag: 'pull',
    equipment_tag: 'bodyweight',
    instructions: '1. Lie face down. 2. Extend arms forward. 3. Lift arms, chest and legs off ground. 4. Hold position. 5. Squeeze shoulder blades together.',
    difficulty: 'beginner',
    musclesWorked: ['lower back', 'glutes', 'upper back'],
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaTF3OHUxeW1nb2w5N3B1enFpaWp5aW5lMGhtNXFlY28xb3c1MWlnMCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Df0bV2cUpLmf6AQKzJ/giphy.gif'
  },

  // BODYWEIGHT - LEGS
  {
    name: 'Air Squat',
    focus_tag: 'legs',
    equipment_tag: 'bodyweight',
    instructions: '1. Stand with feet shoulder-width. 2. Lower hips back and down. 3. Go until thighs parallel to ground. 4. Push through heels to stand. 5. Keep chest up throughout.',
    difficulty: 'beginner',
    musclesWorked: ['quads', 'glutes', 'hamstrings'],
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnNseDUwZGE0NnByeTJ4YWVxMWNyamZqbzZmeHZma3N2dDF0d3E4cSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/XbOXk8xypeJbiQgnuP/giphy.gif'
  },
  {
    name: 'Lunges',
    focus_tag: 'legs',
    equipment_tag: 'bodyweight',
    instructions: '1. Stand tall. 2. Step forward with one leg. 3. Lower back knee toward ground. 4. Both knees at 90°. 5. Push back to start. 6. Alternate legs.',
    difficulty: 'beginner',
    musclesWorked: ['quads', 'glutes', 'hamstrings'],
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdjNvemN3bHd0YzB1bHlkYmRyMXJ1enQzeHN2Nm80b3AwMnBjMTl6bCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/McCvW7U8BX3QB3PXAg/giphy.gif'
  },
  {
    name: 'Jump Squats',
    focus_tag: 'legs',
    equipment_tag: 'bodyweight',
    instructions: '1. Start in squat position. 2. Explode up jumping high. 3. Land softly back in squat. 4. Repeat immediately. 5. Use arms for momentum.',
    difficulty: 'intermediate',
    musclesWorked: ['quads', 'glutes', 'calves'],
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHg1b2V3MGRpdXVpOGlid3p2MWh3OHRldWwzanBhZmZzYXBsemFidSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/eSoIC0aHgHKCg3NqDn/giphy.gif'
  },
  {
    name: 'Bulgarian Split Squats',
    focus_tag: 'legs',
    equipment_tag: 'bodyweight',
    instructions: '1. Place back foot on bench. 2. Stand on front leg. 3. Lower back knee toward ground. 4. Push through front heel to stand. 5. Complete reps then switch legs.',
    difficulty: 'intermediate',
    musclesWorked: ['quads', 'glutes', 'hamstrings'],
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExb2FrYjl6emw4MmZ4aTA3MHhnMWRycjFwenZnYzh0eGRsMXJrbG53MyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/LHvD0ogJrdWhtXtdtF/giphy.gif'
  },

  // DUMBBELLS - FULL BODY
  {
    name: 'Dumbbell Thruster',
    focus_tag: 'full_body',
    equipment_tag: 'dumbbells_only',
    instructions: '1. Hold dumbbells at shoulders. 2. Squat down. 3. Drive up explosively. 4. Press dumbbells overhead. 5. Lower dumbbells back to shoulders.',
    difficulty: 'intermediate',
    musclesWorked: ['legs', 'shoulders', 'core'],
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExc2lwMmc3bWhtbTVkZXM0YncyYjhzNWRlcDZjdzl3MmRvMDU3ajQ2dCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/lJyqZarjgFUftZz91X/giphy.gif'
  },
  {
    name: 'Man Makers',
    focus_tag: 'full_body',
    equipment_tag: 'dumbbells_only',
    instructions: '1. Hold dumbbells in push-up position. 2. Do push-up. 3. Row each arm. 4. Jump feet to hands. 5. Clean dumbbells to shoulders. 6. Press overhead.',
    difficulty: 'advanced',
    musclesWorked: ['full body'],
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaHZvdXlpMWxiMHhhdWpnODZiNWFhc3ZhN24yYTJsYWMyaDlpOWxheCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/iFJLOo8yKenAZlfh6A/giphy.gif'
  },

  // DUMBBELLS - PUSH
  {
    name: 'Dumbbell Push Press',
    focus_tag: 'push',
    equipment_tag: 'dumbbells_only',
    instructions: '1. Hold dumbbells at shoulders. 2. Dip knees slightly. 3. Drive up explosively. 4. Press dumbbells overhead. 5. Lower with control.',
    difficulty: 'intermediate',
    musclesWorked: ['shoulders', 'triceps', 'legs'],
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY25yOG0zbjloMWhiZHBkanllb200MXV4bDZwajJzZDV2eGxsMGhzZCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/7lugb7ObGYiXe/giphy.gif'
  },
  {
    name: 'Dumbbell Chest Press',
    focus_tag: 'push',
    equipment_tag: 'dumbbells_only',
    instructions: '1. Lie on bench holding dumbbells. 2. Start with arms extended. 3. Lower dumbbells to chest. 4. Press back up. 5. Keep elbows at 45°.',
    difficulty: 'beginner',
    musclesWorked: ['chest', 'triceps', 'shoulders'],
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmZxbmZ2OTZubG11dGhqYzJmNG1hNW5sNHFjOHB6NTdjMWtjZW9zNCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/z1Suqc2f0GCPReDgUB/giphy.gif'
  },
  {
    name: 'Dumbbell Overhead Press',
    focus_tag: 'push',
    equipment_tag: 'dumbbells_only',
    instructions: '1. Stand with dumbbells at shoulders. 2. Press dumbbells straight up. 3. Lock out arms overhead. 4. Lower with control. 5. Keep core tight.',
    difficulty: 'beginner',
    musclesWorked: ['shoulders', 'triceps', 'upper chest'],
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWV3b3E4bGJyMXRlNjc0bnA0bWV1cjB3cjlpOWFjYmY1bWNza2FjZCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/QAnF7fUn6ykSLlmZk9/giphy.gif'
  },
  {
    name: 'Dumbbell Tricep Extension',
    focus_tag: 'push',
    equipment_tag: 'dumbbells_only',
    instructions: '1. Hold one dumbbell with both hands overhead. 2. Lower behind head by bending elbows. 3. Keep upper arms still. 4. Extend back up. 5. Control the movement.',
    difficulty: 'beginner',
    musclesWorked: ['triceps'],
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXk0MHhjZXZtY2t1NG5jOTE3aXV2MTJsY21kOW1lMW1sd3hhMW40ZCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/cJMZtP13i6nlhTip3V/giphy.gif'
  },

  // DUMBBELLS - PULL
  {
    name: 'Dumbbell Row (per arm)',
    focus_tag: 'pull',
    equipment_tag: 'dumbbells_only',
    instructions: '1. Place one knee on bench. 2. Hold dumbbell in opposite hand. 3. Pull dumbbell to hip. 4. Squeeze shoulder blade. 5. Lower with control. 6. Switch sides.',
    difficulty: 'beginner',
    musclesWorked: ['back', 'biceps', 'rear shoulders'],
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGlibzNscXA2MGtteWl1NHY1OTdkeXoxa2dmMTk5bG42eGo0NmFrMSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l46CurBmMVnuBTbMs/giphy.gif'
  },
  {
    name: 'Dumbbell Bent Over Row',
    focus_tag: 'pull',
    equipment_tag: 'dumbbells_only',
    instructions: '1. Hinge forward at hips with dumbbells. 2. Keep back flat. 3. Pull dumbbells to hips. 4. Squeeze shoulder blades. 5. Lower with control.',
    difficulty: 'intermediate',
    musclesWorked: ['back', 'biceps', 'rear shoulders'],
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWRocDZzOGp3bXFrbDE2dXFidmVsYmIwNmN0M3RtYmhubW45ZjlraCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/RuDMfiBPHlt0lVOMiq/giphy.gif'
  },
  {
    name: 'Dumbbell Bicep Curl',
    focus_tag: 'pull',
    equipment_tag: 'dumbbells_only',
    instructions: '1. Stand with dumbbells at sides. 2. Keep elbows close to body. 3. Curl dumbbells to shoulders. 4. Squeeze biceps at top. 5. Lower slowly.',
    difficulty: 'beginner',
    musclesWorked: ['biceps', 'forearms'],
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZHpycHM0OHFuOHIzcXZmeGtzc2phaGluajkwbzRpcXpuZnl0czdyciZlcD12MV9naWZzX3NlYXJjaCZjdD1n/5UpHZfVWAyx9WRI2od/giphy.gif'
  },
  {
    name: 'Dumbbell Hammer Curl',
    focus_tag: 'pull',
    equipment_tag: 'dumbbells_only',
    instructions: '1. Hold dumbbells with palms facing each other. 2. Curl up keeping palms facing. 3. Squeeze at top. 4. Lower slowly. 5. Keep elbows stationary.',
    difficulty: 'beginner',
    musclesWorked: ['biceps', 'forearms', 'brachialis'],
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWp0MGhvZ3JqZWNpNWRnMnlyaXFpYW5qZm1waTFmMHNnbHgxcW90ZiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/7wjAml7kljXvs6BVwq/giphy.gif'
  },

  // DUMBBELLS - LEGS
  {
    name: 'Dumbbell Goblet Squat',
    focus_tag: 'legs',
    equipment_tag: 'dumbbells_only',
    instructions: '1. Hold dumbbell at chest with both hands. 2. Squat down keeping chest up. 3. Push knees out. 4. Go until thighs parallel. 5. Drive through heels to stand.',
    difficulty: 'beginner',
    musclesWorked: ['quads', 'glutes', 'core'],
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZTJid2VkdXM3NjFtdnl1a2l3M2lrbm92NHV4Zzl1ejBjanIzeG4wdCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/sFA7kr2QBSC3oGasvz/giphy.gif'
  },
  {
    name: 'Dumbbell Romanian Deadlift',
    focus_tag: 'legs',
    equipment_tag: 'dumbbells_only',
    instructions: '1. Hold dumbbells in front of thighs. 2. Hinge at hips pushing them back. 3. Lower dumbbells along legs. 4. Feel hamstring stretch. 5. Drive hips forward to stand.',
    difficulty: 'intermediate',
    musclesWorked: ['hamstrings', 'glutes', 'lower back'],
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExODE5dGs2N3pyZnRtdWM3MWFwaGhzNzkxbHd0aWw5a2ZoZ2xraHU2MyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/OTXTsWS8rRws7DhUQl/giphy.gif'
  },
  {
    name: 'Dumbbell Lunges',
    focus_tag: 'legs',
    equipment_tag: 'dumbbells_only',
    instructions: '1. Hold dumbbells at sides. 2. Step forward. 3. Lower back knee. 4. Push through front heel. 5. Return to start. 6. Alternate legs.',
    difficulty: 'beginner',
    musclesWorked: ['quads', 'glutes', 'hamstrings'],
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnl5dXpqaDEyMzR0OTFheXowOXViaDBnODY0dGs5bG9pZWV1dHVxYiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/StVhHPCcDPoa4eiwC4/giphy.gif'
  },
  {
    name: 'Dumbbell Bulgarian Split Squat',
    focus_tag: 'legs',
    equipment_tag: 'dumbbells_only',
    instructions: '1. Hold dumbbells. 2. Place back foot on bench. 3. Lower back knee down. 4. Push through front heel. 5. Complete reps then switch.',
    difficulty: 'intermediate',
    musclesWorked: ['quads', 'glutes', 'hamstrings'],
    gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYzBwNHIwYXR2aTh0bXpqeHBrb3E0bzE1ZjZmbG9tM3N3a2FhanlsNCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Q8O1oo9cKR3zbBJA2D/giphy.gif'
  }
];

const importEnhancedData = async () => {
  await connectDB();
  try {
    await Exercise.deleteMany();
    await Exercise.insertMany(enhancedExercises);
    console.log(`✅ ${enhancedExercises.length} Enhanced Exercises Imported Successfully!`);  
    process.exit();
  } catch (error) {
    console.error(`❌ Error with data import: ${error}`);
    process.exit(1);
  }
};

importEnhancedData();