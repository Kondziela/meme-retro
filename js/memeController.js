/* global EmojiPicker */
'use strict';

angular
    .module('fireideaz')

    .controller('MemeCtrl', [
        '$scope',
        '$window',
        '$rootScope',
        'ModalService',
        'MemeService',
        function ($scope,
                  $window,
                  $rootScope,
                  modalService,
                  memeService) {

            $scope.clearVariable = function () {
                $scope.gifs = [[]];
            };

            $scope.deleteGif = function (message) {
                message.gif_url = "";
                modalService.closeAll();
            };

            $scope.addGif = function (message) {
                if ($scope.gif) {
                    message.gif_url = $scope.gif;
                    $rootScope.$broadcast('imageAdd', message);
                    modalService.closeAll();
                }
            };

            $scope.addMeme = function (message) {
                var gif_url = $scope.gif ? $scope.gif : document.getElementsByName("pictureLink")[0].value;
                if (gif_url) {
                    var memeTop = document.getElementsByName("memeTop")[0].value;
                    if (!memeTop) {
                        memeTop = " ";
                    }
                    message.gif_url = memeService.getMemeUrl(memeTop, document.getElementsByName("memeBottom")[0].value, gif_url);
                    $rootScope.$broadcast('imageAdd', message);
                    modalService.closeAll();
                }
            };

            $scope.loadAndShowGifs = function () {
                $scope.next = 0;
                $scope.loadGifs();
            };

            $scope.loadAndShowMemes = function () {
                $scope.next = 0;
                $scope.loadMemes();
            };

            function handleRequestResponse(urlList) {
                var rowList = [], currentRow = 0;

                urlList.forEach(function (item, index) {
                    if (!(index % 3)) {
                        currentRow++;
                        rowList[currentRow] = [];
                    }
                    rowList[currentRow].push({gif: item, class: ''});
                });
                $scope.gifs = rowList;
                $scope.$apply();
            }

            $scope.loadGifs = function (offset) {
                memeService.getGifsUrlsByQuery(document.getElementsByName("gifname")[0].value, 9, offset).then(handleRequestResponse);
            };

            $scope.loadMemes = function (offset) {
                memeService.getStaticGifsUrlsByQuery(document.getElementsByName("gifname")[0].value, 9, offset).then(handleRequestResponse);
            };

            $scope.selectMeme = function (gif) {
                $scope.gifs.forEach(function (gifArr) {
                    gifArr.forEach(function (gif) {
                        gif.class = "";
                    });
                });
                gif.class = "with-border selected our-css";
                $scope.gif = gif.gif;
            };

            $scope.findNextGifs = function () {
                $scope.gifs = [];
                $scope.next = $scope.next + 1;
                $scope.loadGifs($scope.next * 9);
            };

            $scope.findPreviousGifs = function () {
                if ($scope.next !== 0) {
                    $scope.gifs = [];
                    $scope.next = $scope.next - 1;
                    $scope.loadGifs($scope.next * 9);
                }
            };

            $scope.findNextMemes = function () {
                $scope.next = $scope.next + 1;
                $scope.loadMemes($scope.next * 9);
            };

            $scope.findPreviousMemes = function () {
                if ($scope.next !== 0) {
                    $scope.next = $scope.next - 1;
                    $scope.loadMemes($scope.next * 9);
                }
            };

            $scope.submitOnEnter = function (event, method, data) {
                if (event.keyCode === 13 && data) {
                    switch (method) {
                        case 'loadAndShowGifs':
                            $scope.loadAndShowGifs();

                            break;
                        case 'loadAndShowMemes':
                            $scope.loadAndShowMemes();

                            break;
                    }
                }
            };
        }
    ]);
