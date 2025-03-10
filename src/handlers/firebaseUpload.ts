import multer from 'multer'
import admin from '@/configs/firebase-admin'

const upload = multer({ storage: multer.memoryStorage() })
const bucket = admin.storage().bucket()

export const singleUpload = async (
  file: any,
  destination: string
): Promise<null | { name: string; minetype: string; url: string }> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return resolve(null)
    }

    const originalname = decodeURIComponent(file.originalname)

    const blob = bucket.file(
      `${destination}/${originalname.split('.')[0]}_${new Date().getTime()}.${originalname.split('.').reverse()[0]}`
    )
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    })

    blobStream.on('error', (err) => {
      console.error(err)
      reject(err)
    })

    blobStream.on('finish', async () => {
      await blob.makePublic()
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      resolve({
        name: originalname,
        minetype: file.mimetype,
        url: publicUrl
      })
    })

    blobStream.end(file.buffer)
  })
}

export const multipleUpload = async (files: any, destination: string) => {
  const promises = files.map(async (file: any) => {
    return await singleUpload(file, destination)
  })

  const urls = await Promise.all(promises)

  return urls
}

export const deleteFileStorageByFileName = async (destination: string, fileName: string) => {
  try {
    await bucket.file(`${destination}/${fileName}`).delete()
  } catch (error: any) {
    console.log(error.message)
  }
}

export const deleteFileStorageByUrl = async (url: string) => {
  try {
    if (url) {
      const filePath = url.split(`https://storage.googleapis.com/${bucket.name}/`)[1]
      await bucket.file(filePath).delete()
    }
  } catch (error: any) {
    console.log(error.message)
  }
}

export const deleteFolderStorage = async (destination: string) => {
  try {
    await bucket.deleteFiles({ prefix: destination })
  } catch (error: any) {
    console.log(error.message)
  }
}

export const getFileUrls = async (destination: string) => {
  try {
    const [files] = await bucket.getFiles({
      prefix: destination
      // delimiter: "/",
    })

    const imageUrls = []

    for (const file of files) {
      const [metadata] = await file.getMetadata()

      if (metadata.contentType && metadata.contentType.startsWith('image/')) {
        await file.makePublic()

        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`
        imageUrls.push(publicUrl)
      }
    }

    return imageUrls
  } catch (error) {
    console.log(error)
  }
}

export default upload
