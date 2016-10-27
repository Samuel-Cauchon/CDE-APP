angular.module('App.controllers', ['ngCordova', 'App.services'])

.run(function($rootScope) {
  $rootScope.currentLanguage = "english";
})

.controller('menuController', function ($scope, $ionicPlatform, $state, DatabaseService, AuthService, $cordovaDevice, $rootScope) {

})


.controller('LoginCtrl', function ($scope, $ionicPlatform, $state, DatabaseService, AuthService, $cordovaDevice, $rootScope) {

  /*var init = function () {
    try{
      $scope.UUID = $cordovaDevice.getUUID();
      DatabaseService.searchUUID($scope.UUID).success(function(dataUUID){
        if (dataUUID[0] != null){
          AuthService.currentUser = dataUser[0]['user'];
          $state.go('homeMenu.newsfeed');
        }
      })
    }
    catch (err){
      console.log("Error " + err.message);
    }
  }*/

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

   /*ionic.Platform.ready(function(){
      init();
   });*/

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

.controller('ProfileCtrl', function ($scope, DatabaseService, AuthService, $rootScope, Backand) {







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
  function imageChanged(fileInput) {

    //read file content
    var file = fileInput.files[0];
    var reader = new FileReader();

    reader.onload = function(e) {
      upload(file.name, e.currentTarget.result).then(function(res) {
        $scope.imageUrl = res.data.url;
        $scope.filename = file.name;
      }, function(err){
        alert(err.data);
      });
    };

    reader.readAsDataURL(file);
  };

  // register to change event on input file 
  function initUpload() {
    var fileInput = document.getElementById('fileInput');

    fileInput.addEventListener('change', function(e) {
      imageChanged(fileInput);
    });
  }

   // call to Backand action with the file name and file data  
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

  $scope.deleteFile = function(){
    if (!$scope.filename){
      alert('Please choose a file');
      return;
    }
    // By calling the files action with DELETE method in will perform 
    // a deletion of the file from Backand Storage
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
                            date:data[i]['date'],
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
