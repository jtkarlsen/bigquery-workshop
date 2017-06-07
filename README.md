# BigQuery workshop
## Om BigQuery
BigQuery er en datavarehuslignende løsning som kjører på Googles skyplatform (GCP).

Google BigQuery er en eksternt tilgjengelig implementasjon av Google sin Dremel.

>By combining multi-level execution trees and columnar data layout, it is capable of running aggregation queries over trillion-row tables in seconds[1].

[1]https://research.google.com/pubs/pub36632.html

Dremel lagrer data kolonnebasert, noe som gir høy scannehastighet og kompresjonsrate.
Dette vil si at data fra forskjellige innslag, men samme kolonne lagres sammen.
Tradisjonelt er dette en teknikk datavarehus har brukt.
Google mener en radbasert lagring vil kunne oppnå en kompresjonsrate på 1:3, mens en kolonnebasert lagring kan oppnå 1:10.
Dette skjer fordi det er veldig mye mer sansynelig at data fra samme kolonne er lik.
En ulempe med kolonnebasert lagring er at updates er krevende. (Tror dette løses av Google med å være append only)

Dremel bruker en trestruktur for distrubusjon av arbeid, i liket med MapReduce.
Dremel er derimot mange ganger raskere enn MapReduce.
Hvis man har behov for å analysere ustrukturert data og behandle den programmatisk må man bruke MapReduce.

### Kostnad
#### Spørringer
Viktigste kostnaden med å bruke BigQuery er for datamengden spørringer traverserer. Det koster $5 per TB hvor den første TB er gratis hver måned. Aktører som Spotify bruker [500 PB per måned](https://twitter.com/sinisa_lyh/status/855212130026631168), noe som ville beløpt seg til $2 560 000 uten en egen avtale på pris.

#### Lagring
En annen kostnad med å bruke BigQuery er lagring, det koster $0.02 per GB per måned.
De første 10 GB  er kostnadsfri.

## Komme i gang
Det er få steg som skal til for å kunne ta i bruk BigQuery, spesielt om man bare vil prøve det ut.

1. Lag et nytt prosjekt i [GCP Console](https://console.cloud.google.com) eller bruk et eksisterende.
2. Åpne BigQuery fra menyen på venstresiden.

Nå er du klar til å ta i bruk BigQuery på offentlige datasett som er gjort tilgjengelig i GCP.

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

Prøv noen spørringer mot de andre offentlige datasettene. Gjerne noen av de større for å få et inntrykk av hasigheten til BigQuery.
De forskjellige offentlige datasettene med en liten beskrivelse kan du finne [her](https://cloud.google.com/bigquery/public-data/).

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

Hvis du har Google Cloud SDK installert kan du kjøre denne kommandoen for å autentisere maskinen:
```sh
gcloud auth application-default login
```
Alternativt kan du generere en nøkkelfil som må inkluderes i 'require' parameterene under. Hvordan det gjøres kan finnes [her](https://googlecloudplatform.github.io/google-cloud-node/#/docs/bigquery/0.9.1/guides/authentication). Dette vil for eksempel være nødvendig om koden kjøres fra en server eller en klient uten Google Cloud SDK satt opp og logget inn. Kjøres applikasjonen fra AppEngine er det derimot ikke nødvendig.

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
Metoden query returnerer et promise som når returnert kan brukes til å prosessere responsen. I dette tilfellet sendes den vidre til en metode som skriver den til konsollet.

#### Skriving
Du kan også prøve deg på å lagre data programmatisk. Dette vil være relevant om du ikke bruker BigQuery mot et eksisterende datasett, men mot et du bygger opp underveis. Et scenario her kan være å lagre alle hendelser i en applikasjon for å så kunne kjøre spørringer mot et potensielt gigantisk datasett i rekordfart og få innblikk i bruksmønster, statistikk og mer.

Via BigQuerys klientbibliotek kan man kalle på metoden 'insert' på en tabell hentet ved hjelp av 'table' kalt på 'dataset'.
```js
bigquery
  .dataset(datasetId)
  .table(tableId)
  .insert(rows)
  .then((insertErrors) => {
    console.log('Inserted:');
    rows.forEach((row) => console.log(row));

    if (insertErrors && insertErrors.length > 0) {
      console.log('Insert errors:');
      insertErrors.forEach((err) => console.error(err));
    }
  })
  .catch((err) => {
    console.error('ERROR:', err);
  });
```
Her er rows et JSON array med data som skal insertes. Merk at responsen til promiset er en liste med errors, så en error for hver rad som eventuelt ikke ble godkjent. Mer utfyllende informasjon om dette finner du [her](https://cloud.google.com/bigquery/streaming-data-into-bigquery#bigquery-stream-data-nodejs).

## Videre
For inspirasjon om hva man kan gjøre med BigQuery anbefaler jeg å sjekke ut [reddit.com/r/bigquery](https://www.reddit.com/r/bigquery/).
