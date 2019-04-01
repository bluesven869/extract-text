import { Meteor } from 'meteor/meteor';
import Links from '/imports/api/links';
import AWS from 'aws-sdk';

function insertLink(title, url) {
  Links.insert({ title, url, createdAt: new Date() });
}

S3.config = {
  key: '--',
  secret: '--',  
	bucket: '--',
	region: '--' // Only needed if not "us-east-1" or "us-standard"
};

Meteor.startup(() => {
  // If the Links collection is empty, add some data.
  
  if (Links.find().count() === 0) {
    insertLink(
      'Do the Tutorial',
      'https://www.meteor.com/tutorials/react/creating-an-app'
    );

    insertLink(
      'Follow the Guide',
      'http://guide.meteor.com'
    );

    insertLink(
      'Read the Docs',
      'https://docs.meteor.com'
    );

    insertLink(
      'Discussions',
      'https://forums.meteor.com'
    );
  }
});

Meteor.methods({
  'analyseImage'({ imageName }) {
    var rekognition = new AWS.Rekognition();
    var params = {
      Image: { /* required */
        // Bytes: new Buffer('...') || 'STRING_VALUE' /* Strings will be Base-64 encoded on your behalf */,
        S3Object: {
          Bucket: 'meteor-files-2019',
          Name: 'files/' + imageName,
          // Version: 'STRING_VALUE'
        }
      }
    };
    rekognition.detectText(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });
  }
});