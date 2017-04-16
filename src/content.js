var domready = require('domready')
var scrapeMessage = require('./content/scrape-message.js')
var userIconMap = require('./content/user-icon-map.js')

var assign = require('object-assign')

var Parse = require('parse').Parse
Parse.initialize('d0AdLsVEqFJsTX9XTuoz3YXluUVZ6mbRdOWM7ea6', 'ywwkjYyVSODKbZkH0G5Y4Ly7IqwWfahsWOPYfrHI')

function selectedMessages () {
  var elements = document.querySelectorAll('.ssslack-selected')
  var iconMap = userIconMap()

  return Array.prototype.slice.call(elements).map(function (el) {
    var messageElement = el.parentNode

    var message = scrapeMessage(messageElement)
    return assign(message, { imageUrl: iconMap[message.sender] })
  })
}

function channelName () {
  var pathname = window.location.pathname
  return (/^\/(?:messages|archives)\/([^\/]+)/).exec(pathname)[1]
}

function teamName () {
  return document.querySelector('#header_team_name, #team_name').textContent.trim()
}

function teamId (argument) {
  return (/^(.+)\.slack\.com$/).exec(window.location.hostname)[1]
}

function setupOverlays () {
  var elements = document.querySelectorAll('.message')
  Array.prototype.slice.call(elements).forEach(function (messageElement) {
    var div = document.createElement('div')
    div.className = 'ssslack ssslack-overlay'

    div.addEventListener('click', function (e) {
      if (div.classList.contains('ssslack-selected')) {
        div.classList.remove('ssslack-selected')
      } else {
        div.classList.add('ssslack-selected')
      }
    })

    messageElement.appendChild(div)
  })
}

function start () {
  setupOverlays()

  var container = document.createElement('div')
  container.className = 'ssslack ssslack-buttons-container'

  var button = document.createElement('a')
  button.innerHTML = 'Post to ssslack'
  button.className = 'ssslack-submit-button'
  button.addEventListener('click', function (e) {
    e.preventDefault()
    e.stopPropagation()

    var messages = selectedMessages()
    if (messages.length === 0) {
      return
    }

    var Snippet = Parse.Object.extend('Snippet')
    var snippet = new Snippet()
    snippet.save({
      messages: messages,
      channel: channelName(),
      team: teamName(),
      team_id: teamId()
    }, {
      success: function (newSnippet) {
        var url = 'https://ssslack.parseapp.com/' + newSnippet.id
        self.port.emit("saved", url);
        finish()
      }
    })
  })

  var cancelButton = document.createElement('a')
  cancelButton.innerHTML = '×'
  cancelButton.className = 'ssslack-cancel-button'

  cancelButton.addEventListener('click', function (e) {
    e.preventDefault()
    finish()
  })

  container.appendChild(button)
  container.appendChild(cancelButton)
  document.body.appendChild(container)
}

function finish () {
  var elements = document.querySelectorAll('.ssslack')
  Array.prototype.slice.call(elements).forEach(function (node) {
    node.parentNode.removeChild(node)
  })
}

domready(function () {
  start()
})
