angular.module('PrimaryModule', ['ui.bootstrap']);

angular.module('PrimaryModule').controller('HomeController', ['$scope', '$timeout', '$http', function ($scope, $timeout, $http) {

	
//	$scope.enforcementChart = {
//		labels: [],
//		options: {
//			legend: true,
//			datasetFill: false,
//			legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
//		},
//		datasets: [{
//				label: "Drug",
//				fillColor: "rgba(220,220,220,0)",
//				strokeColor: "#414DF2",
//				pointColor: "#414DF2",
//				pointStrokeColor: "#fff",
//				pointHighlightFill: "#fff",
//				pointHighlightStroke: "#414DF2",
//				data: []
//            },
//			{
//				label: "Device",
//				fillColor: "rgba(220,220,220,0)",
//				strokeColor: "#33F240",
//				pointColor: "#33F240",
//				pointStrokeColor: "#fff",
//				pointHighlightFill: "#fff",
//				pointHighlightStroke: "#33F240",
//				data: []
//            },
//			{
//				label: "Food",
//				fillColor: "rgba(220,220,220,0)",
//				strokeColor: "#F5764C",
//				pointColor: "#F5764C",
//				pointStrokeColor: "#fff",
//				pointHighlightFill: "#fff",
//				pointHighlightStroke: "#F5764C",
//				data: []
//            }]
//	};

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

	//    $http.get('/drug/pastYearEnforcement').success(function (data) {
	//        $scope.pastYearEnforcementSuccess(data, 'drug');
	//    });
	//    
	//    $http.get('/device/pastYearEnforcement').success(function (data) {
	//        $scope.pastYearEnforcementSuccess(data, 'device');
	//    });
	//    
	//    $http.get('/food/pastYearEnforcement').success(function (data) {
	//        $scope.pastYearEnforcementSuccess(data, 'food');
	//    });


	//    $scope.pastYearEnforcementSuccess = function (data, enforcementCategory) {
	//        if (data && data.results) {
	//            $scope.enforcementChart.labels = [];
	//            switch (enforcementCategory) {
	//            case 'drug':
	//                $scope.enforcementChart.datasets[0].data = [];
	//                _.each(data.results, function (item) {
	//                    $scope.enforcementChart.labels.push(item.label);
	//                    $scope.enforcementChart.datasets[0].data.push(item.value);
	//                });
	//                break;
	//            case 'device':
	//                $scope.enforcementChart.datasets[1].data = [];
	//                _.each(data.results, function (item) {
	//                    $scope.enforcementChart.labels.push(item.label);
	//                    $scope.enforcementChart.datasets[1].data.push(item.value);
	//                });
	//                break;
	//            case 'food':
	//                $scope.enforcementChart.datasets[2].data = [];
	//                _.each(data.results, function (item) {
	//                    $scope.enforcementChart.labels.push(item.label);
	//                    $scope.enforcementChart.datasets[2].data.push(item.value);
	//                });
	//                break;
	//            }
	//        }
	//        var enforcementChartCanvas = document.getElementById('enforcementChart').getContext('2d');
	//        var enforcementChart = new Chart(enforcementChartCanvas).Line($scope.enforcementChart, {
	//            legend: true,
	//            responsive: true,
	//            legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
	//            multiTooltipTemplate: "<%= value %>",
	//            tooltipTemplate: "<%if (label){%><%=label %>: <%}%><%= value %>",
	//             bezierCurve: false,
	//             scaleShowGridLines: false,
	//            scaleFontSize:12
	//        });
	//
	//        document.getElementById('enforcementChart-legend').innerHTML = enforcementChart.generateLegend();
	//    };

}]);