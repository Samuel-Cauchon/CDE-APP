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

			listRaluca: function(){
				return $http ({
				  method: 'GET',
				  url: Backand.getApiUrl() + '/1/objects/user',
				  params: {
				    pageSize: 20,
				    pageNumber: 1,
				    filter: [{"fieldName":"name","operator":"equals","value":"Raluca Niti"}],
				    sort: ''
				  }
				});
			},

			updateSam: function(){
				return $http ({
				  method: 'PUT',
				  url: Backand.getApiUrl() + '/1/objects/user/1',
					data: {"description": "Rule the world"},
				  params: {
				    // returnObject: true,
				  }
				});
			}
		}

  });
