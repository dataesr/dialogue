import 'survey-core/survey-core.css';
import { Model } from 'survey-core';
import { Survey } from 'survey-react-ui';

import surveyJson from './jsonBuilder';

export default function SurveyComponent() {
  const survey = new Model(surveyJson);

  return <Survey model={survey} />;
}