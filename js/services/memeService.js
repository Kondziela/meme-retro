'use strict';

angular
    .module('fireideaz')
    .service('MemeService', ['$http',
        function ($http) {
            var memeService = {};

            memeService.getStaticGifsUrlsByQuery = function (name, limit, offset) {
                if (!offset) {
                    offset = 0;
                }
                if (!limit) {
                    limit = 9;
                }
                return new Promise(function (resolve, reject) {
                    $http({
                        method: 'GET',
                        url: 'https://api.giphy.com/v1/gifs/search?api_key=orXMkeCrlZ1aZZLEVLWCjY7XsUgYgJUe&limit=' + limit + '&q=' + name + '&offset=' + offset
                    }).then(function successCallback(response) {
                        resolve(response.data.data.map(function (gifObj) {
                            return gifObj.images.downsized_still.url;
                        }));
                    }, function errorCallback(response) {
                        console.log('ERROR: ' + response);
                        reject();
                    });
                });
            };

            memeService.getGifsUrlsByQuery = function (name, limit, offset) {
                if (!offset) {
                    offset = 0;
                }
                if (!limit) {
                    limit = 9;
                }
                return new Promise(function (resolve, reject) {
                    $http({
                        method: 'GET',
                        url: 'https://api.giphy.com/v1/gifs/search?api_key=orXMkeCrlZ1aZZLEVLWCjY7XsUgYgJUe&limit=' + limit + '&q=' + name + '&offset=' + offset
                    }).then(function successCallback(response) {
                        resolve(response.data.data.map(function (gifObj) {
                            return gifObj.images.downsized.url;
                        }));
                    }, function errorCallback(response) {
                        console.log('ERROR: ' + response);
                        reject();
                    });
                });
            };

            memeService.getMemeUrl = function (topString, downString, gifUrl) {
                var top = topString.replace(/\?/g, '~q');
                top = top.replace(/\//g, '~s');
                top = top.replace(/\%/g, '~p');
                top = top.replace(/\#/g, '~h');
                top = top.replace(/\"/g, '\'\'');
                top = top.replace(/\_/g, '__');
                top = top.replace(/\-/g, '--');
                top = top.replace(/\s/g, '_');

                var down = downString.replace(/\?/g, '~q');
                down = down.replace(/\//g, '~s');
                down = down.replace(/\%/g, '~p');
                down = down.replace(/\#/g, '~h');
                down = down.replace(/\"/g, '\'\'');
                down = down.replace(/\_/g, '__');
                down = down.replace(/\-/g, '--');
                down = down.replace(/\s/g, '_');

                return 'https://memegen.link/custom/' + top + '/' + down + '.jpg?alt=' + gifUrl;
            };

            return memeService;
        }]);
