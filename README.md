# Dialogue v2

- POC V2 in PHP https://github.com/dataesr/dialoguev2-poc -> see it live here https://dialogue.dataesr.fr/
- https://github.com/dataesr/dialoguev2-poc/blob/main/docs/PRESENTATION-EQUIPE-INTERNE.md
- https://github.com/dataesr/dialoguev2-poc/blob/main/docs/Dialogue_Interactions_Specifications.md
- POC to choose the form tool https://github.com/dataesr/dialogue-poc


## Technical stack
- npm
- DSFR+ https://github.com/dataesr/dsfr-plus
- React + TypeScript
- vite https://vite.dev/guide/#scaffolding-your-first-vite-project
- SurveyJS https://surveyjs.io/
- node ^22.18.0 || >=24
- Express https://expressjs.com/en/5x/starter/installing/

No choice is currently made between axios and fetch.


## SSO

cf. documentation https://kit.dev.dataesr.ovh/ui/app/kit-provider


## Install

`npm i`


## Run locally

`npm run dev`

Client: http://localhost:5173/
Server: http://localhost:3000/


## Deployment

The version number follows [semver](https://semver.org/).

To deploy in production, simply run this command from your staging branch :

`npm run deploy:[patch|minor|major]`

⚠️ Obviously, only members of the [dataesr organization](https://github.com/dataesr/) have rights to push on the repo.