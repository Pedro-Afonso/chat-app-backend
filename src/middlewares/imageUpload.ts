import multer from 'multer'

const storage = multer.diskStorage({})

const imageUpload = multer({ storage })

export { imageUpload }
