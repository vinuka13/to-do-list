module.exports.getdate = getdate;

function getdate() {
  var today = new Date();
  var options = {
    weekday: "long",
    day : "numeric",
    month : "long"
  };

  var kindofday = today.toLocaleDateString("en-US", options);
  return kindofday;
}

module.exports.getday = getday;
 
function getday() {
  var today = new Date();
  var options = {
    weekday: "long",
  };

  var kindofday = today.toLocaleDateString("en-US", options);
  return kindofday;
}
