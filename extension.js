

function parseBar(bar, current_xps, target_xps, keys){
  // bar.id === 'skill-progress-xp-16' Mage level, has 2 bars, 1 is small, other is span
  if(bar.id === 'skill-progress-xp-11') {return;}
  let xps = bar.textContent.replaceAll(",","").split("/");
  let skill_id = bar.id.split("-");
  skill_id = skill_id[skill_id.length -1];
  cxp = parseInt(xps[0],10);
  txp = parseInt(xps[1],10);
  if (Number.isNaN(txp) || Number.isNaN(cxp)){ return; }
  if(current_xps[skill_id] === undefined){
    current_xps[skill_id] = cxp;
    target_xps[skill_id] = txp;
    keys.push(skill_id);
  }
}
function parseBars() {
  let bars = $('span[id^="skill-progress-xp"]');
  if(bars.length === 0){
    return [null, null]
  }
  let current_xps = {};
  let target_xps = {};
  let keys = [];
  let i;
  for(i = 0; i < bars.length; i++){
    parseBar(bars[i], current_xps, target_xps, keys)
  }
  bars = $('small[id^="skill-progress-xp"]');
  for(i = 0; i < bars.length; i++){
      parseBar(bars[i], current_xps, target_xps, keys)
    }
  current_xps["keys"] = keys;
  target_xps["keys"] = keys;
  return [current_xps, target_xps];
}

function extensionUpdate(old, ext_up_interval, skills) {
  let ext_cont = $("#extension-content");
  let diffSave = [];
  let extensionLineContainer = "<h5 class='font-w400 font-size-sm text-center m-1'>";
  let memorySize = (60000/ext_up_interval | 0);
  ext_cont.empty();
  tmp_xps = parseBars();
  current_xps = tmp_xps[0]
  target_xps = tmp_xps[1]
  let totalXP = current_xps.keys.reduce((sum, curr) => {
    return sum + current_xps[curr];
  });
  if(totalXP === "0000000000069069069069069069000000690"){
    console.log("Parse returned init data")
    return null
  }
  totalXP = old[0].keys.reduce((sum, curr) => {
    return sum + old[0][curr];
  });
  if(totalXP === "0000000000069069069069069069000000690"){
    console.log("Old had init data, rewriting")
    old[0] = JSON.parse(JSON.stringify(current_xps));
    return null
  }
  current_xps.keys.forEach((index) => {
    value = current_xps[index]
    if (value != old[0][index]) {
      let diff = (value - old[0][index]);
      if (old.length < memorySize) {
        diff = diff*(memorySize/old.length);
      }
      diffSave.push({index:index, xpm: diff});
      ext_cont.html(ext_cont.html() + extensionLineContainer +"<img class='nav-img' src='" + skills[index].media + "'/>" + skills[index].name + ": " + Math.round(diff) + " xp/m</h5>");
    }
  });
  old.push(JSON.parse(JSON.stringify(current_xps)));
  if (old.length > memorySize){
    while(old.length > memorySize){
      old.shift();
    }
  }
  if(diffSave.length != 0){
    ext_cont.html("<h5 class='font-w700 text-center m-1 mb-2'>XPM</h5>" + ext_cont.html());
    ext_cont.html(ext_cont.html() + "<h5 class='font-w700 text-center m-1 mb-2'> Time until next level</h5>");
    diffSave.forEach((value) => {
      let index = parseInt(value.index);
      if(Number.isNaN(target_xps[index])) {return;}
      let timeToLevel = Math.round((target_xps[index] - current_xps[index])/value.xpm);
      ext_cont.html(ext_cont.html() + extensionLineContainer +"<img class='nav-img' src='" + skills[index].media + "'/>" + skills[index].name + ": " + timeToLevel + " minutes</h5>");
      if(index === 3) { // Cooking required item calc
        let quantity = parseInt($("#skill-cooking-food-selected-qty").text().replaceAll(",",""));
        let itemXP = parseInt($("#skill-cooking-food-selected-xp").text());
        if(!Number.isNaN(quantity) && !Number.isNaN(itemXP)){
          let mastery = parseInt($("#mastery-screen-skill-3").text());
          let successChance = ((mastery*0.6)+70 >= 99) ? 0.99 : (mastery*0.6+70)/100;
          let futureXP = (current_xps[index]+quantity*itemXP)*successChance;
          let targetXP = target_xps[index];
          let requiredItems = Math.ceil(((targetXP-current_xps[index])/itemXP)*(1/successChance));
          if( futureXP >= targetXP){
            ext_cont.html(ext_cont.html() + extensionLineContainer + "Items until next level: " + requiredItems + "</h5>");
          } else {
            ext_cont.html(ext_cont.html() + extensionLineContainer + "More items required for a level: " + (requiredItems-quantity));
          }
        }
      } else if(index === 5) { // Smithing required item calc
        let quantity = parseInt($("#smithing-item-have-0").text().replaceAll(",",""));
        let required = parseInt($("#smith-item-reqs").text())
        quantity = Math.floor(quantity/required)
        console.log(quantity, required)
        let itemXP = parseInt($("#smith-item-produce").text().split(" ")[1]);
        if(!Number.isNaN(quantity) && !Number.isNaN(itemXP)){
          let mastery = parseInt($("#mastery-screen-skill-5").text());
          let preserve = 0;
          if(mastery === 99){
            preserve = 0.3;
          } else {
            breakpoint = mastery - mastery % 10;
            preserve = 0.05 * breakpoint/20
          }
          let masteryXP = parseFloat($("#mastery-pool-xp-progress-5").text());
          preserve = (masteryXP/25 <= 2) ? (preserve + (Math.floor(masteryXP/25)*0.05)) : (preserve + 0.10)
          let futureXP = (current_xps[index]+(quantity*itemXP)*(1+preserve));
          let targetXP = target_xps[index];
          let requiredItems = Math.ceil(((targetXP-current_xps[index])/(itemXP/required)));
          if( futureXP >= targetXP){
            ext_cont.html(ext_cont.html() + extensionLineContainer + "Items until next level: " + requiredItems + "</h5>");
          } else {
            ext_cont.html(ext_cont.html() + extensionLineContainer + "More items required for a level: " + (requiredItems-quantity));
          }
        }
      } else if (index === 13) { //Fletcing  required item calc
        let quantities = $("#fletch-item-have").children("span")
        let requirements = $("#fletch-item-reqs").text().split(" ")
        quantites.forEach((item, i) => {
          let quantity = parseInt(item.innerText.replaceAll(",",""))
          requires = requirements[i]
          return Math.floor(quantity/requires)
        });

        let itemXP = parseInt($("#fletch-item-produce").text().split(" ")[1]);
      }

    });
  }
};
$(document).ready(() => {
  let tmp_xps = parseBars();
  console.log("Document ready")
  if($("#extension-container").length === 0){
    $("#page-container").append('<div id="extension-container" class="block block-themed mb-0" style="position: fixed;margin: 5px;bottom: 5px;z-index: 999;max-width: 500px;"><h3 id="extension-header" class="block-header"> Melvor Idle Extension</h3><div id="extension-content" class="block-content block-content-full"></div></div>');
    console.log("Container Loaded");
  } else {
    console.log("Reloaded");
  }

  let skills = {
    "0": {
      "name": "Woodcutting",
      "media": "assets/media/skills/woodcutting/woodcutting.svg",
      "hasMastery": true,
      "maxLevel": 99
    },
    "1": {
      "name": "Fishing",
      "media": "assets/media/skills/fishing/fishing.svg",
      "hasMastery": true,
      "maxLevel": 99
    },
    "2": {
      "name": "Firemaking",
      "media": "assets/media/skills/firemaking/firemaking.svg",
      "hasMastery": true,
      "maxLevel": 99
    },
    "3": {
      "name": "Cooking",
      "media": "assets/media/skills/cooking/cooking.svg",
      "hasMastery": true,
      "maxLevel": 99
    },
    "4": {
      "name": "Mining",
      "media": "assets/media/skills/mining/mining.svg",
      "hasMastery": true,
      "maxLevel": 99
    },
    "5": {
      "name": "Smithing",
      "media": "assets/media/skills/smithing/smithing.svg",
      "hasMastery": true,
      "maxLevel": 99
    },
    "6": {
      "name": "Attack",
      "media": "assets/media/skills/attack/attack.svg",
      "hasMastery": false,
      "maxLevel": 99
    },
    "7": {
      "name": "Strength",
      "media": "assets/media/skills/strength/strength.svg",
      "hasMastery": false,
      "maxLevel": 99
    },
    "8": {
      "name": "Defence",
      "media": "assets/media/skills/defence/defence.svg",
      "hasMastery": false,
      "maxLevel": 99
    },
    "9": {
      "name": "Hitpoints",
      "media": "assets/media/skills/hitpoints/hitpoints.svg",
      "hasMastery": false,
      "maxLevel": 99
    },
    "10": {
      "name": "Thieving",
      "media": "assets/media/skills/thieving/thieving.svg",
      "hasMastery": true,
      "maxLevel": 99
    },
    "11": {
      "name": "Farming",
      "media": "assets/media/skills/farming/farming.svg",
      "hasMastery": true,
      "maxLevel": 99
    },
    "12": {
      "name": "Ranged",
      "media": "assets/media/skills/ranged/ranged.svg",
      "hasMastery": false,
      "maxLevel": 99
    },
    "13": {
      "name": "Fletching",
      "media": "assets/media/skills/fletching/fletching.svg",
      "hasMastery": true,
      "maxLevel": 99
    },
    "14": {
      "name": "Crafting",
      "media": "assets/media/skills/crafting/crafting.svg",
      "hasMastery": true,
      "maxLevel": 99
    },
    "15": {
      "name": "Runecrafting",
      "media": "assets/media/skills/runecrafting/runecrafting.svg",
      "hasMastery": true,
      "maxLevel": 99
    },
    "16": {
      "name": "Magic",
      "media": "assets/media/skills/magic/magic.svg",
      "hasMastery": false,
      "maxLevel": 99
    },
    "17": {
      "name": "Prayer",
      "media": "assets/media/skills/prayer/prayer.svg",
      "hasMastery": false,
      "maxLevel": 99
    },
    "18": {
      "name": "Slayer",
      "media": "assets/media/skills/slayer/slayer.svg",
      "hasMastery": false,
      "maxLevel": 99
    },
    "19": {
      "name": "Herblore",
      "media": "assets/media/skills/herblore/herblore.svg",
      "hasMastery": true,
      "maxLevel": 99
    }
  };
  let ext_up_interval = 5000;
  let current_xps = [];
  let target_xps = [];
  console.log("Initial XP load done");
  let old = [JSON.parse(JSON.stringify(tmp_xps[0]))];
  setInterval(extensionUpdate.bind(null,old,ext_up_interval,skills), ext_up_interval);
  console.log("Interval set");
  //unfunctional.. why? Registering this way should work if the script is loaded when the document is ready.
  //Extension seems to load way before the game is actually loaded, might have to figure out a better way to load the extension.
  $("body").on("click",".swal2-container", (a) => {
    old = [JSON.parse(JSON.stringify(parseBars()[0]))];
    console.log("Return from AFK");
  })
  $("body").on("click", "#extension-container", () => {
    if($("#extension-content").filter(":hidden").length === 0){
        $("#extension-content").hide();
        $("#extension-header").text("M");
    } else {
      $("#extension-content").show();
      $("#extension-header").text("Melvor Idle Extension");
    }
  });
  console.log("Return from AFK set")
});
