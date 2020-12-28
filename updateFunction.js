clearInterval(extension_interval_function);
$("#extension-content").remove();
$("#extension-container").append('<div id="extension-content" class="block-content block-content-full"> Reloaded</div>');
function extensionUpdate() {
  let ext_cont = $("#extension-content");
  let diffSave = [];
  let extensionLineContainer = "<h5 class='font-w400 font-size-sm text-combat-smoke m-1'>";
  ext_cont.empty();
  skillXP.forEach((value, index) => {
    if (value != old[0][index]) {
      let diff = (value - old[0][index]);
      diffSave.push({index:index, xpm: diff});
      ext_cont.html(ext_cont.html() + extensionLineContainer + "<img class='nav-img' src='" + SKILLS[index].media + "'/>" + SKILLS[index].name + ": " + Math.round(diff) + " xp/m</h5>");
    }
  });
  old.push(Array.from(skillXP));
  if (old.length >= (60000/ext_up_interval | 0)+1){
    while(old.length >= (60000/ext_up_interval | 0)+1){
      old.shift();
    }
  }
  if(diffSave.length != 0){
    ext_cont.html("<h5 class='font-w700 text-center m-1 mb-2'> XPM</h5>" + ext_cont.html());
    ext_cont.html(ext_cont.html() + "<h5 class='font-w700 text-center m-1 mb-2'> Time until next level</h5>");
    diffSave.forEach((value) => {
      let timeToLevel = Math.round((exp.level_to_xp(skillLevel[value.index] + 1) - skillXP[value.index])/value.xpm);
      ext_cont.html(ext_cont.html() + extensionLineContainer +"<img class='nav-img' src='" + SKILLS[value.index].media + "'/>" + SKILLS[value.index].name + ": " + timeToLevel + " minutes</h5>");
    });
  }
};
extension_interval_function = setInterval(extensionUpdate, ext_up_interval);
console.log("Reloaded");
