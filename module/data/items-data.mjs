export class AbilityHunterData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      active: new fields.BooleanField({initial: false}),
      description: new fields.HTMLField()
    }
  }
}

export class AbilityCrewData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      active: new fields.BooleanField({initial: false}),
      description: new fields.HTMLField()
    }
  }
}

export class BoonData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      active: new fields.BooleanField({initial: false}),
      effect: new fields.StringField(),
      description: new fields.HTMLField(),
      tier: new fields.NumberField({required: true, nullable: false, integer: true, min: 0, initial: 1})
    }
  }
}

export class ToolData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      type: new fields.StringField({initial: "special"}),
      loadout: new fields.NumberField({required: true, nullable: false, integer: true, min: 0, initial: 1}),
      equipped: new fields.BooleanField({initial: false}),
      broken: new fields.BooleanField({initial: false}),
      description: new fields.HTMLField()
    }
  }
}

export class PurchaseData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      active: new fields.BooleanField({initial: false}),
      type: new fields.StringField({initial: "special"}),
      price: new fields.NumberField({required: true, nullable: false, integer: true, min: 0, initial: 1}),
      description: new fields.HTMLField()
    }
  }
}

