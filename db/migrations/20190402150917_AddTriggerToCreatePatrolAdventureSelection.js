exports.up = knex =>
  knex.schema.raw(`
    create or replace function create_patrol_adventure_selection()
    returns trigger
    language plpgsql as $body$
    begin
      insert into patrol_adventure_selection(patrol_id) values(new.id);
      return new;
    end;
    $body$;

    do $$ begin

    create trigger create_patrol_adventure_selection
      after insert on patrol
      for each row
      execute procedure create_patrol_adventure_selection();

    exception
      when others then null;
    end $$;
`);

exports.down = knex =>
  knex.schema.raw(`
    drop trigger create_patrol_adventure_selection on patrol;
    drop function create_patrol_adventure_selection();
`);
