'use strict';
(function () {
    angular
        .module('cybersponse')
        .controller('editCustomPicklistMessageDev200Ctrl', editCustomPicklistMessageDev200Ctrl);
        
        editCustomPicklistMessageDev200Ctrl.$inject = ['$scope', '$uibModalInstance', '$state', 'config', 'Entity', 'picklistsService', '_'];

    function editCustomPicklistMessageDev200Ctrl($scope, $uibModalInstance, $state, config, Entity, picklistsService, _) {
        $scope.addOptions = addOptions;
        $scope.removeOptions = removeOptions;
        $scope.cancel = cancel;
        $scope.save = save;
        $scope.config = config;
        $scope.config.isTimeout = config.isTimeout || false
        $scope.config.picklits_mapping = $scope.config.picklits_mapping || {
        options: []
       };
       
        function _init() {
            if ($state.params.module) {
                loadAttributes();
                loadAttributesToUpdate();
            }
        }
        _init();
      
      
      function loadAttributes() {
        $scope.fieldsArray = [];
        var entity = new Entity($state.params.module);
        entity.loadFields().then(function () {
          $scope.fieldsArray = entity.getFormFieldsArray();
          $scope.fieldsArray = _.filter($scope.fieldsArray, function(item){ return item.model === 'picklists'; });
          if($scope.config.picklistItem){
            var selectedPicklistItem = _.find($scope.fieldsArray, function(item){
            return item.name === $scope.config.picklistItem;
            });
            $scope.loadlistitem(selectedPicklistItem);
          }
        });
      }

      $scope.loadListItemValuesToUpdate = function (picklistItem) {
        if(picklistItem && angular.isString(picklistItem)){
          picklistItem = _.find($scope.fieldsArray, function(item){
            return item.name === picklistItem;
          });
        }
        picklistsService.loadPicklists(picklistItem).then(function (data) {
            $scope.picklistValueItems = data.options;
         });
      };

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

      function loadAttributesToUpdate() {
        $scope.picklistItems = [];
        var entity = new Entity($state.params.module);
        entity.loadFields().then(function () {
          $scope.picklistItems = entity.getFormFieldsArray();
          $scope.picklistItems = _.filter($scope.picklistItems, function(item){ return item.model === 'picklists'; });
          if($scope.config.updatePicklistItem){
            var selectedPicklistItem = _.find($scope.picklistItems, function(item){
            return item.name === $scope.config.updatePicklistItem;
            });
           $scope.loadListItemValuesToUpdate(selectedPicklistItem);
          }
        });
      }
	
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
