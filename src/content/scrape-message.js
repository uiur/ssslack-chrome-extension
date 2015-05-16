var sanitize = require('sanitize-html')
module.exports = function scrapeMessage (element) {
  var imageElement = element.querySelector('.member_image')

  var imageUrl = null
  if (imageElement) {
    imageUrl = imageElement.style['background-image'].replace(/(^url\()|(\))$/g, '')
  }

  return {
    content: content(element),
    sender: element.querySelector('.message_sender').textContent.trim(),
    timestamp: element.querySelector('.timestamp').textContent.trim(),
    imageUrl: imageUrl
  }
}

function content (element) {
  var html = element.querySelector('.message_content').innerHTML.trim()
  return sanitize(html)
}
