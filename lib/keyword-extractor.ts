export interface KeywordData {
  text: string
  count: number
  sentiment: "positive" | "negative" | "neutral"
  tfidf: number
  contexts: string[]
  categories: string[]
}

export interface CategoryKeywords {
  [category: string]: {
    positive: KeywordData[]
    negative: KeywordData[]
    neutral: KeywordData[]
  }
}

// Enhanced stop words list
const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "are",
  "but",
  "not",
  "you",
  "all",
  "can",
  "had",
  "her",
  "was",
  "one",
  "our",
  "out",
  "day",
  "get",
  "has",
  "him",
  "his",
  "how",
  "man",
  "new",
  "now",
  "old",
  "see",
  "two",
  "way",
  "who",
  "boy",
  "did",
  "its",
  "let",
  "put",
  "say",
  "she",
  "too",
  "use",
  "this",
  "that",
  "with",
  "have",
  "from",
  "they",
  "know",
  "want",
  "been",
  "good",
  "much",
  "some",
  "time",
  "very",
  "when",
  "come",
  "here",
  "just",
  "like",
  "long",
  "make",
  "many",
  "over",
  "such",
  "take",
  "than",
  "them",
  "well",
  "were",
  "will",
  "would",
  "there",
  "what",
  "your",
  "about",
  "after",
  "again",
  "before",
  "being",
  "below",
  "between",
  "both",
  "during",
  "each",
  "few",
  "further",
  "having",
  "into",
  "more",
  "most",
  "other",
  "same",
  "should",
  "since",
  "some",
  "such",
  "their",
  "these",
  "they",
  "those",
  "through",
  "until",
  "where",
  "which",
  "while",
  "with",
  "without",
])

// Category definitions with enhanced keywords
const CATEGORY_KEYWORDS = {
  "Product Quality": [
    "quality",
    "material",
    "build",
    "construction",
    "durability",
    "craftsmanship",
    "design",
    "finish",
    "texture",
    "appearance",
    "functionality",
    "performance",
    "reliability",
    "sturdy",
    "flimsy",
    "cheap",
    "premium",
    "solid",
    "lightweight",
    "heavy",
    "smooth",
    "rough",
    "defective",
    "broken",
    "damaged",
  ],
  "Customer Service": [
    "service",
    "staff",
    "support",
    "help",
    "assistance",
    "representative",
    "agent",
    "team",
    "friendly",
    "helpful",
    "rude",
    "unprofessional",
    "knowledgeable",
    "responsive",
    "patient",
    "courteous",
    "attitude",
    "communication",
    "follow-up",
    "resolution",
    "complaint",
    "issue",
    "problem",
    "solution",
  ],
  "Delivery & Shipping": [
    "delivery",
    "shipping",
    "arrived",
    "package",
    "fast",
    "slow",
    "quick",
    "delayed",
    "late",
    "early",
    "on-time",
    "tracking",
    "courier",
    "packaging",
    "box",
    "wrapped",
    "damaged",
    "lost",
    "missing",
    "expedited",
    "standard",
    "express",
    "overnight",
    "logistics",
    "transport",
  ],
  "Pricing & Value": [
    "price",
    "cost",
    "expensive",
    "cheap",
    "affordable",
    "value",
    "money",
    "worth",
    "budget",
    "overpriced",
    "reasonable",
    "fair",
    "discount",
    "sale",
    "deal",
    "bargain",
    "investment",
    "costly",
    "economical",
    "premium",
    "luxury",
    "budget-friendly",
    "cost-effective",
  ],
  "User Experience": [
    "easy",
    "difficult",
    "simple",
    "complex",
    "intuitive",
    "confusing",
    "user-friendly",
    "interface",
    "navigation",
    "setup",
    "installation",
    "instructions",
    "manual",
    "guide",
    "tutorial",
    "learning",
    "curve",
    "straightforward",
    "complicated",
    "seamless",
    "smooth",
    "clunky",
  ],
  "Features & Functionality": [
    "feature",
    "function",
    "capability",
    "option",
    "setting",
    "mode",
    "tool",
    "utility",
    "versatile",
    "limited",
    "comprehensive",
    "basic",
    "advanced",
    "innovative",
    "outdated",
    "modern",
    "cutting-edge",
    "useful",
    "useless",
    "practical",
    "convenient",
    "efficient",
    "effective",
  ],
}

// Calculate TF-IDF score
function calculateTFIDF(term: string, document: string, corpus: string[]): number {
  const termFreq = (document.toLowerCase().match(new RegExp(term.toLowerCase(), "g")) || []).length
  const docLength = document.split(/\s+/).length
  const tf = termFreq / docLength

  const docsWithTerm = corpus.filter((doc) => doc.toLowerCase().includes(term.toLowerCase())).length
  const idf = Math.log(corpus.length / (docsWithTerm + 1))

  return tf * idf
}

// Extract n-grams (1-3 words)
function extractNGrams(text: string, n: number): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word))

  const ngrams: string[] = []
  for (let i = 0; i <= words.length - n; i++) {
    const ngram = words.slice(i, i + n).join(" ")
    if (ngram.length > 3) {
      ngrams.push(ngram)
    }
  }
  return ngrams
}

// Categorize keywords based on context
function categorizeKeyword(keyword: string): string[] {
  const categories: string[] = []

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (
      keywords.some(
        (k) => keyword.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(keyword.toLowerCase()),
      )
    ) {
      categories.push(category)
    }
  }

  return categories.length > 0 ? categories : ["General"]
}

export function extractAdvancedKeywords(
  reviews: Array<{ review: string; sentiment?: string }>,
  minCount = 3,
): { keywords: KeywordData[]; categoryKeywords: CategoryKeywords } {
  const corpus = reviews.map((r) => r.review)
  const keywordMap = new Map<
    string,
    {
      count: number
      sentiments: string[]
      contexts: string[]
      tfidfScores: number[]
    }
  >()

  // Extract 1-grams, 2-grams, and 3-grams
  reviews.forEach((review, index) => {
    const sentiment = review.sentiment || "neutral"

    // Extract different n-grams
    for (let n = 1; n <= 3; n++) {
      const ngrams = extractNGrams(review.review, n)

      ngrams.forEach((ngram) => {
        if (!keywordMap.has(ngram)) {
          keywordMap.set(ngram, {
            count: 0,
            sentiments: [],
            contexts: [],
            tfidfScores: [],
          })
        }

        const data = keywordMap.get(ngram)!
        data.count++
        data.sentiments.push(sentiment)
        data.contexts.push(review.review.substring(0, 100) + "...")
        data.tfidfScores.push(calculateTFIDF(ngram, review.review, corpus))
      })
    }
  })

  // Process keywords
  const keywords: KeywordData[] = []
  const categoryKeywords: CategoryKeywords = {}

  // Initialize category structure
  Object.keys(CATEGORY_KEYWORDS).forEach((category) => {
    categoryKeywords[category] = {
      positive: [],
      negative: [],
      neutral: [],
    }
  })
  categoryKeywords["General"] = { positive: [], negative: [], neutral: [] }

  keywordMap.forEach((data, keyword) => {
    if (data.count >= minCount) {
      // Determine dominant sentiment
      const sentimentCounts = data.sentiments.reduce(
        (acc, s) => {
          acc[s] = (acc[s] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

      const dominantSentiment = Object.entries(sentimentCounts).reduce((a, b) =>
        sentimentCounts[a[0]] > sentimentCounts[b[0]] ? a : b,
      )[0] as "positive" | "negative" | "neutral"

      const avgTFIDF = data.tfidfScores.reduce((sum, score) => sum + score, 0) / data.tfidfScores.length
      const categories = categorizeKeyword(keyword)

      const keywordData: KeywordData = {
        text: keyword,
        count: data.count,
        sentiment: dominantSentiment,
        tfidf: avgTFIDF,
        contexts: data.contexts.slice(0, 3), // Keep top 3 contexts
        categories,
      }

      keywords.push(keywordData)

      // Add to category keywords
      categories.forEach((category) => {
        if (categoryKeywords[category]) {
          categoryKeywords[category][dominantSentiment].push(keywordData)
        }
      })
    }
  })

  // Sort keywords by TF-IDF score and count
  keywords.sort((a, b) => b.tfidf * b.count - a.tfidf * a.count)

  // Sort category keywords
  Object.keys(categoryKeywords).forEach((category) => {
    Object.keys(categoryKeywords[category]).forEach((sentiment) => {
      categoryKeywords[category][sentiment as keyof (typeof categoryKeywords)[typeof category]].sort(
        (a, b) => b.tfidf * b.count - a.tfidf * a.count,
      )
    })
  })

  return {
    keywords: keywords.slice(0, 50), // Top 50 keywords
    categoryKeywords,
  }
}
