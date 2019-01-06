const { toGlobalId } = require('graphql-relay-tools');

const adventureList = adventures =>
  adventures
    .map(
      a =>
        `<p style="Margin: 0; Margin-bottom: 10px; color: #0a0a0a; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0; margin-bottom: 10px; padding: 0; text-align: left;"><a href="https://adventure.pacificjamboree.ca/adventures/${toGlobalId(
          'Adventure',
          a.id
        )}" style="Margin: 0; color: #2199e8; font-family: Helvetica, Arial, sans-serif; font-weight: normal; line-height: 1.3; margin: 0; padding: 0; text-align: left; text-decoration: none;">${
          a.name
        }</a>${a.oosDescription ? `: ${a.oosDescription}` : ''}</p>`
    )
    .join('\n');

module.exports = ({ oos, adventures, dueDate }) => {
  return /*html*/ `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">

  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width">
    <title>Welcome to the PJ 2019 Adventure Team</title>
  </head>

  <body style="-moz-box-sizing: border-box; -ms-text-size-adjust: 100%; -webkit-box-sizing: border-box; -webkit-text-size-adjust: 100%; Margin: 0; background: #f3f3f3 !important; box-sizing: border-box; color: #0a0a0a; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0; min-width: 100%; padding: 0; text-align: left; width: 100% !important;">
    <style>
      @media only screen {
        html {
          min-height: 100%;
          background: #f3f3f3;
        }
      }
      
      @media only screen and (max-width: 596px) {
        .small-float-center {
          margin: 0 auto !important;
          float: none !important;
          text-align: center !important;
        }
        .small-text-center {
          text-align: center !important;
        }
        .small-text-left {
          text-align: left !important;
        }
        .small-text-right {
          text-align: right !important;
        }
      }
      
      @media only screen and (max-width: 596px) {
        .hide-for-large {
          display: block !important;
          width: auto !important;
          overflow: visible !important;
          max-height: none !important;
          font-size: inherit !important;
          line-height: inherit !important;
        }
      }
      
      @media only screen and (max-width: 596px) {
        table.body table.container .hide-for-large,
        table.body table.container .row.hide-for-large {
          display: table !important;
          width: 100% !important;
        }
      }
      
      @media only screen and (max-width: 596px) {
        table.body table.container .callout-inner.hide-for-large {
          display: table-cell !important;
          width: 100% !important;
        }
      }
      
      @media only screen and (max-width: 596px) {
        table.body table.container .show-for-large {
          display: none !important;
          width: 0;
          mso-hide: all;
          overflow: hidden;
        }
      }
      
      @media only screen and (max-width: 596px) {
        table.body img {
          width: auto;
          height: auto;
        }
        table.body center {
          min-width: 0 !important;
        }
        table.body .container {
          width: 95% !important;
        }
        table.body .columns,
        table.body .column {
          height: auto !important;
          -moz-box-sizing: border-box;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          padding-left: 16px !important;
          padding-right: 16px !important;
        }
        table.body .columns .column,
        table.body .columns .columns,
        table.body .column .column,
        table.body .column .columns {
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
        table.body .collapse .columns,
        table.body .collapse .column {
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
        td.small-1,
        th.small-1 {
          display: inline-block !important;
          width: 8.33333% !important;
        }
        td.small-2,
        th.small-2 {
          display: inline-block !important;
          width: 16.66667% !important;
        }
        td.small-3,
        th.small-3 {
          display: inline-block !important;
          width: 25% !important;
        }
        td.small-4,
        th.small-4 {
          display: inline-block !important;
          width: 33.33333% !important;
        }
        td.small-5,
        th.small-5 {
          display: inline-block !important;
          width: 41.66667% !important;
        }
        td.small-6,
        th.small-6 {
          display: inline-block !important;
          width: 50% !important;
        }
        td.small-7,
        th.small-7 {
          display: inline-block !important;
          width: 58.33333% !important;
        }
        td.small-8,
        th.small-8 {
          display: inline-block !important;
          width: 66.66667% !important;
        }
        td.small-9,
        th.small-9 {
          display: inline-block !important;
          width: 75% !important;
        }
        td.small-10,
        th.small-10 {
          display: inline-block !important;
          width: 83.33333% !important;
        }
        td.small-11,
        th.small-11 {
          display: inline-block !important;
          width: 91.66667% !important;
        }
        td.small-12,
        th.small-12 {
          display: inline-block !important;
          width: 100% !important;
        }
        .columns td.small-12,
        .column td.small-12,
        .columns th.small-12,
        .column th.small-12 {
          display: block !important;
          width: 100% !important;
        }
        table.body td.small-offset-1,
        table.body th.small-offset-1 {
          margin-left: 8.33333% !important;
          Margin-left: 8.33333% !important;
        }
        table.body td.small-offset-2,
        table.body th.small-offset-2 {
          margin-left: 16.66667% !important;
          Margin-left: 16.66667% !important;
        }
        table.body td.small-offset-3,
        table.body th.small-offset-3 {
          margin-left: 25% !important;
          Margin-left: 25% !important;
        }
        table.body td.small-offset-4,
        table.body th.small-offset-4 {
          margin-left: 33.33333% !important;
          Margin-left: 33.33333% !important;
        }
        table.body td.small-offset-5,
        table.body th.small-offset-5 {
          margin-left: 41.66667% !important;
          Margin-left: 41.66667% !important;
        }
        table.body td.small-offset-6,
        table.body th.small-offset-6 {
          margin-left: 50% !important;
          Margin-left: 50% !important;
        }
        table.body td.small-offset-7,
        table.body th.small-offset-7 {
          margin-left: 58.33333% !important;
          Margin-left: 58.33333% !important;
        }
        table.body td.small-offset-8,
        table.body th.small-offset-8 {
          margin-left: 66.66667% !important;
          Margin-left: 66.66667% !important;
        }
        table.body td.small-offset-9,
        table.body th.small-offset-9 {
          margin-left: 75% !important;
          Margin-left: 75% !important;
        }
        table.body td.small-offset-10,
        table.body th.small-offset-10 {
          margin-left: 83.33333% !important;
          Margin-left: 83.33333% !important;
        }
        table.body td.small-offset-11,
        table.body th.small-offset-11 {
          margin-left: 91.66667% !important;
          Margin-left: 91.66667% !important;
        }
        table.body table.columns td.expander,
        table.body table.columns th.expander {
          display: none !important;
        }
        table.body .right-text-pad,
        table.body .text-pad-right {
          padding-left: 10px !important;
        }
        table.body .left-text-pad,
        table.body .text-pad-left {
          padding-right: 10px !important;
        }
        table.menu {
          width: 100% !important;
        }
        table.menu td,
        table.menu th {
          width: auto !important;
          display: inline-block !important;
        }
        table.menu.vertical td,
        table.menu.vertical th,
        table.menu.small-vertical td,
        table.menu.small-vertical th {
          display: block !important;
        }
        table.menu[align="center"] {
          width: auto !important;
        }
        table.button.small-expand,
        table.button.small-expanded {
          width: 100% !important;
        }
        table.button.small-expand table,
        table.button.small-expanded table {
          width: 100%;
        }
        table.button.small-expand table a,
        table.button.small-expanded table a {
          text-align: center !important;
          width: 100% !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
        table.button.small-expand center,
        table.button.small-expanded center {
          min-width: 0;
        }
      }
    </style>
    <!-- <style> -->
    <table class="body" data-made-with-foundation="" style="Margin: 0; background: #f3f3f3 !important; border-collapse: collapse; border-spacing: 0; color: #0a0a0a; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; height: 100%; line-height: 1.3; margin: 0; padding: 0; text-align: left; vertical-align: top; width: 100%;">
      <tbody>
        <tr style="padding: 0; text-align: left; vertical-align: top;">
          <td class="float-center" align="center" valign="top" style="-moz-hyphens: auto; -webkit-hyphens: auto; Margin: 0 auto; border-collapse: collapse !important; color: #0a0a0a; float: none; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; hyphens: auto; line-height: 1.3; margin: 0 auto; padding: 0; text-align: center; vertical-align: top; word-wrap: break-word;">
            <center data-parsed="" style="min-width: 580px; width: 100%;">
              <table class="spacer float-center" style="Margin: 0 auto; border-collapse: collapse; border-spacing: 0; float: none; margin: 0 auto; padding: 0; text-align: center; vertical-align: top; width: 100%;">
                <tbody>
                  <tr style="padding: 0; text-align: left; vertical-align: top;">
                    <td height="16px" style="-moz-hyphens: auto; -webkit-hyphens: auto; Margin: 0; border-collapse: collapse !important; color: #0a0a0a; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; hyphens: auto; line-height: 16px; margin: 0; mso-line-height-rule: exactly; padding: 0; text-align: left; vertical-align: top; word-wrap: break-word;"></td>
                  </tr>
                </tbody>
              </table>
              <table align="center" class="container header float-center" style="Margin: 0 auto; background: #f3f3f3; border-collapse: collapse; border-spacing: 0; float: none; margin: 0 auto; padding: 0; text-align: center; vertical-align: top; width: 580px;">
                <tbody>
                  <tr style="padding: 0; text-align: left; vertical-align: top;">
                    <td style="-moz-hyphens: auto; -webkit-hyphens: auto; Margin: 0; border-collapse: collapse !important; color: #0a0a0a; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; hyphens: auto; line-height: 1.3; margin: 0; padding: 0; text-align: left; vertical-align: top; word-wrap: break-word;">
                      <table class="row" style="border-collapse: collapse; border-spacing: 0; display: table; padding: 0; position: relative; text-align: left; vertical-align: top; width: 100%;">
                        <tbody>
                          <tr style="padding: 0; text-align: left; vertical-align: top;">
                            <th class="small-12 large-12 columns first last" style="Margin: 0 auto; color: #0a0a0a; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0 auto; padding: 0; padding-bottom: 16px; padding-left: 16px; padding-right: 16px; text-align: left; width: 564px;">
                              <table style="border-collapse: collapse; border-spacing: 0; padding: 0; text-align: left; vertical-align: top; width: 100%;">
                                <tbody>
                                  <tr style="padding: 0; text-align: left; vertical-align: top;">
                                    <th style="Margin: 0; color: #0a0a0a; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0; padding: 0; text-align: left;">
                                      <h1 class="text-center" style="Margin: 0; Margin-bottom: 10px; color: inherit; font-family: Helvetica, Arial, sans-serif; font-size: 34px; font-weight: normal; line-height: 1.3; margin: 0; margin-bottom: 10px; padding: 0; text-align: center; word-wrap: normal;">Welcome to the PJ 2019 Adventure Team</h1>
                                      <p class="text-center" style="Margin: 0; Margin-bottom: 10px; color: #0a0a0a; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0; margin-bottom: 10px; padding: 0; text-align: center;">Get ready to choose your own adventure!</p>
                                    </th>
                                    <th class="expander" style="Margin: 0; color: #0a0a0a; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0; padding: 0 !important; text-align: left; visibility: hidden; width: 0;"></th>
                                  </tr>
                                </tbody>
                              </table>
                            </th>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table align="center" class="container body-border float-center" style="Margin: 0 auto; background: #fefefe; border-collapse: collapse; border-spacing: 0; border-top: 8px solid #00b5ad; float: none; margin: 0 auto; padding: 0; text-align: center; vertical-align: top; width: 580px;">
                <tbody>
                  <tr style="padding: 0; text-align: left; vertical-align: top;">
                    <td style="-moz-hyphens: auto; -webkit-hyphens: auto; Margin: 0; border-collapse: collapse !important; color: #0a0a0a; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; hyphens: auto; line-height: 1.3; margin: 0; padding: 0; text-align: left; vertical-align: top; word-wrap: break-word;">
                      <table class="row" style="border-collapse: collapse; border-spacing: 0; display: table; padding: 0; position: relative; text-align: left; vertical-align: top; width: 100%;">
                        <tbody>
                          <tr style="padding: 0; text-align: left; vertical-align: top;">
                            <th class="small-12 large-12 columns first last" style="Margin: 0 auto; color: #0a0a0a; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0 auto; padding: 0; padding-bottom: 16px; padding-left: 16px; padding-right: 16px; text-align: left; width: 564px;">
                              <table style="border-collapse: collapse; border-spacing: 0; padding: 0; text-align: left; vertical-align: top; width: 100%;">
                                <tbody>
                                  <tr style="padding: 0; text-align: left; vertical-align: top;">
                                    <th style="Margin: 0; color: #0a0a0a; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0; padding: 0; text-align: left;">
                                      <table class="spacer" style="border-collapse: collapse; border-spacing: 0; padding: 0; text-align: left; vertical-align: top; width: 100%;">
                                        <tbody>
                                          <tr style="padding: 0; text-align: left; vertical-align: top;">
                                            <td height="32px" style="-moz-hyphens: auto; -webkit-hyphens: auto; Margin: 0; border-collapse: collapse !important; color: #0a0a0a; font-family: Helvetica, Arial, sans-serif; font-size: 32px; font-weight: normal; hyphens: auto; line-height: 32px; margin: 0; mso-line-height-rule: exactly; padding: 0; text-align: left; vertical-align: top; word-wrap: break-word;"></td>
                                          </tr>
                                        </tbody>
                                      </table>
                                      <center data-parsed="" style="min-width: 532px; width: 100%;"> <img height="311" src="https://i1.wp.com/www.pacificjamboree.ca/wp-content/uploads/2018/01/PJLogo600.jpg?w=600&amp;amp;ssl=1" align="center" class="float-center" style="-ms-interpolation-mode: bicubic; Margin: 0 auto; clear: both; display: block; float: none; margin: 0 auto; max-width: 100%; outline: none; text-align: center; text-decoration: none; width: auto;">                                      </center>
                                      <table class="spacer" style="border-collapse: collapse; border-spacing: 0; padding: 0; text-align: left; vertical-align: top; width: 100%;">
                                        <tbody>
                                          <tr style="padding: 0; text-align: left; vertical-align: top;">
                                            <td height="16px" style="-moz-hyphens: auto; -webkit-hyphens: auto; Margin: 0; border-collapse: collapse !important; color: #0a0a0a; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; hyphens: auto; line-height: 16px; margin: 0; mso-line-height-rule: exactly; padding: 0; text-align: left; vertical-align: top; word-wrap: break-word;"></td>
                                          </tr>
                                        </tbody>
                                      </table>
                                      <p style="Margin: 0; Margin-bottom: 10px; color: #0a0a0a; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0; margin-bottom: 10px; padding: 0; text-align: left;"><b>Hello ${oos.preferredName ||
                                        oos.firstName}, and welcome to the 2019 Pacific Jamboree Adventure Team!</b></p>
                                      <p style="Margin: 0; Margin-bottom: 10px; color: #0a0a0a; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0; margin-bottom: 10px; padding: 0; text-align: left;">Thank you so much for volunteering for PJ 2010 and welcome to the Adventure team. We are excited to have you on board with us! We have lots of different adventures in the planning stages for PJ, with some requiring
                                        special skills, and others that just need to have someone who wants to have fun and has some positive energy to share.</p>
                                      <p style="Margin: 0; Margin-bottom: 10px; color: #0a0a0a; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0; margin-bottom: 10px; padding: 0; text-align: left;">We would like to place you in an area where you would like to work in for the week; you may have skills or certifications that you want to use or perhaps you have a keen interest in doing something new or you want to
                                        develop new skills. Below is a list of the different adventures we have planned that still have OOS vacancies, and what is involved in the activity.</p>
                                      <p style="Margin: 0; Margin-bottom: 10px; color: #0a0a0a; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0; margin-bottom: 10px; padding: 0; text-align: left;"><b>It is imporant that you reply to this message prompty!</b> Please reply to this message within the next ten days (by ${dueDate}) with your top 3 choices and we will do our best to accommodate you. <b>Please realize that we need to place about 300 Offers of Service in Adventure so if we don’t hear back from you by ${dueDate}, you will be placed whereever we need people the most.</b></p>

                                      ${adventureList(adventures)}
                                      
                                      <p style="Margin: 0; Margin-bottom: 10px; color: #0a0a0a; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0; margin-bottom: 10px; padding: 0; text-align: left;">Thanks again for volunteering for PJ 2019 – we can't wait to see you at Camp Barnard in July!</p>

                                      <p style="Margin: 0; Margin-bottom: 10px; color: #0a0a0a; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0; margin-bottom: 10px; padding: 0; text-align: left;">
                                        Yours in Scouting,<br>
                                        <br> The PJ 2019 Adventure Team<br>
                                        <a href="mailto:adventure@pacificjamboree.ca" style="Margin: 0; color: #2199e8; font-family: Helvetica, Arial, sans-serif; font-weight: normal; line-height: 1.3; margin: 0; padding: 0; text-align: left; text-decoration: none;">adventure@pacificjamboree.ca</a><br>
                                      </p>
                                    </th>
                                    <th class="expander" style="Margin: 0; color: #0a0a0a; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; line-height: 1.3; margin: 0; padding: 0 !important; text-align: left; visibility: hidden; width: 0;"></th>
                                  </tr>
                                </tbody>
                              </table>
                            </th>
                          </tr>
                        </tbody>
                      </table>
                      <table class="spacer" style="border-collapse: collapse; border-spacing: 0; padding: 0; text-align: left; vertical-align: top; width: 100%;">
                        <tbody>
                          <tr style="padding: 0; text-align: left; vertical-align: top;">
                            <td height="16px" style="-moz-hyphens: auto; -webkit-hyphens: auto; Margin: 0; border-collapse: collapse !important; color: #0a0a0a; font-family: Helvetica, Arial, sans-serif; font-size: 16px; font-weight: normal; hyphens: auto; line-height: 16px; margin: 0; mso-line-height-rule: exactly; padding: 0; text-align: left; vertical-align: top; word-wrap: break-word;"></td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </center>
          </td>
        </tr>
      </tbody>
    </table>
  </body>

  </html>
  `;
};
