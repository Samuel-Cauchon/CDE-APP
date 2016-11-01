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

			searchImg: function(imgName){
				return $http ({
					method: 'GET',
					url: Backand.getApiUrl() + '/1/query/data/searchImg',
					params: {
						parameters: {
							imageName: imgName
						}
					}
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

			getallUsers: function(){
				return $http ({
					method: 'GET',
					url: Backand.getApiUrl() + '/1/query/data/getAllUsername',
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

			getallPhotos: function(){
				return $http ({
					method: 'GET',
					url: Backand.getApiUrl() + '/1/query/data/getAllPhotos',
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

			updateImg: function(name, photo){
				return $http ({
					method: 'GET',
					url: Backand.getApiUrl() + '/1/query/data/updateImg',
					params: {
						parameters: {
							name: name,
							photo: photo
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

	return{
		getEventsFirstDay:function(){
			return DatabaseService.getData('/1/query/data/getEventsDay1?deep=true', {});
		},
		getEventsSecondDay: function(){
			return DatabaseService.getData('/1/query/data/getEventsDay2',{});
		},
		getEventsFinalDay: function(){
			return DatabaseService.getData('/1/query/data/getEventsDay3',{});
		},
		getUserQuery:function(){
			return DatabaseService.getData('/1/query/data/GetAllUsers',{});
		},
		getUserAttending: function(){
			console.log(DatabaseService.getData('1/objects/event/', {}));
			console.log("hi");
			return DatabaseService.getData('1/objects/user', {});
		},
		setEventId: function(id){
			eventId = id;
		},
		getEventId: function(){
			return eventId;
		},
		getPeopleAttendingEvent: function(){
			if(eventId) {
				console.log(DatabaseService.getData('/1/objects/event/' + eventId + '?deep=true', {}));
				return DatabaseService.getData('/1/objects/event/' + eventId + '?deep=true', {});
			}
		},
		getBLAH: function(){
			console.log(DatabaseService.getData('/1/objects/event?deep=true',{}));
			return DatabaseService.getData('/1/objects/event?deep=true',{});
		},
		getPeopleAttending: function(){
			return DatabaseService.getData('/1/objects/relusersevents', {});
		},
		updatePeopleAttending: function(){
			return DatabaseService.newEntry('/1/objects/relusersevents', {user:16, event:eventId} )
		},

		setEventArrayWithFixedTiming: function(dayArr, day){
			if (day == 'one'){
				console.log("IM HEREEEEE")
				firstDayEvents = dayArr;
			}

			if (day == 'second'){
				secondDayEvents = dayArr;
			}

			if (day == 'last'){
				thirdDayEvents = dayArr;
			}
		},

		getEventArrayWithFixedTiming: function(day){
			if (day == 'one'){
				if(firstDayEvents) {
					return firstDayEvents;
				}
				else{
					return [];
				}
			}

			if(day == 'second'){
				return secondDayEvents;
			}

			if(day == 'third'){
				return thirdDayEvents
			}
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

.factory('Base64', function(){
	var self = this;
	self.encode = function (input) {
		// Converts each character in the input to its Unicode number, then writes
		// out the Unicode numbers in binary, one after another, into a string.
		// This string is then split up at every 6th character, these substrings
		// are then converted back into binary integers and are used to subscript
		// the "swaps" array.
		// Since this would create HUGE strings of 1s and 0s, the distinct steps
		// above are actually interleaved in the code below (ie. the long binary
		// string, called "input_binary", gets processed while it is still being
		// created, so that it never gets too big (in fact, it stays under 13
		// characters long no matter what).

		// The indices of this array provide the map from numbers to base 64

		var swaps = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","+","/"];
		var input_binary = "";      // The input string, converted to Unicode numbers and written out in binary
		var output = "";        // The base 64 output
		var temp_binary;        // Used to ensure the binary numbers have 8 bits
		var index;      // Loop variable, for looping through input
		for (index=0; index < input.length; index++){
			// Turn the next character of input into astring of 8-bit binary
			temp_binary = input.charCodeAt(index).toString(2);
			while (temp_binary.length < 8){
				temp_binary = "0"+temp_binary;
			}
			// Stick this string on the end of the previous 8-bit binary strings to
			// get one big concatenated binary representation
			input_binary = input_binary + temp_binary;
			// Remove all 6-bit sequences from the start of the concatenated binary
			// string, convert them to a base 64 character and append to output.
			// Doing this here prevents input_binary from getting massive
			while (input_binary.length >= 6){
				output = output + swaps[parseInt(input_binary.substring(0,6),2)];
				input_binary = input_binary.substring(6);
			}
		}
		// Handle any necessary padding
		if (input_binary.length == 4){
			temp_binary = input_binary + "00";
			output = output + swaps[parseInt(temp_binary,2)];
			output = output + "=";
		}
		if (input_binary.length == 2){
			temp_binary = input_binary + "0000";
			output = output + swaps[parseInt(temp_binary,2)];
			output = output + "==";
		}
		// Output now contains the input in base 64
		return output;
	};

	self.decode = function (input) {
		// Takes a base 64 encoded string "input", strips any "=" or "==" padding
		// off it and converts its base 64 numerals into regular integers (using a
		// string as a lookup table). These are then written out as 6-bit binary
		// numbers and concatenated together. The result is split into 8-bit
		// sequences and these are converted to string characters, which are
		// concatenated and output.
		input = input.replace("=","");      // Padding characters are redundant
		// The index/character relationship in the following string acts as a
		// lookup table to convert from base 64 numerals to Javascript integers
		var swaps = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		var output_binary = "";
		var output = "";
		var temp_bin = "";
		var index;
		for (index=0; index < input.length; index++) {
			temp_bin = swaps.indexOf(input.charAt(index)).toString(2);
			while (temp_bin.length < 6) {
				// Add significant zeroes
				temp_bin = "0"+temp_bin;
			}
			while (temp_bin.length > 6) {
				// Remove significant bits
				temp_bin = temp_bin.substring(1);
			}
			output_binary = output_binary + temp_bin;
			while (output_binary.length >= 8) {
				output = output + String.fromCharCode(parseInt(output_binary.substring(0,8),2));
				output_binary = output_binary.substring(8);
			}
		}
		return output;
	};

	return self;
})

.factory('TwitterREST', function($http, $q, Base64){

	var self = this;
	var authorization = null;
	var consumerKey = "8yU73UJ95NWn0Zg3zokdLchUx";
	var consumerSecret = "m6S0lt5Biazsz0S9X8YVwrEqSdP0Riemo6L2xzKHIpcCiH6REg";
	var twitterTokenURL = "https://api.twitter.com/oauth2/token";
	var twitterStreamURL = "https://api.twitter.com/1.1/search/tweets.json?q="; //url query
	var qValue = "bufnitaNocturna";
	var numberOfTweets = "&count=20";

	self.sync = function () {
		var def = $q.defer();
		//get authorization token
		self.getAuthorization().then(function(){
			var req1 = {
				method: 'GET',
				url: twitterStreamURL+qValue+numberOfTweets,
				headers: {
					'Authorization': 'Bearer '+authorization.access_token,
					'Content-Type': 'application/json'
				},
				cache:true
			};
			// make request with the token
			$http(req1).
			success(function(data, status, headers, config) {
				def.resolve(data);
			}).
			error(function(data, status, headers, config) {

				def.resolve(false);
			});
		});
		return def.promise;
	};

	self.getAuthorization = function () {
		var def = $q.defer();
		var base64Encoded;

		var combined = encodeURIComponent(consumerKey) + ":" + encodeURIComponent(consumerSecret);

		base64Encoded = Base64.encode(combined);

	  // Get the token
	  $http.post(twitterTokenURL,"grant_type=client_credentials", {headers: {'Authorization': 'Basic ' + base64Encoded, 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'}}).
	  success(function(data, status, headers, config) {
	  	authorization = data;
	  	if (data && data.token_type && data.token_type === "bearer") {
	  		def.resolve(true);
	  	}
	  }).
	  error(function(data, status, headers, config) {
	  	def.resolve(false);
	  });
	  return def.promise;
	};

	return self;
});
