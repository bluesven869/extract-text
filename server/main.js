import { Meteor } from 'meteor/meteor';
import AWS from 'aws-sdk';


AWS.config.update({
  accessKeyId: Meteor.settings.AWS_KEY,
  secretAccessKey: Meteor.settings.AWS_SECURITY_KEY,
  region: Meteor.settings.AWS_S3_REGION,
  
});

S3.config = {
  key: Meteor.settings.AWS_KEY,
  secret: Meteor.settings.AWS_SECURITY_KEY,  
	bucket: Meteor.settings.AWS_S3_BUCKET,
	region: Meteor.settings.AWS_S3_REGION,
};

Meteor.startup(() => {

});

Meteor.methods({
  'analyseImage'({ S3File }, callback) {
    
    var rekognition = new AWS.Rekognition({
      region: Meteor.settings.AWS_S3_REGION,
      accessKeyId: Meteor.settings.AWS_KEY,
      secretAccessKey: Meteor.settings.AWS_SECURITY_KEY,

    });
    
    var params = {
      Image: {
        S3Object: {
          Bucket: Meteor.settings.AWS_S3_BUCKET,
          Name: S3File.relative_url.substr(1)
        }
      }
    };

    const response = new Promise(resolve => {
      rekognition.detectText(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
          // console.log(data);           // successful response
          resolve(data);
        }
      });
    })
    return response;
  }
});