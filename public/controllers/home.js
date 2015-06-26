angular.module('PrimaryModule', ['ui.bootstrap']);

angular.module('PrimaryModule').controller('HomeController', ['$scope', '$timeout', '$http', function ($scope, $timeout, $http) {

	$scope.selectedDrug = '';
	$scope.getDrugs = function (val) {
		return $http.get('/drugs', {
			params: {
				searchTerm: val
			}
		}).then(function (response) {
			return _.each(response.data, function (item) {
				return item.substring(0, 30);
			});
		});
	};

	$scope.onSelect = function ($item, $model, $label) {
		$scope.$item = $item;
		$scope.$model = $model;
		$scope.$label = $label;
		$scope.selectedDrug = $model;
	};

	

}]);