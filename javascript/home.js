const player = $("#player");
$("#circle").attr("class", "play");
$("#from_pause_to_play")[0].beginElement();

player[0].ontimeupdate = function () {
  minutes = parseInt(player[0].currentTime / 60);
  seconds = parseInt(player[0].currentTime % 60);
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  $(".music-data .time-stamp").text(minutes + " : " + seconds);
  reqwidth = player[0].currentTime / player[0].duration;
  $(".music-body .progress-bar .inner").css("width", reqwidth * 100 + "%");
};

$(".search-bar form").submit(function (e) {
  e.preventDefault();
  $(".loading").addClass("active");
  q = $(".search-bar input").val();
  $(".search-results").find(".search-result:not('.hidden')").remove();
  if (q != "") {
    thisForm = $(this);
    $.ajax({
      type: "GET",
      url: thisForm.attr("action") + q,
      success: function (response) {
        response.results.forEach(function (result) {
          item = $(".search-result.hidden").clone();
          item.removeClass("hidden");
          item.find("img").attr("src", result.thumbnails[0]);
          item.find(".title").text(result.title);
          item.attr("data-id", result.id);
          $(".search-results").append(item);
        });
        $(".loading").removeClass("active");
        $(".search-results").addClass("active");
      },
    });
  }
});

function playsong(e) {
  $(".loading").addClass("active");
  video_id = e.attr("data-id");
  $(".search-results").removeClass("active");
  $(".search-results").find(".search-result:not('.hidden')").remove();
  $.ajax({
    type: "GET",
    url: "/api/getsong/?q=" + video_id,
    success: function (response) {
      setSong(response);
    },
  });
}

function loadRecommendations(video_id) {
  $.ajax({
    url: "/api/recommendations",
    type: "get",
    data: {
      id: video_id,
    },
    success: function (response) {
      if (response.results.length != 0) {
        response.results.forEach((card) => {
          new_card = $(".recommendations .recomm-result.hidden").clone();
          new_card.removeClass("hidden");
          new_card.attr("data-id", card.videoId);
          new_card.find("img").attr("src", card.thumbnail);
          new_card.find(".title").text(card.title);
          $(".recommendations").append(new_card);
        });
        $(".recommendations").css("display", "block");
      }
    },
    error: function (xhr) {},
  });
}

function setSong(response) {
  url = response.playurl;
  video_id = response.video_id;
  title = response.title;
  description = response.description;
  player.attr("src", response.playurl);
  $(".music-body .thumbnail-holder img").attr(
    "src",
    `http://img.youtube.com/vi/${video_id}/maxresdefault.jpg`
  );
  $(".music-body .song-name").text(title);
  if (description.length > 255) {
    description = description.slice(0, 250) + "...";
  }
  $(".thumbnail-holder .bio p").text(description);
  $(".loading").removeClass("active");
  $("#circle").attr("class", "");
  $("#from_play_to_pause")[0].beginElement();
  player[0].play();
  loadRecommendations(video_id);
}

function play_pause() {
  if (player[0].paused) {
    $("#circle").attr("class", "");
    $("#from_play_to_pause")[0].beginElement();
    player[0].play();
  } else {
    $("#circle").attr("class", "play");
    $("#from_pause_to_play")[0].beginElement();
    player[0].pause();
  }
}

$(".progress-bar").on("click", function (e) {
  if (player[0].src != ""){
    reqSeek = e.offsetX / e.target.offsetWidth;
    player[0].currentTime = reqSeek * player[0].duration;
  } 
});

$("body").click(function () {
  $(".search-results").removeClass("active");
  $(".search-results").find(".search-result:not('.hidden')").remove();
  $(".query-results").removeClass("active");
});

$(".search-bar form input[type='text']").on("input", function (e) {
  search(e.target.value);
});

function set_query(e) {
  var data = e.target.innerText;
  $(".search-bar form input[type='text']").val(data);
  $(".search-bar form").submit();
}

function add_query(list) {
  $(".query-results").html("");
  list.forEach((li) => {
    query = $("<div>");
    query[0].onclick = set_query;
    query.addClass("query").html(li[0]).appendTo(".query-results");
  });
  $(".query-results").addClass("active");
}

function search(q) {
  $.ajax({
    url: "/api/search",
    type: "get",
    data: {
      q: q,
    },
    success: function (response) {
      if (response.data != "") {
        x = response.data.slice(19, response.data.length - 1);
        data = JSON.parse(x)[1];
        add_query(data);
      } else {
        $(".query-results").html("");
        $(".query-results").removeClass("active");
      }
    },
    error: function (xhr) {},
  });
}


window.onkeydown = (e) => {
  if ($(".search-bar input[name='q']")[0] !== document.activeElement) {
    if (e.keyCode == 32) {
      play_pause();
    } else if (e.keyCode == 37) {
      player[0].currentTime -= 5;
    } else if(e.keyCode == 39){
      player[0].currentTime += 5;
    }
  }
};