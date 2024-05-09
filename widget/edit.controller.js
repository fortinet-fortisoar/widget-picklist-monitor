'use strict';
(function () {
    angular
        .module('cybersponse')
        .controller('editCustomPicklistMessage112Ctrl', editCustomPicklistMessage112Ctrl);

        editCustomPicklistMessage112Ctrl.$inject = ['$scope', '$uibModalInstance', '$state', 'config', 'Entity', 'picklistsService', '_'];

    function editCustomPicklistMessage112Ctrl($scope, $uibModalInstance, $state, config, Entity, picklistsService, _) {
        $scope.addOptions = addOptions;
        $scope.removeOptions = removeOptions;
        $scope.cancel = cancel;
        $scope.save = save;
        $scope.config = config;
        $scope.config.picklits_mapping = $scope.config.picklits_mapping || {
        options: []
       };
      
        function _init() {
            if ($state.params.module) {
                loadAttributes();
            }
        }
        _init();
      
      
      function loadAttributes() {
        $scope.fieldsArray = [];
        var entity = new Entity($state.params.module);
        entity.loadFields().then(function () {
          $scope.fieldsArray = entity.getFormFieldsArray();
          $scope.fieldsArray = _.filter($scope.fieldsArray, function(item){ return item.model === 'picklists'; });
          if(config.picklistItem){
            var selectedPicklistItem = _.find($scope.fieldsArray, function(item){
            return item.name === config.picklistItem;
            });
            $scope.loadlistitem(selectedPicklistItem);
          }
        }
                                );
      }
      $scope.loadlistitem = function (picklistItem) {
        if($scope.config.picklits_mapping.options.length === 0){
          $scope.config.picklits_mapping.options.push({showSpinner:true});
        } else {
          _.map($scope.config.picklits_mapping.options, function(item){
            if(!_.has(item, 'showSpinner')){
              return item.showSpinner = true;
            }
            });
        } 
        if(picklistItem && angular.isString(picklistItem)){
          picklistItem = _.find($scope.fieldsArray, function(item){
            return item.name === picklistItem;
          });
        }
        picklistsService.loadPicklists(picklistItem).then(function (data) {
            $scope.listItems = data.options;
         });
      };
	
      function removeOptions(index){
        $scope.config.picklits_mapping.options.splice(index, 1); 
      }
      
      function addOptions(){
        $scope.config.picklits_mapping.options.push({showSpinner:true});
      }

      function cancel() {
          $uibModalInstance.dismiss('cancel');
       }

       function save() {
         if ($scope.editPicklistMonitorForm.$invalid) {
              $scope.editPicklistMonitorForm.$setTouched();
              $scope.editPicklistMonitorForm.$focusOnFirstError();
              return;
         }
        $uibModalInstance.close($scope.config);
       }

    }
})();
