// lol
function onError(e) {
  console.error(e);
}

// select the node that will be observed for mutations
const targetNodeFeed = document.body;
// options for the observer
const config = { attributes: true, childList: true, subtree: true };
// Callback function to execute when mutations are observed
function twetchUnmute(userId) {
  let posts = $("div[id^='post']");
  posts.find("a[href='" + userId + "']")
  .parent()
  .parent()
  .show();
}

function twetchMute() {
  let posts = $("div[id^='post']");
  // remove posts from your mute list
  for (var userId in userList) {
    posts
      .find("a[href='" + userList[userId] + "']")
      .parent()
      .parent()
      .hide();
  }
}

// pasted from stack overflow
const callback = function (mutationsList, observer) {
  // check if you are on a profile page
  if (window.location.pathname.match("u/*")) {
    // add the button to the DOM
    if (!document.getElementById("muteButton")) {
      // create the button
      var r = $("<input/>").attr({
        type: "button",
        id: "muteButton",
        value: !userList.includes(window.location.pathname) ? "Mute" : "Unmute"
      });

      $('button span:contains("Following")').parent().parent().append(r);
      $('button span:contains("Follow")').parent().parent().append(r);

      // assign the callback
      $("#muteButton").click(function (cb) {
        const uId = window.location.pathname;
        if (!userList.includes(uId)) {
          $('#muteButton').attr('value', "Unmute");
          browser.runtime.sendMessage({ mute: uId });
          userList.push(uId);
        } else {
          $('#muteButton').attr('value', "Mute");
          twetchUnmute(uId);
          browser.runtime.sendMessage({ unmute: uId });
          const index = userList.indexOf(uId);
          if (index > -1) {
            userList.splice(index, 1);
          }
        }
      });
    }
  }
  twetchMute();
};

// initiate mute powers
$(document).ready(function () {
  browser.storage.local.get().then(function (result) {
    if (!result["list"]) {
      browser.runtime.sendMessage("init");
      userList = [];
    } else {
      userList = result["list"];
      twetchMute();
    }
  });
  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(callback);
  // Start observing the target node for configured mutations
  observer.observe(targetNodeFeed, config);
});
