// Enhanced sentiment analysis with more sophisticated scoring
export interface SentimentResult {
  sentiment: "positive" | "negative" | "neutral"
  confidence: number
  score: number // -1 to 1 scale
}

// Expanded sentiment dictionaries with weights
const sentimentWords = {
  positive: {
    // Strong positive (weight: 2)
    excellent: 2,
    amazing: 2,
    outstanding: 2,
    fantastic: 2,
    perfect: 2,
    incredible: 2,
    superb: 2,
    exceptional: 2,
    brilliant: 2,
    magnificent: 2,

    // Moderate positive (weight: 1.5)
    great: 1.5,
    wonderful: 1.5,
    awesome: 1.5,
    impressive: 1.5,
    remarkable: 1.5,

    // Mild positive (weight: 1)
    good: 1,
    nice: 1,
    fine: 1,
    okay: 1,
    decent: 1,
    satisfied: 1,
    happy: 1,
    pleased: 1,
    recommend: 1,
    helpful: 1,
    useful: 1,
    quality: 1,
    fast: 1,
    easy: 1,
    smooth: 1,
    reliable: 1,
    efficient: 1,
    professional: 1,
  },
  negative: {
    // Strong negative (weight: -2)
    terrible: -2,
    awful: -2,
    horrible: -2,
    disgusting: -2,
    appalling: -2,
    atrocious: -2,
    dreadful: -2,
    abysmal: -2,
    catastrophic: -2,
    disastrous: -2,

    // Moderate negative (weight: -1.5)
    bad: -1.5,
    poor: -1.5,
    disappointing: -1.5,
    frustrating: -1.5,
    annoying: -1.5,

    // Mild negative (weight: -1)
    slow: -1,
    expensive: -1,
    delayed: -1,
    broken: -1,
    defective: -1,
    useless: -1,
    problem: -1,
    issue: -1,
    difficult: -1,
    complicated: -1,
    confusing: -1,
    unreliable: -1,
    unprofessional: -1,
    rude: -1,
    unhelpful: -1,
  },
}

// Negation words that flip sentiment
const negationWords = [
  "not",
  "no",
  "never",
  "nothing",
  "nowhere",
  "neither",
  "nobody",
  "none",
  "hardly",
  "scarcely",
  "barely",
]

// Intensifiers that amplify sentiment
const intensifiers = {
  very: 1.5,
  extremely: 2,
  incredibly: 2,
  absolutely: 1.8,
  totally: 1.6,
  really: 1.3,
  quite: 1.2,
  rather: 1.1,
  somewhat: 0.8,
  slightly: 0.7,
}

export function analyzeSentimentAdvanced(text: string): SentimentResult {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
  let totalScore = 0
  let wordCount = 0

  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    let score = 0

    // Check for sentiment words
    if (sentimentWords.positive[word]) {
      score = sentimentWords.positive[word]
    } else if (sentimentWords.negative[word]) {
      score = sentimentWords.negative[word]
    }

    if (score !== 0) {
      // Check for intensifiers before this word
      if (i > 0 && intensifiers[words[i - 1]]) {
        score *= intensifiers[words[i - 1]]
      }

      // Check for negation in the 3 words before
      let isNegated = false
      for (let j = Math.max(0, i - 3); j < i; j++) {
        if (negationWords.includes(words[j])) {
          isNegated = true
          break
        }
      }

      if (isNegated) {
        score *= -0.8 // Flip and slightly reduce intensity
      }

      totalScore += score
      wordCount++
    }
  }

  // Normalize score
  const normalizedScore = wordCount > 0 ? totalScore / wordCount : 0
  const confidence = Math.min(wordCount / 5, 1) // Higher confidence with more sentiment words

  let sentiment: "positive" | "negative" | "neutral"
  if (normalizedScore > 0.3) {
    sentiment = "positive"
  } else if (normalizedScore < -0.3) {
    sentiment = "negative"
  } else {
    sentiment = "neutral"
  }

  return {
    sentiment,
    confidence,
    score: Math.max(-1, Math.min(1, normalizedScore)),
  }
}
