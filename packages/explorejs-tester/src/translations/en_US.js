import React from 'react';

import intro from './en_US.intro';

export default {
  languages: {
    pl_PL: 'Polish',
    en_US: 'English'
  },
  general: {
    configuration: 'Configuration',
    testConfigurations: 'Test configurations',
    title: 'ExploreJS interactive survey',
    beginSurvey: 'Begin survey',
    goToBase:'go to base version',
    scenarioIntro: (numScenarios) => `Now you have ${numScenarios} scenarios, you can pick them from the menu on the left or by using contextual buttons below`,
    intro
  },
  menu: {
    survey: 'Survey',
    home: 'Home'
  },
  session: {
    finish: 'Finish and score',
    simulate: 'Simulate slow network',
    speed: 'Network speed',
    wrongOrderWarningHeader: 'Oh Snap!',
    wrongOrderWarning: conf => <div>You should look at <em>{conf}</em> configuration first.</div>
  },
  scenario: {
    back: 'Back',
    again: 'Test it again!',
    next: 'Next',
    pleasePutScore: 'Please, put a score for this configuration',
    clickButton: 'Click button below to experience visual exploration of large dataset with this configuration, then score it.',
    start: 'Start!'
  }
};
