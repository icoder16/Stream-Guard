const AWS = require("aws-sdk");

const rekognition = new AWS.Rekognition({
  region: process.env.AWS_REKOGNITION_REGION
});

// Start moderation job
exports.startModerationJob = async (bucket, key) => {
  const params = {
    Video: {
      S3Object: {
        Bucket: bucket,
        Name: key
      }
    },

    NotificationChannel: {
      RoleArn: process.env.REKOGNITION_ROLE_ARN,
      SNSTopicArn: process.env.REKOGNITION_SNS_ARN
    }
  };

  const res = await rekognition
    .startContentModeration(params)
    .promise();

  return res.JobId;
};

// Get moderation results
exports.getModerationResults = async (jobId, nextToken = null) => {
  const params = {
    JobId: jobId
  };

  if (nextToken) {
    params.NextToken = nextToken;
  }

  return rekognition
    .getContentModeration(params)
    .promise();
};
