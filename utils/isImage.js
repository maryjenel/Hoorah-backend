exports.isImage = (mimetype) => {
  const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png']

  return acceptedImageTypes.includes(mimetype)
}


exports.isVideo = (url) => {
  return /\.(MP4|mp4|MOV|mov)$/.test(url)
  }