angular.module('App.services', ['backand'])

  .service('DatabaseService', function($http, Backand){
    var service = this,
      baseUrl = '/1/objects/',
      objectName = 'items/';
    return{

			//get the name of all users
			getUsers: function() {
				return $http ({
					method: 'GET',
					url: Backand.getApiUrl() + '/1/query/data/GetAllUsers',
					params: {
						parameters: {}
					}
				});
			},

      list: function(){
        return $http ({
          method: 'GET',
          url: Backand.getApiUrl() + '/1/objects/user',
          params: {
            pageSize: 20,
            pageNumber: 1,
            filter: null,
            sort: ''
          }
        });
      },
      // Example of how to enter parameters for how to retrieve data from db
      // listRaluca: function(){
      // 	return $http ({
      // 	  method: 'GET',
      // 	  url: Backand.getApiUrl() + '/1/objects/user',
      // 	  params: {
      // 	    pageSize: 20,
      // 	    pageNumber: 1,
      // 	    filter: [{"fieldName":"name","operator":"equals","value":"Raluca Niti"}],
      // 	    sort: ''
      // 	  }
      // 	});
      // },

      searchUUID: function(UUID){
        return $http ({
          method: 'GET',
          url: Backand.getApiUrl() + '/1/query/data/searchUUID',
          params: {
            parameters: {
              UUID: UUID
            }
          }
        });
      },

      addError: function(errorText){
        return $http ({
          method: 'GET',
          url: Backand.getApiUrl() + '/1/query/data/addError',
          params: {
            parameters: {
              errorText: errorText
            }
          }
        });
      },

      searchUser: function(usernameEntered){
        return $http ({
          method: 'GET',
          url: Backand.getApiUrl() + '/1/query/data/searchUser',
          params: {
            parameters: {
              username: usernameEntered
            }
          }
        });
      },

      searchImg: function(imgEntered){
        return $http ({
          method: 'GET',
          url: Backand.getApiUrl() + '/1/query/data/searchImg',
          params: {
            parameters: {
              imageName: imgEntered
            }
          }
        });
      },

      updateImg: function(username, imgEntered){
        return $http ({
          method: 'GET',
          url: Backand.getApiUrl() + '/1/query/data/updateImg',
          params: {
            parameters: {
              name: username,
              photo: imgEntered
            }
          }
        });
      },

      searchPass: function(usernameEntered, passwordEntered){
        return $http ({
          method: 'GET',
          url: Backand.getApiUrl() + '/1/query/data/searchPass',
          params: {
            parameters: {
              user: usernameEntered,
              password : passwordEntered
            }
          }
        });
      },

      getData: function(url, parameters){
        return $http ({
          method: 'GET',
          url: Backand.getApiUrl() + url,
          params: parameters
        });
      },

      getID: function (username){
        return $http ({
          method: 'GET',
          url: Backand.getApiUrl() + '/1/query/data/getID',
          params: {
            parameters: {
              username: username
            }
          }
        });
      },

      getallUsers: function(){
        return $http ({
          method: 'GET',
          url: Backand.getApiUrl() + '/1/query/data/getAllUsername',
        });

      },

      updateUUID: function(UUID, name){
        return $http ({
          method: 'GET',
          url: Backand.getApiUrl() + '/1/query/data/updateUUID',
          params: {
            parameters: {
              UUID: UUID,
              name: name
            }
          }
        });
      },

      updateName: function(username, newName){
        return $http ({
          method: 'GET',
          url: Backand.getApiUrl() + '/1/query/data/updateName',
          params: {
            parameters: {
              username: username,
              newName: newName
            }
          }
        });
      },

      GetPhoneNumber: function(user){
        return $http ({
          method: 'GET',
          url: Backand.getApiUrl() + '/1/query/data/GetPhoneNumber',
          params: {
            parameters: {
              username: user
            }
          }
        });
      },

      GetProfileImg: function(user){
        return $http ({
          method: 'GET',
          url: Backand.getApiUrl() + '/1/query/data/GetProfileImg',
          params: {
            parameters: {
              username: user
            }
          }
        });
      },

      GetProfession: function(user){
        return $http ({
          method: 'GET',
          url: Backand.getApiUrl() + '/1/query/data/GetProfession',
          params: {
            parameters: {
              username: user
            }
          }
        });
      },

      getName: function(user){
        return $http ({
          method: 'GET',
          url: Backand.getApiUrl() + '/1/query/data/getName',
          params: {
            parameters: {
              username: user
            }
          }
        });
      },

      GetBirthday: function(user){
        return $http ({
          method: 'GET',
          url: Backand.getApiUrl() + '/1/query/data/GetBirthday',
          params: {
            parameters: {
              username: user
            }
          }
        });
      },

      GetDescription: function(user){
        return $http ({
          method: 'GET',
          url: Backand.getApiUrl() + '/1/query/data/GetDescription',
          params: {
            parameters: {
              username: user
            }
          }
        });
      },

      // Example of how to enter parameters for updating data entry
      // updateData: function(){
      // 	return $http ({
      // 	  method: 'PUT',
      // 	  url: Backand.getApiUrl() + '/1/objects/user/1',
      // 		data: {"description": "Rule the world"},
      // 	  params: {
      // 	    // returnObject: true,
      // 	  }
      // 	});
      // },

      updateData: function(url, data, parameters){
        return $http ({
          method: 'PUT',
          url: Backand.getApiUrl() + url,
          data: data,
          params: parameters
        });
      },

      updatePhonenumber: function(newPhoneNumber, user){
        return $http ({
          method: 'GET',
          url: Backand.getApiUrl() + '/1/query/data/updatePhonenumber',
          params: {
            parameters: {
              newPhonenumber: newPhoneNumber,
              user: user
            }
          }
        });
      },

      updateProfession: function(newProfession, user){
        return $http ({
          method: 'GET',
          url: Backand.getApiUrl() + '/1/query/data/updateProfession',
          params: {
            parameters: {
              newProfession: newProfession,
              user: user
            }
          }
        });
      },

      updateBirthdate: function(newBirthdate, user){
        return $http ({
          method: 'GET',
          url: Backand.getApiUrl() + '/1/query/data/updateBirthdate',
          params: {
            parameters: {
              newBirthdate: newBirthdate,
              user: user
            }
          }
        });
      },


      updateDescription: function(user, newDescription){
        return $http ({
          method: 'GET',
          url: Backand.getApiUrl() + '/1/query/data/UpdateDescription',
          params: {
            parameters: {
              user: user,
              description: newDescription
            }
          }
        });
      },


      // Exaple of format in which to enter parameters for new data entry
      // newUser: function(){
      // 	return $http ({
      // 		method: 'POST',
      // 		url: Backand.getApiUrl() + '/1/objects/user/1',
      // 		data: {
      // 			"name": "Liana Yang",
      // 			"description": "Girl who codes",
      // 			"photo": "TO BE IMPLEMENTED",
      // 			"twitterLink": "TO BE IMPLEMENTED",
      // 			"linkedInLink": "TO BE IMPLEMENTED",
      // 			"facebookLink": "TO BE IMPLEMENTED"}
      // 	});
      // }

      newEntry: function(url, data){
        return $http ({
          method: 'POST',
          url: Backand.getApiUrl() + url,
          data: data
        });
      },

      createNewUser: function(data, id){
        return $http ({
          method: 'GET',
          url: Backand.getApiUrl() + '/1/query/data/createNewUser',
          params: {
            parameters: {
              id: id,
              name: data.name,
              username: data.username,
              password: data.password
            }
          }
        });
      },

      getMaxId: function(){
        return $http ({
          method: 'GET',
          url: Backand.getApiUrl() + '/1/query/data/getMaxId',
          params: {
            parameters: {}
          }
        });
      },

      getAllEvents: function() {
        return $http ({
          method: 'GET',
          url: Backand.getApiUrl() + '/1/query/data/getEveryEvent',
          params: {
            parameters: {}
          }
        });
      },

      getName: function(username){
       	return $http ({
          method: 'GET',
          url: Backand.getApiUrl() + '/1/query/data/getName',
          params: {
            parameters: {
              username: username
            }
          }
        });
      },

      getAllSpeakersInfo: function() {
        return $http ({
          method: 'GET',
          url: Backand.getApiUrl() + '/1/query/data/getAllSpeakersInfo',
          params: {
           	parameters: {}
          }
        });
      },

      getAllNamePhotos: function(){
        return $http ({
          method: 'GET',
          url: Backand.getApiUrl() + '/1/query/data/getAllNamePhotos',
          params: {
          	parameters: {}
          }
        });
      },

      GetProfession: function(user){
        return $http ({
          method: 'GET',
          url: Backand.getApiUrl() + '/1/query/data/GetProfession',
          params: {
          parameters: {
            username: user
            }
          }
        });
      },

      getSpeakerEvents: function(user){
        return $http ({
          method: 'GET',
          url: Backand.getApiUrl() + '/1/query/data/getSpeakerEvents',
          params: {
            parameters: {
              username: user
            }
          }
        });
      },

      getSpeakerEventsFr: function(user){
        return $http ({
          method: 'GET',
          url: Backand.getApiUrl() + '/1/query/data/getSpeakerEventsFr',
          params: {
            parameters: {
              username: user
            }
          }
        });
      }
      /*uploadImage: function (filename, filedata) {

       var baseUrl = '/1/objects/';
       var baseActionUrl = baseUrl + 'action/'
       var objectName = 'user';
       var filesActionName = 'img';

       // By calling the files action with POST method in will perform
       // an upload of the file into Backand Storage
       $http({
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
       },

       deleteImage: function(filename){

       var baseUrl = '/1/objects/';
       var baseActionUrl = baseUrl + 'action/'
       var objectName = 'user';
       var filesActionName = 'img';
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
       "filename": filename
       }
       }).then(function(){
       // Reset the form
       $scope.imageUrl = null;
       document.getElementById('fileInput').value = "";
       });
       }*/

    }

  })

  .factory( 'AuthService', function() {
    var currentUser;
    var uid;
    var userSelected;
    var speakerName;
    var isSpeaker;
    return {
    };
  })

  .factory('NewsfeedService', function(DatabaseService){
    var name = "";
    return {
      getUserName: function(uid){
        var params = {filter: [{"fieldName":"id","operator":"equals","value":uid}]};
        return DatabaseService.getData('/1/objects/user', params);
      }
    }
  })

  .factory('PersonService', function($http){
    var BASE_URL = "http://api.randomuser.me/";
    var items = [];
    return {
      GetFeed: function(){
        return $http.get(BASE_URL+'?results=5').then(function(response){
          items = response.data.results;
          return items;
        });
      },
      GetNewUser: function(){
        return $http.get(BASE_URL).then(function(response){
          items = response.data.results;
          return items;
        });
      }
    }
  })

  .service('MainEvents', function(DatabaseService){
    var eventId;
    var firstDayEvents = [];
    var secondDayEvents = [];
    var thirdDayEvents = [];
    var userId;
    var allUsers;
    var mapOfIdToNames;
    var mapOfEventsUsers;

    return {
      getEventsFirstDay: function () {
        return DatabaseService.getData('/1/query/data/getEventsDay1?deep=true', {});
      },
      getEventsSecondDay: function () {
        return DatabaseService.getData('/1/query/data/getEventsDay2', {});
      },
      getEventsFinalDay: function () {
        return DatabaseService.getData('/1/query/data/getEventsDay3', {});
      },
      getUserQuery: function () {
        return DatabaseService.getData('/1/query/data/GetAllUsers', {});
      },
      getUserAttending: function () {
        console.log(DatabaseService.getData('1/objects/event/', {}));
        console.log("hi");
        return DatabaseService.getData('1/objects/user', {});
      },
      setEventId: function (id) {
        eventId = id;
      },
      getEventId: function () {
        return eventId;
      },
      getPeopleAttendingEvent: function () {
        if (eventId) {
          console.log(DatabaseService.getData('/1/objects/event/' + eventId + '?deep=true', {}));
          return DatabaseService.getData('/1/objects/event/' + eventId + '?deep=true', {});
        }
      },
      getBLAH: function () {
        console.log(DatabaseService.getData('/1/objects/event?deep=true', {}));
        return DatabaseService.getData('/1/objects/event?deep=true', {});
      },
      getPeopleAttending: function () {
        return DatabaseService.getData('/1/objects/relusersevents', {});
      },
      updatePeopleAttending: function (userId, eventId) {
        console.log("user id", userId);
        console.log("service eventId", eventId);
        return DatabaseService.newEntry('/1/objects/relusersevents', {user: userId, event: eventId});
      },

      setEventArrayWithFixedTiming: function (dayArr, day) {
        if (day == 'one') {
          firstDayEvents = dayArr;
        }

        if (day == 'second') {
          secondDayEvents = dayArr;
        }

        if (day == 'last') {
          thirdDayEvents = dayArr;
        }
      },

      getEventArrayWithFixedTiming: function (day) {
        if (day == 'one') {
          return firstDayEvents;
        }

        if (day == 'second') {
          return secondDayEvents;
        }

        if (day == 'third') {
          return thirdDayEvents
        }
      },

      setUserId: function (id) {
        userId = id;
      },

      getUserId: function () {
        return userId;
      },

      setPeopleAttendingEachEvent: function(peopleAttendingArr){
        mapOfIdToNames = peopleAttendingArr;
      },

      getPeopleAttendingEachEvent: function(){
        if(mapOfIdToNames){
          return mapOfIdToNames;
        }
        else{
          return {};
        }
      },

      setMapOfEventsToUsers: function(map){
        mapOfEventsUsers = map;
      },

      getMapOfEventsToUsers: function(){
        return mapOfEventsUsers;
      }

    }
  })

  .service('EventService', function(){
    var eventId;
    return {
      setEventId: function(eId){
        eventId = eId;
      },
      getEventId: function(){
        return eventId;
      }
    }
  })

  .service('SearchService', function() {
    var eventArr;
    return {
      setEventArr: function(arr){
        eventArr = arr;
        console.log(eventArr);
      },
      getEventArr: function(){
        return eventArr;
      }
    }
  });
