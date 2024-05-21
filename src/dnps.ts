// Copyright (c) 2023 FRC 1678 Citrus Circuits

/**
 * Moves the selected team to the DNP sheet.
 */
function moveToDnp(
    eventRange: GoogleAppsScript.Spreadsheet.Range,
    sheet: GoogleAppsScript.Spreadsheet.Sheet
) {
    // sheet is the sheet the team is being moved from
    // eventRange is the cell in the team row that was edited
    var teamNumber: string | number = sheet
        .getRange(eventRange.getRow(), 1)
        .getValue();

    // Appends team number to "DNPs" sheet and deletes it from main editor
    // Checks if team is not already dnped to make sure you can't double dnp from final picklist sheet
    if (findCell(dnpsSheet, teamNumber.toString()) == null) {
        dnpsSheet.appendRow([teamNumber]);
        sheet.deleteRow(eventRange.getRow());
        // Add a checkbox next to the team number
        dnpsSheet.getRange(dnpsSheet.getLastRow(), 2).insertCheckboxes();
    }
    
    // Replaces final picklist delta with d if team was dnped
    if (findCell(finalPicklistSheet, teamNumber.toString()) != null && sheet == mainEditorSheet) {
        var dnpedTeam = finalPicklistSheet.createTextFinder(teamNumber.toString()).findNext()
        finalPicklistSheet.getRange(dnpedTeam.getRow(), 3).setValue("d")
    }
}

/**
 * Removes a team from the DNP list and puts it back into the main editor at the bottom.
 */
function unDnp(eventRange: GoogleAppsScript.Spreadsheet.Range) {
    var teamNumber = dnpsSheet.getRange(eventRange.getRow(), 1).getValue();
    
    // Only add team back if it doesn't exist
    if (findCell(mainEditorSheet, teamNumber) == null) {
        // Add the team back to the main editor.
        mainEditorSheet.appendRow([teamNumber]);
        // Renumber the order of the teams in the main editor.
        renumberOrder(mainEditorSheet);
        // Fix any missing formula cells in the main editor.
        fixFormulas(mainEditorSheet);
    } 
    if (findCell(finalPicklistSheet, teamNumber) == null) {
        // Add the team to the bottom of the final picklist
        finalPicklistSheet.appendRow([teamNumber]);
        renumberOrder(finalPicklistSheet);
        fixFormulas(finalPicklistSheet);
    }
    // Delete the team from the DNP list.
    dnpsSheet.deleteRow(eventRange.getRow());
}
