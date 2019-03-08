const Model = require('./BaseModel');

class TextContent extends Model {
  static get tableName() {
    return 'content';
  }

  static get relationMappings() {
    const TextContentRevision = require('./TextContentRevision');
    return {
      revisions: {
        relation: Model.HasManyRelation,
        modelClass: TextContentRevision,
        join: {
          from: 'content.id',
          to: 'content_revision.contentId',
        },
      },
    };
  }
}

module.exports = TextContent;
