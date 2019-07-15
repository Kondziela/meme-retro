'use strict';

angular
  .module('fireideaz')
  .service('ModalService', ['ngDialog', 'MemeService', '$rootScope', function(ngDialog, memeService, $rootScope) {
    return {
      openAddNewColumn: function(scope) {
        ngDialog.open({
          template: 'addNewColumn',
          className: 'ngdialog-theme-plain',
          scope: scope
        });
      },
      openAddNewBoard: function(scope) {
        ngDialog.open({
          template: 'addNewBoard',
          className: 'ngdialog-theme-plain',
          scope: scope
        });
      },
      openDeleteCard: function(scope) {
        ngDialog.open({
          template: 'deleteCard',
          className: 'ngdialog-theme-plain',
          scope: scope
        });
      },
      openDeleteEmbed: function(scope) {
        ngDialog.open({
          template: 'deleteEmbed',
          className: 'ngdialog-theme-plain',
          scope: scope
        });
      },
      openDeleteColumn: function(scope) {
        ngDialog.open({
          template: 'deleteColumn',
          className: 'ngdialog-theme-plain',
          scope: scope
        });
      },

      openMergeCards: function(scope) {
        ngDialog.open({
          template: 'mergeCards',
          className: 'ngdialog-theme-plain',
          scope: scope
        });
      },
       openImportBoard: function(scope) {
        scope.cleanImportData();
        ngDialog.open({
          template: 'importCards',
          className: 'ngdialog-theme-plain bigDialog',
          scope: scope
        });
      },
      openDeleteBoard: function(scope) {
        ngDialog.open({
          template: 'deleteBoard',
          className: 'ngdialog-theme-plain danger',
          scope: scope
        });
      },
      openDeleteCards: function(scope) {
        ngDialog.open({
          template: 'deleteCards',
          className: 'ngdialog-theme-plain danger',
          scope: scope
        });
      },
      openVoteSettings: function(scope) {
        ngDialog.open({
          template: 'voteSettings',
          className: 'ngdialog-theme-plain',
          scope: scope
        });
      },
      openCardSettings: function(scope) {
        ngDialog.open({
          template: 'cardSettings',
          className: 'ngdialog-theme-plain',
          scope: scope
        });
      },
      openGifDialog: function(scope) {
        ngDialog.open({
          template: 'gifSearch',
          className: 'ngdialog-theme-plain bigDialog',
          scope: scope
        });
      },
      openMemeDialog: function(scope) {
        ngDialog.open({
          template: 'memeSearch',
          className: 'ngdialog-theme-plain bigDialog',
          scope: scope
        });
      },
      closeAll: function() {
        ngDialog.closeAll();
      },
      loadRandomGif: function (tile) {
        var jsonList = [
          {"text": "The best sprint ever", "tag": "happiness", "id": 1},
          {"text": "The best sprint in my life", "tag": "joy", "id": 1},
          {"text": "I was crying  while deploying", "tag": "cry", "id": 2},
          {"text": "I am crying such a good sprint ended", "tag": "sweet", "id": 1},
          {"text": "I am crying from happiness that the sprint ended", "tag": "exhausted", "id": 2},
          {"text": "I love my team", "tag": "kissy", "id": 1},
          {"text": "I love working with you", "tag": "heart", "id": 1},
          {"text": "I hate some client ideas", "tag": "banana", "id": 2},
          {
            "text": "Priority of stories needs to be kept in mind as at the very start of sprint we were working on almost all stories and also it leads to more number of pull requests in open",
            "tag": "rabbit",
            "id": 2
          },
          {
            "text": "I am disappointed because ... did whole story before sprint started",
            "tag": "hamtaro",
            "id": 2
          },
          {
            "text": "I am amazed because ... did whole story before sprint started",
            "tag": "respect",
            "id": 1
          },
          {
            "text": "Thanks ... that you haven't forced us to make more improvements!!",
            "tag": "relief",
            "id": 1
          },
          {"text": "Thank you ... for help with GUI!!", "tag": "thanks", "id": 1},
          {"text": "Why am I still here??", "tag": "pokemon", "id": 2},
          {"text": "3x WHY????!!", "tag": "miniones", "id": 2},
          {
            "text": "The story with ... was underestimated and because of it we couldn't deliver two another stories",
            "tag": "maharaja",
            "id": 2
          },
          {
            "text": "Some of us dont read US carefully and then the story couldn't be delivered because of the lack of some crucial functionality",
            "tag": "mrbean",
            "id": 2
          },
          {"text": "You are so nice I can't live without you <3", "tag": "like", "id": 1},
          {"text": "I can't imagine a better team <3", "tag": "pinguin", "id": 1},
          {"text": "The working with ... was so demotivating...", "tag": "seals", "id": 2},
          {"text": "I love working with ...", "tag": "monkey", "id": 1},
          {
            "text": "We shouldn't get the story which is blocked by the one from the previous sprint",
            "tag": "disappointment",
            "id": 2
          },
          {"text": "I need vacations after that sprint", "tag": "panda", "id": 2},
          {"text": "The DLs ignore me. I can't continue with stories", "tag": "kick", "id": 2},
          {"text": "As many jenkins failures this sprint as drops in sea", "tag": "death", "id": 2},
          {"text": "... we miss you.... ;<", "tag": "sombrero", "id": 2},
          {"text": "... thanks for super KT session!", "tag": "batman", "id": 1},
          {"text": "... thanks for supporting ...!", "tag": "support", "id": 1},
          {"text": "Lets code more instead of this retro meeting", "tag": "holmes", "id": 2},
          {"text": "... the Confluence Master!!", "tag": "agent", "id": 1},
          {"text": "Improvement again?!", "tag": "nahi", "id": 2},
          {"text": "The story was overestimated", "tag": "super", "id": 1},
          {"text": "The story was underestimated", "tag": "weep", "id": 2},
          {"text": "The current velocity is killing", "tag": "jumping", "id": 2}];
        var randomIndex = Math.floor(Math.random() * jsonList.length);
        var jsonObject = jsonList[randomIndex];
        memeService.getGifsUrlsByQuery(jsonObject.tag, 1).then(function(urls) {
          tile.gif_url = urls[0];
          tile.text = jsonObject.text;
          $rootScope.$broadcast('imageAdd', tile);
        });
      }
    };
  }]);
