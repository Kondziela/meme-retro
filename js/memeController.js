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
                    $scope.loadRandomBoard(); //TODO: delete after adding button for loading random board
                    modalService.closeAll();
                }
            };

            $scope.addMeme = function (message) {
                if ($scope.gif) {
                    message.gif_url = memeService.getMemeUrl(document.getElementsByName("memeTop")[0].value, document.getElementsByName("memeBottom")[0].value, $scope.gif);
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
                //TODO: read file, delete below
                var jsonList = [
                    {"text": "The best sprint ever", "tag": "happiness", "id": 1},
                    {"text": "The best sprint in my life", "tag": "joy", "id": 1},
                    {"text": "I was crying  while deploying", "tag": "cry", "id": 2},
                    {"text": "I am crying such a good sprint ended", "tag": "sweet", "id": 1},
                    {"text": "I am crying from happiness that the sprint ended", "tag": "exhausted", "id": 2},
                    {"text": "I love my team", "tag": "kissy", "id": 1},
                    {"text": "I love working with you", "tag": "heart", "id": 1},
                    {"text": "I hate some BMW ideas", "tag": "banana", "id": 2},
                    {
                        "text": "Priority of stories needs to be kept in mind as at the very start of sprint we were working on almost all stories and also it leads to more number of pull requests in open",
                        "tag": "rabbit",
                        "id": 2
                    },
                    {
                        "text": "I am disappointed because Panky did whole story before sprint started",
                        "tag": "hamtaro",
                        "id": 2
                    },
                    {
                        "text": "I am amazed because Panky did whole story before sprint started",
                        "tag": "respect",
                        "id": 1
                    },
                    {"text": "Thanks Nisha for help in kafka story!!", "tag": "respectful", "id": 1},
                    {"text": "Thanks Kajtek for help in solr story!!", "tag": "carrot", "id": 1},
                    {
                        "text": "Thanks Pawel that you havent forced us to make more improvements!!",
                        "tag": "relief",
                        "id": 1
                    },
                    {"text": "Thank you Pawel for help with GUI!!", "tag": "thanks", "id": 1},
                    {"text": "Linoy Pawel Arti the best informatica team", "tag": "laughing", "id": 1},
                    {"text": "Tanaja Iza Nisha the Misses of Three Shores", "tag": "beautiful", "id": 1},
                    {"text": "Why am I still here??", "tag": "pokemon", "id": 2},
                    {"text": "When Munich will be the district of Mumbai?", "tag": "munich", "id": 2},
                    {"text": "3x WHY????!!", "tag": "miniones", "id": 2},
                    {
                        "text": "The story with CNAP was underestimated and because of it we couldnt deliver two another stories",
                        "tag": "maharaja",
                        "id": 2
                    },
                    {"text": "Why Mumbai doesnt come next month?", "tag": "india", "id": 2},
                    {
                        "text": "Some of us dont read US carefully and then the story couldnt be delivered because of the lack of some crucial functionality",
                        "tag": "mrbean",
                        "id": 2
                    },
                    {"text": "It wasnt sprint, it was shit!", "tag": "shit", "id": 2},
                    {"text": "You are so nice I can't live without you <3", "tag": "like", "id": 1},
                    {"text": "I can't imagine the better team<3", "tag": "pinguin", "id": 1},
                    {"text": "The working with Gantt was so demotivating...", "tag": "seals", "id": 2},
                    {"text": "I love working with ETLs", "tag": "monkey", "id": 1},
                    {
                        "text": "We shouldnt get the story which is blocked by the one from the previous sprint",
                        "tag": "disappointment",
                        "id": 2
                    },
                    {"text": "I need vacations after that sprint", "tag": "panda", "id": 2},
                    {"text": "The DLs ignore me. I can't continue with stories", "tag": "kick", "id": 2},
                    {"text": "So many jenkins failures this sprint as drops in sea", "tag": "death", "id": 2},
                    {"text": "Batmans still alive despite lack of Kamilek", "tag": "minion", "id": 1},
                    {"text": "Arti we miss you.... ;<", "tag": "sombrero", "id": 2},
                    {"text": "Fabian thanks for super KT session!", "tag": "batman", "id": 1},
                    {"text": "Elena thanks for KT with Informatica stuff!", "tag": "russia", "id": 1},
                    {"text": "Shriya thanks for supporting Firestorms!", "tag": "support", "id": 1},
                    {"text": "Lets code more instead of this retro meeting", "tag": "holmes", "id": 2},
                    {"text": "Apon the Confluence Master!!", "tag": "agent", "id": 1},
                    {"text": "Johannes you are the best DataMan ever", "tag": "shake", "id": 1},
                    {"text": "Alex the Masta of Rasta!!!", "tag": "cats", "id": 1},
                    {"text": "Andy the ETK Master", "tag": "king", "id": 1},
                    {"text": "Improvement again?!", "tag": "nahi", "id": 2},
                    {"text": "The story was overestimated", "tag": "super", "id": 1},
                    {"text": "The story was underestimated", "tag": "weep", "id": 2},
                    {"text": "The story was overestimated", "tag": "shock", "id": 2},
                    {"text": "The current velocity is killing", "tag": "jumping", "id": 2}];
                //---END TODO
                var randomIndexes = [];
                var numberOfPoints = 5;
                for (var i = 0; i < numberOfPoints; i++) {
                    var index;
                    do {
                        index = Math.floor(Math.random() * (jsonList.length + 1))
                    }
                    while (randomIndexes.includes(index));
                    randomIndexes.push(index);
                }
                randomIndexes.forEach(function (index) {
                    var jsonObject = jsonList[index];
                    memeService.getGifsUrlsByQuery(jsonObject.tag, 1).then(function (urlList) {
                        if (urlList.length) {
                            $scope.addPoint(jsonObject.id, jsonObject.text, urlList[0]);
                        }
                    });
                });
            };

            $scope.addPoint = function (id, text, gifUrl) {
                $scope.messages
                    .$add({
                        text: text,
                        creating: false,
                        user_id: $scope.userUid,
                        gif_url: gifUrl,
                        type: {
                            id: id
                        },
                        votes: 0
                    });
                $scope.messages.$save();
            };
        }
    ]);
