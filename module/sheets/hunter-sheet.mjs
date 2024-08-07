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
      classes: ["teeth", "sheet", "actor", "hunter"],
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
    // select Vice
    html.find(".set-vice").click(this._onSetVice.bind(this));
    // select Background
    html.find(".set-background").click(this._onSetBackground.bind(this));
    // select HunterClass
    html.find(".set-hunter").click(this._onSetHunterClass.bind(this));
    // Add Magic Discipline
    html.find('.add-discipline').click(this._onAddDiscipline.bind(this));
    // Add Magic Method
    html.find('.add-method').click(this._onAddMethod.bind(this));
    // Import Dangerous Acquaintances
    html.find('.import-acquaintances').click(this._onImportAcquaintances.bind(this));
    // remove a Dangerous Acquaintance
    html.find('.remove-acquaintance').click(this._onRemoveAcquaintance.bind(this));
    // Add Trauma
    html.find('.add-trauma').click(this._onAddTrauma.bind(this));
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
            const hunter= element.map(el => el.dataset.value);
            await this.actor.update({ "system.hunterClass": hunter });

            const itemPack = game.packs.get('teeth.items');
            await itemPack.getIndex();
            const defaultFolder = itemPack.folders.find(p => p.name === "Default")._id;
            const classFolder = itemPack.folders.find(p => p.name === this.actor.system.hunterClass.split(".").at(-1))._id;
            const classItems = itemPack.index.filter(p => p.folder === classFolder);

            // clear out old class items
            for (const item of this.actor.items) {
              if (item._source.folder != defaultFolder && item._source.folder != null) { 
                item.delete();
              }
            }

            // add new class items
            for (const item of classItems) {
              const addItem = await itemPack.getDocument(item._id);
              this.actor.createEmbeddedDocuments('Item', [addItem]);
            }
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
   * Handle adding traumas.
   * @param {Event} the originating click event
   * @private
   */
  async _onAddDiscipline(event) {
    const currentDisciplines = (this.actor.system.magicDisciplines || []).filter(Boolean);
    const defaultDisciplines = Object.values(TEETH.disciplines);
    const filteredDisciplines = defaultDisciplines.filter(discipline => !currentDisciplines.includes(discipline));

    const template = await renderTemplate("systems/teeth/templates/apps/discipline.hbs", { currentDisciplines, filteredDisciplines });

    const dialog = new Dialog({
      title: game.i18n.localize("TEETH.ChooseDiscipline"),
      content: template,
      buttons: {
        add: {
          label: game.i18n.localize("TEETH.AddDiscipline"),
          callback: async (html) => {
            const elements = Array.from(html.find(".discipline.active"));
            const newDisciplines = elements.map(el => el.dataset.value);

            const customDiscipline = html.find("input.custom-discipline")[0].value;
            if (customDiscipline) {
              newDisciplines.push(customDiscipline);
            }

            await this.actor.update({ "system.magicDisciplines": newDisciplines });
          }
        }
      },
      default: "add",
      close: () => {},
      render: (html) => {
        html.find(".discipline").on("click", function() {
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
  async _onAddMethod(event) {
    const currentMethods = (this.actor.system.magicMethods || []).filter(Boolean);
    const defaultMethods = Object.values(TEETH.methods);
    const filteredMethods = defaultMethods.filter(method => !currentMethods.includes(method));

    const template = await renderTemplate("systems/teeth/templates/apps/method.hbs", { currentMethods, filteredMethods });

    const dialog = new Dialog({
      title: game.i18n.localize("TEETH.ChooseMethod"),
      content: template,
      buttons: {
        add: {
          label: game.i18n.localize("TEETH.AddMethod"),
          callback: async (html) => {
            const elements = Array.from(html.find(".method.active"));
            const newMethods = elements.map(el => el.dataset.value);

            const customMethod = html.find("input.custom-method")[0].value;
            if (customMethod) {
              newMethods.push(customMethod);
            }

            await this.actor.update({ "system.magicMethods": newMethods });
          }
        }
      },
      default: "add",
      close: () => {},
      render: (html) => {
        html.find(".method").on("click", function() {
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
   * Handled importing acquaintances for playbook from NPCs pack
   * @param {Event} the originating click event
   * @private
   */
  async _onImportAcquaintances(event) {
    const hunterClass = this.actor.system.hunterClass.split(".").at(-1)

    const npcPack = game.packs.get('teeth.npcs');
    await npcPack.getIndex()
    const npcFolder = npcPack.folders.find(p => p.name === hunterClass)._id;
    const classNpcs = npcPack.index.filter(p => p.folder === npcFolder);

    await this.actor.update({ "system.contacts" : classNpcs });
  }

  /**
   * Handled removing an acquaintance
   * @param {Event} the originating click event
   * @private
   */
  async _onRemoveAcquaintance(event) {
    const rmUuid = $(event.currentTarget).data("uuid");
    const currentAcqs = this.actor.system.contacts;
    const newAcqs = currentAcqs.filter(acq => acq.uuid != rmUuid);

    await this.actor.update({ "system.contacts" : newAcqs });
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
