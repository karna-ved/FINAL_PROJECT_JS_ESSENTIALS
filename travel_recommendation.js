const API_URL = "travel_recommendation_api.json"; // Update if needed

// Fetch and display recommendations
async function fetchRecommendations() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        
        // Log the fetched data to check if it's loading correctly
        console.log("Fetched data:", data);

        let allItems = data.countries.flatMap(country => country.cities)
                        .concat(data.temples, data.beaches);

        displayRecommendations(allItems);
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        document.getElementById("recommendations-container").innerHTML = 
            "<p style='color:white; text-align:center;'>Failed to load recommendations.</p>";
    }
}


// Display recommendations in a scrollable right-side container
function displayRecommendations(data) {
    const container = document.getElementById("recommendations-container");
    container.innerHTML = ""; // Clear previous results

    if (!data || data.length === 0) {
        container.innerHTML = "<p style='color:white; text-align:center;'>No recommendations available.</p>";
        return;
    }

    console.log("Displaying:", data);

    data.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("recommendation-card");
        card.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}" class="city-image">
            <div class="info">
                <h2>${item.name}</h2>
                <p>${item.description}</p>
                <button class="visit-btn">Visit</button>
            </div>
        `;
        container.appendChild(card);
    });
}


// Search recommendations
async function searchRecommendations() {
    const searchInput = document.querySelector(".search-box input").value.toLowerCase().trim();
    if (!searchInput) return;

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        let allItems = data.countries.flatMap(c => c.cities).concat(data.temples, data.beaches);

        console.log("Searching for:", searchInput);
        console.log("All Items:", allItems);

        let filteredItems = allItems.filter(item =>
            item.name.toLowerCase().includes(searchInput) || 
            item.description.toLowerCase().includes(searchInput)
        );

        console.log("Filtered Items:", filteredItems);

        displayRecommendations(filteredItems);
    } catch (error) {
        console.error("Error during search:", error);
    }
}


// Event listeners
document.querySelector(".search-btn").addEventListener("click", searchRecommendations);
document.querySelector(".clear-btn").addEventListener("click", () => {
    document.querySelector(".search-box input").value = "";
    // fetchRecommendations();
});

// Load recommendations on page load
// window.onload = fetchRecommendations;
