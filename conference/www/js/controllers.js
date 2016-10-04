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
        $state.go('homeMenu.schedule')
	};

})

.controller('EventsCtrl', function($scope, MainEvents) {

    var peopleAttendingEachEvent = {};
    $scope.map = {};

  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };

  MainEvents.getUserQuery().success(function(data){
    var userArr = data;
    console.log("User Info", data);
    for (var i =0; i < userArr.length; i++){
      peopleAttendingEachEvent[userArr[i].id] = {
        name: userArr[i].name
      };
    }
    console.log("IIII", peopleAttendingEachEvent);
    MainEvents.getPeopleAttending().success(function(data){
      var mapOfEventToUser = data.data;
      mapOfEventToUser.forEach(function(item){
        if(!$scope.map[item.event]){
          $scope.map[item.event] = [peopleAttendingEachEvent[item.user].name];
          console.log("SUP", $scope.map[item.event]);
        }
        else{
          $scope.map[item.event].push(peopleAttendingEachEvent[item.user].name);
        }
      })
      console.log("MAP", $scope.map["1"]);
      $scope.getMappingOfEventToUsers = function(id){
        console.log("ID", id);
        console.log("TRY", $scope.map[id]);
        return $scope.map[id];
      }
    })
  });
  MainEvents.getEventsFirstDay().success(function (data) {
    $scope.dayOneEvents = data;
    console.log("Day One Events", data);
    angular.forEach($scope.dayOneEvents, function (value) {
      value.starttime = new Date(Date.parse(value.starttime)).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
      });
      value.endtime = new Date(Date.parse(value.endtime)).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
      });
    })
  });

    $scope.registerUser= function(id){
      console.log("Id", id);
      MainEvents.setEventId(id);
      //MainEvents.getPeopleAttendingEvent().success(function(data){
      //  $scope.peopleAttending = data;
      //  console.log("peopleAttending", $scope.peopleAttending);
      //})
      //MainEvents.getPeopleAttending().success(function(data){
      //  $scope.peep = data.data;
      //  var temp = data.data;
      //  console.log("HIIII", data.data);
      //  temp.forEach(function(item){
      //    if(!map[item.event]){
      //      console.log("YOOOO");
      //      map[item.event] = [peopleAttendingEachEvent[item.user].name];
      //      console.log("SUP", map[item.event]);
      //    }
      //    else{
      //      console.log("MY NIGGA");
      //      map[item.event].push(peopleAttendingEachEvent[item.user].name);
      //    }
      //  });
      //  console.log("MAP", map["1"]);
      //})
    }

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
