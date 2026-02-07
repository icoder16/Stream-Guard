const s3 = require("../config/aws");

// Generate temporary streaming URL
exports.getSignedUrl = async (key) => {
  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    Expires: 60 * 60 // 1 hour
  };

  return s3.getSignedUrlPromise("getObject", params);
};
