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

`npm start`

Client: http://localhost:5173/
Server: http://localhost:3000/


## Deployment

The version number follows [semver](https://semver.org/).

To deploy in production, simply run this command from your staging branch :

`npm run deploy:[patch|minor|major]`

⚠️ Obviously, only members of the [dataesr organization](https://github.com/dataesr/) have rights to push on the repo.


## Wording

- Campagnes -> campaigns
  - Sans validation -> none
  - Validation déclarative -> declarative
  - Validation bloquante -> locking
- Millésimes -> vintages
  - Brouillon -> draft
  - En test -> test
  - Publiée -> published
  - Fermée -> closed
  - Archivée -> archived


## Users

cf. Dialogue v1 & POC

5 rôles pour l'administration de Dialogue:
- lecteur
- contributeur
- superviseur niveau 1 (souvent au niveau du rectorat, gestion de la campagne à l'échelle académique donc gère les établissements de la région académique telle que définie par Paysage)
- superviseur niveau 2 (plutôt le ministère et les MOA des différentes campagnes, donc gère tous les établissements qui participent à la campagne)
- admin (Yann, Alexandra & Mialy, gestion des codes d'inviation, ajout ou suppression d'utilisateurs de l'administration, gestion des droits de ces utilisateurs ...)

Ces rôles sont uniquement liés à la partie administration de Dialogue. Chaque rôle peut voir la liste des campagnes en cours, en test ou passées de ses espaces. Le rôle de répondant à un millésime d'une campagne est géré différemment.

Espaces
- millésime x établissement x rôle

1 même établissement peut exister au sein d'espaces différents au sein d'un millésime. Avec donc des rôles différents.

Un code d'invitation peut être saisi dans l'UI de réponse de Dialogue. Paysage assure le lien entre un nom de domaine d'adresse email et une structure (et donc un espace).

Un superviseur peut inviter des utilisateurs avec un rôle lecteur, contributeur ou superviseur.