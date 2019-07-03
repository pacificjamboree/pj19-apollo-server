const dedent = require('dedent');
const formatDate = require('date-fns/format');
const sortBy = require('lodash.sortby');
const { Patrol } = require('../../models');

const DATE_FORMAT_START = 'dddd h:mm A';
const DATE_FORMAT_END = 'h:mm A';

const formatLocation = location =>
  location === 'onsite' ? 'On-Site' : 'Off-Site';

const formatPeriodDate = p => {
  if (p.adventure.location === 'onsite') {
    return `${formatDate(p.startAt, DATE_FORMAT_START)} - ${formatDate(
      p.endAt,
      DATE_FORMAT_END
    )}`;
  } else {
    return `${formatDate(p.startAt, 'dddd')} ${
      formatDate(p.startAt, 'A') === 'AM' ? 'Morning' : 'Afternoon'
    }`;
  }
};

const generatePatrolScheduleMarkdown = async id => {
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
        ## ${formatPeriodDate(p)} – ${formatLocation(p.adventure.location)}

        ### ${p.adventure.fullName()}
        ${
          p.adventure.scoutOnly
            ? "**Scouts Only**: Due to the extremely limited capacity of this activity, participation is limited to Scouts only. If there is excess capacity in your assigned period, Scouters may be able to participate at the Adventure Lead's discretion."
            : ''
        }
      `;
    });

    return dedent`
      --- 
      body_class: markdown-body
      css: |-
          .page-break { page-break-after: always; }
          .markdown-body { font-size: 11px; }
          .markdown-body h1 { font-size: 1.5em; }
          .markdown-body h2 { font-size: 1.25em; }
          .markdown-body p { font-size: .8em; }
          .markdown-body pre > code { white-space: pre-wrap; }
      pdf_options: 
        displayHeaderFooter: true
        footerTemplate: |-
          <section>
            <div>
              Patrol ${
                patrol.patrolNumber
              } - Page <span class="pageNumber"></span> of <span class="totalPages"></span>
            </div>
          </section>
        headerTemplate: |-
          <style>
            section {
              margin: 0 auto;
              font-family: system-ui;
              font-size: 8px;
            }
          </style>
          <section></section>
        margin: 1cm
      stylesheet: "https://s3.ca-central-1.amazonaws.com/adventure.pacificjamboree.ca/documents/patrol_schedules/github-markdown.css"
      ---

      # Adventure Schedule - Patrol ${patrol.subcamp}-${patrol.patrolNumber}
      
      Adventure Schedule Changes can be made at Adventure Headquarters before 8pm. No same-day adventure additions can be made. If you plan to drop out of an activity, please let us know either in person at Adventure Headquarters, or through your Subcamp, so that we can make your space available to other Patrols, and so that we're not looking for you.

      For off-site activities, the times noted are not your bus departure times. **You must consult the bus schedules posted in your Subcamp, and at the Adventure Bussing area for your bus departure times. You must arrive at your bus at least 15 minutes prior to the posted departure time. Busses will not be held for late units**.

      Please consult the Trail Card for each Adventure. They contain important information about how to prepare for each Adventure.

      Note that some activites (e.g. Escape Room and Robotics) appear to occur at the same times and overlap. These two activities are offered together; Patrols will be split amongst the two and rotate through both.

        ${periodDetails.join('\n')}
      `;
  } catch (error) {
    throw error;
  }
};

module.exports = { generatePatrolScheduleMarkdown };
