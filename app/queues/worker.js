var { queues } = require('./index');
var { processorInitialisers } = require('./processors');

Object.entries(queues).forEach(([queueName, queue]) => {
  console.log(`Worker listening to '${queueName}' queue`);
  queue.process(processorInitialisers[queueName]());
});
