exports.isImage = (url) => {
  return /\.(jpg|jpeg|png|webp|avif|gif|JPG|svg)$/.test(url)
}
