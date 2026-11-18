const surveyJson = {
    
  "elements": [
        {
          "type": "matrixdropdown",
          "name": "question1",
          "title": "Connaissance des coûts des activités",
          "description": "Coûts et revenus des activités en euros (€)",
          "alternateRows": true,
          "columns": [
            {
              "name": "column1",
              "title": "Coûts E, EC",
              "inputType": "number"
            },
            {
              "name": "column2",
              "title": "Coûts BIATSS",
              "inputType": "number"
            },
            {
              "name": "column3",
              "title": "Coûts de fonctionnement",
              "inputType": "number"
            },
            {
              "name": "column4",
              "title": "Coûts d'amortissement",
              "inputType": "number"
            },
            {
              "name": "column5",
              "title": "Revenus",
              "inputType": "number"
            }
          ],
          "cellType": "text",
          "rows": [
            {
              "value": "row1",
              "text": "Formation accréditée",
            },
            {
              "value": "row2",
              "text": "Formation hors champ de l'accréditation"
            },
            {
              "value": "row3",
              "text": "Formation doctorale"
            },
            {
              "value": "row4",
              "text": "Activités de recherche"
            },
            {
              "value": "row5",
              "text": "Création et exploitation de plateformes scientifiques et technologiques"
            }
          ],
          "allowAddRows": false,
          "rowCount": 5
        }       
      ] 
}

export default surveyJson