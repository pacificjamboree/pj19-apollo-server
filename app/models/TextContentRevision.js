const Model = require('./BaseModel');

class TextContentRevision extends Model {
  static get tableName() {
    return 'content_revision';
  }

  static get relationMappings() {
    const TextContent = require('./TextContent');
    return {
      current: {
        relation: Model.BelongsToOneRelation,
        modelClass: TextContent,
        join: {
          from: 'content_revision.content_id',
          to: 'content.id',
        },
      },
    };
  }
}

module.exports = TextContentRevision;
