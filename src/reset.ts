// Copyright (c) 2023 FRC 1678 Citrus Circuits

/**
 * Resets the order of the teams based on the first pickability ratings.
 * Also clears DNPs and fixes missing formulas.
 */
function resetOrder() {
    // Get the range of the entire teams list in Team Raw Data
    var range = teamRawDataSheet.getRange(2, 1, teamRawDataSheet.getLastRow(), 1);
    // Get the range to copy the teams into
    var rangeToCopyTo = mainEditorSheet.getRange(4, 1, range.getNumRows() - 3, 1);
    // Clear the outdated teams list
    rangeToCopyTo.clearContent();
    // Copy the new teams list
    range.copyTo(rangeToCopyTo, { contentsOnly: true });
    // Clear the DNP list
    if (dnpsSheet.getLastRow() != 1) dnpsSheet.deleteRows(2, dnpsSheet.getLastRow() - 1);
    // Fix any missing formula cells in the main editor
    fixFormulas(mainEditorSheet);
    // Go to the first pick mode
    goToFirstPick();
    // Delete the last row because an extra empty row is made for some reason I still can't figure out why
    // mainEditorSheet.deleteRow(mainEditorSheet.getLastRow());
}

/**
 * Copies the formulas in the main editor down to any cells that are missing them.
 */
function fixFormulas(sheet: GoogleAppsScript.Spreadsheet.Sheet) {
    // Whether you want to fix formulas in the Main Editor or Final Picklist
    var firstPickCell = findCell(sheet, "1st");
    var secondPickCell = findCell(sheet, "2nd");
    var firstPickTopLeftCorner = sheet.getRange(4, firstPickCell.getColumn(), 1, 1);
    var secondPickTopLeftCorner = sheet.getRange(4, secondPickCell.getColumn(), 1, 1);
    
    // Reset the formula in the cell in the top left corner
    firstPickTopLeftCorner.setValue(`=VLOOKUP($A4, 'Team Raw Data'!$A$1:$ZZ$99, ${sheet.getRange(1, firstPickCell.getColumn(), 1, 1).getA1Notation().charAt(0)}$1, FALSE)`);

    var topRow = sheet.getRange(4, firstPickCell.getColumn(), 1, sheet.getLastColumn() - 2);
    
    // Copy the formulas to the right in the top row
    firstPickTopLeftCorner.copyTo(topRow, SpreadsheetApp.CopyPasteType.PASTE_FORMULA, false);
    // Copy the final picklist formula to the third column
    
    // Copy the formulas down the rest of the rows
    var allRows = sheet.getRange(
        4,
        firstPickCell.getColumn(),
        sheet.getLastRow() - 3,
        sheet.getLastColumn() - 2
    );
    topRow.copyTo(allRows, SpreadsheetApp.CopyPasteType.PASTE_FORMULA, false);

    // Reset formulas for delta column
    if (sheet == finalPicklistSheet) {
        var finalTopLeftCorner = sheet.getRange(4, 3, 1, 1);
        finalTopLeftCorner.setValue("=IFNA(-$B4+INDEX('Main Editor'!B:B,MATCH(A4,'Main Editor'!A:A,0),0), \"d\")");
        var finalColumn = finalPicklistSheet.getRange(4, 3, finalPicklistSheet.getMaxRows() - 3, 1);
        finalTopLeftCorner.copyTo(finalColumn, SpreadsheetApp.CopyPasteType.PASTE_FORMULA, false);
    }

    // Set function for 2nd pickability
    var defensiveRatingLeftCorner = sheet.getRange(4, findCell(sheet, "defensive_rating_second_pickability").getColumn(), 1, 1);
    var defensiveProxyLeftCorner = sheet.getRange(4, findCell(sheet, "defense_proxy_second_pickability").getColumn(), 1, 1);
    var scoringLeftCorner = sheet.getRange(4, findCell(sheet, "scoring_second_pickability").getColumn(), 1, 1);
    var secondFerryingLeftCorner = sheet.getRange(4, findCell(sheet, "ferrying_second_pickability").getColumn(), 1, 1);
    secondPickTopLeftCorner.setValue(`=Max(${defensiveRatingLeftCorner.getA1Notation()}:${secondFerryingLeftCorner.getA1Notation()})`);
    var secondPickCol = sheet.getRange(4, secondPickCell.getColumn(), sheet.getLastRow() - 3, 1);
    secondPickTopLeftCorner.copyTo(secondPickCol, SpreadsheetApp.CopyPasteType.PASTE_FORMULA, false);

    // Set functions for the column depicting which pickability second pickability is displaying
    var whichCol = findCell(sheet, "which_one").getColumn();
    var whichColTopCell = sheet.getRange(4, whichCol, sheet.getLastRow() - 3, 1);
    whichColTopCell.setValue(`=SWITCH(${secondPickTopLeftCorner.getA1Notation()}, ${secondFerryingLeftCorner.getA1Notation()}, \"Ferrying"\ , ${scoringLeftCorner.getA1Notation()}, \"Scoring"\ , ${defensiveProxyLeftCorner.getA1Notation()}, \"Defense"\ , \"Defense"\)`); 
    whichColTopCell.copyTo(sheet.getRange(4, whichCol, sheet.getLastRow() - 3, 1), SpreadsheetApp.CopyPasteType.PASTE_FORMULA, false);
   
    // Fix the conditional formatting rules that get messed up when copying formulas
    var rules = sheet.getConditionalFormatRules();
    for (var i = 0; i < rules.length; i++) {
        if (rules[i].getRanges()[0].getA1Notation().startsWith("C") || rules[i].getRanges()[0].getA1Notation().startsWith("D")) {
            var newRule = rules[i].copy();
            newRule.setRanges([sheet.getRange(4, firstPickCell.getColumn(), sheet.getLastRow() - 3, 1)]);
            rules[i] = newRule;
            sheet.setConditionalFormatRules(rules);
            break;
        }
    }
}

function findCell(sheet: GoogleAppsScript.Spreadsheet.Sheet, value: string): GoogleAppsScript.Spreadsheet.Range {
    return sheet.createTextFinder(value).findNext();
}
