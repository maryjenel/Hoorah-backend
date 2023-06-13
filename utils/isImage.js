exports.isImage = (mimetype) => {
  const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png']

  return acceptedImageTypes.includes(mimetype)
}
