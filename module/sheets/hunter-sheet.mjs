import { TeethActorSheet } from "./actor-sheet.mjs";
import { TEETH } from "../helpers/config.mjs";

/**
 * Extend the TeethActorSheet
 * @extends {TeethActorSheet}
 */
export class TeethHunterSheet extends TeethActorSheet
{

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["bitd", "sheet", "actor", "hunter"],
      width: 750,
      height: 900,
      tabs: [{
        navSelector: ".sheet-tabs",
        contentSelector: ".sheet-body",
        initial: "general"
      }]
    });
  }

  /** @override */
  async getData() {
    const context = await super.getData();

    // Prepare hunter data and items.
    this._prepareItems(context);

    return context;
  }

    /**
   * @param {Object} actorData The actor to prepare.
   * @return {undefined}
   */
  _prepareItems(context) {
    let playbook;
    const abilities = [];
    const contacts = [];
    const inventory = [];
    const specInventory = [];

    const playbookId = this.actor.system.playbook;

    for (const i of context.items) {
      i.img = i.img || DEFAULT_TOKEN;

      if (i.type === 'playbook') {
        if (i._id === playbookId) {
          playbook = i;
        }
      }
      else if (i.type === 'abilityHunter') {
        abilities.push(i);
      }
      else if (i.type === 'contact') {
        contacts.push(i);
      }
      else if (i.type === 'tool') {
        if (i.system.type === 'common') {
          inventory.push(i);
        } else {
          specInventory.push(i);
        }
      }
    }

    context.abilities = abilities;
    context.contacts = contacts;
    context.inventory = inventory;
    context.playbook = playbook;
    context.specInventory = specInventory;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);
    // Add Trauma
    html.find('.add-trauma').click(this._onAddTrauma.bind(this));
    // select Vice
    html.find(".set-vice").click(this._onSetVice.bind(this));
    // select Background
    html.find(".set-background").click(this._onSetBackground.bind(this));
    // select HunterClass
    html.find(".set-hunter").click(this._onSetHunterClass.bind(this));
  }

  /* -------------------------------------------- */

  /**
   * Handle background selection.
   * @param {Event} the originating click event
   * @private
   */
  async _onSetHunterClass(event) {
    const myHunters = TEETH.hunterClasses;
    const template = await renderTemplate("systems/teeth/templates/apps/hunter.hbs", {myHunters});

    const dialog = new Dialog({
      title: game.i18n.localize("TEETH.ChooseClass"),
      content: template,
      buttons: {
        set: {
          label: game.i18n.localize("TEETH.SetClass"),
          callback: async (html) => {
            const element = Array.from(html.find(".hunter.active"));
            const  hunter= element.map(el => el.dataset.value);
            await this.actor.update({ "system.hunterClass": hunter });
          }
        }
      },
      default: "set",
      close: () =>  {},
      render: (html) => {
        html.find(".hunter").on("click", function() {
          $(this).toggleClass("active");
        });
      }
    },
    {
      width: 220
    });

    dialog.render(true);
  }
  /**
   * Handle background selection.
   * @param {Event} the originating click event
   * @private
   */
  async _onSetBackground(event) {
    const myBackgrounds  = TEETH.backgrounds;
    const template = await renderTemplate("systems/teeth/templates/apps/background.hbs", {myBackgrounds});

    const dialog = new Dialog({
      title: game.i18n.localize("TEETH.ChooseBackground"),
      content: template,
      buttons: {
        set: {
          label: game.i18n.localize("TEETH.SetBackground"),
          callback: async (html) => {
            const element = Array.from(html.find(".background.active"));
            const background = element.map(el => el.dataset.value);
            await this.actor.update({ "system.background": background });
          }
        }
      },
      default: "set",
      close: () =>  {},
      render: (html) => {
        html.find(".background").on("click", function() {
          $(this).toggleClass("active");
        });
      }
    },
    {
      width: 220
    });

    dialog.render(true);
  }

  /**
   * Handle vice selection.
   * @param {Event} the originating click event
   * @private
   */
  async _onSetVice(event) {
    const myVices  = TEETH.vices;
    const template = await renderTemplate("systems/teeth/templates/apps/vice.hbs", {myVices});

    const dialog = new Dialog({
      title: game.i18n.localize("TEETH.ChooseVice"),
      content: template,
      buttons: {
        set: {
          label: game.i18n.localize("TEETH.SetVice"),
          callback: async (html) => {
            const element = Array.from(html.find(".vice.active"));
            const vice = element.map(el => el.dataset.value);
            await this.actor.update({ "system.vice": vice });
          }
        }
      },
      default: "set",
      close: () =>  {},
      render: (html) => {
        html.find(".vice").on("click", function() {
          $(this).toggleClass("active");
        });
      }
    },
    {
      width: 220
    });

    dialog.render(true);
  }


  /**
   * Handle adding traumas.
   * @param {Event} the originating click event
   * @private
   */
  async _onAddTrauma(event) {
    const currentTraumas = (this.actor.system.trauma || []).filter(Boolean);
    const defaultTraumas = [
      "TEETH.Traumas.Cold",
      "TEETH.Traumas.Haunted",
      "TEETH.Traumas.Obsessed",
      "TEETH.Traumas.Paranoid",
      "TEETH.Traumas.Reckless",
      "TEETH.Traumas.Soft",
      "TEETH.Traumas.Unstable",
      "TEETH.Traumas.Vicious",
    ];
    const filteredTraumas = defaultTraumas.filter(trauma => !currentTraumas.includes(trauma));

    const template = await renderTemplate("systems/teeth/templates/apps/trauma.hbs", { currentTraumas, filteredTraumas });

    const dialog = new Dialog({
      title: game.i18n.localize("TEETH.ChooseTrauma"),
      content: template,
      buttons: {
        add: {
          label: game.i18n.localize("TEETH.AddTrauma"),
          callback: async (html) => {
            const elements = Array.from(html.find(".trauma.active"));
            const newTraumas = elements.map(el => el.dataset.value);

            const customTrauma = html.find("input.custom-trauma")[0].value;
            if (customTrauma) {
              newTraumas.push(customTrauma);
            }

            await this.actor.update({ "system.trauma": newTraumas });
          }
        }
      },
      default: "add",
      close: () => {},
      render: (html) => {
        html.find(".trauma").on("click", function() {
          $(this).toggleClass("active");
        });
      }
    },
    {
      width: 220
    });

    dialog.render(true);
  }

  /** @override */
  async _onDropActor(event, data) {
    if (!this.isEditable) return;
    const cls = getDocumentClass("Actor");
    const sourceActor = await cls.fromDropData(data);

    this.actor.addLinkedActor(sourceActor);
  }
}
