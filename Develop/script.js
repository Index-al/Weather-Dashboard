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

        // Update the city variable
        city = searchInput;

        // Update the URL with the latest search
        history.pushState(null, null, "?city=" + searchInput);

        // Display the results
        displayResults();
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
        // Update the city variable
        city = selectedCity;
        displayResults();
    }
});

// Function to update search history
function updateSearchHistory() {
    // Clear the search history
    document.querySelector("#search-history").innerHTML = "";
    // Display the updated search history
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
}

// If a city is specified in the URL, fetch data from the OpenWeatherMap API and display it on the page(section id = results, div id = current, div id = forecast)
function displayResults() {
    if (city) {
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;
        console.log("queryURL: " + encodeURI(queryURL));

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
            // Display the search results(use day.js to format the date)
            var currentCity = data.name;
            var currentDate = dayjs().format("MM/DD/YYYY");
            var currentIcon = data.weather[0].icon;
            var currentTemp = data.main.temp;
            var currentWindSpeed = data.wind.speed;
            var currentHumidity = data.main.humidity;

            // Display the current weather conditions
            // City name
            document.querySelector("#current").innerHTML = "<h2>" + currentCity + " (" + currentDate + ")</h2>";
            // Weather icon
            document.querySelector("#current").innerHTML += "<img src='http://openweathermap.org/img/w/" + currentIcon + ".png' alt='Current weather icon'>";
            // Temperature
            document.querySelector("#current").innerHTML += "<p>Temp: " + currentTemp + " °F</p>";
            // Wind speed
            document.querySelector("#current").innerHTML += "<p>Wind: " + currentWindSpeed + " MPH</p>";
            // Humidity
            document.querySelector("#current").innerHTML += "<p>Humidity: " + currentHumidity + "%</p>";

        })
        .catch(function(error) {
            console.log(error);
            // Extract the last 3 digits of the error
            var errorCode = error.message.slice(-3);
            // Display an error message on the page with the error code
            if (errorCode === "404") {
                document.querySelector("#results").innerHTML = "<h2 class='error-message'>City not found!</h2>";
                // Remove the city from the search history
                var index = searchHistory.indexOf(city);
                if (index > -1) {
                    searchHistory.splice(index, 1);
                    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
                    updateSearchHistory();
                }
            } else if (errorCode === "L')") {
                document.querySelector("#results").innerHTML = "<h2 class='error-message'>An error has occurred. Please refresh the page.</h2>";
                // Reload the page
                location.reload();
            } else {
                document.querySelector("#results").innerHTML = "<h2 class='error-message'>Error: " + errorCode + "</h2>";
            }
        });
        updateSearchHistory();
    }
}

// After all HTML elements have loaded, display the search results
window.onload = displayResults();