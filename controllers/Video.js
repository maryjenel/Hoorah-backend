const ffmpeg = require('fluent-ffmpeg')

exports.compressVideo = (videoPath, outputPathh) => {
  // Input video file path
  // Output video file path
  const outputPath = `compressed_${outputPathh}.mp4`

  // Set the target bitrate
  const targetBitrate = '2M'

  // Compress video bitrate
  ffmpeg(videoPath.tempFilePath)
    .videoBitrate(targetBitrate)
    .output(outputPath)
    .on('end', () => {
      console.log('Compression complete!')
    })
    .on('error', (err) => {
      console.error('Error compressing video:', err)
    })
    .run()
}
