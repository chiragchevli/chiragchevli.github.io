$(function() {
  var container = $("#content"),
    $window,
    ui,
    buttons,
    width,
    height,
    landscape,
    $hint = $("#hint"),
    $credits = $("#credits"),
    mouse = new Two.Vector(),
    $embed = $("#embed"),
    embedding = false,
    interacting = false,
    $merchandise = $("#merchandise"),
    merchandising = false,
    $window = $(window);

  /**
   * Append Sound Generation to Animations
   */

  Sound.ready(function() {
    _.each(animations.list, function(a, i) {
      if (a.filename) {
        a.sounds = [];
      }
    });
    var silent = new Sound("assets/silent.mp3", function() {
      var enableAudio = function() {
        Sound.enabled = true;
        silent.play();
        $window.unbind("click", enableAudio);
      };
      $window.bind("click", enableAudio);
      initialize();
    });
  });

  function initialize() {
    animations.initializeSound();
    var firstRun = true;
    $window
      .bind("resize", function(e) {
        width = $window.width();
        height = $window.height();

        orientUserInterface(e);
      })
      // Disable scrolling on mobile
      .bind("touchstart touchmove touchend touchcancel", function(e) {
        if (
          Sound.enabled &&
          !(merchandising || $(e.target).hasClass("ios-app-store"))
        ) {
          e.preventDefault();
          return false;
        }
      })
      .bind("keydown", function(e, data) {
        if (e.metaKey || e.ctrlKey) {
          return;
        }

        e.preventDefault();
        var code = e.which || data;
        var index;

        switch (code) {
          // Q - P
          case 81:
            index = "0,0";
            break;
          case 87:
            index = "0,1";
            break;
          case 69:
            index = "0,2";
            break;
          case 82:
            index = "0,3";
            break;
          case 84:
            index = "0,4";
            break;
          case 89:
            index = "0,5";
            break;
          case 85:
            index = "0,6";
            break;
          case 73:
            index = "0,7";
            break;
          case 79:
            index = "0,8";
            break;
          case 80:
            index = "0,9";
            break;

          // A - L
          case 65:
            index = "1,0";
            break;
          case 83:
            index = "1,1";
            break;
          case 68:
            index = "1,2";
            break;
          case 70:
            index = "1,3";
            break;
          case 71:
            index = "1,4";
            break;
          case 72:
            index = "1,5";
            break;
          case 74:
            index = "1,6";
            break;
          case 75:
            index = "1,7";
            break;
          case 76:
            index = "1,8";
            break;

          // Z - M
          case 90:
            index = "2,0";
            break;
          case 88:
            index = "2,1";
            break;
          case 67:
            index = "2,2";
            break;
          case 86:
            index = "2,3";
            break;
          case 66:
            index = "2,4";
            break;
          case 78:
            index = "2,5";
            break;
          case 77:
            index = "2,6";
            break;
          // case 188:
          //   index = '2,7';
          //   break;

          // SPACE
          case 32:
            index = "3,0";
            break;
        }

        trigger(index);
        triggered();
      });

    $credits.css("display", "block");
    $hint
      .find(".message")
      .html("Press any key, A to Z or spacebar, and turn up speakers");

    two
      .bind("update", function() {
        TWEEN.update();
        animations.update();

        if (!ui) {
          return;
        }

        _.each(buttons.needsUpdate, updateButtons);

        ui.update();
      })
      .play();

    $window.trigger("resize");

    _.delay(function() {
      $("#lobby").fadeOut(triggerLogo);
      if (
        url.boolean(
          "kiosk"
        ) /*|| (window.localStorage && window.localStorage.visited)*/
      ) {
        triggered();
        return;
      } else if (/merchandise/gi.test(url.hash)) {
        $("#merchandise-button").trigger("click");
        return;
      }
      $hint.fadeIn();
      if (window.localStorage) {
        window.localStorage.visited = true;
      }
    }, 1000);
  }

  function orientUserInterface() {
    if (!ui) {
      return;
    }

    width = $window.width();
    height = $window.height();
    landscape = width >= height;
    var size = buttons.length;

    _.each(buttons, function(group, i) {
      var length = group.length;
      var w, h, w2, h2, x, y;

      if (landscape) {
        w = width / length;
        h = height / size;
      } else {
        w = width / size;
        h = height / length;
      }

      group.width = w;
      group.height = h;

      w /= 2;
      h /= 2;

      _.each(group, function(button, j) {
        var vertices = button.vertices;

        if (landscape) {
          x = (width * (j + 0.5)) / length;
          y = (height * (i + 0.5)) / size;
        } else {
          x = (width * (i + 0.5)) / size;
          y = (height * (j + 0.5)) / length;
        }

        vertices[0].set(-w, -h);
        vertices[1].set(w, -h);
        vertices[2].set(w, h);
        vertices[3].set(-w, h);

        button.translation.set(x, y);
        button.visible = true;
      });
    });
  }

  function triggerLogo() {
    if (window.localStorage && window.localStorage.visited) {
      return;
    }

    trigger("0,9");
    trigger("2,6");
    trigger("1,7");
    trigger("2,1");

    if (window.localStorage) {
      window.localStorage.visited = true;
    }
  }

  function trigger(hash, silent) {
    var animation = animations.map[hash];

    if (animation) {
      if (animation.playing()) {
        animation.clear();
      }
      animation.start(undefined, silent);
      if (window.ga) {
        window.ga("send", "event", "animation", "trigger", hash);
      }
    }
  }

  function triggered() {
    if (url.boolean("kiosk")) {
      startDemonstration();
      reloadOnIdle();
      interacting = true;
      return;
    }
    $hint.fadeOut();
    
  }
});
