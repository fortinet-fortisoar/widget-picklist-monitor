(function () {
    angular
       .module('cybersponse')
       .controller('customPicklistMessageDev200Ctrl', customPicklistMessageDev200Ctrl);
    customPicklistMessageDev200Ctrl.$inject = ['$scope', '$state', '$timeout', '$interval', 'Modules', 'Entity', 'config', 'websocketService', '$rootScope', '_'];
 
    function customPicklistMessageDev200Ctrl($scope, $state, $timeout, $interval, Modules, Entity, config, websocketService, $rootScope, _) {
       $scope.config = config;
       $scope.title = '';
       $scope.timeinterval = 0;
       $scope.currentTheme = $rootScope.theme.id;
       var widgetsubscription;
 
       function checkPicklistCondition() {
          Modules.get({
             module: $state.params.module,
             id: $state.params.id,
             __selectFields: config.picklistItem
          }).$promise.then(function (result) {
             var foundPickListValue = _.find($scope.config.picklits_mapping.options, function (item) {
                return item.picklistValue === result[config.picklistItem].itemValue;
             });
             if (foundPickListValue) {
                $scope.flag = true
                $scope.title = foundPickListValue.picklistLoadingTitle;
                $scope.picklistMessageIcon = foundPickListValue.picklistMessageIcon;
                $scope.showSpinner = _.has(foundPickListValue, 'showSpinner') ? foundPickListValue.showSpinner : true;
                $scope.showIcon = foundPickListValue.showIcon
                $scope.loading = true;
                if (config.time) {
                    $timeout(function () {
                       $scope.flag = false
                       $scope.title = config.newtitle;
                       if (config.newpicklistItem && config.newpicklistValue) {
                         updatePicklist();
                       }
                    }, config.time*60000);
                 }
             } else {
                $scope.title = "";
                $scope.picklistMessageIcon = "";
                $scope.showSpinner = false;
                $scope.showIcon = false;
                $scope.loading = false;
             }
          })
       }
 
        function updatePicklist() {
          var picklistObject = {};
          picklistObject[config.newpicklistItem] = $scope.selectedPicklistObject
          Modules.update({
             module: $state.params.module,
             id: $state.params.id,
          }, picklistObject).$promise.then(function () {
             toaster.success({
                body: 'updated picklis'
             });
          }, function () {
             toaster.error({
                body: 'Unable to update comment.'
             });
          }).finally(function () {
             scope.processing = false;
          });
       }

       function loadAttributes() {
        $scope.fieldsArray = [];
        var entity = new Entity($state.params.module);
        entity.loadFields().then(function () {
          $scope.fieldsArray = entity.getFormFieldsArray();
          $scope.fieldsArray = _.filter($scope.fieldsArray, function(item){ return item.model === 'picklists'; });
          if(config.newpicklistItem){
            var selectedPicklistItem = _.find($scope.fieldsArray, function(item){
            return item.name === config.newpicklistItem;
            });
            $scope.selectedPicklistItem = selectedPicklistItem;
            if(config.newpicklistValue){
                selectedPicklistItemValue = _.find($scope.selectedPicklistItem.options, function(item){
                    return item.itemValue === config.newpicklistValue;
                    });
                $scope.selectedPicklistObject = selectedPicklistItemValue   
            }            
          }
        });
      }
 
       $scope.$on('$destroy', function () {
          if (widgetsubscription) {
             websocketService.unsubscribe(widgetsubscription);
          }
          $interval.cancel($scope.timeinterval);
       });
       $scope.$on('websocket:reconnect', function () {
 
          widgetWSSubscribe();
       });
 
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
          });
       }
       widgetWSSubscribe();
       checkPicklistCondition();
       loadAttributes();
    }
 })();