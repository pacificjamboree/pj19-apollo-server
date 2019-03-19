const { CHROME_PATH } = process.env;
const mdToPdf = require('md-to-pdf');
const tempWrite = require('temp-write');
const tempy = require('tempy');
const AWS = require('aws-sdk');
const fs = require('fs');

const {
  generateAdventureGuideMarkdown,
} = require('../../graphql/resolvers/adventureGuide');

const { S3_BUCKET, AWS_REGION, AWS_ENDPOINT } = process.env;

const awsConfig = {
  region: AWS_REGION,
};

if (AWS_ENDPOINT) {
  awsConfig.endpoint = AWS_ENDPOINT;
}

if (process.env !== 'production') {
  awsConfig.logger = console;
  awsConfig.s3ForcePathStyle = true;
  awsConfig.sslEnabled = false;
}

AWS.config.setPromisesDependency();
AWS.config.update(awsConfig);
module.exports = () => async job => {
  console.log('Generating Adventure Guide PDF');
  try {
    // Get the generated markdown for the adventure guide
    // with adventures inserted
    const guide = await generateAdventureGuideMarkdown();

    // md-to-pdf requires an actual file on disk
    // Write the data to a tempfile
    const mdTempFile = tempWrite.sync(guide.body);

    // Create a temp dir to write the output file
    const pdfFile = tempy.file({ extension: 'pdf' });

    const pdfResult = await mdToPdf(mdTempFile, {
      dest: pdfFile,
      launch_options: {
        executablePath: CHROME_PATH,
        args: ['--no-sandbox'],
      },
    });

    // If PDF was generated, upload it to S3
    if (pdfResult) {
      const uploadParams = { Bucket: S3_BUCKET };

      const fileStream = fs.createReadStream(pdfFile);
      fileStream.on('error', function(err) {
        console.log('File Error', err);
      });
      uploadParams.Body = fileStream;
      uploadParams.Key = 'documents/pj-2019-adventure-guide.pdf';
      uploadParams.ContentType = 'application/pdf';
      uploadParams.ContentDisposition = 'inline';

      const s3 = new AWS.S3();
      return s3
        .upload(uploadParams)
        .promise()
        .then(console.log);
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
};
