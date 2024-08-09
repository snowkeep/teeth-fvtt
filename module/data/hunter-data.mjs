import { TeethActor, TeethItem } from "../documents/_module.mjs";

export default class HunterData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = {required: true, nullable: false, integer: true};
    const requiredPositiveInteger = {...requiredInteger, min: 0};

    return {
      alias: new fields.StringField(),
      hunterClass: new fields.StringField(),
      background: new fields.StringField(),
      vice: new fields.StringField(),
      magicDisciplines: new fields.ArrayField(new fields.StringField()),
      magicMethods: new fields.ArrayField(new fields.StringField()),
      stress: new fields.SchemaField({
        value: new fields.NumberField({requiredPositiveInteger, initial: 0 }),
        max: new fields.NumberField({requiredPositiveInteger, initial: 9 })
      }),
      behaviour: new fields.ArrayField(new fields.StringField()),
      corruption: new fields.SchemaField({
        value: new fields.NumberField({requiredPositiveInteger, initial: 0 }),
        max: new fields.NumberField({requiredPositiveInteger, initial: 16 })
      }),
      mutations: new fields.ArrayField(new fields.ObjectField(), {
        validate: v => v.length <= 4,
        validationError: "must have 4 or less Mutations"
      }),
      coins: new fields.SchemaField({
        value: new fields.NumberField({requiredPositiveInteger, initial: 0 }),
        max: new fields.NumberField({requiredPositiveInteger, initial: 4 })
      }),
      stash: new fields.SchemaField({
        value: new fields.NumberField({requiredPositiveInteger, initial: 0 }),
        max: new fields.NumberField({requiredPositiveInteger, initial: 30 })
      }),
      exp: new fields.SchemaField({
        value: new fields.NumberField({requiredPositiveInteger, initial: 0 }),
        max: new fields.NumberField({requiredPositiveInteger, initial: 8 })
      }),
      load: new fields.SchemaField({
        max: new fields.NumberField({requiredPositiveInteger, initial: 5 })
      }),

      healing: new fields.SchemaField({
        value: new fields.NumberField({requiredPositiveInteger, initial: 0 }),
        max: new fields.NumberField({requiredPositiveInteger, initial: 4 })
      }),
      injury: new fields.SchemaField({
        minor: new fields.ArrayField(new fields.StringField(), {
          validate: v => v.length <= 2,
          validationError: "must only have 2 Minor harms"
        }),
        major: new fields.ArrayField(new fields.StringField(), {
          validate: v => v.length <= 2,
          validationError: "must only have 2 Major harms"
        }),
        mortal: new fields.StringField()
      }),

      attributes: new fields.SchemaField({
        insight: new fields.SchemaField({
          exp: new fields.SchemaField({
            value: new fields.NumberField({requiredPositiveInteger, initial: 0 }),
            max: new fields.NumberField({requiredPositiveInteger, initial: 6 })
          })
        }),
        prowess: new fields.SchemaField({
          exp: new fields.SchemaField({
            value: new fields.NumberField({requiredPositiveInteger, initial: 0 }),
            max: new fields.NumberField({requiredPositiveInteger, initial: 6 })
          })
        }),
        resolve: new fields.SchemaField({
          exp: new fields.SchemaField({
            value: new fields.NumberField({requiredPositiveInteger, initial: 0 }),
            max: new fields.NumberField({requiredPositiveInteger, initial: 6 })
          })
        }),
      }),

      actions: new fields.SchemaField({
        scout: new fields.SchemaField({
          value: new fields.NumberField({requiredPositiveInteger, initial: 0 }),
          max: new fields.NumberField({requiredPositiveInteger, initial: 4 })
        }),
        doctor: new fields.SchemaField({
          value: new fields.NumberField({requiredPositiveInteger, initial: 0 }),
          max: new fields.NumberField({requiredPositiveInteger, initial: 4 })
        }),
        surveil: new fields.SchemaField({
          value: new fields.NumberField({requiredPositiveInteger, initial: 0 }),
          max: new fields.NumberField({requiredPositiveInteger, initial: 4 })
        }),
        devise: new fields.SchemaField({
          value: new fields.NumberField({requiredPositiveInteger, initial: 0 }),
          max: new fields.NumberField({requiredPositiveInteger, initial: 4 })
        }),
        aim: new fields.SchemaField({
          value: new fields.NumberField({requiredPositiveInteger, initial: 0 }),
          max: new fields.NumberField({requiredPositiveInteger, initial: 4 })
        }),
        manoeuvre: new fields.SchemaField({
          value: new fields.NumberField({requiredPositiveInteger, initial: 0 }),
          max: new fields.NumberField({requiredPositiveInteger, initial: 4 })
        }),
        fight: new fields.SchemaField({
          value: new fields.NumberField({requiredPositiveInteger, initial: 0 }),
          max: new fields.NumberField({requiredPositiveInteger, initial: 4 })
        }),
        wreck: new fields.SchemaField({
          value: new fields.NumberField({requiredPositiveInteger, initial: 0 }),
          max: new fields.NumberField({requiredPositiveInteger, initial: 4 })
        }),
        study: new fields.SchemaField({
          value: new fields.NumberField({requiredPositiveInteger, initial: 0 }),
          max: new fields.NumberField({requiredPositiveInteger, initial: 4 })
        }),
        command: new fields.SchemaField({
          value: new fields.NumberField({requiredPositiveInteger, initial: 0 }),
          max: new fields.NumberField({requiredPositiveInteger, initial: 4 })
        }),
        evoke: new fields.SchemaField({
          value: new fields.NumberField({requiredPositiveInteger, initial: 0 }),
          max: new fields.NumberField({requiredPositiveInteger, initial: 4 })
        }),
        persuade: new fields.SchemaField({
          value: new fields.NumberField({requiredPositiveInteger, initial: 0 }),
          max: new fields.NumberField({requiredPositiveInteger, initial: 4 })
        })
      }),

      playbook: new fields.ForeignDocumentField(TeethItem, {idOnly: true}),
      contacts: new fields.ArrayField(new fields.SchemaField({
        id: new fields.ForeignDocumentField(TeethActor, {idOnly: true}),
        uuid: new fields.StringField(),
        name: new fields.StringField(),
        relationship: new fields.NumberField({requiredPositiveInteger, max: 3, initial: 1 })
      })),

      description: new fields.HTMLField()
    }
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  prepareDerivedData() {
    for (const [attrKey, attribute] of Object.entries(this.attributes)) {
      attribute.value = 0;
      const linkedActions = CONFIG.TEETH.attributeLinks[attrKey];
      for (const key of linkedActions) {
        const action = this.actions[key];
        if (action.value > 0) attribute.value += 1;
      }
    }

    const load = this.load;
    load.value = 0;
    for (const i of this.parent.items) {
      if (i.system.loadout && i.system.equipped) {
        load.value += i.system.loadout;
      }
    }
  }
}
