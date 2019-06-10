/* global EmojiPicker */
'use strict';

angular
  .module('fireideaz')

  .controller('MainCtrl', [
    '$scope',
    '$filter',
    '$window',
    'Utils',
    'Auth',
    '$rootScope',
    'FirebaseService',
    'ModalService',
    'MemeService',
    'FEATURES',
    function(
      $scope,
      $filter,
      $window,
      utils,
      auth,
      $rootScope,
      firebaseService,
      modalService,
      memeService,
      FEATURES
    ) {
      $scope.next = 0;
      $scope.loading = true;
      $scope.messageTypes = utils.messageTypes;
      $scope.utils = utils;
      $scope.newBoard = {
        name: '',
        text_editing_is_private: true
      };
      $scope.features = FEATURES;
      $scope.userId = $window.location.hash.substring(1) || '';
      $scope.searchParams = {};
      $window.location.search
        .substr(1)
        .split('&')
        .forEach(function(pair) {
          var keyValue = pair.split('=');
          $scope.searchParams[keyValue[0]] = keyValue[1];
        });
      $scope.sortField = $scope.searchParams.sort || 'date_created';
      $scope.selectedType = 1;
      $scope.import = {
        data: [],
        mapping: []
      };

      $scope.droppedEvent = function(dragEl, dropEl) {
        var drag = $('#' + dragEl);
        var drop = $('#' + dropEl);
        var dragMessageRef = firebaseService.getMessageRef(
          $scope.userId,
          drag.attr('messageId')
        );

        dragMessageRef.once('value', function() {
          dragMessageRef.update({
            type: {
              id: drop.data('column-id')
            }
          });
        });
      };

      function getBoardAndMessages(userData) {
        $scope.userId = $window.location.hash.substring(1) || '499sm';

        var messagesRef = firebaseService.getMessagesRef($scope.userId);
        var board = firebaseService.getBoardRef($scope.userId);

        $scope.boardObject = firebaseService.getBoardObjectRef($scope.userId);

        board.on('value', function(board) {
          if (board.val() === null) {
            window.location.hash = '';
            location.reload();
          }

          $scope.board = board.val();
          $scope.maxVotes = board.val().max_votes ? board.val().max_votes : 6;
          $scope.boardId = $rootScope.boardId = board.val().boardId;
          $scope.boardContext = $rootScope.boardContext = board.val().boardContext;
          $scope.loading = false;
          $scope.hideVote = board.val().hide_vote;
          setTimeout(function() {
            new EmojiPicker();
          }, 100);
        });

        $scope.boardRef = board;
        $scope.messagesRef = messagesRef;
        $scope.userUid = userData.uid;
        $scope.messages = firebaseService.newFirebaseArray(messagesRef);
      }

      if ($scope.userId !== '') {
        auth.logUser($scope.userId, getBoardAndMessages);
      } else {
        $scope.loading = false;
      }

      $scope.isColumnSelected = function(type) {
        return parseInt($scope.selectedType) === parseInt(type);
      };

      $scope.isCensored = function(message, privateWritingOn) {
        return message.creating && privateWritingOn;
      };

      $scope.updatePrivateWritingToggle = function(privateWritingOn) {
        $scope.boardRef.update({
          text_editing_is_private: privateWritingOn
        });
      };

      $scope.updateEditingMessage = function(message, value) {
        message.creating = value;
        $scope.messages.$save(message);
      };

      $scope.getSortFields = function() {
        return $scope.sortField === 'votes'
          ? ['-votes', 'date_created']
          : 'date_created';
      };

      $scope.saveMessage = function(message) {
        message.creating = false;
        $scope.messages.$save(message);
      };

      $scope.$on('imageAdd', function (event, message) {
        $scope.saveMessage(message);
      });

      function redirectToBoard() {
        window.location.href =
          window.location.origin +
          window.location.pathname +
          '#' +
          $scope.userId;
      }

      $scope.isBoardNameInvalid = function() {
        return !$scope.newBoard.name;
      };

      $scope.isMaxVotesValid = function() {
        return Number.isInteger($scope.newBoard.max_votes);
      };

      $scope.createNewBoard = function() {
        $scope.loading = true;
        modalService.closeAll();
        $scope.userId = utils.createUserId();

        var callback = function(userData) {
          var board = firebaseService.getBoardRef($scope.userId);
          board.set(
            {
              boardId: $scope.newBoard.name,
              date_created: new Date().toString(),
              columns: $scope.messageTypes,
              user_id: userData.uid,
              max_votes: $scope.newBoard.max_votes || 6,
              text_editing_is_private: $scope.newBoard.text_editing_is_private
            },
            function(error) {
              if (error) {
                $scope.loading = false;
              } else {
                redirectToBoard();
              }
            }
          );

          $scope.newBoard.name = '';
        };

        auth.createUserAndLog($scope.userId, callback);
      };

      $scope.changeBoardContext = function() {
        $scope.boardRef.update({
          boardContext: $scope.boardContext
        });
      };

      $scope.changeBoardName = function(newBoardName) {
        $scope.boardRef.update({
          boardId: newBoardName
        });

        modalService.closeAll();
      };

      $scope.updateSortOrder = function() {
        var updatedFilter =
          $window.location.origin +
          $window.location.pathname +
          '?sort=' +
          $scope.sortField +
          $window.location.hash;
        $window.history.pushState({ path: updatedFilter }, '', updatedFilter);
      };

      $scope.addNewColumn = function(name) {
        if (typeof name === 'undefined' || name === '') {
          return;
        }

        $scope.board.columns.push({
          value: name,
          id: utils.getNextId($scope.board)
        });

        var boardColumns = firebaseService.getBoardColumns($scope.userId);
        boardColumns.set(utils.toObject($scope.board.columns));

        modalService.closeAll();
      };

      $scope.changeColumnName = function(id, newName) {
        if (typeof newName === 'undefined' || newName === '') {
          return;
        }

        $scope.board.columns.map(function(column, index, array) {
          if (column.id === id) {
            array[index].value = newName;
          }
        });

        var boardColumns = firebaseService.getBoardColumns($scope.userId);
        boardColumns.set(utils.toObject($scope.board.columns));

        modalService.closeAll();
      };

      $scope.deleteColumn = function(column) {
        $scope.board.columns = $scope.board.columns.filter(function(_column) {
          return _column.id !== column.id;
        });

        var boardColumns = firebaseService.getBoardColumns($scope.userId);
        boardColumns.set(utils.toObject($scope.board.columns));
        modalService.closeAll();
      };

      $scope.deleteMessage = function(message) {
        $scope.messages.$remove(message);
        modalService.closeAll();
      };

      function addMessageCallback(message) {
        var id = message.key;
        angular.element($('#' + id)).scope().isEditing = true;
        new EmojiPicker();
        $('#' + id)
          .find('textarea')
          .focus();
      }

      $scope.addNewMessage = function(type) {
        $scope.messages
          .$add({
            text: '',
            creating: true,
            user_id: $scope.userUid,
            gif_url: '',
            type: {
              id: type.id
            },
            date: firebaseService.getServerTimestamp(),
            date_created: firebaseService.getServerTimestamp(),
            votes: 0
          })
          .then(addMessageCallback);
      };

      $scope.deleteCards = function() {
        $($scope.messages).each(function(index, message) {
          $scope.messages.$remove(message);
        });

        modalService.closeAll();
      };

      $scope.deleteBoard = function() {
        $scope.deleteCards();
        $scope.boardRef.ref.remove();

        modalService.closeAll();
        window.location.hash = '';
        location.reload();
      };

      $scope.submitOnEnter = function(event, method, data) {
        if (event.keyCode === 13) {
          switch (method) {
            case 'createNewBoard':
              if (!$scope.isBoardNameInvalid()) {
                $scope.createNewBoard();
              }

              break;
            case 'addNewColumn':
              if (data) {
                $scope.addNewColumn(data);
                $scope.newColumn = '';
              }

              break;
           case 'loadRandomBoard':
              if (data) {
                $scope.loadRandomBoard();
              }

              break;
          }
        }
      };

      $scope.cleanImportData = function() {
        $scope.import.data = [];
        $scope.import.mapping = [];
        $scope.import.error = '';
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
                        index = Math.floor(Math.random() * jsonList.length);
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

      /* globals Clipboard */
      new Clipboard('.import-btn');

      angular.element($window).bind('hashchange', function() {
        $scope.loading = true;
        $scope.userId = $window.location.hash.substring(1) || '';
        auth.logUser($scope.userId, getBoardAndMessages);
      });
    }

  ]);
