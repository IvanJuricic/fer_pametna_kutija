"use strict";
var app = angular.module('smart-box', ['ngMaterial', 'ngMessages', 'mdDataTable']);

app.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('red')
        .accentPalette('grey');
});

app.directive('mdtCustomCellButton', function () {
    return {
        template: '<md-button class="md-warn md-raised">Save</md-button>',
    };
});

app.controller('AdminController', function AdminController($scope, $http, $mdToast, $mdDialog, $window) {
    $scope.userCallback = userCallback;
    $scope.rfidCallback = rfidCallback;
    $scope.showConfirmSave = showConfirmSave;
    $scope.showConfirmDeleteUser = showConfirmDeleteUser;
    $scope.showConfirmDeleteRFID = showConfirmDeleteRFID;
    $scope.createUser = createUser;
    $scope.user = {
        email: "",
        password: ""
    };
    var baseURL = window.location.protocol + '//' + window.location.host;

    function userCallback(page, pageSize) {
        var offset = (page - 1) * pageSize;

        return $http.post(baseURL + "/admin/getUsers", {
            'offset': offset,
            'limit': pageSize,
        }).then(function (result) {
            return {
                results: result.data.users,
                totalResultCount: result.data.count
            }
        }, function (err) {
            var toastSettings = $mdToast.simple().content(err.data).position("bottom right");
            $mdToast.show(toastSettings);
        });
    }

    function updateRFID(rowID) {
        var currentElement = angular.element('#' + rowID);
        $http.post(baseURL + "/admin/updateUserID", {
            'rfid': currentElement[0].value,
            'id': rowID,
        }).then(function (result) {
            if (result.data == "success") {
                $window.location.reload();
            }
        }, function (err) {
            var toastSettings = $mdToast.simple().content(err.data).position("bottom right");
            $mdToast.show(toastSettings);
        });;
    }

    function rfidCallback(page, pageSize) {
        var offset = (page - 1) * pageSize;

        return $http.post(baseURL + "/admin/getAllRFIDs", {
            'offset': offset,
            'limit': pageSize,
        }).then(function (result) {
            return {
                results: result.data.rfids,
                totalResultCount: result.data.count
            }
        }, function (err) {
            var toastSettings = $mdToast.simple().content(err.data).position("bottom right");
            $mdToast.show(toastSettings);
        });
    }


    function createUser() {
        $http.post(baseURL + "/register/", {
            'username': $scope.user.email,
            'password': $scope.user.password,
        }).then(function (result) {
            if (result.data == "success") {
                $window.location.reload();
            }
        }, function (err) {
            var toastSettings = $mdToast.simple().content(err.data).position("bottom right");
            $mdToast.show(toastSettings);
        });
        $scope.user = {
            email: "",
            password: ""
        };
    }

    function showConfirmSave(rowID) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title('Are you sure you want to update the user RFID?')
            .ok('Yes')
            .cancel('No');

        $mdDialog.show(confirm).then(function () {
            updateRFID(rowID);
        }, function () {
        });
    };
    function showConfirmDeleteUser(rowID) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title('Are you sure you want to delete the user?')
            .ok('Yes')
            .cancel('No');

        $mdDialog.show(confirm).then(function () {
            deleteUser(rowID);
        }, function () {
        });
    };
    function showConfirmDeleteRFID(rowID) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title('Are you sure you want to delete the RFID?')
            .ok('Yes')
            .cancel('No');

        $mdDialog.show(confirm).then(function () {
            deleteRFID(rowID);
        }, function () {
        });
    };

    function deleteRFID(rowID) {
        var currentElement = angular.element('#' + rowID);
        $http.post(baseURL + "/admin/deleteRFID", {
            'id': rowID,
        }).then(function (result) {
            if (result.data == "success") {
                $window.location.reload();
            }
        }, function (err) {
            var toastSettings = $mdToast.simple().content(err.data).position("bottom right");
            $mdToast.show(toastSettings);
        });;
    }

    function deleteUser(rowID) {
        var currentElement = angular.element('#' + rowID);
        $http.post(baseURL + "/admin/deleteUser", {
            'id': rowID,
        }).then(function (result) {
            if (result.data == "success") {
                $window.location.reload();
            }
        }, function (err) {
            var toastSettings = $mdToast.simple().content(err.data).position("bottom right");
            $mdToast.show(toastSettings);
        });;
    }
});
app.controller('LoginController', function AdminController($scope, $http, $mdToast, $window) {
    $scope.loginUser = loginUser;
    $scope.user = {
        email: "",
        password: ""
    };
    var baseURL = window.location.protocol + '//' + window.location.host;
    function loginUser() {
        $http.post(baseURL + "/login/", {
            'username': $scope.user.email,
            'password': $scope.user.password,
        }).then(function (message) {
            if (message.data == "authenticated") {
                $window.location.href = '/user';
            }
        }, function (err) {
            var toastSettings = $mdToast.simple().content(err.data).position("bottom right");
            $mdToast.show(toastSettings);
        });
        $scope.user = {
            email: "",
            password: ""
        };
    }
});