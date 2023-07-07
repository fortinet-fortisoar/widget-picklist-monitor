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
            __selectFields: $scope.config.picklistItem
         }).$promise.then(function (result) {
            var foundPickListValue = _.find($scope.config.picklits_mapping.options, function (item) {
               return item.picklistValue === result[$scope.config.picklistItem].itemValue;
            });
            if (foundPickListValue) {
               $scope.flag = true
               $scope.title = foundPickListValue.picklistLoadingTitle;
               $scope.picklistMessageIcon = foundPickListValue.picklistMessageIcon;
               $scope.showSpinner = _.has(foundPickListValue, 'showSpinner') ? foundPickListValue.showSpinner : true;
               $scope.showIcon = foundPickListValue.showIcon
               $scope.loading = true;
               if ($scope.config.timeout) {
                  $timeout(function () {
                     $scope.flag = false
                     $scope.title = $scope.config.newTitle;
                     if ($scope.config.updatePicklistItem && $scope.config.updatePicklistValue) {
                        loadAttributes();          
                     }
                  }, $scope.config.timeout*10000);
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
         picklistObject[$scope.config.updatePicklistItem] = $scope.selectedPicklistObject
         Modules.update({
            module: $state.params.module,
            id: $state.params.id,
         }, picklistObject)
      }

      function loadAttributes() {
         $scope.fieldsArray = [];
         var entity = new Entity($state.params.module);
         entity.loadFields().then(function () {
            $scope.fieldsArray = entity.getFormFieldsArray();
            $scope.fieldsArray = _.filter($scope.fieldsArray, function (item) { return item.model === 'picklists'; });
            if ($scope.config.updatePicklistItem) {
               var selectedPicklistItem = _.find($scope.fieldsArray, function (item) {
                  return item.name === $scope.config.updatePicklistItem;
               });
               $scope.selectedPicklistItem = selectedPicklistItem;
               if ($scope.config.updatePicklistValue) {
                  selectedPicklistItemValue = _.find($scope.selectedPicklistItem.options, function (item) {
                     return item.itemValue === $scope.config.updatePicklistValue;
                  });
                  $scope.selectedPicklistObject = selectedPicklistItemValue
               }
            }
               updatePicklist();
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
         websocketService.subscribe($state.params.module + '/' + $state.params.id, function (result) {
            var changedAttribute;
            if (angular.isDefined(result.changeData)) {
               if (result.changeData.includes($scope.config.picklistItem)) {
                  changedAttribute = $scope.config.picklistItem;
               }
            }
            if (changedAttribute) {
               checkPicklistCondition();
            }
         }).then(function (subscription) {
            widgetsubscription = subscription;
         });
      }
      widgetWSSubscribe();
      checkPicklistCondition();
   }
})();