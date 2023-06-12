const ffmpeg = require('fluent-ffmpeg')

exports.compressVideo = (videoPath, outputPathh, callback) => {
  // Input video file path
  // Output video file path
  const outputPath = `tmp/compressed_${outputPathh}.mp4`
  const originalBitrate = 1000 // Original bitrate in Kbps
  const desiredBitrate = originalBitrate / 4 // Desired bitrate in Kbps
  // Compress the video
  console.log(videoPath.tempFilePath)
  ffmpeg(videoPath.tempFilePath)
    .outputOptions('-b:v', `${desiredBitrate}k`)
    .save(outputPath)
    .on('end', () => {
      console.log('Video compression completed.')

      callback(outputPath)
    })
    .on('error', err => {
      console.error('An error occurred during video compression:', err)
    })
}
