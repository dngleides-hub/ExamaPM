const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDirs = {
  covers: path.join(__dirname, '../public/uploads/covers'),
  pdfs: path.join(__dirname, '../public/uploads/pdfs')
};

Object.values(uploadDirs).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'cover') {
      cb(null, uploadDirs.covers);
    } else if (file.fieldname === 'pdfFile') {
      cb(null, uploadDirs.pdfs);
    } else {
      cb(new Error('Campo de arquivo inválido'), null);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'cover') {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens JPEG, JPG e PNG são permitidas para a capa'), false);
    }
  } else if (file.fieldname === 'pdfFile') {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos PDF são permitidos'), false);
    }
  } else {
    cb(new Error('Campo de arquivo inválido'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760
  },
  fileFilter: fileFilter
});

module.exports = upload;