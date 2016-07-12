var INSTA_API_BASE_URL = "https://api.instagram.com/v1";
var app = angular.module('Instamood',[]);

app.controller('MainCtrl', function($scope, $http) {
  // get the access token if it exists
  $scope.hasToken = true;
  var token = window.location.hash;
  console.log(token);
  if (!token) {
  	$scope.hasToken = false;
  }
  token = token.split("=")[1];

  $scope.getInstaPics = function() {
  	var path = "/users/self/media/recent";
  	var mediaUrl = INSTA_API_BASE_URL + path;
  	$http({
  		method: "JSONP",
  		url: mediaUrl,
  		params: {
  			callback: "JSON_CALLBACK",
  			access_token: "489090119.8ae6b7d.093ea5ad6121437b937928f5d89eb87e"
  		}
  	}).then(function(response) {
  		$scope.picArray = response.data.data;
  		console.log(response);
  		$scope.egoCount = 0;
  		$scope.popularity = 0;
  		$scope.brevity = 0;
  		$scope.visibilityThirst = 0;
  		var Monday = 0;
  		var Tuesday = 0;
  		var Wednesday = 0;
  		var Thursday = 0;
  		var Friday = 0;
  		var Saturday = 0;
  		var Sunday = 0;
  		for (var i=0; i<$scope.picArray.length; i++){
  			var pic = $scope.picArray[i];
  			if (pic.user_has_liked === true){
  				$scope.egoCount = $scope.egoCount+1;
  			}
  			if (pic.likes.count >= 0){
  				$scope.popularity = $scope.popularity + pic.likes.count/$scope.picArray.length;
  			}
  			if (pic.caption.text.length >= 0){
  				$scope.brevity = $scope.brevity + pic.caption.text.length/$scope.picArray.length;
  			}
  			if (pic.tags.length >= 0){
  				$scope.visibilityThirst = $scope.visibilityThirst + pic.tags.length/$scope.picArray.length;
  			}
  			var timestamp = $scope.picArray[i].created_time;
          	var a = new Date(timestamp*1000);
          	var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
          	var dayOfWeek = days[a.getDay()];
          	if (dayOfWeek==="Sunday"){
          			Sunday = Sunday +1;
      			}
  			if (dayOfWeek==="Monday"){
          			Monday = Monday +1;
      			}
  			if (dayOfWeek==="Tuesday"){
          			Tuesday = Tuesday +1;
      			}
  			if (dayOfWeek==="Wednesday"){
          			Wednesday = Wednesday +1;
      			}
      		if (dayOfWeek==="Thursday"){
          			Thursday = Thursday +1;
      			}
      		if (dayOfWeek==="Friday"){
          			Friday = Friday +1;
      			}
  			if (dayOfWeek==="Saturday"){
          			Saturday = Saturday +1;
      			}
  			var weekArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  			$scope.activeDay = weekArray[0]
  			for (var j=0; j<weekArray.length; j++){
  					if (weekArray[j]>$scope.activeDay){
  						$scope.activeDay = days[j];
					}
  				} 			
          	}
  		for (var i=0; i<$scope.picArray.length; i++){
  			analyzeSentiments(i);
  		}

  	})	
	var analyzeSentiments = function(imgIdx){
	  	$http({
	  		method:"GET",
	  		url: "https://twinword-sentiment-analysis.p.mashape.com/analyze/",
	  		params:{
	  			text: $scope.picArray[imgIdx].caption.text,
	  		},
	  		headers: {
	  			"X-Mashape-Key": "Th3XBxonXUmshah63CPixRUk2rDlp1eNuLEjsnYQ1UnNvMtgYa"
	  		},
	  	}).then(function(response) {
	  		$scope.picArray[imgIdx]["score"] = response.data.score;
	  	});
	}
 };
 });



