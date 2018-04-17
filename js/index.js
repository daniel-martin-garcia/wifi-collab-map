//Inicializacion de variables
var mapDiv = $('#mapDiv');
var map;
var previusMarker;


//Cuando pulsamos el icono reiniciamos el marker
$('#back').click(function(){
    if(mapDiv.hasClass('col-sm-10')){
      $("#panelOculto").toggle(1);
      mapDiv.removeClass('col-sm-10').addClass('col-sm-12');
      previusMarker.setMap(null);
      map.setZoom(4);
      document.getElementById("usr").value = "";
  }
});


//Funcion que inicializa el mapa de la api de Google
function initMap() {
  var myLatlng = {lat: 40.400144, lng: -3.722540};

  //Creamos un mapa
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: myLatlng
  });

  //Cuando se hace click en el mapa se abre un panel lateral y se añade un marker
  map.addListener('click', function(event) {
    if(mapDiv.hasClass('col-sm-12')){
      mapDiv.removeClass('col-sm-12').addClass('col-sm-10');
      $("#panelOculto").toggle(100);
    } 
    map.setZoom(17);
    addMarker(event.latLng);
  });
}


//Funcion que anade un marker, con su lat y lng
function addMarker(location) {
  if (previusMarker != null) {
    previusMarker.setMap(null);
  }
  var marker = new google.maps.Marker({
    position: location,
    map: map
  });
  previusMarker = marker;
  map.setCenter(marker.getPosition());
  document.getElementById("usr").value = marker.getPosition().lat() + ", " +  marker.getPosition().lng();
  console.log(marker.getPosition().lat());
  console.log(marker.getPosition().lng());
}