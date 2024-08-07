export const TEETH = {
  attributeLinks: {
    insight: ["scout", "doctor", "surveil", "devise"],
    prowess: ["aim", "manoeuvre", "fight", "wreck"],
    resolve: ["study", "command", "evoke", "persuade"]
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

  hunterClasses: {
    bruiser: "TEETH.Hunters.Bruiser",
    captain: "TEETH.Hunters.Captain",
    keeper: "TEETH.Hunters.Keeper",
    outrider: "TEETH.Hunters.Outrider",
    sapper: "TEETH.Hunters.Sapper"
  },

  backgrounds: {
    NewMoney: "TEETH.Backgrounds.NewMoney",
    OldBlood: "TEETH.Backgrounds.OldBlood",
    Soldiery: "TEETH.Backgrounds.Soldiery",
    Peasantfolk: "TEETH.Backgrounds.Peasantfolk",
    Scholastic: "TEETH.Backgrounds.Scholastic",
    Traveller: "TEETH.Backgrounds.Traveller"
  },

  vices: {
    faith: "TEETH.Vices.Faith",
    gambling: "TEETH.Vices.Gambling",
    luxury: "TEETH.Vices.Luxury",
    Obligation: "TEETH.Vices.Obligation",
    Pleasure: "TEETH.Vices.Pleasure",
    Stupor: "TEETH.Vices.Stupor",
    Weird: "TEETH.Vices.Weird"
  },

  disciplines: {
    elementalism: "TEETH.DisciplineList.Elementalism",
    mesmerism: "TEETH.DisciplineList.Mesmerism",
    transmogrification: "TEETH.DisciplineList.Transmogrification",
    cosmism: "TEETH.DisciplineList.Cosmism",
    conjuration: "TEETH.DisciplineList.Conjuration"
  },
  methods: {
    touch: "TEETH.MethodList.Touch",
    memento: "TEETH.MethodList.Memento",
    device: "TEETH.MethodList.Device",
    encircle: "TEETH.MethodList.Encircle",
    concoction: "TEETH.MethodList.Concoction"
  },

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
      scout: "TEETH.Scout",
      doctor: "TEETH.Doctor",
      surveil: "TEETH.Surveil",
      devise: "TEETH.Devise",
      aim: "TEETH.Aim",
      manoeuvre: "TEETH.Manoeuvre",
      fight: "TEETH.Fight",
      wreck: "TEETH.Wreck",
      study: "TEETH.Study",
      command: "TEETH.Command",
      evoke: "TEETH.Evoke",
      persuade: "TEETH.Persuade"
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
