export type AffirmationItem = {
  id: string;
  text: string;
  categoryId: string;
  premium?: boolean;
};

export type AffirmationCategory = {
  id: string;
  title: string;
  description: string;
  whenToUse: string;
  emotionalBenefit: string;
  morningInstruction: string;
  eveningInstruction: string;
  reflectionQuestion: string;
  premium: boolean;
  tag: string;
  theme: string;
  freeAccess: "full" | "preview" | "locked";
  affirmations: AffirmationItem[];
};

function makeAffirmations(categoryId: string, items: string[], premium = false): AffirmationItem[] {
  return items.map((text, index) => ({
    id: `${categoryId}-${index + 1}`,
    text,
    categoryId,
    premium,
  }));
}

export const affirmationCategories: AffirmationCategory[] = [
  {
    id: "self-worth",
    title: "Self-worth & boundaries",
    description: "Build self-respect, inner support, and clear energetic boundaries.",
    whenToUse: "Use this when you feel pulled to please others, explain yourself, or abandon your own rhythm.",
    emotionalBenefit: "Self-trust, emotional clarity, and grounded confidence.",
    morningInstruction: "Repeat your affirmation three times before answering messages or making decisions for others.",
    eveningInstruction: "Notice one moment where you protected your energy today.",
    reflectionQuestion: "Where did I honor my energy today?",
    premium: false,
    tag: "Boundaries",
    theme: "Self-trust",
    freeAccess: "full",
    affirmations: makeAffirmations("self-worth", [
      "I honor my energy and choose what supports me.",
      "My boundaries protect the life I am building.",
      "I do not chase what is not aligned with me.",
      "I can be kind without abandoning myself.",
      "My needs are allowed to take up space.",
      "I trust the quiet no that protects my peace.",
      "I choose relationships that respect my rhythm.",
    ]),
  },
  {
    id: "love",
    title: "Love & relationships",
    description: "Open space for calm connection, emotional honesty, and mutual attraction.",
    whenToUse: "Use this when your heart feels uncertain, attached, closed, or afraid of being seen.",
    emotionalBenefit: "Warmth, softness, trust, and emotional balance.",
    morningInstruction: "Repeat your affirmation while breathing into the center of your chest.",
    eveningInstruction: "Notice where love felt calm instead of dramatic.",
    reflectionQuestion: "What kind of connection felt safe to my nervous system today?",
    premium: false,
    tag: "Love",
    theme: "Connection",
    freeAccess: "full",
    affirmations: makeAffirmations("love", [
      "I welcome love that feels calm, honest, and mutual.",
      "My heart opens without abandoning myself.",
      "I attract connection that respects my truth.",
      "I am worthy of love that does not confuse me.",
      "I let intimacy grow at a pace that feels safe.",
      "I can receive care without earning it.",
      "The right connection brings peace, not pressure.",
    ]),
  },
  {
    id: "money",
    title: "Money & abundance",
    description: "Strengthen permission to receive, create stability, and notice resource flow.",
    whenToUse: "Use this when you feel scarcity, guilt around receiving, or pressure around money.",
    emotionalBenefit: "Safety, confidence, permission, and grounded expansion.",
    morningInstruction: "Repeat your affirmation before checking work, money, or messages.",
    eveningInstruction: "Notice one resource, opportunity, or support that reached you today.",
    reflectionQuestion: "Where did I allow support instead of resisting it?",
    premium: false,
    tag: "Abundance",
    theme: "Resources",
    freeAccess: "preview",
    affirmations: makeAffirmations("money", [
      "I allow support, resources, and opportunity to reach me.",
      "My energy is worthy of stable abundance.",
      "I build safety through clear choices.",
      "I can receive without guilt.",
      "Money can support peace, freedom, and care.",
      "I notice opportunities that match my values.",
      "I am allowed to grow beyond old limits.",
    ]),
  },
  {
    id: "body",
    title: "Body & health",
    description: "Return to softness, body trust, grounding, and daily care.",
    whenToUse: "Use this when you feel disconnected from your body, tense, tired, or overly critical.",
    emotionalBenefit: "Softness, patience, presence, and body acceptance.",
    morningInstruction: "Repeat your affirmation while placing one hand on your body.",
    eveningInstruction: "Notice one way your body supported you today.",
    reflectionQuestion: "What did my body ask for today?",
    premium: false,
    tag: "Body",
    theme: "Care",
    freeAccess: "preview",
    affirmations: makeAffirmations("body", [
      "My body is not an obstacle; it is my home.",
      "I return to softness without losing strength.",
      "I listen to my body with patience.",
      "I can care for myself without punishment.",
      "My body deserves respect in every phase.",
      "I move at a rhythm that supports me.",
      "Rest is part of my path.",
    ]),
  },
  {
    id: "protection",
    title: "Protection & grounding",
    description: "Create inner stability, energetic protection, and calm presence.",
    whenToUse: "Use this when you feel overwhelmed, scattered, drained, or affected by other people's energy.",
    emotionalBenefit: "Calm, safety, energetic clarity, and inner strength.",
    morningInstruction: "Repeat your affirmation while imagining your energy returning to your body.",
    eveningInstruction: "Notice what did not belong to you and release it.",
    reflectionQuestion: "What energy did I carry today that was not mine?",
    premium: false,
    tag: "Grounding",
    theme: "Protection",
    freeAccess: "full",
    affirmations: makeAffirmations("protection", [
      "My energy is clear, grounded, and protected.",
      "I release what does not belong to me.",
      "I am safe to move at my own rhythm.",
      "I return to myself with every breath.",
      "I do not need to absorb every emotion around me.",
      "My presence is steady even when life is loud.",
      "I choose calm before reaction.",
    ]),
  },
  {
    id: "past-life",
    title: "Past-life reflection",
    description: "Release repeating emotional patterns and soften old soul imprints.",
    whenToUse: "Use this when a fear, attachment, or reaction feels older than the current situation.",
    emotionalBenefit: "Release, forgiveness, emotional freedom, and deeper self-understanding.",
    morningInstruction: "Repeat your affirmation while imagining old fear leaving your body.",
    eveningInstruction: "Notice one reaction today that may belong to an older pattern.",
    reflectionQuestion: "What pattern am I ready to stop repeating?",
    premium: true,
    tag: "Past-life",
    theme: "Release",
    freeAccess: "locked",
    affirmations: makeAffirmations("past-life", [
      "I release old fear and allow my soul to move forward.",
      "I am not bound to repeat what once protected me.",
      "Old patterns can end safely through awareness.",
      "I forgive the version of me that learned through pain.",
      "My soul is allowed to choose a new response.",
      "I release loyalty to suffering.",
      "I carry wisdom forward, not fear.",
    ], true),
  },
  {
    id: "intuition",
    title: "Intuition",
    description: "Strengthen inner knowing, subtle perception, and trust in quiet signals.",
    whenToUse: "Use this when you feel unsure, overstimulated, or disconnected from your inner voice.",
    emotionalBenefit: "Clarity, trust, inner listening, and calm decision-making.",
    morningInstruction: "Repeat your affirmation before consuming outside opinions.",
    eveningInstruction: "Notice one moment where your body knew before your mind explained.",
    reflectionQuestion: "What did my intuition whisper today?",
    premium: true,
    tag: "Intuition",
    theme: "Inner voice",
    freeAccess: "locked",
    affirmations: makeAffirmations("intuition", [
      "My inner voice is quiet, clear, and worthy of trust.",
      "I do not need noise to know what is true.",
      "My body recognizes alignment before my mind explains it.",
      "I listen before I rush.",
      "The right answer can arrive softly.",
      "I trust the signal that brings peace.",
      "My intuition becomes clearer when I slow down.",
    ], true),
  },
  {
    id: "soulmate",
    title: "Soulmate connection",
    description: "Explore attraction, emotional mirrors, and the relationship patterns your soul repeats.",
    whenToUse: "Use this when you are thinking about a specific person, longing for connection, or trying to understand a bond.",
    emotionalBenefit: "Emotional clarity, grounded attraction, and self-honoring connection.",
    morningInstruction: "Repeat your affirmation while asking what kind of love supports your path.",
    eveningInstruction: "Notice whether connection today brought peace, intensity, or confusion.",
    reflectionQuestion: "What does this connection mirror back to me?",
    premium: true,
    tag: "Soulmate",
    theme: "Mirrors",
    freeAccess: "locked",
    affirmations: makeAffirmations("soulmate", [
      "I attract connection that meets me with honesty.",
      "A true bond does not require me to lose myself.",
      "I can feel deeply and still stay grounded.",
      "My soul recognizes peace, not only intensity.",
      "I release attachment to unavailable love.",
      "I welcome connection that chooses me clearly.",
      "The right relationship expands my life, not my anxiety.",
    ], true),
  },
];

export function getAffirmationCategoryById(id: string) {
  return affirmationCategories.find((category) => category.id === id) ?? null;
}

export function getAffirmationById(id: string) {
  for (const category of affirmationCategories) {
    const affirmation = category.affirmations.find((item) => item.id === id);
    if (affirmation) return affirmation;
  }
  return null;
}
