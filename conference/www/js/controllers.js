angular.module('App.controllers', ['ngOpenFB', 'ngCordova', 'App.services'])

  .run(function($rootScope) {
    $rootScope.currentLanguage = "english";
  })

  .controller('menuController', function ($scope, $ionicPlatform, $state, DatabaseService, AuthService, $cordovaDevice, $rootScope) {

  })

.controller('LoginCtrl', function ($scope, $ionicPlatform, $state, DatabaseService, AuthService, $rootScope) {
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
            //Check if the password is correct.
            if (dataPass[0]['password'] === $scope.dataEntered.password){
              AuthService.currentUser = $scope.dataEntered.username;
              AuthService.uid = dataUser[0]['id'];
              console.log(AuthService.uid);
              DatabaseService.updateUUID($scope.UUID, AuthService.currentUser).success(function(){})
              console.log(AuthService.currentUser);
              //if (AuthService.currentLanguage == "English"){
                console.log($rootScope.currentLanguage);
                $state.go('homeMenu.newsfeed');
              //}
              //else{
                //$state.go('homeMenu.newsfeedFrench');
              //}
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

.controller('LogoutCtrl', function ($scope, $ionicPlatform, $state, DatabaseService, AuthService, $rootScope) {

  $scope.Logout = function () {
      DatabaseService.updateUUID("", AuthService.currentUser).success(function(){})
      AuthService.currentUser = "";
        $state.go('welcome');
   };
})

.controller('OptionCtrl', function ($scope, $ionicPlatform, $state, DatabaseService, AuthService, $rootScope) {

  $scope.goFrench = function() {
      $rootScope.currentLanguage = "french";
      console.log($rootScope.currentLanguage);
  };

  $scope.goEnglish = function() {
      $rootScope.currentLanguage = "english";
  };
})

.controller('UsersPageCtrl', function($scope, $ionicPlatform, $state, DatabaseService, AuthService, $rootScope){
    DatabaseService.getallUsers().success(function(dataAllUsers){
        $scope.allUsers = dataAllUsers;
    })

    $scope.setUserSelected = function(user){
        AuthService.userSelected = user;
        console.log(AuthService.userSelected);
    }
})

.controller('RegisterCtrl', function($scope, $ionicPlatform, $state, DatabaseService, AuthService, $rootScope){

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

.controller('EventsCtrl', function($scope, MainEvents, $ionicPopover) {

    var peopleAttendingEachEvent = {};
    $scope.map = {};

  $scope.dates = [
    {text: 'November 18, 2016', value:1},
    {text: 'November 19, 2016', value: 2},
    {text: 'November 20, 2016', value: 3}
  ];

  $scope.datesFrench = [
    {text: '18 novembre 2016', value: 1},
    {text: '19 novembre 2016', value: 2},
    {text: '20 novembre 2016', value: 3}
  ]

  $scope.defaultDate = {
    clientSide: '1'
  }
  $scope.putNewDate = function(datePickedVal, dateArr){
    var index;
    dateArr.some(function(entry, i){
      if (entry.value == datePickedVal){
        index =i;
      }
    })

    if (index <= 2) {
      setDateForRepetition(index);
      return dateArr[index].text;
    }
  }

  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };

  $ionicPopover.fromTemplateUrl('templates/popover.html', {
    scope: $scope,
  }).then(function(popover) {
    $scope.popover = popover;
  });

  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };

  MainEvents.getUserQuery().success(function(data) {
    var userArr = data;
    for (var i = 0; i < userArr.length; i++) {
      peopleAttendingEachEvent[userArr[i].id] = {
        name: userArr[i].name
      };
    }
    MainEvents.getPeopleAttending().success(function(data){
      var mapOfEventToUser = data.data;
      mapOfEventToUser.forEach(function(item) {
        if((item.user) && (item.event) && peopleAttendingEachEvent[item.user]) {
          if (!$scope.map[item.event]) {
            $scope.map[item.event] = [peopleAttendingEachEvent[item.user].name];
          }
          else {
            $scope.map[item.event].push(peopleAttendingEachEvent[item.user].name);
          }
        }
      })
      $scope.getMappingOfEventToUsers = function(id){
        return $scope.map[id];
      }
    })
  });


  MainEvents.getEventsFirstDay().success(function (data) {
    $scope.dayOneEvents = data;
    fixTiming($scope.dayOneEvents);
    MainEvents.setEventArrayWithFixedTiming($scope.dayOneEvents, 'one')

  });

  MainEvents.getEventsSecondDay().success(function(data){
    $scope.dayTwoEvents = data;
    fixTiming($scope.dayTwoEvents);
    MainEvents.setEventArrayWithFixedTiming($scope.dayTwoEvents, 'second');
  });


  MainEvents.getEventsFinalDay().success(function(data){
    $scope.finalDayEvents = data;
    fixTiming($scope.finalDayEvents);
    MainEvents.setEventArrayWithFixedTiming($scope.finalDayEvents, 'last');
  });

  function fixTiming(dayEventArr){
    angular.forEach(dayEventArr, function (value) {
      value.starttime = new Date(Date.parse(value.starttime)).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
      });
      value.endtime = new Date(Date.parse(value.endtime)).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
      });
    })
  }

  //$scope.setDateForRepetition = function(){
  //
  //}
  function setDateForRepetition(ind) {
    $scope.events;
    if (ind == 0) {
      $scope.events = MainEvents.getEventArrayWithFixedTiming('one');
    }

    if(ind == 1){
      $scope.events = MainEvents.getEventArrayWithFixedTiming('second');
    }

    if(ind == 2){
      $scope.events = MainEvents.getEventArrayWithFixedTiming('third');
    }
  }

  })

.controller('ProfileCtrl', function ($scope, DatabaseService, AuthService, $rootScope) {
  $scope.editPhone = null;
  $scope.editDescription = null;
  $scope.editBirthdate = null;
  $scope.editDescription = null;


  $scope.startEditPhone = function(){
    $scope.editPhone = "1";
  }

  $scope.endEditPhone= function(){
    DatabaseService.updatePhonenumber("("+$scope.updatedProfile.newPhonenumberRegional+") "+$scope.updatedProfile.newPhonenumberFirstPart+"-"+$scope.updatedProfile.newPhonenumberSecondPart, AuthService.currentUser).success(function(){
      DatabaseService.GetPhoneNumber(AuthService.currentUser).success(function(dataphone){
        $scope.profile.phonenumber = dataphone[0]['phonenumber'];
        $scope.editPhone = null;
      })
    })
  }

  $scope.startEditBirthdate = function(){
    $scope.editBirthdate = "1";
  }

  $scope.endEditBirthdate= function(){
    DatabaseService.updateBirthdate($scope.updatedProfile.newBirthdateDay+"-"+$scope.updatedProfile.newBirthdateMonth+"-"+$scope.updatedProfile.newBirthdateYear, AuthService.currentUser).success(function(){
      DatabaseService.GetBirthday(AuthService.currentUser).success(function(databirthdate){
        $scope.profile.birthdate = databirthdate[0]['birthdate'];
        $scope.editBirthdate = null;
      })
    })
  }


  $scope.startEditDescription = function(){
    $scope.editDescription = "1";
  }

  $scope.endEditDescription= function(){
    DatabaseService.updateDescription(AuthService.currentUser, $scope.updatedProfile.newDescription).success(function(){
      DatabaseService.GetDescription(AuthService.currentUser).success(function(datadescription){
        $scope.profile.description = datadescription[0]['description'];
        $scope.editDescription = null;
      })
    })
  }

  $scope.profile = {
      img:"",
      phonenumber:"",
      birthdate:"",
      description:""
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

  $scope.updatedProfile = {

    newBirthdateDay:"",
    newBirthdateMonth:"",
    newBirthdateYear:"",

    newPhonenumberRegional:"",
    newPhonenumberFirstPart:"",
    newPhonenumberSecondPart:"",

    newDescription:""


  }
})

.controller('UsersCtrl', function ($scope, DatabaseService, AuthService, $rootScope) {

  console.log(AuthService.userSelected);
  $scope.setUserSelected = function(user){
      AuthService.userSelected = user;
      console.log(AuthService.userSelected);
  }

})


.controller('UserProfileCtrl', function ($scope, DatabaseService, AuthService, $rootScope) {


  $scope.profile = {
      img:"",
      phonenumber:"",
      birthdate:"",
      description:""
  }


  DatabaseService.GetProfileImg(AuthService.userSelected).success(function(dataimg){
    DatabaseService.GetPhoneNumber(AuthService.userSelected).success(function(dataphone){
      DatabaseService.GetBirthday(AuthService.userSelected).success(function(databirth){
        DatabaseService.GetDescription(AuthService.userSelected).success(function(datadescription){
          $scope.profile.img = dataimg[0]['profileimage'];
          $scope.profile.phonenumber = dataphone[0]['phonenumber'];
          $scope.profile.birthdate = databirth[0]['birthdate'];
          $scope.profile.description = datadescription[0]['description'];
        })
      })
    })
  })

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


.controller('NewsfeedCtrl', function($scope, $http, DatabaseService, NewsfeedService, Backand, $timeout, PersonService, AuthService, TwitterREST) {



  $scope.entry = [];
  var uid = AuthService.uid;
  $scope.userName = AuthService.currentUser;

  $scope.$on('$ionicView.enter', function () {
    retrieveTwitterFeed();
		retrieveInfo();
	  console.log("page opened");
	})

  $scope.refreshTwitterfeed = function () {
		retrieveTwitterFeed();
    $scope.$broadcast('scroll.refreshComplete');
		console.log("page refresh");
	}

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


  var getMonth = function(monthNumber) {
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[parseInt(monthNumber) -1];
  };

  var formatDate = function(datetime) {
    var result = datetime.split("-");
    var year = result[0];
    var month = getMonth(result[1]);
    var res = result[2].split("T");
    var day = res[0];
    var time = res[1].split(":");
    var hour = time[0];
    var min = time[1];

    return month+" "+day+" at "+hour+":"+min;
  };

  function retrieveTwitterFeed(){
    TwitterREST.sync().then(function(tweets){
          console.log(tweets);
          $scope.tweets = tweets.statuses;
      });

      $scope.innapBrowser = function (value) {
          window.open(value, '_blank');
      };
    }

  $scope.postComment = function(id) {
    var comment = document.getElementById(id).value;
    var timestamp = new Date();
    var day = formatNumber(timestamp.getDate());
    var month = formatNumber(timestamp.getMonth()+1);
    var year = timestamp.getFullYear();
    var hours = formatNumber(timestamp.getHours());
    var min = formatNumber(timestamp.getMinutes());
    var sec = formatNumber(timestamp.getSeconds());
    var date = ""+year+"-"+month+"-"+day+"T"+hours+":"+min+":"+sec;
    var data = {"date": date, "uid": uid, "content": comment, "commentid": id, "likes": 0};
    DatabaseService.newEntry('/1/objects/pushBoard', data).success(function(data){
      $scope.ServerResponse = data;
      console.log("comment saved");
      $scope.refreshNewsfeed();
      document.getElementById(id).value = null;
    })
      .error(function (data, status, header, config) {
            $scope.ServerResponse =  htmlDecode("Data: " + data +
                "\n\n\n\nstatus: " + status +
                "\n\n\n\nheaders: " + header +
                "\n\n\n\nconfig: " + config);
                console.log("error saving comment");
    });
  }

  $scope.like = function(likesCounter, entryId){
     var data = {"likes": (parseInt(likesCounter) + 1)};
     DatabaseService.updateData('/1/objects/pushBoard/'+entryId, data).success(function(data){
       $scope.ServerResponse = data;
       console.log("likes updated");
       $scope.refreshNewsfeed();
     })
       .error(function (data, status, header, config) {
             $scope.ServerResponse =  htmlDecode("Data: " + data +
                 "\n\n\n\nstatus: " + status +
                 "\n\n\n\nheaders: " + header +
                 "\n\n\n\nconfig: " + config);
   							console.log("error updating likes");
     });
   };


  function retrieveInfo(){
    DatabaseService.getData('/1/query/data/getUserNameFromID').success(function(data){
      for (i=0; i < data.length; i++){
          $scope.entry[i] = {name:data[i]['name'],
                            date:formatDate(data[i]['date']),
                            content:data[i]['content'],
                            commentid: data[i]['commentid'],
                            id: data[i]['id'],
                            likes: data[i]['likes']};
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

.controller('SearchCtrl', function($scope, $http, DatabaseService) {
  $scope.searchables = "blank";
  console.log($scope.searchables);
  $scope.searched = [];
  $scope.searchUsers = function() {
    var searchItem = document.getElementById('searchContent').value;
    if ($scope.searchables = "blank") {
      console.log("Blank search - unsearchable")
    }
    else if (searchItem = "") {
      console.log("Blank search - unsearchable")
    }
    else if ($scope.searchables = "user"){
      DatabaseService.getData('/1/query/data/searchUser').success(function(data){
      for (i=0; i < data.length; i++){
        $scope.searched[i] = {name:data[i]['name'], photo:data[i]['photo']};
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
    else if ($scope.searchables = "name"){
      DatabaseService.getData('/1/query/data/searchEventByName').success(function(data){
        for (i=0; i < data.length; i++){
          $scope.searched[i] = {name:data[i]['name'], photo:data[i]['photo']};
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
    else if ($scope.searchables = "location") {
      DatabaseService.getData('/1/query/data/searchEventByLocation').success(function(data){
        for (i=0; i < data.length; i++){
          $scope.searched[i] = {name:data[i]['name'], photo:data[i]['photo']};
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
  }

  $scope.getDropdownOption = function(){
    searchopt = $scope.selectOption;
    console.log(searchopt);
    switch(searchopt) {
      case 'location':
        $scope.searchables = "location";
        break;
      case 'name':
        $scope.searchables = "name";
        break;
      case 'user':
        $scope.searchables = "user";
        break;
      default:
        $scope.searchables = "blank";

    }
    console.log($scope.searchables);
  }

})
