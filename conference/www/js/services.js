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
				  url: Backand.getApiUrl() + '/1/query/data/getAllUsers',
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

			getData: function(url, parameters){
				return $http ({
				  method: 'GET',
				  url: Backand.getApiUrl() + url,
				  params: parameters
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
			}

		}

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

.factory('MainEvents', function($http){
  return{
    getEventsFirstDay:function(){
      console.log(DatabaseService.getData('/1/objects/event',{}));
      DatabaseService.getData('/1/objects/event',{});
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

