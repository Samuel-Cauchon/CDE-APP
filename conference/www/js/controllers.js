angular.module('App.controllers', ['ngOpenFB', 'ngCordova', 'App.services'])

.controller('LoginCtrl', function ($scope, $ionicModal, $timeout, ngFB, $ionicPlatform, $state) {

    $scope.fbLogin = function () {

        ngFB.init({appId: '1700851050186495'});
        ngFB.login({scope: 'email,publish_actions'}).then(   // MODIFIED: read_stream,
            function (response) {
                if (response.status === 'connected') {
                    console.log('Facebook login succeeded');
                } else {
                    alert('Facebook login failed');
                }
        });

    //    $state.go('homeMenu.home')
        $state.go('homeMenu.newsfeed')
	};

})

.controller('ProfileCtrl', function ($scope, ngFB) {
    ngFB.api({
        path: '/me',
        params: {fields: 'id,name'}
    }).then(
        function (user) {
            $scope.user = user;
        },
        function (error) {
            alert('Facebook error: ' + error.error_description);
        });
})

.controller('MapCtrl', function($scope, $state, $cordovaGeolocation, $ionicPlatform) {


	var options = {timeout: 10000, enableHighAccuracy: true};

    var script = window.document.createElement('script');
    script.src = 'http://maps.googleapis.com/maps/api/js?v=3.exp&sensor=true&callback=InitMapCb';
    window.document.head.appendChild(script);

	$cordovaGeolocation.getCurrentPosition(options).then(function(position){


        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

	}, function(error){
        console.log("Could not get location");
    });

})

.controller('NewsfeedCtrl', function($scope, $http, DatabaseService, Backand) {

  var uid = 1;
  $scope.message = "I love this conference!";
  // $http.get('https://api.backand.com/1/objects/user').success(function (data) {
  //   $scope.user = data['data'][0]['name'];
  // });
  DatabaseService.list().success(function(data){
    $scope.user = data['data'][1]['name'];
  });

  DatabaseService.updateSam().success(function (data, status, headers) {
			    $scope.ServerResponse = data;
			    console.log("update sent");
			})
        .error(function (data, status, header, config) {
            $scope.ServerResponse =  htmlDecode("Data: " + data +
                "\n\n\n\nstatus: " + status +
                "\n\n\n\nheaders: " + header +
                "\n\n\n\nconfig: " + config);
								console.log("update not sent");
         });

})
