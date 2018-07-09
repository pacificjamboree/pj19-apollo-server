const PLAN = JSON.stringify([
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Phasellus convallis felis consectetur quam condimentum ornare.',
  'Sed suscipit, turpis eu consectetur placerat, massa velit fringilla massa, a sagittis est velit non erat.',
]);

const DO = JSON.stringify([
  'Nunc rhoncus turpis ut magna faucibus malesuada.',
  'Fusce et eros vitae neque dignissim venenatis.',
  'Mauris eu nisl id quam semper pellentesque at vel dolor.',
]);

const REVIEW = JSON.stringify([
  'Nunc lobortis lacus dolor.In vestibulum cursus porttitor.',
  'Nunc porttitor ante vitae erat auctor porta.',
  'Aliquam porta luctus eros nec euismod.',
]);

const SAFETY = JSON.stringify([
  'Quisque at dui non leo condimentum fringilla a sit amet massa.',
  'Donec dui dolor, porta et pellentesque nec, egestas eu tortor.',
]);

exports.seed = async knex =>
  knex('adventure').update({
    pdr_plan: PLAN,
    pdr_do: DO,
    pdr_review: REVIEW,
    pdr_safety_tips: SAFETY,
  });
