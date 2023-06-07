
const db = require('../db')
// User constructor
function FeedItem ({ fileName, url, description }) {
  this.fileName = fileName
  this.url = url
  this.description = description
}
// add a createFeed method to the prototype
FeedItem.prototype.createFeedItem = async function (feedItem) {
  const { fileName, url, description } = feedItem
  console.log(
    'url in post feedItem = ' +
      url +
      ' and name = ' +
      fileName +
      ' and description = ' +
      description
  )
  try {
    const sqlText =
      'INSERT INTO feeditem(title, media, description) VALUES($1, $2, $3)'
    const values = [fileName, url, description]
    const request = await db.query(sqlText, values)
    return request
  } catch (error) {
    console.log({ error })
    throw error
  }
}

module.exports = FeedItem
