/* Function to move a team to the final picklist from the main editor */

function moveToFinalPickList(
    eventRange: GoogleAppsScript.Spreadsheet.Range,
) {
    // Get team number
    var teamNumber: string | number = mainEditorSheet
        .getRange(eventRange.getRow(), 1)
        .getValue(); 
    // Whether final picklist has the team already
    if (finalPicklistSheet.createTextFinder(teamNumber.toString()).findNext() == null) {
        // Add new row to final picklist at bottom
        finalPicklistSheet.appendRow([teamNumber])  
        // Renumber the final picklist
        renumberOrder(finalPicklistSheet)  
        // Add the formulas again
        fixFormulas(finalPicklistSheet)
    }
        
    // Renumber main editor to get rid of the "f" character
    renumberOrder(mainEditorSheet)
}