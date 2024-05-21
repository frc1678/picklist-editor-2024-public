# Using the Picklist Editor

This is a guide on how to operate the Picklist Editor for the picklist meetings. This guide should be kept up-to-date with changes in the scripts and/or the spreadsheet.

## Reordering

The main feature of the Picklist Editor is the ability to reorder the teams in the list. To move a team in the order, simply change its corresponding number in the `Order` column of the Main Editor sheet to a new number specifying the new placement of the team. It is most intuitive to change the number to a decimal between the order numbers of the team before the targeted placement and the team after the targeted placement. For example, if a team in position 12 is to be moved to position 5, the entered number should be 4.5. Upon changing the placement of a team, the sidebar will automatically open for the next team.

## Renumbering

For special cases, renumbering in the `Order` column is necessary without sorting the list. This can be needed, for example, when the sheet is sorted by a data point and the order numbers need to be reset without resorting the teams again. To reset the numbers in the `Order` column without changing the team order, append a space to the `Order` header.

## DNPs

At the picklist meeting, a list of teams is created to be marked as Do Not Pick, or DNP. To mark a team as a DNP, go to the Main Editor and replace the team's corresponding number in the `Order` column with the letter `d`. The team will be deleted from the Main Editor and will appear in the DNPs sheet. To unmark a team as DNP, locate its entry in the DNPs sheet and click on the corresponding checkbox. The team will be deleted from the DNPs sheet and added back to the Main Editor sheet, at the bottom of the order. Try not to DNP or un-DNP multiple teams in rapid succession as this may break things. Teams can also be marked, and unmarked as DNP in the Final Picklist sheet. 

## Team Comparison Graphs

The Team Comparison Graphs sheet allows for graphing data of multiple teams in the matches they have played. The `Data Field` dropdown menu can be used to select a data point to graph. To change the teams that have their data graphed, change the values in the four colored boxes to the team numbers of choice. The data is displayed as a bar chart where a bar is displayed for each team in each match. The table below the bar chart shows which match each bar's value is coming from.

## Settings

The Settings sheet contains options that may be useful for operation of the Picklist Editor. The `Enable sidebar?` checkbox determines whether all sidebar functionality is enabled. The `Enable autosort?` checkbox controls whether automatic team sorting will happen when the placement numbers are edited. The `Reset things (click)` checkbox is a quick way to reset most of the contents of the Main Editor and DNPs sheets based on the Team Raw Data, and can be used to initially sort the teams by first pickability. The table titled `Comparison Graph Data Fields` determines what data points will appear in the dropdown menu in the Team Comparison Graphs sheet and what they will be labeled as.

## Final Picklist Commands

There are some commands that allow for additional operation in the Final Picklist. In the Main Editor, marking a team's corresponding number in the `Order` column with the letter `f` will add a team to the final picklist, while marking the corresponding number of the same team in the Final Picklist sheet with `r` will remove that team from the Final Picklist. 