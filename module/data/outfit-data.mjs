import { TeethActor, TeethItem } from "../documents/_module.mjs";

export default class OutfitData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = {required: true, nullable: false, integer: true};
    const requiredPositiveInteger = {...requiredInteger, min: 0};

    return {
      agenda: new fields.SchemaField({
        value: new fields.NumberField({requiredPositiveInteger, initial: 0 }),
        max: new fields.NumberField({requiredPositiveInteger, initial: 24 }),
      }),
      tier: new fields.SchemaField({
        value: new fields.NumberField({requiredPositiveInteger, initial: 1 }),
        max: new fields.NumberField({requiredPositiveInteger, initial: 4 }),
      }),
      coins: new fields.SchemaField({
        value: new fields.NumberField({requiredPositiveInteger, initial: 0 }),
        max: new fields.NumberField({requiredPositiveInteger, initial: 10 }),
      }),
      vault: new fields.SchemaField({
        value: new fields.NumberField({requiredPositiveInteger, initial: 0 }),
        max: new fields.NumberField({requiredPositiveInteger, initial: 20 }),
      }),

      playbook: new fields.ForeignDocumentField(TeethItem, {idOnly: true}),
      members: new fields.ArrayField(new fields.SchemaField({
        id: new fields.ForeignDocumentField(TeethActor, {idOnly: true}),
        uuid: new fields.StringField(),
        name: new fields.StringField()
      })),
      contacts: new fields.ArrayField(new fields.SchemaField({
        id: new fields.ForeignDocumentField(TeethActor, {idOnly: true}),
        uuid: new fields.StringField(),
        name: new fields.StringField(),
        relationship: new fields.NumberField({requiredPositiveInteger, max: 3, initial: 1 })
      })),
      /*goals: new fields.ArrayField(new fields.SchemaField({
        id: new fields.ForeignDocumentField(TeethActor, {idOnly: true}),
        uuid: new fields.StringField(),
        name: new fields.StringField(),
        progress: new fields.SchemaField({
          value: new fields.NumberField({requiredPositiveInteger, initial: 0 }),
          max: new fields.NumberField({requiredPositiveInteger, initial: 4 }),
        })
      })),*/

      description: new fields.HTMLField()
    };
  }

  /** @inheritdoc */
  prepareDerivedData() {
    // increase a tier every 4 agenda points
    this.tier.value = Math.floor(this.agenda.value / 4);
  }


}
