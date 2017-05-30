# BigQuery workshop

BigQuery er en datavarehusløsning som kjører på googles skyplatform GCP.

//TODO Skrive om det tekniske som skjer i bakgrunnen og pros/cons

## Index
// TODO
- Komme i gang
- Query datasett
  - Endepunkter
  - Klientbiblioteker

## Komme i gang
Det er få steg som skal til for å kunne ta i bruk BigQuery, spesielt om man bare vil prøve det ut.

1. Lag et nytt prosjekt i [GCP Console](https://console.cloud.google.com) eller bruk et eksisterende.
2. Åpne BigQuery fra menyen på venstresiden.

Nå er du klar til å ta i bruk BigQuery på offentlige datasett som er gjort tilgjengelig i GCP.

### Datasett

Denne workshoppen vil ta i bruk offentlige datasett, så det er ikke behov for å laste opp data. Men skal man bruke BigQuery på egen data må dette lastes opp. En guide på dette finnes [her](https://cloud.google.com/bigquery/loading-data).

De forskjellige offentlige datasettene med en liten beskrivelse kan du finne [her](https://cloud.google.com/bigquery/public-data/).

## Kostnad
### Spørringer
Viktigste kostnaden med å bruke BigQuery er for datamengden spørringer traverserer. Det koster $5 per TB hvor den første TB er gratis hver måned. Aktører som Spotify bruker [500PB per måned](https://twitter.com/sinisa_lyh/status/855212130026631168), noe som ville beløpt seg til $2 560 000 uten en egen avtale på pris.

### Lagring
En annen kostnad med å bruke BigQuery er lagring, det koster $0.02 per GB per måned.

## Bruke BigQuery
### GCP UI
Det enkleste for å prøve ut spørringer mot BigQuery er å bruke grensesnittet til GCP. Etter å ha fulgt stegene for å komme i gang skal du være på BigQuery sin velkomstside.

Fra menyen på venstresiden kan man lage en ny spørring, se på tidligere spørringer og se på datasettene tilgjengelig. Man kan i tillegg til dette lage tabeller og laste opp et begrenset datasett (10 MB). Filer større enn dette må lastes opp gjennom Google Cloud Storage.

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

### REST-endepunkt


### Klientbiblioteker
