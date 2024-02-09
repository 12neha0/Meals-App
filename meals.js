const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

let favoriteMeals = JSON.parse(localStorage.getItem('favoriteMeals')) || [];

searchInput.addEventListener('input', debounce(searchMeals, 500));

async function searchMeals() {
  searchResults.innerHTML = ''; // Clear previous search results
  const searchTerm = searchInput.value.trim();
  if (searchTerm === '') return; // If search term is empty, return

  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
    const data = await response.json();
    if (data.meals === null) {
      searchResults.innerHTML = '<p>No meals found. Please try another search term.</p>';
      return;
    }

    data.meals.forEach(meal => {
      const mealCard = createMealCard(meal);
      searchResults.appendChild(mealCard);
    });
  } catch (error) {
    console.log('An error occurred:', error);
  }
}

function createMealCard(meal) {
  const mealCard = document.createElement('div');
  mealCard.classList.add('meal');
  mealCard.innerHTML = `
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    <h3>${meal.strMeal}</h3>
    <button onclick="addToFavorites('${meal.idMeal}')">Add to Favorites</button>
  `;
  return mealCard;
}

async function addToFavorites(mealId) {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    const data = await response.json();
    const favoriteMeal = data.meals[0];
    if (!favoriteMeals.some(meal => meal.idMeal === favoriteMeal.idMeal)) {
      favoriteMeals.push(favoriteMeal);
      localStorage.setItem('favoriteMeals', JSON.stringify(favoriteMeals));
    }
  } catch (error) {
    console.log('An error occurred:', error);
  }
}

// Utility function to debounce input events
function debounce(func, timeout) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
