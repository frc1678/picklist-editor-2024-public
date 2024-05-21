const lfm = [];
const notLFM = [
  "foul_cc",
  "first_pickability",
  "second_pickability",
  "which_one",
  "defensive_rating_second_pickability",
  "defense_proxy_second_pickability",
  "scoring_second_pickability",
  "ferrying_second_pickability",
  "driver_field_awareness",
  "driver_quickness",
  "driver_ability",
  "can_intake_ground",
  "weight",
  "dnp_rating",
  "fragility",
  "which_fragility",
  "electrical_fragility",
  "mechanical_fragility",
];

function toggleLFM(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
  sheet.showRows(1);
  sheet.showRows(2);
  
  // Whether you are in the main editor or the final picklist
  let start = (sheet.getName() == "Main Editor")? 3 : 4
  // Checking if LFM checkbox is checked
  if (sheet.getRange("A3").getValue()) {
    // Loop through every column on second row and add lfm to them if they aren't lfm already
    for (let i = start; i <= sheet.getLastColumn(); i++) {
      let range = sheet.getRange(2, i);
      if (!notLFM.includes(range.getValue())) {
        if (!range.getValue().startsWith("lfm")) {
          range.setValue("lfm_" + range.getValue());
        }
      }
    }
  } else {
    
    // Loop through every column on the second row and remove lfm to them if they aren't in the notLFM list.
    for (let i = start; i <= sheet.getLastColumn(); i++) {
      let range = sheet.getRange(2, i);
      if (!notLFM.includes(range.getValue())) {
        if (range.getValue().startsWith("lfm")) {
          range.setValue(range.getValue().replace("lfm_", ""));
        }
      }
    }
  }

  sheet.hideRows(1);
  sheet.hideRows(2);
}
