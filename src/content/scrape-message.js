var purify = require('dompurify')

module.exports = function scrapeMessage (element) {
  return {
    content: content(element),
    sender: element.querySelector('.message_sender').textContent.trim(),
    timestamp: element.querySelector('.timestamp').textContent.trim()
  }
}

function content (element) {
  var html = element.querySelector('.message_content').innerHTML.trim()

  return purify.sanitize(html, {
    ALLOWED_TAGS: ['a'],
    ALLOWED_ATTR: ['href'],
    ALLOW_DATA_ATTR: false
  })
}
