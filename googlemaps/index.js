
const URL_PROVINCIES = "https://www.trackcorona.live/api/provinces";
let provinces = [];
const infoWindowProvinces = province => {
  return `<div class="content">
    Ciudad: ${province.location} </br>
    Recuperadas: ${province.recovered} </br>
    Muertas: ${province.dead} </br>
    Actualizacion: ${province.updated} </br>
  </div`;
};

function initMap() {
  var map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: { lat: 37.09, lng: -95.712 }
  });
  fetch(URL_PROVINCIES)
    .then(response => response.json())
    .then(data => {
      provinces = [...data.data];
      console.log(provinces);
      for (let index = 0; index < data.data.length; index++) {
        const province = data.data[index];
        if (province.country_code === "us") {
          const marker = new google.maps.Marker({
            position: { lat: province.latitude, lng: province.longitude },
            map: map,
            title: province.location,
            icon:'./virus.png'
          });
          const infowindow = new google.maps.InfoWindow({
            content: infoWindowProvinces(province)
          });
          marker.addListener("mouseover", function () {
            infowindow.open(map, marker);
          });
          marker.addListener("mouseout", function () {
            infowindow.close(map, marker);
          });
        }
      }
    });
  const filter = document.getElementById("city");
  const buttonFilter = document.getElementById("filter");
  buttonFilter.addEventListener("click", function () {
    const province = provinces.find(province => {
      return province.location === filter.value;
    });

    if (province) {
      const html = infoWindowProvinces(province);
      document.getElementById("data").innerHTML = html;
      map.setZoom(7);
      map.setCenter(
        new google.maps.LatLng(province.latitude, province.longitude)
      );
    }
  });
}