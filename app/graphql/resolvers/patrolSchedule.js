const dedent = require('dedent');
const formatDate = require('date-fns/format');
const sortBy = require('lodash.sortby');
const { Patrol } = require('../../models');

const DATE_FORMAT = 'dddd h A';

const formatLocation = location =>
  location === 'onsite'
    ? 'On-Site'
    : 'Off-Site – **Consult Bus Schedule for Departure Time and Bus Number**';

const generatePatrolScheduleMarkdown = async id => {
  console.log({ id });
  try {
    // Get the data we need
    const patrol = await Patrol.query()
      .where({ id })
      .eager('[schedule.[adventure]]')
      .first();

    const { schedule } = patrol;
    const sorted = sortBy(schedule, 'startAt');
    const periodDetails = sorted.map(p => {
      return dedent`
        ## ${formatDate(p.startAt, DATE_FORMAT)} - ${formatDate(
        p.endAt,
        DATE_FORMAT
      )}
        ### ${p.adventure.fullName()}
        ${formatLocation(p.adventure.location)}
      `;
    });

    return dedent`
      ---
      pdf_options:
        margin: 1.5cm
      ---

      # Adventure Schedule - Patrol ${patrol.patrolNumber}
      
        ${periodDetails.join('\n')}
      `;
  } catch (error) {
    throw error;
  }
};

module.exports = { generatePatrolScheduleMarkdown };
