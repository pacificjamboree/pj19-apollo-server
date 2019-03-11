if (process.env.NODE_ENV === 'production') {
  const { resolve } = require('path');
  require('dotenv').config({ path: resolve(__dirname, '../../.env') });
}

var { queues } = require('./index');
var { processorInitialisers } = require('./processors');

Object.entries(queues).forEach(([queueName, queue]) => {
  console.log(`Worker listening to '${queueName}' queue`);
  queue.process(processorInitialisers[queueName]());
});
