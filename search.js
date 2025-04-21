const list = localStorage.getItem('saved_data');

const data = JSON.parse(list) || [];


let filteredItems = [...data]
let filters = {}

const appendFilteredItems = () => {
    
    applyFilters();
    
    searchResults.innerHTML = '';
    if (filteredItems.length === 0) {
        searchResults.innerHTML = '<p>No results found</p>';
        return;
    }
    
    filteredItems.forEach((item) => {
        
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.innerHTML = `
        <div class="recipe-card">
        <h2>${item.name}</h2>
        <p><strong>Course:</strong> ${item.crsname}</p>
        <p><strong>Ingredients:</strong> ${
            JSON.parse(item.ingred).map((ingredient) => ingredient.name).join(', ')
        }</p>
        <p class="description">${item.decrib}</p>
        <div class="card-actions">
        <a href="RecipePage.html" class="details-btn">View Details</a>
        <a href="editPage.html" class="edit-btn">Edit</a>
        </div>
        </div>
        `;
        
        searchResults.appendChild(recipeCard);
    });
}

const addFilter = (key, filter) => {
    filters[key] = filter;
}

const applyFilters = () => {
    filteredItems = [...data];
    console.log(filters);
    filteredItems = data.filter((item) => {
        return Object.values(filters).every((filter) => {
            return filter(item);
        });
    });
}

// Search functionality

const searchInput = document.getElementById('search-input');

const searchResults = document.getElementById('recipes-grid');
const searchButton = document.getElementById('search-button');

const search = () => {
    const searchTerm = searchInput.value.toLowerCase();

    addFilter(
        'search',(item) => {
        return item.name.toLowerCase().includes(searchTerm);
    });
    
    appendFilteredItems();
}

searchButton.addEventListener('click', search);
searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        search();
    }
});

// Ingredient filter functionality
const ingredientsInput = document.getElementById('ingredient-input');

ingredientsInput.addEventListener('change', (event) => {
    const selectedIngredients = ingredientsInput.value.split(',').map((ingredient) => ingredient.trim().toLowerCase());
    console.log(selectedIngredients);

    if (selectedIngredients.length == 1 && selectedIngredients[0] === '') {
        delete filters.ingredients;
    }
    else {
        addFilter(
            'ingredients', (item) => {
                const ingredients = JSON.parse(item.ingred).map((ingredient) => ingredient.name);
                return selectedIngredients.every((ingredient) => ingredients.includes(ingredient));
            }
        );
    }
    
    
    appendFilteredItems();
})