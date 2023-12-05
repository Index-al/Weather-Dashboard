// When a user clicks the "search" button, the following will happen:
// 1. The search term will be saved to localStorage
// 1a. This will be done by creating a new array, pushing the search term to the array, and then saving the array to localStorage
// 1b. If the array already exists, the search term will be pushed to the array and then saved to localStorage
// 1c. The array will be saved to localStorage as a string

// 2. The search term will be displayed in the search history
// 2a. This will be done by creating a new <li> element, setting the text of the <li> element to the search term, and then appending the <li> element to the <ul> element
// 2b. If the <ul> element already exists, the <li> element will be appended to the <ul> element

// 3. The user will be taken to the search results page
// 3a. This will be done by setting the window.location.href to the search results page
// 3b. The search results page will be passed the search term as a query parameter
// 3c. The search results page will use the query parameter to fetch the search results from the API
// 3d. The search results page will display the search results