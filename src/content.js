var domready = require('domready')
var sanitize = require('sanitize-html')
var copy = require('chrome-clip-copy')

var Parse = require('parse').Parse
Parse.initialize('d0AdLsVEqFJsTX9XTuoz3YXluUVZ6mbRdOWM7ea6', 'ywwkjYyVSODKbZkH0G5Y4Ly7IqwWfahsWOPYfrHI')

function selectedMessages () {
  var elements = document.querySelectorAll('.ssslack-selected')

  return Array.prototype.slice.call(elements).map(function (el) {
    var messageElement = el.parentNode
    var imageElement = messageElement.querySelector('.member_image')

    var imageUrl = null
    if (imageElement) {
      imageUrl = imageElement.style['background-image'].replace(/(^url\()|(\))$/g, '')
    }

    return {
      content: messageContent(messageElement),
      sender: messageElement.querySelector('.message_sender').textContent.trim(),
      timestamp: messageElement.querySelector('.timestamp').textContent.trim(),
      imageUrl: imageUrl
    }
  })
}

function messageContent (messageElement) {
  var html = messageElement.querySelector('.message_content').innerHTML.trim()
  return sanitize(html)
}

function logText () {
  return selectedMessages().map(function (message) {
    return message.sender + ': ' + message.content
  }).join('\n')
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

      var text = logText()

      copy(text)
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
    snippet.save({ messages: selectedMessages() }, {
      success: function (newSnippet) {
        window.open('https://ssslack.parseapp.com/' + newSnippet.id)
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
