angular.module('App.controllers', ['ngCordova', 'App.services', 'App.directives'])

.run(function($rootScope) {
	$rootScope.currentLanguage = "english";
})

.controller('menuController', function ($scope, $ionicPlatform, $state, DatabaseService, AuthService, $cordovaDevice, $rootScope) {

})

.controller('LoginCtrl', function ($scope, $ionicPlatform, $state, DatabaseService, AuthService, $cordovaDevice, $rootScope, $ionicPopup, MainEvents) {

  try{
    $rootScope.UUID = $cordovaDevice.getUUID();
    DatabaseService.searchUUID($rootScope.UUID).success(function(dataUUID){
      if ((dataUUID[0] != null) && (dataUUID[0]['UUID'] != "\'{{UUID}}\'")){
        AuthService.currentUser = dataUUID[0]['username'];
        AuthService.uid = dataUUID[0]['id'];
        $state.go('homeMenu.newsfeed');
      }
     })
  }
     catch (err){
		    DatabaseService.addError(err.message).success(function(){});
       	console.log("Error " + err.message);
     }


	$scope.dataEntered = {
		username : "",
		password : "",
	};

	$scope.goFrench = function(){
		$rootScope.currentLanguage = "french";
		$state.go('welcomefr');
	}

	$scope.goEnglish = function(){
		$rootScope.currentLanguage = "english";
		$state.go('welcome');
	}

	$scope.Login = function () {
		DatabaseService.searchUser($scope.dataEntered.username).success(function(dataUser){
            //Check if the username exist...
            if($scope.dataEntered.username === "" && $scope.dataEntered.password === ""){
                var alertPopup = $ionicPopup.alert({
                    title: 'Please enter a registered username and password.'
                });
//                alert("Please enter a registered username and password.")
            }
            else if ($scope.dataEntered.username === ""){
                var alertPopup = $ionicPopup.alert({
                    title: 'Please enter a registered username.'
                });
            }
            else if ($scope.dataEntered.password === ""){
                var alertPopup = $ionicPopup.alert({
                    title: 'Please enter a registered password.'
                });
            }
            else {
                if(dataUser.length === 0){
                    var alertPopup = $ionicPopup.alert({
                        title: 'Please enter a registered username.'
                    });
                }
                else if (dataUser[0]['username'] === $scope.dataEntered.username){
                    DatabaseService.searchPass($scope.dataEntered.username, $scope.dataEntered.password).success(function(dataPass){
                        //Check if the password is correct.
                        if(dataPass.length === 0){
                            var alertPopup = $ionicPopup.alert({
                                title: 'Please enter the password for your CDE account.'
                            });
                        }
                        else if (dataPass[0]['password'] === $scope.dataEntered.password){
                            AuthService.currentUser = $scope.dataEntered.username;
                            AuthService.uid = dataUser[0]['id'];
                            MainEvents.setUserId(AuthService.uid);
                            if ($rootScope.UUID != undefined){
                              DatabaseService.updateUUID($rootScope.UUID, AuthService.currentUser).success(function(){})
                            }
                            if ($rootScope.currentLanguage != "french"){
                                $state.go('homeMenu.newsfeed');
                            }
                            else{
                                $state.go('homeMenu.newsfeedfr');
                            }
                        }
                    });
                }
                else{
                    var alertPopup = $ionicPopup.alert({
                        title: 'Please enter a registered username.'
                    });
                }
            }
        });
    };

	$scope.Register = function () {
		if($rootScope.currentLanguage != "french"){
			$state.go('register');
		}
		else{
			$state.go('registerfr');
		}
	};

})

.controller('LogoutCtrl', function ($scope, $ionicPlatform, $state, DatabaseService, AuthService, $rootScope) {

	$scope.Logout = function () {
		DatabaseService.updateUUID("", AuthService.currentUser).success(function(){})
		AuthService.currentUser = "";
    AuthService.uid = "";
		if ($rootScope.currentLanguage != "french"){
			$state.go('welcome');
		}
		else{
			$state.go('welcomefr');
		}
	};
})

.controller('OptionCtrl', function ($scope, $ionicPlatform, $state, $location, DatabaseService, AuthService, $rootScope, $route) {

	$scope.goFrench = function() {
		$rootScope.currentLanguage = "french";

	};

	$scope.goEnglish = function() {
		$rootScope.currentLanguage = "english";

  };

})

.controller('UsersPageCtrl', function($scope, $ionicPlatform, $state, DatabaseService, AuthService, $rootScope){
	DatabaseService.getAllNamePhotos().success(function(dataAllInfo){
		$scope.usersInfo = dataAllInfo;
	})

	$scope.setUserSelected = function(userChosen){
		AuthService.userSelected = userChosen;
    AuthService.isSpeaker = false;
	}
})

.controller('SpeakersPageCtrl', function($scope, $ionicPlatform, $state, DatabaseService, AuthService, $rootScope) {

	DatabaseService.getAllSpeakersInfo().success(function(dataAllInfo){
		$scope.speakersInfo = dataAllInfo;
	})

	$scope.setSpeakerSelected = function(speaker, spname){
		AuthService.userSelected = speaker;
    AuthService.speakerName = spname ;
    AuthService.isSpeaker = true;
	}

})

.controller('RegisterCtrl', function($scope,$cordovaDevice, $ionicPlatform, $state, DatabaseService, AuthService, $rootScope, $ionicPopup){

	$scope.dataEnteredRegister = {
		username : "",
		name : "",
		password : "",
	};



	function checkForm()
	{
		if($scope.dataEnteredRegister.username == "" || $scope.dataEnteredRegister.password == "" || $scope.dataEnteredRegister.name == "" ) {
			var alertPopup = $ionicPopup.alert({
                        title: 'Some extra information is required.'
            });
			return false;
		}
		re = /^\w+$/;
		if(!re.test($scope.dataEnteredRegister.username)) {
            var alertPopup = $ionicPopup.alert({
                title: 'Please type your username as only letters, numbers and underscores.'
            });
			return false;
		}
    if($scope.dataEnteredRegister.password.length < 6) {
      var alertPopup = $ionicPopup.alert({
        title: 'Please enter a password having at least 6 characters.'
      });
		return false;
  }
  console.log("NO ERROR FOUND!")
	return true;
	};

	$scope.Register = function () {
		DatabaseService.searchUser($scope.dataEnteredRegister.username).success(function(dataUser){
		//Check if the username exist...
		if (dataUser[0] == null && checkForm()){
		  DatabaseService.createNewUser($scope.dataEnteredRegister).success(function(data){
			  AuthService.currentUser = $scope.dataEnteredRegister.username;
        DatabaseService.getID($scope.dataEnteredRegister.username).success(function(dataID){
          AuthService.uid = dataID[0]['id'];
          if ($rootScope.UUID != undefined){
            DatabaseService.updateUUID($rootScope.UUID, AuthService.currentUser).success(function(){})
          }
          if ($rootScope.currentLanguage != "french"){
            $state.go('homeMenu.newsfeed');
          }
          else{
            $state.go('homeMenu.newsfeedfr');
          }
        })
			  //		MainEvents.setUserId(AuthService.uid);
			})
		}
    else if(dataUser[0] != null){
        var alertPopup = $ionicPopup.alert({
          title: 'This username is already registered.'
        });
    }
	})
	};

	$scope.Cancel = function () {
		if ($rootScope.currentLanguage != "french"){
			$state.go('welcome');
		}
		else{
			$state.go('welcomefr');
		}
	};
})

  .controller('EventsCtrl', function($scope, MainEvents, $ionicPopover, AuthService, $location, $route) {

    var peopleAttendingEachEvent = {};
    $scope.map = {};
    $scope.mapUserRegisteredToEvent = {};
    $scope.eventIdUserClicked;
    $scope.userArr;

    $scope.eventRegistered = false;
    $scope.activateRegisteredButton = function(){
      $scope.eventRegistered = !$scope.eventRegistered;
    }


    $scope.$on('$ionicView.enter', function () {
      updatePeopleAttendingEachEvent();
      console.log("page opened");
    })

    $scope.getIdOfEvent= function(eventId){
      $scope.eventIdUserClicked = eventId;
    }

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
    function updatePeopleAttendingEachEvent() {
      MainEvents.getUserQuery().success(function (data) {
       var userArr = data;
        for (var i = 0; i < userArr.length; i++) {
          console.log("HEREEE");
          peopleAttendingEachEvent[userArr[i].id] = {
            name: userArr[i].name
          };
        }
        MainEvents.setPeopleAttendingEachEvent(peopleAttendingEachEvent);
      console.log("User Arr", userArr);
      MainEvents.getPeopleAttending().success(function (data) {
        var mapOfEventToUser = data.data;
        console.log("Map of event to user", mapOfEventToUser);
        console.log("Peopel attending each event", peopleAttendingEachEvent);
        mapOfEventToUser.forEach(function (item) {
          console.log("CHeCK user", (item.user));
          console.log("Check evnet", item.event);
          console.log("check ppl attending each event", peopleAttendingEachEvent[item.user]);
          if ((item.user) && (item.event) && peopleAttendingEachEvent[item.user]) {
            console.log("item.event", item.event);
            if (!$scope.map[item.event]) {
              $scope.map[item.event] = [peopleAttendingEachEvent[item.user].name];
              console.log("CAme here");
            }
            else {
              $scope.map[item.event].push(peopleAttendingEachEvent[item.user].name);
              console.log("Came here too",peopleAttendingEachEvent[item.user].name );
            }
          }
        })
        console.log("$scope.map", $scope.map);
        MainEvents.setMapOfEventsToUsers($scope.map);
        $scope.getMappingOfEventToUsers = function (id) {
          $scope.calculateNumberOfPeopleAttending = function(){
            var length;
            if($scope.map[id]){
              console.log("INSIDE CALCULATE NUMBER OF PEOPEL ATTENDING IF");
              length = removeDuplicates($scope.map[id]).length;
            }
            else {
              length = 0;
            }
            return length;
          }
          if ($scope.map[id]) {
          //  console.log("$scope.map[id]", (removeDuplicates($scope.map[id])).length);
            $scope.numberOfPeopleAttending = (removeDuplicates($scope.map[id])).length;
            return removeDuplicates($scope.map[id]);
            //$scope.checkIfUserHasRegisteredToEvent(id, $scope.map[id], peopleAttendingEachEvent);
          }
        }
      })
      })
    }


    function removeDuplicates(arr){
      if(arr) {
        var temp = [];
        for (var i = 0; i < arr.length; i++) {
          if (temp.indexOf(arr[i]) == -1) {
            temp.push(arr[i]);
          }
        }
        arr = temp;
        temp = [];
        return arr;

      }
    }

    $scope.registered = false;
    $scope.preRegistered = function(){
      $scope.registered = !$scope.registered;
    }

    function checkIfUserHasRegisteredToEvent(uid, mapOfIdsToUsernames, eventId, mapOfEventsToRegister) {
      if (uid && mapOfIdsToUsernames && eventId && mapOfEventsToRegister) {
        var username = mapOfIdsToUsernames[uid].name;
        console.log("Username", username);
        for (var key in mapOfEventsToRegister) {
          var obj = mapOfEventsToRegister[key];
          if (obj.indexOf(username) !== -1) {
            $scope.mapUserRegisteredToEvent[key]= ({'value': true});
          }
          else{
            $scope.mapUserRegisteredToEvent[key] = ({'value': false});
          }
        }

        //$scope.mapUserRegisteredToEvent = removeDuplicates($scope.mapUserRegisteredToEvent);
      }
    }

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

    function setDateForRepetition(ind) {
      $scope.events;
      if (ind == 0) {
        $scope.events = MainEvents.getEventArrayWithFixedTiming('one');
      }

      if(ind == 1){
        $scope.events = MainEvents.getEventArrayWithFixedTiming('second')
      }

      if(ind == 2){
        $scope.events = MainEvents.getEventArrayWithFixedTiming('third');
      }
    }

    $scope.refreshEvents = function () {
      updatePeopleAttendingEachEvent();
      $scope.$broadcast('scroll.refreshComplete');
      console.log("page refresh");
    }

    $scope.registerForEvent = function(eventId) {
      var uid = AuthService.uid;
      console.log("UID", uid);
      console.log("Event ID", eventId);
      var userNamesArrForEachId = MainEvents.getPeopleAttendingEachEvent();
      var mapOfEventsToUsers = MainEvents.getMapOfEventsToUsers();
     // console.log("REGISTER FOR EVENT", mapOfEventsToUsers[eventId] === undefined);
      var username = userNamesArrForEachId[uid].name;
      if (username && eventId && mapOfEventsToUsers) {
        if ((mapOfEventsToUsers[eventId] === undefined) || (mapOfEventsToUsers[eventId].indexOf(username) == -1)) {
          console.log("HERE");
          MainEvents.updatePeopleAttending(uid, eventId ).success(function (data) {
              console.log("AFTER");
              var serverResponse = data;
              $scope.refreshEvents();
              $scope.activateRegisteredButton();
              //checkIfUserHasRegisteredToEvent(uid,userNamesArrForEachId, eventToRegister, mapOfEventsToUsers);

            })
            .error(function (data) {
              $scope.serverResponse = htmlDecode("Data: " + data);
              console.log("Error refreshing data");
            });
        }
        console.log("CAME HERE WHICH IS GOOD")
      }
      else{
        console.log("UNDEFINED username, eventID or mapOfEventToUsers!")
      }
    }

    $scope.redirectToSpeaker = function(spName){
      AuthService.speakerName = spName;
      AuthService.isSpeaker = true;
      $location.path("/homeMenu/userProfile");
      $route.reload();
    }

    $scope.redirectToSpeakerFr = function(spName){
      AuthService.speakerName = spName;
      AuthService.isSpeaker = true;
      $location.path("/homeMenu/userProfilefr");
      $route.reload();
    }


  })

.controller('ProfileCtrl', function ($scope, DatabaseService, AuthService, $rootScope, MainEvents, $http, Backand) {

  $scope.editPhoto = null;
  $scope.editDescription = null;
  $scope.editProfession = null;
  $scope.editName = null;
  $scope.imageUrl = null;
  $scope.filename = null;
        $scope.btnText = "Upload";

    $scope.currentPic = null;

     DatabaseService.GetProfileImg(AuthService.currentUser).success(function(dataImg){
         $scope.currentPic = dataImg[0]['photo'];
     })

  var baseUrl = '/1/objects/';
  var baseActionUrl = baseUrl + 'action/'
  var objectName = 'user';
  var filesActionName = 'img';

$scope.file_changed = function(element) {
        console.log("weeee!!")
        $scope.$apply(function(scope) {
            console.log("yaho!")
            var photofile = element.files[0];
            var reader = new FileReader();
            reader.onload = function(e) {
                console.log("hmmm...")
                // handle onload
            };
            if(photofile != undefined){
                reader.onload = function(e) {
        upload(photofile.name, e.currentTarget.result).then(function(res) {
          $scope.imageUrl = res.data.url;
          $scope.filename = photofile.name;
//          DatabaseService.updateImg(AuthService.currentUser, file.name).success(function(data){
//          })
          $scope.profile.imgName = photofile.name;
        },  function(err){
              alert(err.data);
            });
        }
        reader.readAsDataURL(photofile);
                console.log("FOUUND A FILE!")
                console.log(photofile)
//                reader.readAsDataURL(photofile);
                $scope.btnText = "Uploaded!";
            }
//            console.log(photofile)
//            console.log(reader.readAsDataURL(photofile));
        });
    };

  // input file onchange callback
  $scope.imageChanged = function() {
        DatabaseService.updateImg(AuthService.currentUser, $scope.profile.imgName).success(function(data){
          })
        $scope.btnText = "Upload";
//    var imageExist = false;
//    var file = fileInput.files[0];
//    var reader = new FileReader();
//
//    DatabaseService.searchImg(file.name).success(function(data){
//      if (data[0] == undefined){
//        imageExist = true;
//      }
//      else {
//        imageExist = false;
//      }
//      //read file content
//      if (imageExist == true){
//        reader.onload = function(e) {
//        upload(file.name, e.currentTarget.result).then(function(res) {
//          $scope.imageUrl = res.data.url;
//          $scope.filename = file.name;
////          DatabaseService.updateImg(AuthService.currentUser, file.name).success(function(data){
////          })
//          $scope.profile.imgName = file.name;
//        },  function(err){
//              alert(err.data);
//            });
//        }
//        reader.readAsDataURL(file);
//      }
//      else {
//        alert("Change the name of the image! // Veuillez changer le nom de l'image!");
//      }
//    })
  };

        $scope.cancelUpload = function() {
        $scope.btnText = "Upload";
        DatabaseService.GetProfileImg(AuthService.currentUser).success(function(dataImg){
            $scope.profile.imgName = dataImg[0]['photo'];
            console.log(dataImg[0]['photo']);
            console.log("!!!");
            console.log($scope.profile.imgName);
            var reader = new FileReader();
            reader.onload = function(e) {
                console.log("image changed!");
                upload($scope.currentPic).then(function(res) {
////                        $scope.imageUrl = res.data.url;
////                        $scope.filename = file.name;
////                        DatabaseService.updateImg(AuthService.currentUser, file.name).success(function(data){
////
////                        })
                        $scope.profile.imgName = $scope.currentPic
////                    }, function(err){
////                        alert(err.data);
                })
            };
        })
        }

  function upload(filename, filedata) {
    // By calling the files action with POST method in will perform
    // an upload of the file into Backand Storage
    return $http({
      method: 'POST',
      url : Backand.getApiUrl() + baseActionUrl +  objectName,
      params:{
        "name": filesActionName
      },
      headers: {
        'Content-Type': 'application/json'
      },
      // you need to provide the file name and the file data
      data: {
        "filename": filename,
        "filedata": filedata.substr(filedata.indexOf(',') + 1, filedata.length) //need to remove the file prefix type
      }
    });
  };



   // register to change event on input file
  function init() {
    var fileInput = document.getElementById('fileInput');

  }

    $scope.startEditPhoto = function(){
      $scope.editPhoto = "1";
    }

    $scope.endEditPhoto = function(){
      $scope.editPhoto = null;
    }

    $scope.endEditPhone= function(){
      DatabaseService.updatePhonenumber("("+$scope.updatedProfile.newPhonenumberRegional+") "+$scope.updatedProfile.newPhonenumberFirstPart+"-"+$scope.updatedProfile.newPhonenumberSecondPart, AuthService.currentUser).success(function(){
        DatabaseService.GetPhoneNumber(AuthService.currentUser).success(function(dataphone){
          $scope.profile.phonenumber = dataphone[0]['phonenumber'];
          $scope.editPhone = null;
        })
      })
    }


    $scope.startEditProfession = function(){
      $scope.editProfession = "1";
    }

    $scope.endEditProfession= function(){
      DatabaseService.updateProfession($scope.updatedProfile.newProfession, AuthService.currentUser).success(function(){
        DatabaseService.GetProfession(AuthService.currentUser).success(function(dataprofession){
          $scope.profile.profession = dataprofession[0]['profession'];
          $scope.editProfession = null;
        })
      })
    }

    $scope.startEditName = function(){
      $scope.editName = "1";
    }

    $scope.endEditName= function(){
      DatabaseService.updateName(AuthService.currentUser,$scope.updatedProfile.newName).success(function(){
        DatabaseService.getName(AuthService.currentUser).success(function(dataname){
          $scope.profile.name = dataname[0]['name'];
          $scope.editName = null;
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
	name:"",
	imgName:"",
	phonenumber:"",
	profession:"",
	description:""
}


DatabaseService.GetPhoneNumber(AuthService.currentUser).success(function(dataphone){
	DatabaseService.GetProfession(AuthService.currentUser).success(function(dataprofession){
		DatabaseService.GetDescription(AuthService.currentUser).success(function(datadescription){
			DatabaseService.GetProfileImg(AuthService.currentUser).success(function(dataImg){
				DatabaseService.getName(AuthService.currentUser).success(function(dataname){
					$scope.profile.name = dataname[0]['name'];
					$scope.profile.imgName = dataImg[0]['photo'];
					$scope.profile.phonenumber = dataphone[0]['phonenumber'];
					$scope.profile.profession = dataprofession[0]['profession'];
					$scope.profile.description = datadescription[0]['description'];
				})
			})
		})
	})
})

$scope.updatedProfile = {

	newName:"",

	newProfession:"",

	newPhonenumberRegional:"",
	newPhonenumberFirstPart:"",
	newPhonenumberSecondPart:"",

	newDescription:""


}
  $scope.$on('$ionicView.enter', function () {
    updateUserEvents();
    console.log("page opened");
  })

function updateUserEvents() {
  $scope.userMap = [];
  var eventList = {};
  // $scope.isUser = 1;
  DatabaseService.getAllEvents().success(function (data) {
    var eventArr = data;
    for (var i = 0; i < eventArr.length; i++) {
      eventList[eventArr[i].id] = {
        name: eventArr[i].name,
        name_fr: eventArr[i].name_fr
      };
    }

    var currentUser = "";
    currentUser = AuthService.uid;

    MainEvents.getPeopleAttending().success(function (data) {
      var mapOfEvents = data.data;
      console.log($rootScope.currentLanguage);
      mapOfEvents.forEach(function (item) {
        if (currentUser == item.user) {
          console.log(eventList[item.event]);
          if ($scope.userMap.indexOf(item) == -1) {
            if ($rootScope.currentLanguage == "english") {
              $scope.userMap.push(eventList[item.event].name);
            } else {
              $scope.userMap.push(eventList[item.event].name_fr);
            }
          }
        }
      })
      $scope.userMap = removeDuplicates($scope.userMap);
      // console.log($scope.userMap);
      $scope.userEvents = function () {
        return $scope.userMap;
      }
    })
  });
}

  function removeDuplicates(arr){
    var temp = [];
    for (var i=0; i < arr.length; i++){
      if(temp.indexOf(arr[i]) == -1){
        temp.push(arr[i]);
      }
    }
    arr = temp;
    temp = [];
    return arr;

  }
})

.controller('UsersCtrl', function ($scope, DatabaseService, AuthService, $rootScope) {

	$scope.setUserSelected = function(user){
		AuthService.userSelected = user;
	}

})

.controller('UsersCtrl', function ($scope, DatabaseService, AuthService, $rootScope) {

	$scope.setUserSelected = function(user){
		AuthService.userSelected = user;
	}

})


.controller('UserProfileCtrl', function ($scope, DatabaseService, AuthService, MainEvents, $rootScope) {


	$scope.profile = {
		img:"",
		name:"",
		phonenumber:"",
		profession:"",
		description:""
	}

	DatabaseService.GetPhoneNumber(AuthService.userSelected).success(function(dataphone){
		DatabaseService.GetProfession(AuthService.userSelected).success(function(dataprofession){
			DatabaseService.GetProfileImg(AuthService.userSelected).success(function(dataImg){
				DatabaseService.GetDescription(AuthService.userSelected).success(function(datadescription){
					DatabaseService.getName(AuthService.userSelected).success(function(dataname){
						$scope.profile.imgName = dataImg[0]['photo'];
						$scope.profile.name = dataname[0]['name'];
						$scope.profile.phonenumber = dataphone[0]['phonenumber'];
						$scope.profile.profession = dataprofession[0]['profession'];
						$scope.profile.description = datadescription[0]['description'];
					})
				})
			})
		})
	})

  $scope.$on('$ionicView.enter', function () {
    updatePeopleEvents();
    console.log("page opened");
  })

  function updatePeopleEvents() {
    $scope.userMap = [];
    var eventList = {};
    DatabaseService.getAllEvents().success(function (data) {
      var eventArr = data;
      for (var i = 0; i < eventArr.length; i++) {
        eventList[eventArr[i].id] = {
          name: eventArr[i].name,
          name_fr: eventArr[i].name_fr
        };
      }

      var currentUser = "";
      if (AuthService.isSpeaker == false) {
        DatabaseService.getID(AuthService.userSelected).success(function (data) {
          currentUser = data[0]['id'];
          console.log(currentUser)
        })
      }

      MainEvents.getPeopleAttending().success(function (data) {
        if (AuthService.isSpeaker == true) {
          console.log(AuthService.speakerName);
          if ($rootScope.currentLanguage == "english") {
            DatabaseService.getSpeakerEvents(AuthService.speakerName).success(function (dbd) {
              var spEvents = dbd.data;
              dbd.forEach(function (item) {
                if ($scope.userMap.indexOf(item) == -1) {
                  $scope.userMap.push(dbd[dbd.indexOf(item)]['name']);
                }
              })
            })
          }
          else {
            DatabaseService.getSpeakerEventsFr(AuthService.speakerName).success(function (dbd) {
              var spEvents = dbd.data;
              dbd.forEach(function (item) {
                if ($scope.userMap.indexOf(item) == -1) {
                  $scope.userMap.push(dbd[dbd.indexOf(item)]['name_fr']);
                }
              })
            })
          }
        } else {
          var mapOfEvents = data.data;
          mapOfEvents.forEach(function (item) {
            console.log(eventList[item.event]);
            if (currentUser == item.user) {
              if ($scope.userMap.indexOf(item) == -1) {
                if ($rootScope.currentLanguage == "english") {
                  $scope.userMap.push(eventList[item.event].name);
                } else {
                  $scope.userMap.push(eventList[item.event].name_fr);
                }
              }
            }
          })
        }
        $scope.userMap = removeDuplicates($scope.userMap);
        console.log($scope.userMap);
        $scope.userEvents = function () {
          return $scope.userMap;
        }
      })
    });
  }

  function removeDuplicates(arr){
    var temp = [];
    for (var i=0; i < arr.length; i++){
      if(temp.indexOf(arr[i]) == -1){
        temp.push(arr[i]);
      }
    }
    arr = temp;
    temp = [];
    return arr;

  }
})

.controller('MapCtrl', function($scope, $state, $cordovaGeolocation, $ionicPlatform) {
  // $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };

	// var options = {timeout: 10000, enableHighAccuracy: true};
    //
    // var script = window.document.createElement('script');
    // script.src = 'http://maps.googleapis.com/maps/api/js?key=AIzaSyDG8JKjni7gEZsFUhoke1xAfrU0Ok_SMTw&callback=InitMapCb';
    // window.document.head.appendChild(script);
    //
	// $cordovaGeolocation.getCurrentPosition(options).then(function(position){
    //
    //
	// 	var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    //
	// 	var mapOptions = {
	// 		center: latLng,
	// 		zoom: 15,
	// 		mapTypeId: google.maps.MapTypeId.ROADMAP
	// 	};
    //
	// 	$scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    //
    // navigator.geolocation.getCurrentPosition(function(pos) {
     //  map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
     //  var myLocation = new google.maps.Marker({
     //    position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
     //    map: map,
     //    title: "My Location"
     //  });
    // });
    //
    // $scope.map = map;
    //
	// }, function(error){
	// 	console.log("Could not get location");
	// });

  ionic.Platform.ready(function() {
    var myLatlng = new google.maps.LatLng(12.96,77.65);

    var mapOptions = {
      center: myLatlng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    $scope.mapCreated = function(map) {
      var latlngPlace = new google.maps.LatLng(45.778954,3.095466);
      var marker = new google.maps.Marker({
        map: map,
        position: latlngPlace
      });

      $scope.map = map;
    };
  });

})


.controller('NewsfeedCtrl', function($scope, $http, DatabaseService, NewsfeedService, Backand, $timeout, AuthService) {

	$scope.entry = [];
	$scope.comments = [];
	var count = 1;
  var currentToken = "";
	var uid = AuthService.uid;
  $scope.userName = "";
  DatabaseService.getName(AuthService.currentUser).success(function(dataname){
    $scope.userName = dataname[0]['name'];
  })

	$scope.$on('$ionicView.enter', function () {
		retrieveInfo();
		DatabaseService.getName(AuthService.currentUser).success(function(dataname){
	    $scope.userName = dataname[0]['name'];
	  });
    //$scope.pushNotification();
	  console.log("page opened");
	})

	$scope.refreshNewsfeed = function () {
		// $scope.entry = [];
		// $scope.comments = [];
		retrieveInfo();
    //$scope.pushNotification();
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

	$scope.showMore = function() {
		count++;
		retrieveInfo();
	};

	$scope.postComment = function(id) {
        console.log("!!!!");
        console.log(id);
		var comment = "";
		if (id == 0){
			comment = document.getElementById(0).value;
		}
		else{
			comment = document.getElementById("commentsBox").value;
		}
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
			document.getElementById("commentsBox").value = null;
			document.getElementById(0).value = null;
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
			var counter = 0;
      for (i=0; i < 10*count; i++){
          $scope.entry[i] = {name:data[i]['name'],
                            date:formatDate(data[i]['date']),
                            content:data[i]['content'],
                            commentid: data[i]['commentid'],
                            id: data[i]['id'],
                            likes: data[i]['likes']};
				//console.log($scope.entry);
      }
			for (i=0; i<$scope.entry.length; i++){
				DatabaseService.getCommentForPost($scope.entry[i].id).success(function(commentData){
					//console.log($scope.entry[i].id);
					//console.log(commentData);
					//console.log(commentData.length);
					console.log("i is", i);
					for(j=0; j<commentData.length; j++){
						$scope.comments[counter] = {name:commentData[j]['name'],
	                            	date:formatDate(commentData[j]['date']),
	                            	content:commentData[j]['content'],
	                            	commentid: commentData[j]['commentid'],
	                            	id: commentData[j]['id']};
						console.log("j is ", j);
						counter++;
					};
					console.log($scope.comments);
				});
			}
    })
    .error(function (data, status, header, config) {
        $scope.ServerResponse =  htmlDecode("Data: " + data +
            "\n\n\n\nstatus: " + status +
            "\n\n\n\nheaders: " + header +
            "\n\n\n\nconfig: " + config);
            console.log("error getting data");
   });
 };

 var message = {};
 var events = [];

 // var push = new Ionic.Push({
 //   "debug": true
 // });
 //
 // push.register(function(token) {
 //   console.log("My Device token:",token.token);
 //   currentToken = token.token;
 //   push.saveToken(token);  // persist the token in the Ionic Platform
 // });

 // DatabaseService.getData('/1/query/data/getUserEventTimes').success(function(data){
 //   for(i=0; i<data.length; i++){
 //     if (data[i]['User'] == uid){
 //       events.push({eventName:data[i]['Name'], eventTime:formatDate(data[i]['Starttime'])});
 //       message = {
 //          "tokens": [currentToken],
 //          "profile": "conference",
 //          "notification": {
 //            "message": events[0].eventName+" starts in 30 min!"
 //           }
 //         }
 //     }
 //   }
  //  console.log(events);
  //  console.log(message);
 // });

//sort events by most recent first
//after notification is sent, pop most recent event
//  $scope.pushNotification = function() {
  //    console.log("the current token is", currentToken);
	//		console.log(message);
  //    console.log(events);
  //     var timestamp = new Date();
  //     var currentDay = timestamp.getDate();
  //     var currentHours = timestamp.getHours();
  //     var currentMin = timestamp.getMinutes();
  //     var dayTimeResult = events[0].eventTime.split(" ");
  //     var eventDay = parseInt(dayTimeResult[1]);
  //     var eventTime = dayTimeResult[3];
  //     var eventHours = parseInt(eventTime.split(":")[0]);
  //     var eventMin = parseInt(eventTime.split(":")[1]);
  //     console.log(currentDay+" current day and "+eventDay+" event day");
  //     console.log(currentHours+" current hours and "+eventHours+" event hours");
  //     if((currentDay == eventDay) && ((currentHours == eventHours) || ((currentHours + 1) == eventHours))){
  //       console.log("we're posting a push");
  // 			$http.defaults.headers.common['Authorization'] = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJmYTAyYjU0ZS0wNmNmLTRmYmUtYmQ3MS0yMzBjMWQ0YmU1OGEifQ.w0RzP2rQjOFjYruB3jq-SHIdq8JOBGp2pFk_R_qzNGQ';
  // 			$http.defaults.headers.common['Content-Type'] = 'application/json';
  // 			$http.post("https://api.ionic.io/push/notifications", JSON.stringify(message)).success(function() {
  // 				//pushed notification to user;
  // 			})
  // 			.error(function (data, status, header, config) {
  // 			$scope.ServerResponse =  htmlDecode("Data: " + data +
  // 				"\n\n\n\nstatus: " + status +
  // 				"\n\n\n\nheaders: " + header +
  // 				"\n\n\n\nconfig: " + config);
  // 			console.log($scope.ServerResponse);
  // 			});
  //     }
	// 	}
})

.controller('SearchCtrl', function($scope, $http, DatabaseService, SearchService) {
	$scope.searchables = "blank";
	$scope.searchContent = "Search";
	$scope.entries = [];
	$scope.searchUsers = function(){
      console.log($scope.searchables);
      console.log($scope.searchContent);
      if ($scope.searchables == "blank") {
        console.log("No Category Selected - unsearchable");
        $scope.entries.push("Please select a category from the dropdown menu to search!");
      }
      else if ($scope.searchContent== "Search") {
        console.log("Blank Search");
        $scope.entries.push("Please enter something in the search box to search!");
      }
      else if ($scope.searchables == "user"){
        console.log("User search");
        DatabaseService.getUsers().success(function(data){
          for (i=0; i < data.length; i++){
            var dbsmash = data[i]['name'].split(" ").join("").toLowerCase();
            var searchsmash = $scope.searchContent.split(" ").join("").toLowerCase();
            if(dbsmash.includes(searchsmash)){
              $scope.entries.push(data[i]['name']);
            }
          }
          if($scope.entries.length == 0) {
            $scope.entries.push("No user with this name was found.");
          }
          console.log($scope.entries);
          SearchService.setEventArr($scope.entries);
        })
      }
      else if ($scope.searchables == "name"){
      	console.log("Event by name");
        DatabaseService.getAllEvents().success(function(data){
          for (i=0; i < data.length; i++){
            var dbsmash = data[i]['name'].split(" ").join("").toLowerCase();
            var searchsmash = $scope.searchContent.split(" ").join("").toLowerCase();
            if(dbsmash.includes(searchsmash)){
              $scope.entries.push(data[i]['name']);
            }
          }
          if($scope.entries.length == 0) {
            $scope.entries.push("No event with this name was found.");
          }
          console.log($scope.entries);
          SearchService.setEventArr($scope.entries);
        })
      }
      else if ($scope.searchables == "location") {
      	console.log("Event by location");
        DatabaseService.getAllEvents().success(function(data){
          for (i=0; i < data.length; i++){
            var dbsmash = data[i]['place'].split(" ").join("").toLowerCase();
            var searchsmash = $scope.searchContent.split(" ").join("").toLowerCase();
            if(dbsmash.includes(searchsmash)){
              $scope.entries.push(data[i]['name']);
            }
          }
          if($scope.entries.length == 0) {
            $scope.entries.push("No events are being held at this location.");
          }
          SearchService.setEventArr($scope.entries);
          //console.log(SearchService.getEventArr());
        })
      }
      // console.log(SearchService.getEventArr());
      SearchService.setEventArr(removeDuplicates(SearchService.getEventArr()));
      // console.log(SearchService.getEventArr());
      $scope.getEntries = function() {
        console.log("MADE IT HERE");
        return $scope.entries;
      }
  }

  $scope.getValue = function(val){
  	console.log("VALLLLL", val);
  }

  function removeDuplicates(arr){
    if(arr) {
      var temp = [];
      for (var i = 0; i < arr.length; i++) {
        if (temp.indexOf(arr[i]) == -1) {
          temp.push(arr[i]);
        }
      }
      arr = temp;
      temp = [];
      return arr;

    }
  }

  $scope.getDropdownOption = function(){
  	searchopt = $scope.selectOption;
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
  }

})
