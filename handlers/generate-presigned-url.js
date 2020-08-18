"use strict";

const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

function generatePresignedUrl() {
  const params = {
    Bucket: process.env.bucketName,
    Key: uuidv4(),
    ACL: "public-read",
    Expires: 120,
  };


  return s3.getSignedUrl("putObject", params, (err, url) => {
    if (err) throw new Error("An error occurred while signing Url");
    return {
      url,
    };
  });
}

module.exports = generatePresignedUrl;
