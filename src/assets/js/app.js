"use strict";
var app = angular.module('smart-box', ['ngMaterial', 'mdDataTable']);

app.controller('AdminController', function AdminController($scope, $http, $mdToast) {
    $scope.paginatorCallback = paginatorCallback;
    var baseURL = window.location.protocol + '//' + window.location.host;
    console.log(baseURL);

    $scope.saveRowCallback = function(row){
        $mdToast.show(
            $mdToast.simple()
                .content('Row changed to: '+row)
                .hideDelay(3000)
        );
    };

    function paginatorCallback(page, pageSize) {
        var offset = (page - 1) * pageSize;

        return $http.post(baseURL+"/admin/getUsers", {
            'offset': offset,
            'limit': pageSize,
        }).then(function (result) {
            return {
                results: result.data.users,
                totalResultCount: result.data.count
            }
        });
    }

});
