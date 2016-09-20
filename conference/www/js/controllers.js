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

.controller('EventsCtrl', function($scope, MainEvents){
  var a = MainEvents.getEventsFirstDay();
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

.controller('NewsfeedCtrl', function($scope, $http, DatabaseService, NewsfeedService, Backand, $timeout, PersonService) {

  $scope.entry = [];
  var uid = 1;
  $scope.userName = "";

  NewsfeedService.getUserName(uid).success(function(data){
    $scope.userName = data['data'][0]['name'];
  });

  $scope.$on('$ionicView.enter', function () {
		retrieveInfo();
	  console.log("page opened");
	})

	$scope.refreshNewsfeed = function () {
		retrieveInfo();
    $scope.$broadcast('scroll.refreshComplete');
		console.log("page refresh");
	}

  var formatNumber = function(number) {
    if (number<10){
      return "0"+number
    } else {
      return ""+number
    }
  };

  $scope.postComment = function() {
    var comment = document.getElementById('newContent').value;
    var timestamp = new Date();
    var day = formatNumber(timestamp.getDate());
    var month = formatNumber(timestamp.getMonth()+1);
    var year = timestamp.getFullYear();
    var hours = formatNumber(timestamp.getHours());
    var min = formatNumber(timestamp.getMinutes());
    var sec = formatNumber(timestamp.getSeconds());
    var date = ""+year+"-"+month+"-"+day+"T"+hours+":"+min+":"+sec;
    var data = {"date": date, "uid": uid, "content": comment};
    DatabaseService.newEntry('/1/objects/pushBoard', data).success(function(data){
      $scope.ServerResponse = data;
      console.log("comment saved");
      $scope.refreshNewsfeed();
      document.getElementById('newContent').value = null;
    })
      .error(function (data, status, header, config) {
            $scope.ServerResponse =  htmlDecode("Data: " + data +
                "\n\n\n\nstatus: " + status +
                "\n\n\n\nheaders: " + header +
                "\n\n\n\nconfig: " + config);
  							console.log("error saving comment");
    });
  }


  function retrieveInfo(){
    DatabaseService.getData('/1/query/data/getUserNameFromID').success(function(data){
      for (i=0; i < data.length; i++){
          $scope.entry[i] = {name:data[i]['name'], date:data[i]['date'], content:data[i]['content']};
      }
    })
    .error(function (data, status, header, config) {
        $scope.ServerResponse =  htmlDecode("Data: " + data +
            "\n\n\n\nstatus: " + status +
            "\n\n\n\nheaders: " + header +
            "\n\n\n\nconfig: " + config);
            console.log("error getting data");
   });
 }


  // $scope.items = [];
  //
  // PersonService.GetFeed().then(function(items){
  //   $scope.items = items;
  // });
  //
  // $scope.doRefresh = function() {
  //   PersonService.GetNewUser().then(function(items){
  //     $scope.items = items.concat($scope.items);
  //
  //     //Stop the ion-refresher from spinning
  //     $scope.$broadcast('scroll.refreshComplete');
  //   });
  // };

})
