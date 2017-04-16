function imageUrl (messageElement) {
  var imageElement = messageElement.querySelector('.member_image')

  if (imageElement) {
    return imageElement.style['background-image'].replace(/(^url\("?)|("?\))$/g, '')
  } else {
    return null
  }
}

module.exports = function scrapeUserIconMap () {
  var messages = document.querySelectorAll('.message')

  return Array.prototype.slice.call(messages).map(function (message) {
    var senderElement = message.querySelector('.message_sender')
    var sender = ''
    if (senderElement) {
      sender = senderElement.textContent.trim()
    }

    return {
      sender: sender,
      image: imageUrl(message)
    }
  }).reduce(function (prev, current) {
    if (current.image && !prev[current.sender]) {
      prev[current.sender] = current.image
    }

    return prev
  }, {})
}
