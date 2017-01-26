def updateExisting(src, dest):
  for key in src:
    if key in dest:
      dest[key] = src[key]
