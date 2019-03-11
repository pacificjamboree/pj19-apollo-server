const Queue = require('bull');
const mdToPdf = require('md-to-pdf');
const tempWrite = require('temp-write');
const tempy = require('tempy');

const queue = new Queue('ADVENTURE_GUIDE_PDF', 'redis://redis:6379');

const { CHROME_PATH } = process.env;

queue.process(async job => {
  try {
    // md-to-pdf requires an actual file on disk
    // Write the data to a tempfile
    const mdTempFile = tempWrite.sync(job.data.guide);

    // Create a temp dir to write the output file
    const pdfFile = tempy.file({ extension: 'pdf' });

    console.log({ pdfFile });

    const pdfResult = await mdToPdf(mdTempFile, {
      dest: pdfFile,
      launch_options: {
        executablePath: CHROME_PATH,
        args: ['--no-sandbox'],
      },
    });

    console.log({ pdfResult });

    // If PDF was generated, upload it to S3
    // TODO implement

    return;
  } catch (e) {
    throw e;
  }
});
