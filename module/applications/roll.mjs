export async function createRollDialog (type, sheet, note) {
  if (!sheet && game.user.character) {
    sheet = game.user.character;
  } else if (!sheet && canvas.tokens.controlled[0]) {
    sheet = canvas.tokens.controlled[0].actor;
  }

  const rollConfig = CONFIG.TEETH.rolls;
  rollConfig.defaultType = type ? type : "fortune";

  if (type == "action") {
    rollConfig.defaultAction = note ? note : "scout";
  } else if (type == "resistance") {
    rollConfig.defaultAttribute = note ? note : "insight";
  } else if (type == "fortune") {
    rollConfig.diceNumber = 1;
  } else {
    rollConfig.defaultAction = "scout";
    rollConfig.defaultAttribute = "insight";
    if (!isNaN(note)) {
      rollConfig.diceNumber = parseInt(note, 10);
    } else {
      rollConfig.diceNumber = 0;
    }
  }

  const functions = {
    action: actionRoll,
    resistance: resistanceRoll,
    fortune: fortuneRoll,
    wilderness: wildernessRoll,
    engagement: engagementRoll,
    vice: indulgeVice
  }

  const html = await renderTemplate("systems/teeth/templates/apps/rollDialog.hbs", rollConfig);

  const dialog = new Dialog({
    title: game.i18n.localize("TEETH.Roll.Title"),
    content: html,
    buttons: {
      roll: {
        label: game.i18n.localize("TEETH.Roll.Submit"),
        icon: '<i class="fas fa-dice"></i>',
        callback: async (html) => {
          const formData = new FormData(html[0].querySelector("form"));
          const data = toIntData(Object.fromEntries(formData.entries()));

          const rollFunction = functions[data.rollType];
          const rollResult = await roll(data, sheet);
          rollResult.name = game.i18n.localize(rollConfig.type[data.rollType]);

          rollFunction(rollResult, sheet, data);
          console.log(rollResult);
          await renderRoll(rollResult, sheet);
          giveExp(rollResult.data, sheet);
        },
      },
      cancel: {
        icon: '<i class="fas fa-times"></i>',
        label: game.i18n.localize("TEETH.Roll.Cancel"),
        callback: () => {},
      },
    },
    default: "roll",
    close: () => {},
    render: (html) => {
      optionalBlocks(html);

      if (sheet) {
        getDiceNumber(html, sheet);
        html.find("#roll-type, #attribute, #action").on("change", function() {
          getDiceNumber(html, sheet);
        });
      }

      html.find("#roll-type").on("change", function() {
        optionalBlocks(html);
      });
    }
  },
  {
    classes: ["dialog", "teeth-roll-dialog"],
    width: 400,
    height: 200
  });
  dialog.render(true);
}

function toIntData(data) {
  for (const prop in data) {
    if (data.hasOwnProperty(prop) && !isNaN(data[prop])) {
      data[prop] = parseInt(data[prop], 10);
    }
  }

  return data;
}

function optionalBlocks(html) {
  const type = html.find("#roll-type")[0].value;

  const blocksArr = html.find(".optional");
  blocksArr.removeClass("active");

  for (const block of blocksArr) {
    const supportedType = block.dataset.connected.split(',');

    if (supportedType.includes(type)) block.classList.add("active");
  }
}

function getDiceNumber(html, sheet) {
  const formData = new FormData(html[0].querySelector("form"));
  const data = toIntData(Object.fromEntries(formData.entries()));
  const type = data.rollType;

  let diceNumber;
  const targetType = type;
  switch (targetType) {
    case 'action':
      const action = data.action;
      if (sheet.system.actions) diceNumber = sheet.system.actions[action].value;
      break;
    case 'resistance':
      const attribute = data.attribute;
      if (sheet.system.attributes) diceNumber = sheet.system.attributes[attribute].value;
      break;
    case 'vice':
      if (sheet.system.attributes) diceNumber = sheet.system.attributes.insight.value;
      for (let [attrKey, attribute] of Object.entries(sheet.system.attributes)) {
        if (attribute.value < diceNumber) {
          diceNumber = attribute.value
        }
      }
      break;
  }

  if (diceNumber || diceNumber == 0) html.find("#dice-number")[0].value = diceNumber;
}

async function roll(formData, sheet) {
  let diceToRoll = formData.diceNumber + formData.modifier;

  if (formData.assistance) diceToRoll++;
  if (formData.pushDice || formData.strangersBargain) diceToRoll++;
  if (formData.horses) diceToRoll++;
  if (formData.prepared) diceToRoll++;
  if (formData.cautious) diceToRoll++;
  if (formData.winter) diceToRoll--;
  if (formData.distance) diceToRoll--;
  if (formData.forest) diceToRoll--;

  let formula = "2d6kl"
  if (diceToRoll > 0) {
    formula = diceToRoll + "d6kh";
  }

  const rollResult = new Roll(formula);
  await rollResult.evaluate();

  rollResult.data = getRollData(rollResult, formData, diceToRoll);
  console.log(rollResult.data);
  sufferStress(sheet, rollResult.data.push.stress);

  return rollResult
}

function getRollData(rollResult, formData, diceToRoll) {
  const data = {
    type: formData.rollType,
    countAs: {
      show: true
    },
    assistance: formData.assistance,
    push: {
      count: 0,
      effect: formData.pushEffect,
      dice: formData.pushDice
    },
    strangersBargain: formData.strangersBargain,
    wilderness: {
      horses: formData.horses,
      prepared: formData.prepared,
      cautious: formData.cautious,
      winter: formData.winter,
      distance: formData.distance,
      forest: formData.forest
    },
    position: {
      key: formData.position
    },
    effect: {
      key: formData.effect
    },
    behaviour: {
      suffer: false
    }
  };

  if (formData.pushEffect) data.push.count++;
  if (formData.pushDice) data.push.count++;

  const effectSequence = CONFIG.TEETH.rolls.effectSequence;
  if (data.push.effect) {
    const index = effectSequence.indexOf(data.effect.key);
    data.effect.key = effectSequence[index + 1];
  }

  data.push.stress = data.push.count * 2;
  data.push.description = game.i18n.format("TEETH.Roll.BonusDescription.Push", {stress: data.push.stress});

  let numSixes = 0;
  rollResult.terms.map(t => t.results.map(
    r => {
      if (r.result <= 3) {
        r.classes = ["failure"];
      } else if (r.result <= 5) {
        r.classes = ["partial"];
      } else {
        numSixes += 1;
        r.classes = ["success"];
      }

      if (r.active) {
        r.classes.push("active");
      } else {
        r.classes.push("inactive");
      }

      r.classes = r.classes.join(" ");
    }
  ));

  if (numSixes > 1 && diceToRoll > 1) {
    data.countAs.key = "critical";
    const index = effectSequence.indexOf(data.effect.key);
    data.effect.key = effectSequence[index + 1];
  } else {
    switch (rollResult.total) {
      case 6:
        data.countAs.key = "success";
        break;
      case 4:
      case 5:
        data.countAs.key = "mixed";
        break;
      case 1:
      case 2:
      case 3:
        data.countAs.key = "fail";
    }
  }

  data.countAs.localizeKey = getLokalizeKey(data.countAs.key);
  data.countAs.localize = game.i18n.localize("TEETH.Roll.Result." + data.countAs.localizeKey);
  data.position.localizeKey = getLokalizeKey(data.position.key);
  data.position.localize = game.i18n.localize("TEETH.Roll.Position." + data.position.localizeKey);
  data.effect.localizeKey = getLokalizeKey(data.effect.key);
  data.effect.localize = game.i18n.localize("TEETH.Roll.Effect." + data.effect.localizeKey);

  Object.assign(data, rollResult.data);

  return data
}

function getLokalizeKey(key) {
  return key.charAt(0).toUpperCase() + key.slice(1)
}

function actionRoll(rollResult, sheet, formData) {
  const rollData = rollResult.data;

  rollData.effect.show = true;
  rollData.position.show = true;
  rollData.action = formData.action;
  const actionKey = rollData.action.charAt(0).toUpperCase() + rollData.action.slice(1);
  rollResult.name += ": " + game.i18n.localize("TEETH." + actionKey);

  rollData.description = game.i18n.localize("TEETH.Roll.Action." + rollData.position.localizeKey + "." + rollData.countAs.localizeKey);

  if (rollData.countAs.key != "fail") {
    rollData.effect.description = game.i18n.localize("TEETH.Roll.EffectDescription." + rollData.effect.localizeKey);
  }

  return rollResult
}

async function resistanceRoll(rollResult, sheet, formData) {
  const rollData = rollResult.data;

  rollData.countAs.show = false;
  const attributeKey = formData.attribute.charAt(0).toUpperCase() + formData.attribute.slice(1);
  rollResult.name += ": " + game.i18n.localize("TEETH." + attributeKey);
  rollData.description = game.i18n.localize("TEETH.Roll.Resistance.Result");

  let addStress = 6 - rollResult.total;
  if (rollData.countAs.key == "critical") {
    rollData.description += game.i18n.localize("TEETH.Roll.Resistance.Critical");
    addStress = -1;
  } else {
    rollData.description += game.i18n.format("TEETH.Roll.Resistance.Regular", {stress: addStress});
  }
  sufferStress(sheet, addStress);

  return rollResult
}

function fortuneRoll(rollResult) {
  const rollData = rollResult.data;

  rollData.description = game.i18n.localize("TEETH.Roll.Fortune." + rollData.countAs.localizeKey);

  const rollEffect = CONFIG.TEETH.rolls.fortuneRollResult[rollData.countAs.key];
  rollData.effect.description = game.i18n.localize("TEETH.Roll.EffectDescription." + rollEffect);

  return rollResult
}

function engagementRoll(rollResult) {
  rollResult.data.description = game.i18n.localize("TEETH.Roll.Engagement." + rollResult.data.countAs.localizeKey);

  return rollResult
}

function wildernessRoll(rollResult) {
  rollResult.data.countAs.show = false;
  rollResult.data.description = game.i18n.localize("TEETH.Roll.Wilderness." + rollResult.data.countAs.localizeKey);

  return rollResult
}

async function indulgeVice(rollResult, sheet) {
  rollResult.data.countAs.show = false;

  const clearStress = rollResult.total;

  if (sheet && sheet.system.stress) {
    const stress = sheet.system.stress.value - clearStress;

    if (stress < 0) {
      rollResult.data.description = game.i18n.localize("TEETH.Roll.IndulgeVice.Overindulgence");
      rollResult.data.description += "<ul>" + game.i18n.localize("TEETH.Roll.IndulgeVice.Trouble") + game.i18n.localize("TEETH.Roll.IndulgeVice.Brag") + game.i18n.localize("TEETH.Roll.IndulgeVice.Lost") + game.i18n.localize("TEETH.Roll.IndulgeVice.Trapped") + "</ul>";
      await sheet.update({ "system.stress.value": 0 });
    } else {
      rollResult.data.description = game.i18n.format("TEETH.Roll.IndulgeVice.Regular", {stress: clearStress});
      await sheet.update({ "system.stress.value": stress });
    }
  }

  return rollResult
}

async function renderRoll(renderData, sheet) {
  renderData.renderDice = renderData.dice[0].results;
  const speaker = ChatMessage.getSpeaker({ actor: sheet });
  const rollTemplate = await renderTemplate("systems/teeth/templates/apps/rollResult.hbs", renderData);
  renderData.toMessage({
    speaker: speaker,
    content: rollTemplate
  });
}

async function sufferStress(sheet, addStress) {
  if (!sheet || !sheet.system.stress) return;
  const stress = sheet.system.stress.value + addStress;

  if (stress < 9) {
    await sheet.update({ "system.stress.value": stress });
  } else {
    rollResult.data.behaviour.manifest = true;
    rollResult.data.behaviour.description = game.i18n.format("TEETH.Roll.ManifestBehaviour.Description", {stress: stress});
    await sheet.update({ "system.stress.value": 0 });
  }
}

async function giveExp(rollData, sheet) {
  const speaker = ChatMessage.getSpeaker({ actor: sheet });
  const supported = rollData.type == "action";

  if (rollData.position.key != "desperate" || !supported) return;

  let conAttribute = "???";
  for (const [attribute, actions] of Object.entries(CONFIG.TEETH.attributeLinks)) {
    if (actions.includes(rollData.action)) {
      conAttribute = attribute;
      break;
    }
  }

  const actorName = speaker.actor ? speaker.alias : "???";
  const message = game.i18n.format("TEETH.Roll.Result.Exp", {actor: actorName, attribute: conAttribute});
  const chatData = {
    user: game.user.id,
    speaker: speaker,
    content: message
  };
  ChatMessage.create(chatData);

  if (sheet && sheet.system.attributes) {
    const exp = sheet.system.attributes[conAttribute].exp;
    if (exp.value < exp.max) {
      exp.value++
      const path = "system.attributes." + conAttribute + ".exp.value"
      await sheet.update({ [path]: exp.value });
    }
  }
}
