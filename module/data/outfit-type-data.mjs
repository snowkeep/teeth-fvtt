import { TeethActor, TeethItem } from "../documents/_module.mjs";

export default class OutfitTypeData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;

    return {
      abilities: new fields.ArrayField(new fields.SchemaField({
        id: new fields.ForeignDocumentField(TeethItem, {idOnly: true}),
        uuid: new fields.StringField(),
        name: new fields.StringField(),
        type: new fields.StringField(),
        title: new fields.StringField(),
        docType: new fields.StringField({initial: "Item"})
      })),
      boons: new fields.ArrayField(new fields.SchemaField({
        id: new fields.ForeignDocumentField(TeethItem, {idOnly: true}),
        uuid: new fields.StringField(),
        name: new fields.StringField(),
        type: new fields.StringField(),
        title: new fields.StringField(),
        docType: new fields.StringField({initial: "Item"})
      })),
      purchases: new fields.ArrayField(new fields.SchemaField({
        id: new fields.ForeignDocumentField(TeethItem, {idOnly: true}),
        uuid: new fields.StringField(),
        name: new fields.StringField(),
        type: new fields.StringField(),
        title: new fields.StringField(),
        docType: new fields.StringField({initial: "Item"})
      })),
      contacts: new fields.ArrayField(new fields.SchemaField({
        id: new fields.ForeignDocumentField(TeethActor, {idOnly: true}),
        uuid: new fields.StringField(),
        name: new fields.StringField(),
        type: new fields.StringField(),
        title: new fields.StringField(),
        docType: new fields.StringField({initial: "Actor"})
      })),

      summary: new fields.StringField(),
      adv1: new fields.StringField(),
      adv2: new fields.StringField(),
      description: new fields.HTMLField()
    }
  }
}
