javascript:$("#main-container").append('<div id="extension-container" class="block block-themed mb-0 modal-dialog" style="position: fixed;margin: 5px;bottom: 5px;z-index: 999;max-width: 500px;"><h3 id="extension-header" class="block-header"> Melvor Idle Extension</h3><div id="extension-content" class="block-content block-content-full"> insert content here </div></div>');
let ext_up_interval = 10000;
let old = [Array.from(skillXP)];
function extensionUpdate() {
  let ext_cont = $("#extension-content");
  let diffSave = [];
  let extensionLineContainer = "<h5 class='font-w400 font-size-sm text-combat-smoke m-1'>";
  ext_cont.empty();
  skillXP.forEach((value, index) => {
    if (value != old[0][index]) {
      let diff = (value - old[0][index]);
      diffSave.push({index:index, xpm: diff});
      ext_cont.html(ext_cont.html() + extensionLineContainer + SKILLS[index].name + ": " + Math.round(diff) + " xp/m</h5>");
    }
  });
  old.push(Array.from(skillXP));
  if (old.length == 7){
    old.shift();
  }
  if(diffSave.length != 0){
    ext_cont.html("<h5 class='font-w700 text-center m-1 mb-2'> XPM</h5>" + ext_cont.html());
    ext_cont.html(ext_cont.html() + "<h5 class='font-w700 text-center m-1 mb-2'> Time until next level</h5>");
    diffSave.forEach((value) => {
      let timeToLevel = Math.round((exp.level_to_xp(skillLevel[value.index] + 1) - skillXP[value.index])/value.xpm);
      ext_cont.html(ext_cont.html() + extensionLineContainer + SKILLS[value.index].name + ": " + timeToLevel + " minutes</h5>");
    });
  }
};
let extension_interval_function = setInterval(extensionUpdate, ext_up_interval);
console.log("loaded");
