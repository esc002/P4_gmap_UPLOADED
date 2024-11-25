let map;
let markerObjects = [];
let modal = document.getElementById("lorem"); // Access the modal
let closeModalBtn = document.querySelector(".button.small"); // Close button

async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
    map = new Map(document.getElementById("map"), {
        center: { lat: 37.7749, lng: -122.4194 },
        zoom: 3
    });

    const { Marker } = await google.maps.importLibrary("marker");

    // Fetch the JSON data from the Sakura_Matsuri.json file
    const response = await fetch('js/Sakura_Matsuri.json');

    const coordinates = await response.json();

    coordinates.forEach((location) => {
        const marker = new Marker({
            position: { lat: location.Latitude, lng: location.Longitude },
            map: map,
            title: location.Name,
            icon: {
                url: "sakura.png", // URL of your custom image
                scaledSize: new google.maps.Size(40, 40) // Optional: Adjust the size of the icon
            }
        });

        markerObjects.push(marker);

        // InfoWindow content for each marker
        const infoWindowContent = `
            <img src="${location.HeaderImg}" style="text-align: center;" height="200px">
            <h4>${location.Name}</h4>
            <p><strong>Address:</strong> ${location.Address}</p>
            <p><strong>Event Dates (2024):</strong> ${location["2024 Event Dates"]}</p>
            <p><strong>Event Website Link:</strong> <a href="${location.Link}" target="_blank">${location.Name}</a></p>
            <a href="#lorem" target="_modal" class="more-info" data-location='${JSON.stringify(location)}'>
                Click here for more info
            </a>
        `;

        const infoWindow = new google.maps.InfoWindow({
            content: infoWindowContent
        });

        marker.addListener("click", () => {
            infoWindow.open(map, marker);
        });

        // Create list item for each marker in the list
        const listItem = document.createElement('div');
        listItem.classList.add('marker-item');
        listItem.textContent = location.Name;
        listItem.onclick = () => {
            map.setCenter({ lat: location.Latitude, lng: location.Longitude });
            map.setZoom(12);
        };

        document.getElementById('markerList').appendChild(listItem);
    });

    // Listen for 'Learn More' click event
    document.body.addEventListener('click', (event) => {
        if (event.target && event.target.classList.contains('more-info')) {
            event.preventDefault();
            const locationData = JSON.parse(event.target.getAttribute('data-location'));
            openModal(locationData);
        }
    });
}

function openModal(location) {
    // Populate modal with data
    document.getElementById("modalTitle").textContent = location.Name;
    document.getElementById("modalImage").src = location.HeaderImg;
    document.getElementById("modalAddress").textContent = `Address: ${location.Address}`;
    document.getElementById("modalEventDates").textContent = `Event Dates (2024): ${location["2024 Event Dates"]}`;
    document.getElementById("modalLink").innerHTML = `<a href="${location.Link}" target="_blank">Event Website</a>`;
    document.getElementById("modalInfo").textContent = `${location.Description}`;
    
    // Open the modal
    $(modal).modally();
}

    // Event listener to toggle the visibility of the marker list when the button is clicked
    document.getElementById("toggleButton").addEventListener("click", () => {
        const markerList = document.getElementById("markerList");
        if (markerList.style.display === "none" || markerList.style.display === "") {
            markerList.style.display = "block"; // Show the list
        } else {
            markerList.style.display = "none"; // Hide the list
        }
        });
    

// Initialize the map when the window is loaded
window.onload = function() {
    initMap();
};
