browser.runtime.onMessage.addListener(notify);

function notify(uId) {

    console.log('message recieved');
    if(uId === "init") {
        browser.storage.local.set({'list': []})
    } else {
        for(var key in uId) {
            if(key === 'mute') {
                browser.storage.local.get().then(function (result) {
                    var tempResult = result['list']
                    tempResult.push(uId[key]);
                    console.log(tempResult)
                    browser.storage.local.set({'list': tempResult});
                });
            } else {
                browser.storage.local.get().then(function (result) {
                    var tempResult = result['list']
                    const index = tempResult.indexOf(uId[key]);
                    if (index > -1) {
                        tempResult.splice(index, 1);
                    }
                    console.log(tempResult)
                    browser.storage.local.set({'list': tempResult});
                });
            }
        }

    }
  console.log(uId);
}
