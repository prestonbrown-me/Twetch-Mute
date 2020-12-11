browser.storage.local.get().then(function (result) {
    if (!result["list"]) {
      browser.runtime.sendMessage("init");
      userList = [];
    } else {
        const userList = result["list"];

        for(const userItem of userList){
            $("#muteList").append("<li><a href='http://twetch.app"+ userItem + "'>"+ userItem + "</a></li>")
        }
    }
  });