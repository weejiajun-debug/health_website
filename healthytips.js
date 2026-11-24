
const form = document.getElementById("health-form");
const formMessage = document.getElementById("form-message");
const scoreElement = document.getElementById("score");
const scoreCircle = document.getElementById("score-circle");
const resultMessage = document.getElementById("result-message");
const avgSleepElement = document.getElementById("avg-sleep");
const avgMealsElement = document.getElementById("avg-meals");
const avgWaterElement = document.getElementById("avg-water");
const suggestionsElement = document.getElementById("suggestions");

function average(values) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function showSuggestions(sleep, meals, water) {
  const suggestions = [];

  // General educational targets, not a medical diagnosis.
  if (sleep < 8) {
    suggestions.push(
      "Your average sleep is below 8 hours. If you are a teenager, aim for 8–10 hours of sleep and try keeping a regular bedtime."
    );
  } else if (sleep > 10) {
    suggestions.push(
      "You are averaging over 10 hours of sleep. Sleep needs vary with age, so consider your energy levels and usual routine too."
    );
  } else {
    suggestions.push(
      "Your average sleep is within the 8–10 hour range recommended for most teenagers. Keep building a restful routine."
    );
  }

  if (meals < 3) {
    suggestions.push(
      "You recorded fewer than 3 meals per day on average. Try to eat regularly and make sure you have enough food to meet your needs."
    );
  } else if (meals > 3) {
    suggestions.push(
      "You recorded more than 3 meals per day on average. Eating patterns vary; focus on balanced, satisfying meals and snacks when hungry."
    );
  } else {
    suggestions.push(
      "You recorded an average of 3 meals a day. Aim for varied, balanced foods and eat when your body needs nourishment."
    );
  }

  if (water < 6) {
    suggestions.push(
      "You recorded fewer than 6 cups of water per day. Keep water nearby and drink regularly; needs vary with heat, activity and individual circumstances."
    );
  } else if (water > 8) {
    suggestions.push(
      "You recorded more than 8 cups of water per day. Hydration needs vary, so drink according to thirst, activity and the weather."
    );
  } else {
    suggestions.push(
      "Your water intake is averaging 6–8 cups per day. Keep drinking regularly and adjust to thirst, exercise and hot weather."
    );
  }

  suggestions.push(
    "Remember to move in ways you enjoy and take breaks to care for your mental well-being. These habits are not included in this tracker."
  );

  suggestionsElement.replaceChildren();

  suggestions.forEach((suggestion) => {
    const item = document.createElement("li");
    item.textContent = suggestion;
    suggestionsElement.appendChild(item);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  formMessage.textContent = "";

  if (!form.reportValidity()) {
    return;
  }

  const data = new FormData(form);

  const sleep = [1, 2, 3].map((day) =>
    Number(data.get(`sleep${day}`))
  );

  const meals = [1, 2, 3].map((day) =>
    Number(data.get(`meals${day}`))
  );

  const water = [1, 2, 3].map((day) =>
    Number(data.get(`water${day}`))
  );

  const allValues = [...sleep, ...meals, ...water];

  if (allValues.some((value) => !Number.isFinite(value) || value < 0)) {
    formMessage.textContent = "Please enter valid, non-negative numbers.";
    return;
  }

  const avgSleep = average(sleep);
  const avgMeals = average(meals);
  const avgWater = average(water);

  /*
   * Educational score out of 100:
   * Sleep: up to 40 points, based on 8 hours.
   * Meals: up to 30 points, based on 3 meals.
   * Water: up to 30 points, based on 6 cups.
   *
   * These are simplified comparison benchmarks, not
   * universal medical recommendations or a health diagnosis.
   */
  const sleepPoints = Math.min(avgSleep / 8, 1) * 40;
  const mealPoints = Math.min(avgMeals / 3, 1) * 30;
  const waterPoints = Math.min(avgWater / 6, 1) * 30;

  const score = Math.round(sleepPoints + mealPoints + waterPoints);

  scoreElement.textContent = `${score}%`;
  scoreCircle.style.setProperty("--score-angle", `${score * 3.6}deg`);

  avgSleepElement.textContent = `${avgSleep.toFixed(1)} hours`;
  avgMealsElement.textContent = `${avgMeals.toFixed(1)} per day`;
  avgWaterElement.textContent = `${avgWater.toFixed(1)} cups/day`;

  if (score >= 85) {
    resultMessage.textContent =
      "Great effort! Keep nurturing your healthy daily habits.";
  } else if (score >= 60) {
    resultMessage.textContent =
      "You are building good habits! A few small changes could help.";
  } else {
    resultMessage.textContent =
      "Every journey starts somewhere. Choose one small habit to work on first.";
  }

  showSuggestions(avgSleep, avgMeals, avgWater);
});

form.addEventListener("reset", () => {
  scoreElement.textContent = "--%";
  scoreCircle.style.setProperty("--score-angle", "0deg");
  resultMessage.textContent =
    "Your journey starts with one small step!";
  avgSleepElement.textContent = "-- hours";
  avgMealsElement.textContent = "-- per day";
  avgWaterElement.textContent = "-- cups/day";
  formMessage.textContent = "";

  suggestionsElement.replaceChildren();

  const item = document.createElement("li");
  item.textContent =
    "Complete the tracker to receive personalised suggestions.";
  suggestionsElement.appendChild(item);
});
