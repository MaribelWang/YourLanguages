const multer  = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/') // 上传文件存储的路径
    },
    filename: function (req, file, cb) {
      const uniqueFileName = `${new Date().getTime()}_${file.originalname}`;
      cb(null, uniqueFileName);
    }
  });

  const upload = multer({ storage: storage });

  module.exports = upload;

