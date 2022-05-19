(function () {
    angular
        .module('cybersponse')
        .controller('customPicklistMessageDev110Ctrl', customPicklistMessageDev110Ctrl);
        customPicklistMessageDev110Ctrl.$inject = ['$scope', '$state', '$interval', 'Modules', 'config', 'websocketService', '$rootScope', '_'];
    function customPicklistMessageDev110Ctrl($scope, $state, $interval, Modules, config, websocketService, $rootScope, _ ) {
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
                        $scope.showSpinner = foundPickListValue.showSpinner;
                        $scope.loading = true;
                    } else  {
                        $scope.title = "";
                        $scope.picklistMessageIcon = "";
                        $scope.showSpinner = false;
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
            if (widgetsubscription) {
                websocketService.unsubscribe(widgetsubscription);
            }
            websocketService.subscribe($state.params.module, function (result) {
                var changedAttribute;
                widgetsubscription = result;
                if (angular.isDefined(result.changeData)) {
                    if (result.changeData.includes(config.picklistItem)) {
                        changedAttribute = config.picklistItem;
                    }
                }
                if (changedAttribute) {
                   checkPicklistCondition();
                }
            }
            );
        }
        widgetWSSubscribe();
        checkPicklistCondition();
    }
}
)();