const { aws4Interceptor } = require('aws4-axios')
const axios = require('axios')
const fs = require('fs')

const FeedItem = require('../models/FeedItem')
const db = require('../db')
const { compressVideo } = require('./Video')
const { isVideo } = require('../utils/isImage')

exports.postFeedItem = async (req, res, next) => {
  // get the file that was uploaded
  const file = req.files.media

  const { description } = req.body
  const split = file.name.split('.')
  split.pop()
  const fileName = split.join('.')
  // upload to s3 bucket
  if (isVideo(file.name)) {
    compressVideo({videoPath: file, outputPathh: req.files.media.name, callback: async function (outputPath) {
      fs.readFile(outputPath, async (err, data) => {
        if (err) {
          console.error('Error reading the MP4 file:', err)
        } else {
          const url = await uploadFileToS3(data, file)
          try {
            // create new feed item with filename and URL
            const feedItem = new FeedItem({ fileName, url, description })
            // insert into postgres DB
            await feedItem.createFeedItem(feedItem)
            res.send(feedItem)
          } catch (error) {
            const errorToThrow = new Error()
            switch (error?.code) {
              case '23505':
                errorToThrow.message = "FeedItem already exists"
                errorToThrow.statusCode = 403
                break
              default:
                errorToThrow.message = error.message
                errorToThrow.statusCode = 500
            }
            next(errorToThrow)
          }
        }
      })
    }})
  } else {
    // we have to readfile to process correct image
    // https://github.com/richardgirges/express-fileupload/issues/139
    fs.readFile(file.tempFilePath, async (err, data) => {
      if (err) {
        console.error('Error reading the MP4 file:', err)
      } else {
        const url = await uploadFileToS3(data, file)
        try {
          // create new feed item with filename and URL
          const feedItem = new FeedItem({ fileName, url, description })
          // insert into postgres DB
          await feedItem.createFeedItem(feedItem)
          res.send(feedItem)
        } catch (error) {
          const errorToThrow = new Error()
          switch (error?.code) {
            case '23505':
              errorToThrow.message = "FeedItem already exists"
              errorToThrow.statusCode = 403
              break
            default:
              errorToThrow.message = error.message
              errorToThrow.statusCode = 500
          }
          next(errorToThrow)
        }
      }
    })
  }
}

exports.getFeed = async (request, response, next) => {
  try {
    await db.query(
      'SELECT * FROM feeditem ORDER BY id ASC',
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
      }
    )
  } catch (error) {
    console.log({ error })
    throw error
  }
}

const uploadFileToS3 = async function (aFile, orgFile) {
  let returnUrl = ''
  const interceptor = aws4Interceptor({
    options: {
      region: 'us-east-2',
      service: 's3'
    },
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_PRIVATE_ACCESS_KEY
    }
  })
  axios.interceptors.request.use(interceptor)
  const options = {
    headers: {
      accept: 'application/json',
      'Accept-Language': 'en-US,en;q=0.8',
      'Content-Type': 'multipart/form-data'
    }
  }
  // URL cant have spaces in it
  const fileName = orgFile.name.replaceAll(' ', '_')
  const url = `https://s3.us-east-2.amazonaws.com/hoorah/${fileName}`
  await axios.put(url, aFile, options).then(res => {
    returnUrl = res.config.url
  })
  return returnUrl
}
