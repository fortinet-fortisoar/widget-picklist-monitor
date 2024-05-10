/* Copyright start
  MIT License
  Copyright (c) 2024 Fortinet Inc
  Copyright end */
 
 'use strict';
(function () {
    angular
        .module('cybersponse')
        .controller('customPicklistMessage112Ctrl', customPicklistMessage112Ctrl);
        customPicklistMessage112Ctrl.$inject = ['$scope', '$state', '$interval', 'Modules', 'config', 'websocketService', '$rootScope', '_'];
    function customPicklistMessage112Ctrl($scope, $state, $interval, Modules, config, websocketService, $rootScope, _ ) {
        $scope.config = config;
        $scope.title = '';
        $scope.timeinterval = 0;
        $scope.currentTheme = $rootScope.theme.id;
        var widgetsubscription;
   
         function checkPicklistCondition(){
                Modules.get({
                    module: $state.params.module,
                    id: $state.params.id,
                    __selectFields: config.picklistItem
                }
                ).$promise.then(function (result) {
                  	var foundPickListValue = _.find($scope.config.picklits_mapping.options, function(item){ return item.picklistValue === result[config.picklistItem].itemValue; });
                    if (foundPickListValue) {
                        $scope.title = foundPickListValue.picklistLoadingTitle;
                        $scope.picklistMessageIcon = foundPickListValue.picklistMessageIcon;
                        $scope.showSpinner = _.has(foundPickListValue, 'showSpinner')  ? foundPickListValue.showSpinner : true;
                        $scope.showIcon = foundPickListValue.showIcon
                        $scope.loading = true;
                    } else  {
                        $scope.title = "";
                        $scope.picklistMessageIcon = "";
                        $scope.showSpinner = false;
                        $scope.showIcon = false;
                        $scope.loading = false;
                    }
                });
         }

        $scope.$on('$destroy', function () {
            if (widgetsubscription) {
                websocketService.unsubscribe(widgetsubscription);
            }
            $interval.cancel($scope.timeinterval);
        }
        );
        $scope.$on('websocket:reconnect', function () {
            
            widgetWSSubscribe();
        }
        );
        
        function widgetWSSubscribe() {
            websocketService.subscribe($state.params.module+'/'+$state.params.id, function (result) {
                var changedAttribute;
                if (angular.isDefined(result.changeData)) {
                    if (result.changeData.includes(config.picklistItem)) {
                        changedAttribute = config.picklistItem;
                    }
                }
                if (changedAttribute) {
                   checkPicklistCondition();
                }
            }).then(function (data){
					widgetsubscription=data;
			});
        }
        widgetWSSubscribe();
        checkPicklistCondition();
    }
}
)();