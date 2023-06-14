const ffmpeg = require('fluent-ffmpeg')

exports.compressVideo = ({videoPath, outputPathh, originalBitrate = 1000, callback}) => {
  // Input video file path
  // Output video file path
  const outputPath = `tmp/compressed_${outputPathh}.mp4`
  const desiredBitrate = originalBitrate / 3 // Desired bitrate in Kbps
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
