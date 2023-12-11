// Initialize variables
var searchBtn = document.querySelector("#search-btn");
var searchHistory = document.querySelector("#search-history");
var searchInput = document.querySelector("#search-input");
var searchForm = document.querySelector("#search-form");
var apiKey = "38adf3c034f74797bf11f35f05d63c25";
var searchHistory = [];
var queryString = window.location.search;
var urlParams = new URLSearchParams(queryString);
var city = urlParams.get("city");

// If a user clicks the search button, get the search input and fetch data from the OpenWeatherMap API
addEventListener("click", function(event) {
    event.preventDefault();
    if (event.target.matches("#search-btn")) {
        var searchInput = document.querySelector("#search-input").value;
        searchHistory.push(searchInput);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        console.log(searchHistory);
        console.log("Search input: " + searchInput);
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&appid=" + apiKey;
        console.log("queryURL: " + encodeURI(queryURL));

        // Update the URL with the latest search
        history.pushState(null, null, "?city=" + searchInput);

        // Fetch data from the OpenWeatherMap API
        fetch(queryURL)
            .then(function(response) {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("Error: " + response.status);
                }
            })
            .then(function(data) {
                // Process the fetched data
                console.log(data);
                // Display the search results
                // TODO: Implement the logic to display the search results
            })
            .catch(function(error) {
                console.log(error);
                // Handle the error
                // TODO: Implement the error handling logic
            });
    }
});

// If searchHistory exists in localStorage on page load, display search history
if (localStorage.getItem("searchHistory")) {
    document.querySelector("#search-blank").style.display = "none";
    console.log("Search history detected!\n\nLast 10 results:");
    // Display search history on sidebar(id = search-history)
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    var startIndex = Math.max(0, searchHistory.length - 10);
    for (var i = searchHistory.length - 1; i >= startIndex; i--) {
        console.log("Search #" + i + ": " + searchHistory[i]);
        var searchHistoryItem = document.createElement("li");
        searchHistoryItem.textContent = searchHistory[i];
        searchHistoryItem.setAttribute("class", "list-group-item");
        searchHistoryItem.setAttribute("id", "search-history-item");
        searchHistoryItem.setAttribute("data-search", searchHistory[i]);
        searchHistoryItem.setAttribute("style", "cursor: pointer;");
        document.querySelector("#search-history").appendChild(searchHistoryItem);
    }
} else {
    document.querySelector("#search-blank").style.display = "block";
    console.log("No search history detected!");
}
// Add event listener to search history list items
document.addEventListener("click", function(event) {
    if (event.target.matches("#search-history-item")) {
        var selectedCity = event.target.getAttribute("data-search");
        // Update the URL with the selected city
        history.pushState(null, null, "?city=" + selectedCity);
    }
});