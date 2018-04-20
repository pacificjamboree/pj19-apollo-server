const casual = require('casual');
module.exports = (patrol_id, workflow_state = 'active') => ({
  patrol_id,
  first_name: casual.first_name,
  last_name: casual.last_name,
  email: casual.email,
  workflow_state,
});
