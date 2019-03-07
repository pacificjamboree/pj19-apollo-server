// https://kaustavdm.in/versioning-content-postgresql.html

exports.up = knex =>
  knex.schema
    .createTable('content', t => {
      t.uuid('id')
        .primary()
        .default(knex.raw('gen_random_uuid()'));
      t.string('title')
        .notNullable()
        .unique();
      t.text('body');
      t.timestamp('created_at').defaultTo(knex.fn.now());
      t.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    .createTable('content_revision', t => {
      t.uuid('id')
        .primary()
        .default(knex.raw('gen_random_uuid()'));
      t.uuid('content_id')
        .references('content.id')
        .notNullable();
      t.timestamp('created_at').defaultTo(knex.fn.now());
      t.string('title').notNullable();
      t.string('body');
    }).raw(`
      create or replace function trigger_on_content_revision()
        returns trigger
        language plpgsql as $body$
      begin
        -- Create content revision only if content's title or body columns have changed
        if old.title <> new.title or old.body <> new.body then
          if old.updated_at is null then
            -- First edit of content
            insert into content_revision (content_id, created_at, title, body)
            values (old.id, old.created_at, old.title, old.body);
          else
            -- Subsequent edits of content
            insert into content_revision (content_id, created_at, title, body)
            values (old.id, old.updated_at, old.title, old.body);
          end if;
        end if;
        -- Return the "NEW" record so that update can carry on as usual
        return new;
      end; $body$;

      create trigger trigger_content_revision
        before update
        on content
        for each row
      execute procedure trigger_on_content_revision();
    `);

exports.down = knex =>
  knex.schema.dropTable('content_revision').dropTable('content');
