var H5PPresave = H5PPresave || {};

H5PPresave['H5P.SpeakTheWordsSet'] = function (content, finished) {
  var presave = H5PEditor.Presave;
  var score = 0;

  if (isContentInValid()) {
    throw new presave.exceptions.InvalidContentSemanticsException('Invalid Speak The Words Set Error');
  }

  score = content.questions
    .filter(function (action) {
      return action.hasOwnProperty('library') && action.hasOwnProperty('params');
    })
    .map(function (action) {
      return (new presave).process(action.library, action.params).maxScore;
    })
    .reduce(function (currentScore, scoreToAdd) {
      if (presave.isInt(scoreToAdd)) {
        currentScore += scoreToAdd;
      }
      return currentScore;
    }, 0);

  presave.validateScore(score);

  if (finished) {
    finished({maxScore: score});
  }

  function isContentInValid() {
    return !presave.checkNestedRequirements(content, 'content.questions') || !Array.isArray(content.questions);
  }
};
