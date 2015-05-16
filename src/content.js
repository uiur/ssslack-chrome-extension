var domready = require('domready')
var copy = require('chrome-clip-copy')
var scrapeMessage = require('./content/scrape-message.js')

var Parse = require('parse').Parse
Parse.initialize('d0AdLsVEqFJsTX9XTuoz3YXluUVZ6mbRdOWM7ea6', 'ywwkjYyVSODKbZkH0G5Y4Ly7IqwWfahsWOPYfrHI')

function selectedMessages () {
  var elements = document.querySelectorAll('.ssslack-selected')

  return Array.prototype.slice.call(elements).map(function (el) {
    var messageElement = el.parentNode
    return scrapeMessage(messageElement)
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

function start () {
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

  var container = document.createElement('div')
  container.className = 'ssslack ssslack-buttons-container'

  var button = document.createElement('a')
  button.innerHTML = 'Post'
  button.setAttribute('href', 'https://gist.github.com/')
  button.setAttribute('target', '_blank')
  button.addEventListener('click', function (e) {
    e.preventDefault()
    e.stopPropagation()

    var Snippet = Parse.Object.extend('Snippet')
    var snippet = new Snippet()
    snippet.save({
      messages: selectedMessages(),
      channel: channelName(),
      team: teamName(),
      team_id: teamId()
    }, {
      success: function (newSnippet) {
        var url = 'https://ssslack.parseapp.com/' + newSnippet.id
        copy(url)
        window.open(url)
        finish()
      }
    })
  })

  var cancelButton = document.createElement('a')
  cancelButton.innerHTML = 'Cancel'
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
