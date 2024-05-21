// Copyright (c) 2023 FRC 1678 Citrus Circuits

var ss = SpreadsheetApp.getActiveSpreadsheet();
var mainEditorSheet = ss.getSheetByName("Main Editor");
var dnpsSheet = ss.getSheetByName("DNPs");
var settingsSheet = ss.getSheetByName("Settings");
var imagesSheet = ss.getSheetByName("Image Raw Data");
var teamRawDataSheet = ss.getSheetByName("Team Raw Data");
var finalPicklistSheet = ss.getSheetByName("Final Picklist");

/**
 * Called when the spreadsheet is edited.
 * Determines what functionality should run depending on what part was edited.
 */
function main(event: any) {
    var eventRange: GoogleAppsScript.Spreadsheet.Range = event.range;
    var sheet = eventRange.getSheet();
    var nextTeam: string | number = sheet.getRange(eventRange.getRow() + 1, 1).getValue();

    switch (sheet.getSheetName()) {
        // Something in the Main Editor was edited
        case "Main Editor":
            // Make sure only one cell was edited
            if (eventRange.getNumColumns() != 1 || eventRange.getNumRows() != 1) {
                break;
            }
        
            // Quick renumber without resorting (cell B3 is edited)
            else if (eventRange.getA1Notation() == "B3") {
                renumberOrder(sheet);
            }
            // Autosort (cell in column B is edited)
            else if (eventRange.getColumn() == 2 && eventRange.getRow() > 3) {
                // Killswitch in settings sheet to disable script
                if (settingsSheet.getRange("C2").getValue() != true) {
                    return;
                }

                // If the order number is changed to 'd', 'dnp', or something similar, move the team to the DNP list
                if (/d(?:np)?/i.test(eventRange.getValue())) {
                    // Move the team to the DNP list
                    moveToDnp(eventRange, sheet);
                    renumberOrder(sheet);
                } else if (/f/i.test(eventRange.getValue())) {
                    moveToFinalPickList(eventRange)
                }
                else {
                    if (eventRange.getColumn() == 2) {
                        // Resort the teams
                        sheet.getRange("A4:B").sort(eventRange.getColumn());
                        // Renumber the draft order
                        renumberOrder(sheet);
                    }
                }
            } 
            else if (eventRange.getA1Notation() == "A3") {
                toggleLFM(sheet)
            } else {
                return;
            }
            break;
        case "Final Picklist":
            // Make sure only one cell was edited
            if (eventRange.getNumColumns() != 1 || eventRange.getNumRows() != 1) {
                break;
            }
            // Quick renumber without resorting (cell B3 is edited)
            else if (eventRange.getA1Notation() == "B3") {
                renumberOrder(sheet);
            }
            // Autosort (cell in column B is edited)
            else if (eventRange.getColumn() == 2 && eventRange.getRow() > 3) {
                // Killswitch in settings sheet to disable script
                if (settingsSheet.getRange("C2").getValue() != true) {
                    return;
                }

                // If the order number is changed to 'd', 'dnp', or something similar, move the team to the DNP list
                if (/d(?:np)?/i.test(eventRange.getValue())) {
                    // Move the team to the DNP list
                    moveToDnp(eventRange, sheet);
                    renumberOrder(sheet);
                } else if (/r/i.test(eventRange.getValue())) {
                    sheet.deleteRow(eventRange.getRow())
                    renumberOrder(sheet)
                } 
                else {
                    if (eventRange.getColumn() == 2) {
                        // Resort the teams
                        sheet.getRange("A4:B").sort(eventRange.getColumn());
                        // Renumber the draft order
                        renumberOrder(sheet);
                    }
                }
            } 
            else if (eventRange.getA1Notation() == "A3") {
                toggleLFM(sheet)
            } else {
                return;
            }
            break;
        // Something in the Settings was edited
        case "Settings":
            switch (eventRange.getA1Notation()) {
                case "D2":
                    // The reset order button was clicked
                    resetOrder();
                    eventRange.setValue("FALSE");
                    break;
                case "B4":
                    // The first pick mode button was clicked
                    goToFirstPick();
                    eventRange.setValue("FALSE");
                    break;
                case "C4":
                    // The second pick mode button was clicked
                    goToSecondPick();
                    eventRange.setValue("FALSE");
                    break;
            }
            // updateGrosbeak(mainEditorSheet, dnpsSheet);
            return;

        // Something in the DNPs was edited
        case "DNPs":
            // One of the teams is being removed from DNP
            if (eventRange.getColumn() == 2) {
                unDnp(eventRange);
            }
            //updateGrosbeak(mainEditorSheet, dnpsSheet);
            return;

        // There is nothing to be done for the edited sheet
        default:
            return;
    }
}
