(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
  * domready (c) Dustin Diaz 2014 - License MIT
  */
!function (name, definition) {

  if (typeof module != 'undefined') module.exports = definition()
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
  else this[name] = definition()

}('domready', function () {

  var fns = [], listener
    , doc = document
    , hack = doc.documentElement.doScroll
    , domContentLoaded = 'DOMContentLoaded'
    , loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState)


  if (!loaded)
  doc.addEventListener(domContentLoaded, listener = function () {
    doc.removeEventListener(domContentLoaded, listener)
    loaded = 1
    while (listener = fns.shift()) listener()
  })

  return function (fn) {
    loaded ? setTimeout(fn, 0) : fns.push(fn)
  }

});

},{}],2:[function(require,module,exports){
module.exports = function copy (str) {
  var textArea = document.createElement('textarea')
  textArea.style.cssText = 'position:absolute;left:-100%'

  document.body.appendChild(textArea)

  textArea.value = str
  textArea.select()
  document.execCommand('copy')

  document.body.removeChild(textArea)

  return str
}

},{}],3:[function(require,module,exports){
var domready = require('domready')
var copy = require('./chrome-clip-copy.js')

function selectedMessages () {
  var elements = document.querySelectorAll('.ssslack-selected')

  return Array.prototype.slice.call(elements).map(function (el) {
    var messageElement = el.parentNode

    return {
      content: messageElement.querySelector('.message_content').textContent.trim(),
      sender: messageElement.querySelector('.message_sender').textContent.trim()
    }
  })
}

function start () {
  var elements = document.querySelectorAll('.message')
  Array.prototype.slice.call(elements).forEach(function (messageElement) {
    var div = document.createElement('div')
    div.className = 'ssslack'

    div.addEventListener('click', function (e) {
      var messageElement = e.target.parentNode

      if (div.classList.contains('ssslack-selected')) {
        div.classList.remove('ssslack-selected')
      } else {
        div.classList.add('ssslack-selected')
      }

      var text = selectedMessages().map(function (message) {
        return message.sender + ': ' + message.content
      }).join('\n')

      copy(text)
    })

    messageElement.appendChild(div)
  })
}

if ((/slack\.com/).test(window.location.hostname)) {
  domready(function () {
    setTimeout(function () {
      start()
    }, 5000)
  })
}

},{"./chrome-clip-copy.js":2,"domready":1}]},{},[3]);
