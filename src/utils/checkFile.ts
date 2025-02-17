export const checkFilesType = (files: any, types: string[]) => {
  if (!files || files.length == 0)
    return {
      success: false,
      message: 'Không tìm thấy file nào.'
    }

  let isValidType = true
  files.forEach((file: any) => {
    if (!types.some((type) => file.mimetype.includes(type))) {
      isValidType = false
      return
    }
  })

  if (!isValidType)
    return {
      success: false,
      message: `Các file phải là ${types.join(',')}.`
    }

  return {
    success: true,
    message: 'Thành công.'
  }
}

export const checkFilesSize = (files: any, maxSize: number) => {
  if (!files || files.length == 0)
    return {
      success: false,
      message: 'Không tìm thấy file nào.'
    }

  let isValidType = true
  files.forEach((file: any) => {
    if (file.size > maxSize) {
      isValidType = false
      return
    }
  })

  if (!isValidType)
    return {
      success: false,
      message: `Các file phải có kích thước tối đa ${maxSize / (1024 * 1024)}mb.`
    }

  return {
    success: true,
    message: 'Thành công.'
  }
}
