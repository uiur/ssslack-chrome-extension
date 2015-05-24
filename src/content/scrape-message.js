var purify = require('dompurify')

module.exports = function scrapeMessage (element) {
  return {
    content: content(element),
    sender: element.querySelector('.message_sender').textContent.trim(),
    timestamp: element.querySelector('.timestamp').textContent.trim()
  }
}

function content (element) {
  if(element.parentElement.classList.contains('file_upload')){
    var html = element.querySelector('.msg_inline_holder').innerHTML.trim()
  }else{
    var html = element.querySelector('.message_content').innerHTML.trim()
  }

  return purify.sanitize(html, {
    ALLOWED_TAGS: ['a', 'img'],
    ALLOWED_ATTR: ['href', 'src'],
    ALLOW_DATA_ATTR: false
  })
}
