angular.module('PrimaryModule', ['ui.bootstrap']);

angular.module('PrimaryModule').controller('DetailsController', ['$scope', '$timeout', '$http', function ($scope, $timeout, $http) {
	$scope.drug_name = getParameterByName('drug_name');
	$scope.drugDetail = {

	};

	$scope.eventChartElement = {};
	$scope.statusChartElement = {};
	$scope.classificationChartElement = {};
	$scope.enforcementChartElement = {};

	$scope.eventChart = getBaseLineChart(1, ["#414DF2"], ["Adverse Events"]);
	$scope.classificationChart = getBasePieChart(3, ["#F7464A", "#46BFBD", "#FDB45C"], ["#FF5A5E", "#5AD3D1", "#FFC870"]);
	$scope.enforcementStatusChart = getBasePieChart(4, ["#F7464A", "#46BFBD", "#FDB45C", "#8254F7"], ["#FF5A5E", "#5AD3D1", "#FFC870", "#B299F2"]);
	$scope.enforcementChart = getBaseLineChart(1, ["#414DF2"], ["Enforcements"]);

	$scope.showEnforcementStatistics = false;
	$scope.enforcementChartLoaded = false;
	$scope.toggleEnforcementStatistics = function () {
		$scope.showEnforcementStatistics = !$scope.showEnforcementStatistics;
		if ($scope.showEnforcementStatistics && !$scope.enforcementChartLoaded) {
			$http.get('/drug/enforcement/count?drug_name=' + $scope.drug_name).success(function (data) {
				$scope.pastEnforcementSuccess(data);
				if (data.length > 0) $scope.showEnforcementStatistics = false;
			});

			$http.get('/drug/enforcement/classification_count?drug_name=' + $scope.drug_name).success(function (data) {
				$scope.pastEnforcementClassificationSuccess(data);
			});

			$http.get('/drug/enforcement/status_count?drug_name=' + $scope.drug_name).success(function (data) {
				$scope.pastEnforcementStatusSuccess(data);
			});
		}
		$scope.enforcementChartLoaded = true;
	}

	$scope.showEventStatistics = false;
	$scope.eventChartLoaded = false;
	$scope.toggleEventStatistics = function () {
		$scope.showEventStatistics = !$scope.showEventStatistics;

		if ($scope.showEventStatistics && !$scope.eventChartLoaded) {
			$http.get('/drug/event/count?drug_name=' + $scope.drug_name).success(function (data) {
				$scope.pastEventSuccess(data);
				if (data.length > 0) $scope.showEventStatistics = false;
			});
		}
		$scope.eventChartLoaded = true;
	}

	$http.get('/drug/label?drug_name=' + $scope.drug_name).success(function (data) {
		if (data) {
			$scope.drugDetail = data;
		}
	});

	$scope.getDrugs = function (val) {
		return $http.get('/drugs', {
			params: {
				search_term: val
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

	$scope.pastEnforcementClassificationSuccess = function (data) {
		if (data) {


			var classII = _.filter(data, function (r) {
				return r.term.toLowerCase() == 'ii';
			});

			if (classII && classII.length > 0) {
				$scope.classificationChart.data[1].value = classII[0].count;
				$scope.classificationChart.data[1].label = 'Class III';
			}

			var classIII = _.filter(data, function (r) {
				return r.term.toLowerCase() == 'iii';
			});

			if (classIII && classIII.length > 0) {
				$scope.classificationChart.data[2].value = classIII[0].count;
				$scope.classificationChart.data[2].label = 'Class II';
			}

			var classI = _.filter(data, function (r) {
				return (r.term.toLowerCase() != 'ii' && r.term.toLowerCase() != 'iii');
			});

			if (classI && classI.length > 0) {
				$scope.classificationChart.data[0].value = classI[0].count - ($scope.classificationChart.data[2].value + $scope.classificationChart.data[1].value);
				$scope.classificationChart.data[0].label = 'Class I';
			}

			var classificationChartCanvas = document.getElementById('classificationChart').getContext('2d');
			$scope.classificationChartElement = new Chart(classificationChartCanvas).Pie($scope.classificationChart.data, $scope.classificationChart.options);

			document.getElementById('classificationChart-legend').innerHTML = $scope.classificationChartElement.generateLegend();
		}
	}

	$scope.pastEnforcementStatusSuccess = function (data) {
		if (data && data) {
			$scope.enforcementStatusChart.data[0].label = 'On Going';
			$scope.enforcementStatusChart.data[1].label = 'Completed';
			$scope.enforcementStatusChart.data[2].label = 'Terminated';
			$scope.enforcementStatusChart.data[3].label = 'Pending';
			for (var i = 0; i < data.length; i++) {
				if (data[i].term == 'ongoing') {
					$scope.enforcementStatusChart.data[0].value = data[i].count;
				} else if (data[i].term == 'completed') {
					$scope.enforcementStatusChart.data[1].value = data[i].count;
				} else if (data[i].term == 'terminated') {
					$scope.enforcementStatusChart.data[2].value = data[i].count;
				} else {
					$scope.enforcementStatusChart.data[3].value = data[i].count;
				}
			}

			var statusChartCanvas = document.getElementById('statusChart').getContext('2d');
			$scope.statusChartElement = new Chart(statusChartCanvas).Pie($scope.enforcementStatusChart.data, $scope.enforcementStatusChart.options);

			document.getElementById('statusChart-legend').innerHTML = $scope.statusChartElement.generateLegend();
		}
	}

	$scope.pastEnforcementSuccess = function (data) {
		if (data) {
			$scope.enforcementChart.labels = [];

			$scope.enforcementChart.datasets[0].data = [];
			_.each(data, function (item) {
				$scope.enforcementChart.labels.push(item.label);
				$scope.enforcementChart.datasets[0].data.push(item.value);
			});

		}
		var enforcementChartCanvas = document.getElementById('enforcementChart').getContext('2d');
		$scope.enforcementChartElement = new Chart(enforcementChartCanvas).Line($scope.enforcementChart, $scope.enforcementChart.options);

		document.getElementById('enforcementChart-legend').innerHTML = $scope.enforcementChartElement.generateLegend();
	};

	$scope.pastEventSuccess = function (data) {
		if (data) {
			$scope.eventChart.labels = [];

			$scope.eventChart.datasets[0].data = [];
			_.each(data, function (item) {
				$scope.eventChart.labels.push(item.label);
				$scope.eventChart.datasets[0].data.push(item.value);
			});

		}
		var eventChartCanvas = document.getElementById('eventChart').getContext('2d');
		$scope.eventChart = new Chart(eventChartCanvas).Line($scope.eventChart, $scope.eventChart.options);

		document.getElementById('eventChart-legend').innerHTML = $scope.eventChart.generateLegend();
	};
}]);

function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getBaseLineChart(datasetLength, color, label) {
	var self = new Object();
	self.labels = [];

	self.options = {
		legend: true,
		responsive: true,
		legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
		multiTooltipTemplate: "<%= value %>",
		tooltipTemplate: "<%if (label){%><%=label %>: <%}%><%= value %>",
		bezierCurve: false,
		scaleShowGridLines: false,
		scaleFontSize: 12
	};
	self.datasets = [];
	for (var i = 0; i < datasetLength; i++) {
		self.datasets.push({
			label: label[i],
			fillColor: "rgba(0,0,0,0)",
			strokeColor: color[i],
			pointColor: color[i],
			pointStrokeColor: "#fff",
			pointHighlightFill: "#fff",
			pointHighlightStroke: color[i],
			data: []
		});
	}
	return self;
}

function getBasePieChart(dataLength, color, highlight) {
	var self = new Object();
	self.options = {
		segmentShowStroke: true,
		segmentStrokeColor: "#fff",
		segmentStrokeWidth: 2,
		percentageInnerCutout: 50, // This is 0 for Pie charts
		animationSteps: 100,
		animationEasing: "easeOutBounce",
		animateRotate: true,
		animateScale: false,
		labelFontFamily: "'Arial'",
		labelFontStyle: "normal",
		labelFontSize: 12,
		labelFontColor: "#fff",
		legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
	};
	self.data = [];
	for (var i = 0; i < dataLength; i++) {
		self.data.push({
			label: 'Sample',
			color: color[i],
			highlight: highlight[i],
			value: 0
		});
	}
	return self;
}