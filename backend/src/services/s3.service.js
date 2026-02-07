const s3 = require("../config/aws");

exports.uploadToS3 = async (file, fileName) => {
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype
  };

  return s3.upload(params).promise();
};
