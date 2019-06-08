/* global EmojiPicker */
'use strict';

angular
    .module('fireideaz')

    .controller('MemeCtrl', [
        '$scope',
        '$window',
        '$rootScope',
        'FirebaseService',
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
                if ($scope.gif) {
                    message.gif_url = memeService.getMemeUrl(document.getElementsByName("memeTop")[0].value, document.getElementsByName("memeBottom")[0].value, $scope.gif);
                    $rootScope.$broadcast('imageAdd', message);
                    $scope.loadRandomBoard();
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
                    })
                });
                gif.class = "with-border selected our-css";
                $scope.gif = gif.gif;
            };

            $scope.findNextGifs = function () {
                $scope.gifs = [];
                $scope.next = $scope.next + 1;
                $scope.loadGifs($scope.next * 9);
            };

            $scope.findNextMemes = function () {
                $scope.next = $scope.next + 1;
                $scope.loadMemes($scope.next * 9);
            };

            $scope.loadRandomBoard = function () {
                //TODO: read file
                var jsonList = [
                    {"text": "The best sprint ever", "tag": "happiness"},
                    {"text": "The best sprint in my life", "tag": "joy"},
                    {"text": "I was crying  while deploying", "tag": "cry"},
                    {"text": "I am crying such a good sprint ended", "tag": "sweet"},
                    {"text": "I am crying from happiness that the sprint ended", "tag": "exhausted"},
                    {"text": "I love my team", "tag": "kissy"},
                    {"text": "I love working with you", "tag": "heart"},
                    {"text": "I hate some BMW ideas", "tag": "banana"},
                    {
                        "text": "Priority of stories needs to be kept in mind as at the very start of sprint we were working on almost all stories and also it leads to more number of pull requests in open",
                        "tag": "rabbit"
                    },
                    {"text": "I am disappointed because Panky did whole story before sprint started", "tag": "hamtaro"},
                    {"text": "I am amazed because Panky did whole story before sprint started", "tag": "respect"},
                    {"text": "Thanks Nisha for help in kafka story!!", "tag": "respectul"},
                    {"text": "Thanks Kajtek for help in solr story!!", "tag": "carrot"},
                    {"text": "Thanks Pawel that you havent forced us to make more improvements!!", "tag": "relief"},
                    {"text": "Thank you Pawel for help with GUI!!", "tag": "thanks"},
                    {"text": "Linoy Pawel Arti the best informatica team", "tag": "laughing"},
                    {"text": "Tanaja Iza Nisha the Misses of Three Shores", "tag": "beautiful"},
                    {"text": "Why am I still here??", "tag": "pokemon"},
                    {"text": "When Munich will be the district of Mumbai?", "tag": "munich"},
                    {"text": "3x WHY????!!", "tag": "miniones"}];
                var randomIndexes = [];
                var numberOfPoints = 5;
                for (var i = 0; i < numberOfPoints; i++) {
                    randomIndexes.push(Math.floor(Math.random() * (jsonList.length + 1)));
                }
                randomIndexes.forEach(function (index) {
                    var jsonObject = jsonList[index];
                    var gifUrl = $scope.findFirstGifByTag(jsonObject.tag);
                    $scope.addPoint("", jsonObject.text, gifUrl);
                })
            };

            $scope.addPoint = function (type, text, gifUrl) {
                $scope.messages
                    .$add({
                        text: text,
                        creating: true,
                        user_id: $scope.userUid,
                        gif_url: gifUrl,
                        type: {
                            id: 1 //type.id
                        },
                        date: firebaseService.getServerTimestamp(),
                        date_created: firebaseService.getServerTimestamp(),
                        votes: 0
                    });
                //.then(addMessageCallback);
            };

            $scope.findFirstGifByTag = function (tag) {
                var firstGif = null;
                memeService.getGifsUrlsByQuery(tag, 1).then(function(urlList) {
                    firstGif = urlList[0];
                });
                return firstGif;
            };
        }
    ]);
