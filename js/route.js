//Inicializacion de variables
var mapDiv = $('#mapDiv');
var origen = $('#origen');
var destino = $('#destino');
var map;
var previusStartMarker;
var previusEndMarker;
var directionsService;
var directionsDisplay;
var input;

//Cuando se pusa el icono se vuelve a la pagina principal
$('#back').click(function(){
  location.href = 'index.html';
});


//Funcion que inicializa el mapa de la api de Google
function initMap() {
  var myLatlng = {lat: 40.400144, lng: -3.722540};

  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: myLatlng
  });

  directionsDisplay.setMap(map);

  //Funcion que recalcula la ruta cuando se cambia origen o destino
  var onChangeHandler = function() {
    calculateAndDisplayRoute(directionsService, directionsDisplay);
    console.log("Llega al change")
  };


  //Llamar a una funcion como esta cuando se ejecute la funcion de calcular la ruta
  map.addListener('click', function(event) {
    if(mapDiv.hasClass('col-sm-12')){
      //mapDiv.removeClass('col-sm-12').addClass('col-sm-10');
      //$("#panelOculto").toggle(100);
    }

    map.setZoom(14);
    //map.setCenter(marker.getPosition());
    addMarker(event.latLng);
  });

  origen.click(function() {
    input = "origen";
  });

  destino.click(function() {
    input = "destino";
  });
}

//Añadimos el marker de origen o destino
function addMarker(location) {
  if(input === "origen") {
    if (previusStartMarker != null) {
      previusStartMarker.setMap(null);
    }
    var marker = new google.maps.Marker({
      position: location,
      map: map
    });
    previusStartMarker = marker;
    map.setCenter(marker.getPosition());
    document.getElementById("origen").value = marker.getPosition().lat() + ", " +  marker.getPosition().lng();
    console.log(origen.val());
    console.log(destino.val());
  } else if (input === "destino") {
    if (previusEndMarker != null) {
      previusEndMarker.setMap(null);
    }
    var marker = new google.maps.Marker({
      position: location,
      map: map
    });
    previusEndMarker = marker;
    map.setCenter(marker.getPosition());
    document.getElementById("destino").value = marker.getPosition().lat() + ", " +  marker.getPosition().lng();
  }
  calculateAndDisplayRoute(directionsService, directionsDisplay);
}

//Funcion que calcula la ruta y la muestra en el mapa
function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  if(origen.val() !== "" && destino.val() !== ""){
    previusStartMarker.setMap(null);
    previusEndMarker.setMap(null);
    directionsService.route({
      origin: document.getElementById('origen').value,
      destination: document.getElementById('destino').value,
      travelMode: 'DRIVING'
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
        var stepsArray = response.routes[0].legs[0].steps;
        console.log(stepsArray);
        var temp = 0;

        //console.log(stepsArray[10].distance.value);
        //Recorremos el origen y destino de todas las indicaciones
        for(var i=0; i<stepsArray.length; i++){
          var lat_origen = stepsArray[i].start_location.lat();
          var lng_origen = stepsArray[i].start_location.lng();

          var lat_dest = stepsArray[i].end_location.lat();
          var lng_dest = stepsArray[i].end_location.lng();

          var paths = stepsArray[i].path;
          //console.log("Origen de indicación " + i+1 + ": " + lat_origen + ", " + lng_origen)
          //console.log("Destino: " + lat_dest + ", " + lng_dest)

          //Recorremos los puntos de cada indicacion
          //Ver que distancias poner
          if(stepsArray[i].distance.value <= 5000){
            for (var j=0; j<paths.length; j++) {
              var lat_path = paths[j].lat();
              var lng_path = paths[j].lng();
              //console.log("Punto de indicación " + i+1 + ": " + lat_path + ", " + lng_path);
              temp +=paths.length;
            }
          } else {
              //Ver cuantos puntos poner en carretera
          }
        }
        console.log(temp);
      } else {
        window.alert('La petición de ruta ha fallado: ' + status);
      }
    });
  }
}
