export const TEETH = {
  attributeLinks: {
    insight: ["hunt", "study", "survey", "tinker"],
    prowess: ["finesse", "prowl", "skirmish", "wreck"],
    resolve: ["attune", "command", "consort", "sway"]
  },
  defaultItems: {
    hunter: ["HZxYeBCQ4bZ632WU", "2H0lH4IeGq22kDyg", "cF0hFmTlXxI8CKSC", "FFNGcKvAeOjoGyI8", "jWTVSlCXWeOiGbfg", "vgMbINvoCQJAYp4q", "6NrhTvPbJTJJUn4s", "vrPi03rFguHYueWZ", "gnv9k4enWnR13mW4", "SapwXYuraydiNjej", "P95oe4AZgSomPqPs", "brU5pWiXWlG5o1Mi", "6cUx1jXXq4dx3wln", "oZOplJcmR6CjQZbO", "Wxoq19qr9LEuuNp4", "IDUBdq7KVd3dxC5W"],
    crew: ["QYT0VHUnH7NvELXE", "0jzSjAD7aC7sTJWB", "JRUITBP7ejrAS7DE", "a78hFI8IrZ4GvmMO", "gwPjJVlyOdpHHkSZ", "iK5vthVkcbBjwl9W", "eOYEeQFnf0Lpflst", "sIzU9C2J8Ff888hZ", "LGG0DCb9qv2Pijy7", "BJG1pPeOQQHc4Sxb", "DYvuI3w5fSwLstvG", "LOPmlnXrAI5baXOx"]
  },
  load: {
    "3": "TEETH.Load.Light",
    "5": "TEETH.Load.Normal",
    "6": "TEETH.Load.Heavy"
  },
  holdTypes: {strong: "TEETH.Hold.Strong", weak: "TEETH.Hold.Weak"},
  statusTypes: {
    allies: "TEETH.Status.Allies",
    friendly: "TEETH.Status.Friendly",
    helpful: "TEETH.Status.Helpful",
    neutral: "TEETH.Status.Neutral",
    interfering: "TEETH.Status.Interfering",
    hostile: "TEETH.Status.Hostile",
    war: "TEETH.Status.War"
  },
  cohort: {
    types: {
      gang: "TEETH.Cohort.Type.Gang",
      expert: "TEETH.Cohort.Type.Expert"
    },
    harm: {
      0: "TEETH.Cohort.Harm.NoHarm",
      1: "TEETH.Cohort.Harm.Weakened",
      2: "TEETH.Cohort.Harm.Impaired",
      3: "TEETH.Cohort.Harm.Broken",
      4: "TEETH.Cohort.Harm.Dead"
    }
  },
  toolType: {
    common: "TEETH.Tool.Common",
    special: "TEETH.Tool.Special"
  },
  toolType: {
    common: "TEETH.Tool.Common",
    special: "TEETH.Tool.Special"
  },
  upgradeType: {
    common: "TEETH.Upgrade.Common",
    special: "TEETH.Upgrade.Special"
  },

  supportedLinks: {
    hunter: {npc: "contacts"},
    crew: {
      hunter: "members",
      npc: "contacts",
      faction: "relatedFactions",
      clock: "goals"
    },
    faction: {
      faction: "relatedFactions",
      npc: "members",
      clock: "goals"
    }
  },

  relationshipClasses: ["rival", "neutral", "friend", "special"],

  rolls: {
    type: {
      action: "TEETH.Roll.Type.Action",
      resistance: "TEETH.Roll.Type.Resistance",
      fortune: "TEETH.Roll.Type.Fortune",
      information: "TEETH.Roll.Type.GatherInformation",
      engagement: "TEETH.Roll.Type.Engagement",
      asset: "TEETH.Roll.Type.AcquireAsset",
      vice: "TEETH.Roll.Type.IndulgeVice"
    },
    rollAs: {
      action: "TEETH.Roll.Type.Action",
      fortune: "TEETH.Roll.Type.Fortune"
    },
    attributes: {
      insight: "TEETH.Insight",
      prowess: "TEETH.Prowess",
      resolve: "TEETH.Resolve"
    },
    actions: {
      hunt: "TEETH.Hunt",
      study: "TEETH.Study",
      survey: "TEETH.Survey",
      tinker: "TEETH.Tinker",
      finesse: "TEETH.Finesse",
      prowl: "TEETH.Prowl",
      skirmish: "TEETH.Skirmish",
      wreck: "TEETH.Wreck",
      attune: "TEETH.Attune",
      command: "TEETH.Command",
      consort: "TEETH.Consort",
      sway: "TEETH.Sway"
    },
    position: {
      controlled: "TEETH.Roll.Position.Controlled",
      risky: "TEETH.Roll.Position.Risky",
      desperate: "TEETH.Roll.Position.Desperate"
    },
    effect: {
      zero: "TEETH.Roll.Effect.Zero",
      limited: "TEETH.Roll.Effect.Limited",
      standard: "TEETH.Roll.Effect.Standard",
      great: "TEETH.Roll.Effect.Great",
      extreme: "TEETH.Roll.Effect.Extreme"
    },
    fortuneRollResult: {
      fail: "Zero",
      mixed: "Limited",
      success: "Standard",
      critical: "Great"
    },
    effectSequence: ["zero", "limited", "standard", "great", "extreme"]
  },

  clockTypes: {
    4: 4,
    6: 6,
    8: 8,
    10: 10,
    12: 12
  }
};
