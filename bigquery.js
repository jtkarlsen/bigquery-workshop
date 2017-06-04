const bigquery = require('@google-cloud/bigquery')({
  projectId: 'faggruppe-bigquery'
});

function printResult (rows) {
  console.log('Query Results:');
  rows.forEach(function (row) {
    let str = '';
    for (let key in row) {
      if (str) {
        str = `${str}\n`;
      }
      str = `${str}${key}: ${row[key]}`;
    }
    console.log(str);
  });
}

function queryStackOverflow(query) {
  console.log('Running query');

  const sqlQuery = `SELECT
  title,
  body
FROM
  [bigquery-public-data:stackoverflow.posts_questions]
WHERE
  (title CONTAINS '`+query+`' OR body CONTAINS '`+query+`')
LIMIT
  10;`;

  const options = {
    query: sqlQuery,
    useLegacySql: true
  };

  bigquery
    .query(options)
    .then((results) => {
      const rows = results[0];
      printResult(rows);
    })
    .catch((err) => {
      console.error('ERROR:', err);
    });
}

queryStackOverflow('bigquery');
