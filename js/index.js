//Inicializacion de variables
var mapDiv = $('#mapDiv');
var map;
var previusMarker;
var allNetworks = $('·allNetworks');
var openNetworks = $('.openNetworks');
var closedNetworks = $('.closedNetworks');
var showingNetworks = "Todas";


//Cuando pulsamos el icono reiniciamos el marker
$('#back').click(function(){
    if(mapDiv.hasClass('col-sm-9')){
      $("#panelOculto").toggle(1);
      mapDiv.removeClass('col-sm-9').addClass('col-sm-12');
      previusMarker.setMap(null);
      map.setZoom(6);
      document.getElementById("usr").value = "";
  }
});


//Funcion que inicializa el mapa de la api de Google
function initMap() {
  var myLatlng = {lat: 40.400144, lng: -3.722540};

  //Creamos un mapa
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 6,
    center: myLatlng
  });

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
    //console.log($('input[name="optradio"][class="allNetworks"]').is(':checked'));
  });

  //Cuando se hace click en el mapa se abre un panel lateral y se añade un marker
  map.addListener('click', function(event) {
    if(mapDiv.hasClass('col-sm-12')){
      mapDiv.removeClass('col-sm-12').addClass('col-sm-9');
      $("#panelOculto").toggle(100);
    } 
    map.setZoom(17);
    addMarker(event.latLng);
    showNetworks();
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

//Funcion que enseña todas las redes
function showNetworks() {
  $("#accordion").html("");
  for (var i = 0; i < wifi.length; i++) {
    var name = wifi[i].SSID;
    var MAC = wifi[i].MAC;
    var type = wifi[i].Type;
    var SignalStrength = wifi[i].SignalStrength;
    var tipo;
    if(type ==="OpenEnc1" || type ==="OpenEnc2" || type ==="" || type ==="OpenEnc3"){
      tipo = "Abierta";
    } else {
      tipo = "Cerrada";
    }

    if(showingNetworks !== "Todas" && tipo !== showingNetworks){
      continue;
    }

    $("#accordion").append("<div class='panel panel-default'> <div class='panel-heading'> <h4 class='panel-title'> <a data-toggle='collapse' data-parent='#accordion' href='#collapse"+i+1+"'>" + name + " (" + tipo + ")" +  "</a> </h4></div> <div id='collapse"+ i+1+"' class='panel-collapse collapse'> <div class='panel-body'><p>MAC: " + MAC + "</p><p>Tipo: " + type + "</p><p>Potencia: " + SignalStrength + " dBm</p></div> </div> </div>");
  }
}



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
    }];