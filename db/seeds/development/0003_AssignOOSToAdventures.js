// get all adventure IDs
// loop over OOS and assign to random one

exports.seed = async (knex, Promise) => {
  const ADVENTURE_IDS = await knex
    .select('id')
    .from('adventure')
    .map(({ id }) => id);
  const OOS_IDS = await knex
    .select('id')
    .from('oos')
    .map(({ id }) => id);

  const promises = OOS_IDS.map(id => {
    const assigned_adventure_id =
      ADVENTURE_IDS[Math.floor(Math.random() * ADVENTURE_IDS.length)];
    return knex('oos')
      .where({ id })
      .update({ assigned_adventure_id });
  });

  return Promise.all(promises);
};
