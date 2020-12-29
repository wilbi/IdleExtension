function parseBars() {
  let bars = $('span[id^="skill-progress-xp"]');
  while(bars.length === 0){
    sleep(1000);
    bars = $('span[id^="skill-progress-xp"]');
  }
  let current_xps = {};
  let target_xps = {};
  let keys = []
  bars.each((i, bar) => {
    let xps = bar.textContent.replaceAll(",","").split("/")
    let skill_id = bar.id.split("-")
    skill_id = skill_id[skill_id.length -1]
    current_xps[skill_id] = parseInt(xps[0],10)
    target_xps[skill_id] = parseInt(xps[1],10)
    keys.push(skill_id)
  })
  bars = $('small[id^="skill-progress-xp"]')
  bars.each((i, bar) => {
    let xps = bar.textContent.replaceAll(",","").split("/")
    let skill_id = bar.id.split("-")
    skill_id = skill_id[skill_id.length -1]
    current_xps[skill_id] = parseInt(xps[0],10)
    target_xps[skill_id] = parseInt(xps[1],10)
    keys.push(skill_id)
  })
  current_xps["keys"] = keys
  target_xps["keys"] = keys
  return [current_xps, target_xps]
}

function extensionUpdate(old, ext_up_interval, skills) {
  let ext_cont = $("#extension-content");
  let diffSave = [];
  let extensionLineContainer = "<h5 class='font-w400 font-size-sm text-combat-smoke m-1'>";
  let memorySize = (60000/ext_up_interval | 0)+1;
  ext_cont.empty();
  tmp_xps = parseBars();
  current_xps = tmp_xps[0]
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
  old.push(JSON.parse(JSON.stringify(tmp_xps[0])));
  if (old.length >= memorySize){
    while(old.length >= memorySize){
      old.shift();
    }
  }
  if(diffSave.length != 0){
    ext_cont.html("<h5 class='font-w700 text-center m-1 mb-2'> XPM</h5>" + ext_cont.html());
    ext_cont.html(ext_cont.html() + "<h5 class='font-w700 text-center m-1 mb-2'> Time until next level</h5>");
    diffSave.forEach((value) => {
      let timeToLevel = Math.round((tmp_xps[1][value.index] - tmp_xps[0][value.index])/value.xpm);
      ext_cont.html(ext_cont.html() + extensionLineContainer +"<img class='nav-img' src='" + skills[value.index].media + "'/>" + skills[value.index].name + ": " + timeToLevel + " minutes</h5>");
    });
  }
};
$(document).ready( () => {
  if($("#extension-container").length === 0){
    $("#main-container").append('<div id="extension-container" class="block block-themed mb-0 modal-dialog" style="position: fixed;margin: 5px;bottom: 5px;z-index: 999;max-width: 500px;"><h3 id="extension-header" class="block-header"> Melvor Idle Extension</h3><div id="extension-content" class="block-content block-content-full"></div></div>');
    console.log("Container Loaded");
    $("#extension-container").on("click", ()=>{
      if($("#extension-content").filter(":hidden").length === 0){
          $("#extension-content").hide()
      } else {
        $("#extension-content").show()
      }

    });
  } else {
    console.log("Reloaded")
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
  }
  console.log("Bars found");
  let ext_up_interval = 5000;
  let current_xps = [];
  let target_xps = [];
  let tmp_xps = parseBars();
  console.log("Initial XP load done");
  let old = [JSON.parse(JSON.stringify(tmp_xps[0]))];
  console.log(ext_up_interval)
  setInterval(extensionUpdate.bind(null,old,ext_up_interval,skills), ext_up_interval)
  console.log("Interval set")
  extensionUpdate();
});
