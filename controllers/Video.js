const ffmpeg = require('fluent-ffmpeg')

exports.compressVideo = (videoPath, outputPathh, callback) => {
  // Input video file path
  // Output video file path
  const outputPath = `tmp/compressed_${outputPathh}.mp4`

  // Define the desired bitrate for compression (e.g., 1/5th of the original bitrate)
  const originalBitrate = 1000 // Original bitrate in Kbps
  const desiredBitrate = originalBitrate / 5 // Desired bitrate in Kbps
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
