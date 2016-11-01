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
	  if (dataUser[0] != null){
		//Maybe an unecessary second check of the corectnes of the username...
		if (dataUser[0]['username'] === $scope.dataEntered.username){
			DatabaseService.searchPass($scope.dataEntered.username, $scope.dataEntered.password).success(function(dataPass){
			//Check if the password is correct.
				if (dataPass[0]['password'] === $scope.dataEntered.password){
					AuthService.currentUser = $scope.dataEntered.username;
					AuthService.uid = dataUser[0]['id'];
					DatabaseService.updateUUID($scope.UUID, AuthService.currentUser).success(function(){})
					if ($rootScope.currentLanguage != "french"){
						$state.go('homeMenu.newsfeed');
					}
					else{
						$state.go('homeMenu.newsfeedfr');
					}
				}
				else{
					alert("Could not login! Wrong Input!")
				}
			});
		}
		else{
			alert("Could not login! Wrong Input!")
		}
	}
	else{
		alert("Could not login! Wrong Input!")
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
		if ($rootScope.currentLanguage != "french"){
			$state.go('welcome');
		}
		else{
			$state.go('welcomefr');
		}
	};
})

.controller('OptionCtrl', function ($scope, $ionicPlatform, $state, DatabaseService, AuthService, $rootScope) {

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
	}
})

.controller('SpeakersPageCtrl', function($scope, $ionicPlatform, $state, DatabaseService, AuthService, $rootScope) {

	DatabaseService.getAllSpeakersInfo().success(function(dataAllInfo){
		$scope.speakersInfo = dataAllInfo;
	})

	$scope.setSpeakerSelected = function(speaker){
		AuthService.userSelected = speaker;
	}

})

.controller('RegisterCtrl', function($scope, $ionicPlatform, $state, DatabaseService, AuthService, $rootScope){

	$scope.dataEnteredRegister = {
		username : "",
		password : "",
		passwordConfirmation : "",
	};



	function checkForm()
	{
		if($scope.dataEnteredRegister.username == "") {
			alert("Error: Username cannot be blank!");
			return false;
		}
		re = /^\w+$/;
		if(!re.test($scope.dataEnteredRegister.username)) {
			alert("Error: Username must contain only letters, numbers and underscores!");
			return false;
		}

		if($scope.dataEnteredRegister.password != "" && $scope.dataEnteredRegister.password == $scope.dataEnteredRegister.passwordConfirmation) {
			if($scope.dataEnteredRegister.password < 6) {
				alert("Error: Password must contain at least six characters!");
				return false;
			}
			if($scope.dataEnteredRegister.password == $scope.dataEnteredRegister.username) {
				alert("Error: Password must be different from Username!");
				return false;
			}
			re = /[0-9]/;
			if(!re.test($scope.dataEnteredRegister.password)) {
				alert("Error: password must contain at least one number (0-9)!");
				return false;
			}
			re = /[a-z]/;
			if(!re.test($scope.dataEnteredRegister.password)) {
				alert("Error: password must contain at least one lowercase letter (a-z)!");
				return false;
			}
			re = /[A-Z]/;
			if(!re.test($scope.dataEnteredRegister.password)) {
				alert("Error: password must contain at least one uppercase letter (A-Z)!");
				return false;
			}
		} else {
			alert("Error: Please check that you've entered and confirmed your password!");
			return false;
		}

		return true;
	};

	$scope.Register = function () {
		DatabaseService.searchUser($scope.dataEnteredRegister.username).success(function(dataUser){
		//Check if the username exist...
		if (dataUser[0] == null && checkForm()){
			DatabaseService.getMaxId().success(function(maxId){
				DatabaseService.createNewUser($scope.dataEnteredRegister, maxId[0]['Max(id)']+1).success(function(data){
					AuthService.currentUser = $scope.dataEnteredRegister.username;
					if ($rootScope.currentLanguage != "french"){
						$state.go('homeMenu.newsfeed');
					}
					else{
						$state.go('homeMenu.newsfeedfr');

					}
				})
			})
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

.controller('ProfileCtrl', function ($scope, DatabaseService, AuthService, $rootScope, Backand, $http, MainEvents) {

	// Create a server side action in backand
	// Go to any object's actions tab
	// and click on the Backand Storage icon.
	// Backand consts:
	var baseUrl = '/1/objects/';
	var baseActionUrl = baseUrl + 'action/'
	var objectName = 'user';
	var filesActionName = 'img';

	// Display the image after upload
	$scope.imageUrl = null;
	// Store the file name after upload to be used for delete
	$scope.filename = null;


    // input file onchange callback
    $scope.imageChangedFr = function (){
    	var imageExist = false;
    	var file = $scope.fileInput.files[0];
    	var reader = new FileReader();

    	DatabaseService.searchImg(file.name).success(function(data){
    		if (data[0] == undefined){
    			imageExist = true;
    		}
    		else {
    			imageExist = false;
    		}
			//read file content
			if (imageExist == true){
				reader.onload = function(e) {
					upload(file.name, e.currentTarget.result).then(function(res) {
						$scope.imageUrl = res.data.url;
						$scope.filename = file.name;
						DatabaseService.updateImg(AuthService.currentUser, file.name).success(function(data){
						})
						$scope.profile.imgName = file.name;
					}, function(err){
						alert(err.data);
					});
				}

				reader.readAsDataURL(file);
			}
			else {
				alert("Change the name of the image! // Veuillez changer le nom de l'image!");
			}
		})
    };

    $scope.imageChangedFr = function (){
    	var imageExist = false;
    	var file = $scope.fileInputFr.files[0];
    	var reader = new FileReader();

    	DatabaseService.searchImg(file.name).success(function(data){
    		if (data[0] == undefined){
    			imageExist = true;
    		}
    		else {
    			imageExist = false;
    		}
			//read file content
			if (imageExist == true){
				reader.onload = function(e) {
					upload(file.name, e.currentTarget.result).then(function(res) {
						$scope.imageUrl = res.data.url;
						$scope.filename = file.name;
						DatabaseService.updateImg(AuthService.currentUser, file.name).success(function(data){
						})
						$scope.profile.imgName = file.name;
					}, function(err){
						alert(err.data);
					});
				}

				reader.readAsDataURL(file);
			}
			else {
				alert("Change the name of the image! // Veuillez changer le nom de l'image!");
			}
		})
    };

  // register to change event on input file
  function initUpload() {
  	$scope.fileInput = document.getElementById('fileInput');



  	$scope.fileInputFr = document.getElementById('fileInputFr');
  }

  $scope.clearAll = function(){

  	$scope.updatedProfile.newDescription = "";
  }

   // call to Backand action with the file name and file data
   function upload(filename, filedata) {
	// By calling the files action with POST method in will perform
	// an upload of the file into Backand Storage

	//DatabaseService.updateImg(AuthService.currentUser, filename).success(function(){
	//})

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

$scope.deleteFile = function(){
	if (!$scope.filename){
		alert('Please choose a file');
		return;
	}
	// By calling the files action with DELETE method in will perform
	// a deletion of the file from Backand Storage
	DatabaseService.updateImg(AuthService.currentUser, "").success(function(data){
	})

	$http({
		method: 'DELETE',
		url : Backand.getApiUrl() + baseActionUrl +  objectName,
		params:{
			"name": filesActionName
		},
		headers: {
			'Content-Type': 'application/json'
		},
	  // you need to provide the file name
	  data: {
	  	"filename": $scope.filename
	  }
	}).then(function(){
	  // Reset the form
	  $scope.imageUrl = null;
	  document.getElementById('fileInput').value = "";
	});
}

$scope.initCtrl = function() {
	initUpload();
}





$scope.editPhone = null;
$scope.editDescription = null;
$scope.editProfession = null;
$scope.editName = null;


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

  $scope.userMap = [];
  var eventList = {};
  $scope.isUser = 1;
  DatabaseService.getAllEvents().success(function(data) {
    var eventArr = data;
    for (var i = 0; i < eventArr.length; i++) {
      eventList[eventArr[i].id] = {
        name: eventArr[i].name
      };
    }

    var currentUser = "";
    if($scope.isUser == 1) {
      currentUser = AuthService.uid;
    } else {
      DatabaseService.getID(AuthService.userSelected).success(function(data){
        currentUser = data[0]['id'];
      })
    }

    MainEvents.getPeopleAttending().success(function(data){
      var mapOfEvents = data.data;
      mapOfEvents.forEach(function(item) {
        if(currentUser == item.user) {
          if ($scope.userMap.indexOf(item) == -1) {
            $scope.userMap.push(eventList[item.event].name);
          }
        }
      })
      $scope.userMap = removeDuplicates($scope.userMap);
      console.log($scope.userMap);
      $scope.userEvents = function(){
        return $scope.userMap;
      }
    })
  });

  function removeDuplicates(arr){
    var temp = [];
    for (var i=0; i < arr.length; i++){
      if(temp.indexOf(arr[i]) == -1){
        temp.push(arr[i]);
      }
    }
    arr = temp;
    temp = [];
    return arr;*/

  }
})

.controller('UsersCtrl', function ($scope, DatabaseService, AuthService, $rootScope) {

	$scope.setUserSelected = function(user){
		AuthService.userSelected = user;
	}

})


.controller('UserProfileCtrl', function ($scope, DatabaseService, AuthService, $rootScope) {


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

})

// .controller('MapCtrl', function($scope, $state, $cordovaGeolocation, $ionicPlatform) {
//
//
// 	var options = {timeout: 10000, enableHighAccuracy: true};
//
// 	var script = window.document.createElement('script');
// 	script.src = 'http://maps.googleapis.com/maps/api/js?v=3.exp&sensor=true&callback=InitMapCb';
// 	window.document.head.appendChild(script);
//
// 	$cordovaGeolocation.getCurrentPosition(options).then(function(position){
//
//
// 		var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
//
// 		var mapOptions = {
// 			center: latLng,
// 			zoom: 15,
// 			mapTypeId: google.maps.MapTypeId.ROADMAP
// 		};
//
// 		$scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
//
// 	}, function(error){
// 		console.log("Could not get location");
// 	});
//
// })


.controller('NewsfeedCtrl', function($scope, $http, DatabaseService, NewsfeedService, Backand, $timeout, PersonService, AuthService, TwitterREST) {



	$scope.entry = [];
	var uid = AuthService.uid;
	$scope.userName = "";
	var parameters = {filter: [{"fieldName":"id","operator":"equals","value":uid}]};
	DatabaseService.getData('/1/objects/user/'+uid).success(function(data){
		$scope.userName = data['name'];

	});

	$scope.$on('$ionicView.enter', function () {
		retrieveTwitterFeed();
		retrieveInfo();
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
	$scope.searched = [];
	$scope.searchContent = "Search";
	$scope.entries = [];
	$scope.searchUsers = function(){
      //$scope.searchContent= document.getElementById('searchContent').value;
      console.log($scope.searchables);
      console.log($scope.searchContent);
      if ($scope.searchables == "blank") {
        console.log("No Category Selected - unsearchable");
        $scope.entries[0] = "Please select a category from the dropdown menu to search!";
      }
      else if ($scope.searchContent== "Search") {
        console.log("Blank Search");
      }
      else if ($scope.searchables == "user"){
        console.log("User search");
        DatabaseService.searchUser($scope.searchContent).success(function(data){
          for (i=0; i < data.length; i++){
            $scope.entries[i] = {name:data[i]['name'],
              id: data[i]['id']};
          }
        })
      }
      else if ($scope.searchables == "user"){
      	console.log("User search");
      }
      else if ($scope.searchables == "name"){
      	console.log("Event by name");
      }
      else if ($scope.searchables == "location") {
      	console.log("Event by location");
      }
  }

    // var eventArr = data;
    // for (var i = 0; i < eventArr.length; i++) {
    //   eventList[eventArr[i].id] = {
    //     name: eventArr[i].name
    //   };
    // }
    //
    // var currentUser = "";
    // if($scope.isUser == 1) {
    //   currentUser = AuthService.uid;
    // } else {
    //   DatabaseService.getID(AuthService.userSelected).success(function(data){
    //     currentUser = data[0]['id'];
    //   })
    // }
    //
    // MainEvents.getPeopleAttending().success(function(data){
    //   var mapOfEvents = data.data;
    //   mapOfEvents.forEach(function(item) {
    //     if(currentUser == item.user) {
    //       if ($scope.userMap.indexOf(item) == -1) {
    //         $scope.userMap.push(eventList[item.event].name);
    //       }
    //     }
    //   })
    //   $scope.userMap = removeDuplicates($scope.userMap);
    //   console.log($scope.userMap);
    //   $scope.userEvents = function(){
    //     return $scope.userMap;
    //   }
    // })
    $scope.entries = removeDuplicates($scope.entries);
    $scope.returnEvents = function(){
      return $scope.entries;
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

    $scope.getValue = function(val){
      console.log("VALLLLL", val);
    }
  $scope.getValue = function(val){
  	console.log("VALLLLL", val);
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
