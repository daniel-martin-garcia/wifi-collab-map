//INICIALIZACION DE VARIABLES
var mapDiv = $('#mapDiv');
var origen = $('#origen');
var destino = $('#destino');
var map;
var previusStartMarker;
var previusEndMarker;
var directionsService;
var directionsDisplay;
var input;
var showingNetworks = "Todas";  

//CUANDO SE PULSA EL ICONO SE ELIMINA EL MARKER Y SE OCULTA EL SIDENAV
$('#back').click(function(){
  location.href = 'index.html';
});


//FUNCION QUE INICIALIZA EL MAPA DE LA API DE GOOGLE Y QUE MUESTRA LAS REDES DE UNA TRAYECTORIA
function initMap() {
  var myLatlng = {lat: 40.400144, lng: -3.722540};

  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 6,
    center: myLatlng
  });

  directionsDisplay.setMap(map);

  //Llamar a una funcion como esta cuando se ejecute la funcion de calcular la ruta
  map.addListener('click', function(event) {
    //map.setZoom(14);
    addMarker(event.latLng);
  });

  //Cuando se aplica un filtro al pulsar un checkbox
  $("input[name='optradio']").change(function(){
    if($('input[name="optradio"][class="openNetworks"]').is(':checked')){
      showingNetworks = "Abierta";
      showNetworks();
    } else if($('input[name="optradio"][class="closedNetworks"]').is(':checked')){
      showingNetworks = "Cerrada";
      showNetworks();
    } else{
      showingNetworks = "Todas";
      showNetworks();
    }
  });

  //Cuando se pulsa en origen si se pincha en el mapa se anade marker de origen
  origen.click(function() {
    input = "origen";
  });

  //Cuando se pulsa en destino si se pincha en el mapa se anade marker de destino
  destino.click(function() {
    input = "destino";
  });
}


//FUNCION QUE ANADE UN MARKER, CON SU LAT Y LNG
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


//FUNCION QUE CALCULA LA RUTA Y LA MUESTRA EN EL MAPA
function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  if(origen.val() !== "" && destino.val() !== ""){
    if(mapDiv.hasClass('col-sm-12')){
      mapDiv.removeClass('col-sm-12').addClass('col-sm-9');
      $("#panelOculto").toggle(100);
    }

    showNetworks();

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


//FUNCION QUE ENSEÑA LAS REDES WIFI Y LAS FILTRA
function showNetworks() {
  $("#accordion").html("");
  for (var i = 0; i < wifi.length; i++) {
    //Obtenemos la informacion de cada red wifi
    var name = wifi[i].SSID;
    var MAC = wifi[i].MAC;
    var type = wifi[i].Type;
    var SignalStrength = wifi[i].SignalStrength;
    var tipo;

    //Se analizan que tipo de wifi es en funcion de la encriptacion
    if(type ==="OpenEnc1" || type ==="OpenEnc2" || type ==="" || type ==="OpenEnc3"){
      tipo = "Abierta";
    } else {
      tipo = "Cerrada";
    }

    //Si no coincide el filtro con el tipo de wifi se salta a la siguiente red
    if(showingNetworks !== "Todas" && tipo !== showingNetworks){
      continue;
    }

    //Se añade al grupo de paneles las redes wifi, cada una en un panel
    $("#accordion").append("<div class='panel panel-default'> <div class='panel-heading'> <h4 class='panel-title'> <a data-toggle='collapse' data-parent='#accordion' href='#collapse"+i+1+"'>" + name + " (" + tipo + ")" +  "</a> </h4></div> <div id='collapse"+ i+1+"' class='panel-collapse collapse'> <div class='panel-body'><p>MAC: " + MAC + "</p><p>Tipo: " + type + "</p><p>Potencia: " + SignalStrength + " dBm</p></div> </div> </div>");
  }
}


//EJEMPLO DE RESPUESTA DEL SERVIDOR PARA UN PUNTO
var wifi = [{
    "index": 1,
    "SSID": "Movistar V00001",
    "MAC": "00:00:00:00:00:01",
    "Type": "OpenEnc1",
    "SignalStrength": -61
  },
  {
    "index": 2,
    "SSID": "Movistar V00002",
    "MAC": "00:00:00:00:00:02",
    "Type": "OpenEnc2",
    "SignalStrength": -62
  },
  {
    "index": 3,
    "SSID": "Movistar V00003",
    "MAC": "00:00:00:00:00:03",
    "Type": "ClosedEnc1",
    "SignalStrength": -63
  },
  {
    "index": 4,
    "SSID": "Movistar V00004",
    "MAC": "00:00:00:00:00:04",
    "Type": "ClosedEnc2",
    "SignalStrength": -64
  },
  {
    "index": 5,
    "SSID": "Movistar V00005",
    "MAC": "00:00:00:00:00:05",
    "Type": "",
    "SignalStrength": -65
  },
  {
    "index": 6,
    "SSID": "Vodafone V00001",
    "MAC": "00:00:00:00:01:01",
    "Type": "ClosedEnc4",
    "SignalStrength": -66
  },
  {
    "index": 7,
    "SSID": "Vodafone V00002",
    "MAC": "00:00:00:00:01:02",
    "Type": "",
    "SignalStrength": -67
  },
  {
    "index": 8,
    "SSID": "Vodafone V00003",
    "MAC": "00:00:00:00:01:03",
    "Type": "OpenEnc1",
    "SignalStrength": -68
  }
];

