angular.module('App.controllers', ['ngCordova', 'App.services'])

.controller('LoginCtrl', function ($scope, $ionicPlatform, $state, DatabaseService, AuthService) {
  $scope.dataEntered = {
    username : "",
    password : "",
  };

    $scope.Login = function () {
      DatabaseService.searchUser($scope.dataEntered.username).success(function(dataUser){
        //Check if the username exist...
        if (dataUser[0] != null){
          //Maybe an unecessary second check of the corectnes of the username...
          if (dataUser[0]['name'] === $scope.dataEntered.username){
            DatabaseService.searchPass($scope.dataEntered.username, $scope.dataEntered.password).success(function(dataPass){
              //Maybe an unecessary check since if the user exists, then there should aslo be a password...
              if (dataPass[0] != null){
                //Check if the password is correct.
                if (dataPass[0]['password'] === $scope.dataEntered.password){
                  AuthService.currentUser = $scope.dataEntered.username;
                  console.log(AuthService.currentUser);
                  $state.go('homeMenu.newsfeed');
                }
              }
            });
          }
        }

      });
     
   };

   $scope.Register = function () {
       $state.go('register');
   };

})

.controller('RegisterCtrl', function($scope, $ionicPlatform, $state, DatabaseService, AuthService){

    $scope.dataEnteredRegister = {
      username : "",
      password : "",
      passwordConfirmation : "",
    };

    $scope.Register = function () {
      DatabaseService.searchUser($scope.dataEnteredRegister.username).success(function(dataUser){
        console.log("1");
        //Check if the username exist...
        if (dataUser[0] == null){
          DatabaseService.getMaxId().success(function(maxId){
            DatabaseService.createNewUser($scope.dataEnteredRegister, maxId[0]['Max(id)']+1).success(function(data){
              AuthService.currentUser = $scope.dataEnteredRegister.username;
              $state.go('homeMenu.newsfeed');
            })
          })
        }
      })
    };

   $scope.Cancel = function () {
       $state.go('welcome');
   };
})

.controller('EventsCtrl', function($scope, MainEvents, DatabaseService, AuthService) {

  var firstDay = '2016-11-18T';
  var secondDay = '2016-11-19';
  var lastDay = '2016-11-20';

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


  MainEvents.getEventsFirstDay().success(function (data) {
    $scope.dayOneEvents = data;
    console.log("Day One Events", data);
    var a = data;
      console.log(typeof(data[0].starttime));
      console.log(data[0].starttime);
    console.log(Date.parse(data[0].startime));
    angular.forEach(a, function (value, key) {
      value.starttime = new Date(Date.parse(value.starttime)).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
      });
      value.endtime = new Date(Date.parse(value.endtime)).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
      })

    });
    $scope.registerUser= function(id){
      console.log("Id", id);

    }

  });
  })

.controller('ProfileCtrl', function ($scope, DatabaseService, AuthService) {

  $scope.profile = {
      img:"",
      phonenumber:"",
      birthdate:""
  }

  DatabaseService.GetProfileImg(AuthService.currentUser).success(function(dataimg){
    DatabaseService.GetPhoneNumber(AuthService.currentUser).success(function(dataphone){
      DatabaseService.GetBirthday(AuthService.currentUser).success(function(databirth){
        DatabaseService.GetDescription(AuthService.currentUser).success(function(datadescription){
          $scope.profile.img = dataimg[0]['profileimage'];
          $scope.profile.phonenumber = dataphone[0]['phonenumber'];
          $scope.profile.birthdate = databirth[0]['birthdate'];
          $scope.profile.description = datadescription[0]['description'];
        })
      })
    })
  })
})

.controller('MapCtrl', function($scope, $state, $cordovaGeolocation, $ionicPlatform, AuthService) {


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

.controller('NewsfeedCtrl', function($scope, $http, DatabaseService, NewsfeedService, Backand, $timeout, PersonService, AuthService) {

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
