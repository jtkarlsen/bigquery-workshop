# BigQuery workshop
## Om BigQuery
BigQuery er en datavarehusløsning som kjører på googles skyplatform GCP.

//TODO Skrive om det tekniske som skjer i bakgrunnen og pros/cons

### Kostnad
#### Spørringer
Viktigste kostnaden med å bruke BigQuery er for datamengden spørringer traverserer. Det koster $5 per TB hvor den første TB er gratis hver måned. Aktører som Spotify bruker [500PB per måned](https://twitter.com/sinisa_lyh/status/855212130026631168), noe som ville beløpt seg til $2 560 000 uten en egen avtale på pris.

#### Lagring
En annen kostnad med å bruke BigQuery er lagring, det koster $0.02 per GB per måned.


## Komme i gang
Det er få steg som skal til for å kunne ta i bruk BigQuery, spesielt om man bare vil prøve det ut.

1. Lag et nytt prosjekt i [GCP Console](https://console.cloud.google.com) eller bruk et eksisterende.
2. Åpne BigQuery fra menyen på venstresiden.

Nå er du klar til å ta i bruk BigQuery på offentlige datasett som er gjort tilgjengelig i GCP.

### Datasett
TODO: Ta bort.
Denne workshoppen vil ta i bruk offentlige datasett, så det er ikke behov for å laste opp data. Men skal man bruke BigQuery på egen data må dette lastes opp. En guide på dette finnes [her](https://cloud.google.com/bigquery/loading-data).

De forskjellige offentlige datasettene med en liten beskrivelse kan du finne [her](https://cloud.google.com/bigquery/public-data/).

## Bruke BigQuery
### Spørringer fra BigQuery Web UI
Det enkleste for å prøve ut spørringer mot BigQuery er å bruke grensesnittet til GCP. Etter å ha fulgt stegene for å komme i gang skal du være på BigQuery sin velkomstside.

Fra menyen på venstresiden kan man lage en ny spørring, se på tidligere spørringer og se på datasettene tilgjengelig. Man kan i tillegg til dette lage tabeller og laste opp datasett.

Et interessant offentlig datasett gjort tilgjenelig i Bigquery er github sine offentlige pakkebrønner. Her kan man for eksempel søke gjennom innholdet i filene etter 'TODO' for å finne ut hvilken prosjekter som kunne trengt din hjelp.

OBS: Det er lurt å bruke 'sample' versjonene for github sitt datasett som gjør at denne spørringen prosesserer 24 GB i stedet for 1.94 TB som vil bruke det dobbelte av den gratis kvoten på en spørring.
```sql
SELECT
  content.sample_repo_name,
  COUNT(*) AS count,
  repository.watch_count
FROM
  [bigquery-public-data:github_repos.sample_contents] AS content
JOIN
  [bigquery-public-data:github_repos.sample_repos] AS repository
ON
  content.sample_repo_name = repository.repo_name
WHERE
  (content.content CONTAINS '//TODO'
    OR content.content CONTAINS '// TODO')
  AND content.sample_path CONTAINS '.java'
GROUP BY
  content.sample_repo_name,
  repository.watch_count
ORDER BY
  count DESC
LIMIT
  40;
```

Resultatet blir presentert etter kort tid og kan enkelt lastes ned som json eller csv.

### Laste opp egen data
En utfyllende guide for å laste opp data til BigQuery kan du finne [her](https://cloud.google.com/bigquery/loading-data).

Det ligger vedlagt en fil kallt 'Crowdbabble_Social-Media-Analytics_Twitter-Download_Donald-Trump_7375-Tweets.csv' som er hentet fra [denne](https://www.crowdbabble.com/blog/the-11-best-tweets-of-all-time-by-donald-trump/) nettsiden.
Den inneholder alle Tweets President Donalt Trump har skrevet fram til 15. August 2016.

For å populere en tabell i BigQuery med denne dataen går man til BigQuery Web UI'et, klikker på pilen ved prosjektnavnet i sidemenyen på venstresiden og velger 'Create new datset'.
Gi datasettet et navn, som kan være f.eks 'donald_tweets' og velg EU som lokasjon. For å slippe å tenke på å rydde opp etter deg kan det være greit å sette på en utløpsdato på datsettet.

Etter at datasettet er opprettet svever du med musepekeren over det og trykker på plussikonet. Her lar du 'Location' stå på 'File upload', men merk deg at du også kan hente data fra Google Cloud Storage, Google Drive og Google Cloud Bigtable. Skriv inn tabellnavn du vil ha og velg så 'Automatically detect' på Schema for å gjøre det enkelt. La resten være som det er og trykk 'Create Table'

Når dataen er ferdig å laste så kan du kjøre spørringer mot dette datasettet. For eksempel denne:
```sql
SELECT
  Tweet_Text,
  Tweet_Url,
  Retweets
FROM
  [prosjektId:datasettId.tabellNavn]
WHERE
  UPPER(Tweet_Text) CONTAINS UPPER('china')
ORDER BY
  Retweets desc
LIMIT
  1000
```

### Spørringer fra en enkel applikasjon
Det finnes offisielle klientbibliotek for C#, Go, Java, Node, PHP, Python og Ruby. For andre språk kan man bruke [REST-grensesnittet](https://cloud.google.com/bigquery/docs/reference/rest/v2/). I denne workshoppen har jeg valgt å implementere kallene i Node.js.

OBS: Klientene for alle språk er fortsatt i beta, og Google garanterer ikke for bakoverkompatibilitet.

Utdypende dokumentasjon om Node.js klientbiblioteket finner du [her](https://googlecloudplatform.github.io/google-cloud-node/#/docs/bigquery/master/bigquery). Komplett kode for applikasjonen ligger i bigquery.js.

Hvis du ikke har node og npm installert, installer dette først. Instrukser finnes [her](https://nodejs.org/en/download/package-manager/).

Første steg er å installere BigQuery klientbibliotek via npm med kommandoen
```sh
npm install --save @google-cloud/bigquery
```

TODO:
gcloud auth application-default login

Lag en .js fil som skal utføre spørringen mot BigQuery.
Importer så avhengigheten til google-cloud/bigquery med:
```js
const bigquery = require('@google-cloud/bigquery')({
  projectId: 'projectId'
});
```
For å bruke gjøre en spørring mot BigQuery kaller man på query metoden til objektet med 'properties' som blant annet inneholder selve spørringen:
```js
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
```
Metoden query returnerer et promise som når returnert kan brukes til å prosessere responsen.
