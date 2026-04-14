export function getKeywordMatches(resumeText, jobDescription) {
  const resume = resumeText.toLowerCase();
  const jdWords = jobDescription.toLowerCase().match(/\b(\w+)\b/g) || [];

  const uniqueWords = [...new Set(jdWords)];

  const matched = [];
  const missing = [];

  uniqueWords.forEach((word) => {
    if (word.length > 3) {
      if (resume.includes(word)) {
        matched.push(word);
      } else {
        missing.push(word);
      }
    }
  });

  return { matched, missing };
}

export function calculateATSScore(matched, total) {
  if (total === 0) return 0;
  return Math.round((matched.length / total) * 100);
}
