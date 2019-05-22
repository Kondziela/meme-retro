'use strict';

angular
    .module('fireideaz')
    .service('MemeService', ['$http',
        function ($http) {
            var memeService = {};

            memeService.getStaticGifsUrlsByQuery = function (name, limit = 9, offset = 0) {

                return new Promise((resolve, reject) => {
                    $http({
                        method: 'GET',
                        url: 'https://api.giphy.com/v1/gifs/search?api_key=orXMkeCrlZ1aZZLEVLWCjY7XsUgYgJUe&limit=' + limit + '&q=' + name + '&offset=' + offset
                    }).then((response) => {
                        resolve(response.data.data.map(function (gifObj) {
                            return gifObj.images.downsized_still.url;
                        }));
                    }, (response) => {
                        reject('ERROR: ' + response);
                    });
                });
            };

            memeService.getGifsUrlsByQuery = function (name, limit = 9, offset = 0) {

                return new Promise((resolve, reject) => {
                    $http({
                        method: 'GET',
                        url: 'https://api.giphy.com/v1/gifs/search?api_key=orXMkeCrlZ1aZZLEVLWCjY7XsUgYgJUe&limit=' + limit + '&q=' + name + '&offset=' + offset
                    }).then((response) => {
                        resolve(response.data.data.map(function (gifObj) {
                            return gifObj.images.downsized.url;
                        }));
                    }, (response) => {
                        reject('ERROR: ' + response);
                    });
                });
            };

            memeService.getMemeUrl = function (topString, downString, gifUrl) {
                var top = topString.replace(/\?/g, '~q')
                    .replace(/\//g, '~s')
                    .replace(/\%/g, '~p')
                    .replace(/\#/g, '~h')
                    .replace(/\"/g, '\'\'')
                    .replace(/\_/g, '__')
                    .replace(/\-/g, '--')
                    .replace(/\s/g, '_'),

                    down = downString.replace(/\?/g, '~q')
                    .replace(/\//g, '~s')
                    .replace(/\%/g, '~p')
                    .replace(/\#/g, '~h')
                    .replace(/\"/g, '\'\'')
                    .replace(/\_/g, '__')
                    .replace(/\-/g, '--')
                    .replace(/\s/g, '_');

                return 'https://memegen.link/custom/' + top + '/' + down + '.jpg?alt=' + gifUrl;
            };

            return memeService;
        }]);
