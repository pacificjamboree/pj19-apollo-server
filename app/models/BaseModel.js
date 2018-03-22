const { Model } = require('objection');
const db = require('../../db');
const { toGlobalId } = require('graphql-relay-tools');

Model.knex(db);

class BaseModel extends Model {
  globalId() {
    return toGlobalId(this.constructor.name, this.id);
  }
}
module.exports = BaseModel;
