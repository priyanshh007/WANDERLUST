  
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map', // container ID
center: coordinates||[77.209, 28.6139], // starting position [lng, lat]
zoom: 10 // starting zoom
});
// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker({color:'red'})
.setLngLat(coordinates||[77.209, 28.6139])
.setPopup(new mapboxgl.Popup({ offset:25 })
.setHTML(
    "<h4>location</h4><p>Exact location will be provided after booking </p>"))
.addTo(map);
