const s3 = require("../config/aws");
const fs = require("fs");

exports.uploadToS3 = async (fileOrPath, fileName, contentType = null) => {

  let body;
  let type;

  // Case 1: From multer (buffer)
  if (fileOrPath.buffer) {
    body = fileOrPath.buffer;
    type = fileOrPath.mimetype;
  }
  // Case 2: From FFmpeg (file path)
  else if (typeof fileOrPath === "string") {
    body = fs.createReadStream(fileOrPath);
    type = contentType || "video/mp4";
  }
  else {
    throw new Error("Invalid file input for S3 upload");
  }

  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: fileName,
    Body: body,
    ContentType: type
  };

  return s3.upload(params).promise();
};
