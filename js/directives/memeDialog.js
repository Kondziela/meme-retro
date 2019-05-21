'use strict';

angular.module('fireideaz').directive('memeDialog', ['MemeService', function (memeService) {
        return {
            templateUrl: 'components/memeDialog.html',
            link: function ($scope) {
                $scope.memeService = memeService;
            }
        };
    }]
);