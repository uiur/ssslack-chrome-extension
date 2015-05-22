var urlbarbutton = require("urlbarbutton");
var tabs = require("sdk/tabs");
var clipboard = require("sdk/clipboard");
var { attach, detach } = require('sdk/content/mod');
var { Style } = require('sdk/stylesheet/style');
var data = require('sdk/self').data;

var button = urlbarbutton({
  id : 'foobar-button',
  image : data.url('images/icon-16.png'),
  onClick : function(){
    var worker = tabs.activeTab.attach({
      contentScriptFile: './content.js'
    })
    worker.port.on("saved", function(url) {
      clipboard.set(url);
      tabs.open(url);
    });
  }
});

button.setAttribute('hidden', true);
button.setAttribute('style', 'margin: 0px;padding: 0px;')

tabs.on('ready', function(tab){
  if(/slack\.com/.test(tab.url)){
    attach(Style({uri: './content.css'}), tab)
    button.setAttribute('hidden', false);
  }else{
    button.setAttribute('hidden', true);
  }
})
