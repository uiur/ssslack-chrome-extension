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

domready(function () {
  start()
})
