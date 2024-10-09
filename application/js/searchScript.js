// Function that performs search operation
async function performSearch() {    //will trigger when user presses enter on search form
    //get search criteria out of html
    let textEntry = document.getElementById("schoolSearch").value;
    let sportEntry = document.getElementById("sportSelect").value;  
    let sortEntry = document.getElementById("sortSelect").value;    
    
    data = {
        searchTerm: textEntry,
        sportSelection: sportEntry , 
        sortSelection: sortEntry        
    }
    
    const response = await fetch("/search", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });

    //results of search
    const result = await response.json();

    const resultsContainer = document.querySelector('.grid-container');
    resultsContainer.innerHTML = ''; // Clears previous results when function is called

    const resultsText = document.querySelector('.results-container');
    resultsText.classList.remove('hidden');

    // Load content dynamically into each cell ('grid-item')
    for (let record of result) {
        const resultNode = document.createElement('div');
      
        resultNode.classList.add('grid-item');
        resultNode.innerHTML = `
        <h2>${record.name}</h2>
        <p>Location: ${record.location}</p>
        `;

        // Makes each individual school result clickable
        resultNode.onclick = () => openPopup(record.name, record.academia_rating, record.location, record.university_id);
        resultsContainer.appendChild(resultNode);
    }
}

// Calls SQL query to get coordinates for respective university
// Removes previous point and move map to new coordinates
async function retriveCoordinates(name) {
    let textEntry = name;
    data = {
        searchTerm: textEntry
    }

    const response = await fetch("/universities", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });

    //results of search
    const result = await response.json();
    console.log(result);

    map2.removeLayer(marker2);
    map2.panTo([result[0].latitude, result[0].longitude]);
    marker2 = L.marker([result[0].latitude, result[0].longitude]).addTo(map2);
}

// Populates school information into hidden 'school-info' div
// Changes visibility of 'school-info' div to make visiable
async function openPopup(name, rating, location, university_id) {

    // Perform fetch to readReview route for the cid
    const response = await fetch(`/readReviews/${university_id}`);

    // Response is JSON structure
    const reviews = await response.json();

    console.log(reviews);

    // Parse the JSON to create review divs and add them to the popup
    let newHTML = "";
    for (let record of reviews) {
        newHTML += `<div class="school-review-item">
                <div class="user-profile">
                    <img src="./images/no_image_75px.jpg" class="default-image">
                    <p>${record.reviews_user_id}</p>
                    <p>${record.rating}</p>
                </div>

                <div class="review-text">
                    ${record.review}
                </div>
            </div>`;
    }

    document.querySelector('.school-athlete-grid').innerHTML = newHTML;


    // Then set the popup to visible...
    var popup = document.querySelector('.school-info');
    var grid = document.querySelector('.school-info-grid');
    popup.style.display = 'block';

    // Prevents body from scrolling while 'school-info' is active
    document.body.style.overflow = 'hidden';


    // Set content dynamically
    grid.innerHTML = `  <h2>${name}</h2>
                        <p><a href="/readReviews/reviewPage/${university_id}/${name}">Write a Review</a><p>
                        <br>
                        <p>${location}</p>`;

    // Retrieve coordinates from database to set map position
    retriveCoordinates(name);
}

// Clears previously selected info and changes 'school-info' visability
function closePopup() {
    var popup = document.querySelector('.school-info');
    popup.style.display = 'none';

    // Re-enable scrolling on body of page 
    document.body.style.overflow = '';
}

// Initialization for the main map 
var map = L.map('map').setView([37.721897, -122.478210], 13);
var marker = L.marker([37.721897, -122.478210]).addTo(map);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Initialization for second map
var map2 = L.map('map2').setView([37.721897, -122.478210], 13);
var marker2 = L.marker([37.721897, -122.478210]).addTo(map2);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map2);
