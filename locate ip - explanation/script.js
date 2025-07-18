let map, marker;

// VITE_GOOGLE_MAPS_API_KEY=AIzaSyCM6W8afI6ZvzRYwFtcm56NJh-8WXGr58E // no inverted comma in .env
// VITE_IPGEOLOCATION_API_KEY=c8e4f8975c7c4e1e97dee8481c37a92d
// #  Prefix environment variables with VITE_ for Vite to expose them to the client-side code.
// above in gitignore
const ipGeoApiKey = 'c8e4f8975c7c4e1e97dee8481c37a92d'; // API key from .env // inverted comma
const googleMapsApiKey = 'AIzaSyCM6W8afI6ZvzRYwFtcm56NJh-8WXGr58E'; // API key from .env

//const ipGeoApiKey = import.meta.env.VITE_IPGEOLOCATION_API_et trackedUserIP = ''; 
// import.meta.env is used in Vite (and other modern JavaScript tooling) to access environment 
// variables during the build process. import.meta is an object that contains metadata
//  about the current module. The env property within import.meta provides access to 
//  environment variables defined in your Vite project.

let trackedUserIP = ''; // Initially empty, to be set by user input

// map by google map api ( intialise map ) -------------------------------------------------
//initialise map nd  set marker on it

// window.initMap: This assigns the initMap function to the window object, making it a global function that
//  can be called by Google Maps API's callback parameter. Google Maps API uses this function to initialize
//   the map once the API script loads.//
// init map : user-defined function
window.initMap = function() {

    map = new google.maps.Map(document.getElementById('map'), { //consturctor call 
        center: { lat: 0, lng: 0 },//initially
        zoom: 2,
    });
// map = new google.maps.Map(...): This creates a new Google Maps object and assigns it to the map 
//google.maps.Map :constructor function provided by the "Maps JavaScript API" for creating a new map object.
// variable. The google.maps.Map constructor is used to initialize the map on your webpage.

// document.getElementById('map'): This selects the HTML element with the ID map. This element will  be the container where the Google Map will be rendered.

// center: { lat: 0, lng: 0 }: This sets the initial center of the map to latitude 0 and longitude 0.
//  The map will be centered at these coordinates when it first loads.

// zoom: 2: This sets the initial zoom level of the map. A zoom level of 2 is quite zoomed out, 
//showing a large portion of the Earth. Higher numbers zoom in closer


    marker = new google.maps.Marker({       
        map: map,
        position: { lat: 0, lng: 0 }, // Initial position
        title: 'Tracked Location',
    });
    // marker = new google.maps.Marker(...): This creates a new marker on the map and assigns it to the 
    // marker variable. The google.maps.Marker constructor is used to place a marker on the map.

// map: map: This specifies the map on which the marker should be placed. It uses the map variable created earlier.
// Set focus to the input field when the page loads

    // position: { lat: 0, lng: 0 }: This sets the initial position of the marker to latitude 0 and
    //  longitude 0. The marker will be placed at these coordinates when it first loads.

    // title: 'Tracked Location': This sets the title of the marker. 
    // The title is a tooltip that appears when the user hovers over the marker.

}
// ---------fetch location by IP address ...API IPgeolocation
// user-defined function
window.fetchLocation = function() {

    fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${ipGeoApiKey}&ip=${trackedUserIP}`)
        .then(response => response.json())
        .then(data => {
            if (data.latitude && data.longitude) {
                const pos = {
                    lat: parseFloat(data.latitude),
                    lng: parseFloat(data.longitude),
                };

                marker.setPosition(pos); // Update marker position
                map.setCenter(pos);// view 
                updateLocationDetails(data);
                clearError(); // Clear error if location data is valid
            } else {
                displayError('Location data is missing...Try entering a valid IP address');
            }
        })
        .catch(error => console.error('Error fetching location:', error))
}
// fetch(...): This is a call to the fetch function, which is used to make HTTP 
// requests. It sends a request to the specified URL and returns a promise that resolves to the response.

// URL of the API endpoint to which the request is sent.

//.then(response => response.json()): This handles the promise returned by the fetch function.
// It converts the HTTP response to JSON format. The response object represents the 
//HTTP response from the server.

// .then(data => {: This handles the promise returned by response.json(). 
    // The data variable now holds the parsed JSON data from the response.

    // if (data.latitude && data.longitude): This checks if the data object contains valid latitude and longitude properties. 

//const pos = { lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) }:
//  Creates a new object pos with lat and lng properties. These are the latitude and
// longitude values parsed as floating-point numbers from the API response data.

// marker.setPosition(pos);: Updates the position of the marker on the map to the new pos coordinates.

//map.setCenter(pos);: Centers the map view on the new pos coordinates.

// clearError();: Calls the clearError function to hide or remove any previously displayed 
// error messages. This is done because valid location data was successfully fetched.

// displayError('Location data is missing...Try entering a valid IP address');:
//  Calls the displayError function to display an error message indicating that 
// location data is missing and suggesting the user try entering a valid IP address.

// .catch(error => console.log('error fetching data '));: Catches any errors that 
// occur during the fetch operation or while processing the response. Logs an error message to the console 
// ------------------------------------------------
// Function to display error message
function displayError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) { //if such id exist 
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}
// Function to clear the error message
function clearError() {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}
// ---------------------------------------------------------------------
// set Location  Details--------------------------------------------------
window.updateLocationDetails = function(data) {
    document.getElementById('coordinates').textContent = `latitude: ${data.latitude},longitude: ${data.longitude}`; // seee `` $ {} backtick
    document.getElementById('city').textContent = data.city || 'N/A';
    document.getElementById('country').textContent = data.country_name || 'N/A';
    document.getElementById('address').textContent = data.address || 'N/A';
}

// onclick --update IP button ------------------------------------------------------
window.updateIP = function() {
    const ipInput = document.getElementById('ipAddressInput').value;
    const blinkTextElements = document.getElementsByClassName('blink-text');

    if (ipInput) {
        trackedUserIP = ipInput;
        fetchLocation(); // Updates location immediately after IP is set

        // Hide the blinking message if IP is entered

        if (blinkTextElements.length > 0) {
            // returns a  HTMLCollection of elements with the specified class name..hence [0]
            blinkTextElements[0].style.display = 'none';
        }
    } else {
        // Show and update the blinking message if no IP address is entered
        if (blinkTextElements.length > 0) {
            blinkTextElements[0].style.display = 'block';
            //set the display property from none to blck..it jst removes none
            // Setting the display property to block makes the element visible and
            // ensures that it takes up space in the layout as a block-level element. 
            // This is useful when you want to show the element that was previously hidden.
            blinkTextElements[0].textContent = 'Enter IP address here ⬆️ ';
        }
    }
}


// Load Google Maps script dynamically-----------------------------------------
const script = document.createElement('script');//script tag created
script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&callback=initMap&libraries=marker`;
// https://maps.googleapis.com/maps/api/js : base URL
// key=${googleMapsApiKey}: API key
//callback=initMap: This specifies that the initMap function should be called once the API script has loaded.
// libraries=marker: This includes the marker library, which is an additional library of the Google Maps API.
script.async = true;
// script is fetched asynchronously
// // async attribute allows the script to be downloaded in parallel with the rest of
//  the page, without blocking the HTML parsing. The script will be executed as soon as 
//  it is available.but defer comes in  ..wait ..executed after html parsing
script.defer = true;
//script is fetched asynchronously, but it is executed only after the HTML document has been fully parsed.
// This is important for scripts that modify the DOM, as it ensures
//   the DOM is ready when the script runs.
document.head.appendChild(script);
//script will be executed as soon as 
//  it is available.but defer comes in  ..wait ..executed after html parsing..
//nd so we can put it in head tag..


// -----------------------------------------------------------------------------
// window:(global object)  Represents the browser's window.
// Used for browser-related operations and global variables.

// document: Represents the HTML document currently displayed in the browser window..
//  Used for manipulating the content and structure of the web page.
// both are NOT interechageable 


//query parameter : ? character is used to start a query string in URLs.
//Query Parameters: The (ampersand) & character is used to separate multiple query parameters in a URL.
