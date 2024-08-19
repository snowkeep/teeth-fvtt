import { TeethActor, TeethItem } from "../documents/_module.mjs";

export default class FactionData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = {required: true, nullable: false, integer: true};
    const requiredPositiveInteger = {...requiredInteger, min: 0};

    return {
      status: new fields.StringField({...requiredInteger, initial: "neutral" }),
      summary: new fields.StringField(),

      based: new fields.SchemaField({
        value: new fields.StringField(),
        show: new fields.BooleanField({ initial: false })
      }),

      showMembers: new fields.BooleanField({ initial: false }),
      members: new fields.ArrayField(new fields.SchemaField({
        id: new fields.ForeignDocumentField(TeethActor, {idOnly: true}),
        uuid: new fields.StringField(),
        name: new fields.StringField()
      })),

      showFactions: new fields.BooleanField({ initial: false }),
      relatedFactions: new fields.ArrayField(new fields.SchemaField({
        id: new fields.ForeignDocumentField(TeethActor, {idOnly: true}),
        uuid: new fields.StringField(),
        name: new fields.StringField(),
        status: new fields.StringField({initial: "neutral"})
      })),

      situation: new fields.HTMLField(),
      description: new fields.HTMLField()
    }
  }
}
