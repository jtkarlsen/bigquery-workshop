# BigQuery workshop

BigQuery er en datavarehusløsning som kjører på googles skyplatform GCP.

## Index
- Komme i gang
- Query datasett
  - Endepunkter
  - Klientbiblioteker

## Komme i gang
Det er få steg som skal til for å kunne ta i bruk BigQuery, spesielt om man bare vil prøve det ut.

1. Lag et nytt prosjekt i [GCP Console](https://console.cloud.google.com) eller bruk et eksisterende.
2. Åpne BigQuery fra menyen på venstresiden.

Nå er du klar til å ta i bruk BigQuery på offentlige datasett som er gjort tilgjengelig i GCP.

### Private datasett

Denne workshoppen vil ta i bruk offentlige datasett, så det er ikke behov for å laste opp data. Men skal man bruke BigQuery på egen data må dette lastes opp. En guide på dette finnes [her](https://cloud.google.com/bigquery/loading-data).

## Bruk
### GCP UI
Det enkleste for å prøve ut spørringer mot BigQuery er å bruke grensesnittet til GCP. Etter å ha fulgt stegene for å komme i gang skal du være på BigQuery sin velkomstside.

Fra menyen på venstresiden kan man lage en ny spørring, se på tidligere spørringer og se på datasettene tilgjengelig. Man kan i tillegg til dette lage tabeller og laste opp et begrenset datasett (10 mb). Filer større enn dette må lastes opp gjennom Google Cloud Storage.

De forskjellige offentlige datasettene med en liten beskrivelse kan du finne [her](https://cloud.google.com/bigquery/public-data/).

### REST-endepunkt

### Klientbiblioteker
