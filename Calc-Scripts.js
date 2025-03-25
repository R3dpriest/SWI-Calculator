/* AI helped me reshape my table sorting script. Helped me convert some of it to jquery */

$(document).ready(function() {
	$('#SortContainer').on('change', '.Sort', SelectSort);
	//note to self, dont move.
	var FuncMapping = {"Name": 0, "Tier": 1, "Type": 2, "Style": 3 };
	function filterAndSortTable() {
		var FuncSortA = $('#SimpleSorterA').val();
		var FuncSortIndex = FuncMapping[FuncSortA];
		var sortOrderRaw = $('#SimpleSorterB').val();
		var sortOrder = (sortOrderRaw.toLowerCase() === "ascending") ? "asc" : "desc";
		var selectedModule = $('#SimpleModules').val();
		var $FuncTar = $('#DataContent tbody');
		var $Funcrows  = $FuncTar.children('tr');
		var $filteredRows = $Funcrows;
		if (selectedModule && selectedModule !== "Select Module") {
			$filteredRows = $Funcrows.filter(function() {
			return $(this).find('td').first().text().trim() === selectedModule;
			});
		}
		var sortedRows = $filteredRows.toArray().sort(function(a, b) {
		var $cellA = $(a).find('td').eq(FuncSortIndex);
		var $cellB = $(b).find('td').eq(FuncSortIndex);
		var valA = $cellA.text().trim();
		var valB = $cellB.text().trim();
      
      // If numeric, sort numerically; otherwise, use localeCompare.
		if ($.isNumeric(valA) && $.isNumeric(valB)) {
			return sortOrder === "asc"
			? parseFloat(valA) - parseFloat(valB)
			: parseFloat(valB) - parseFloat(valA);
		} else {
			return sortOrder === "asc"
			? valA.localeCompare(valB)
			: valB.localeCompare(valA);
		}
		});
	$FuncTar.empty().append(sortedRows);
	}
	$('#SortContainer').on('change', '.Sort', filterAndSortTable);
	$('#SimpleModules').on('change', filterAndSortTable);
	Generate();
	SelectOptions(Modules, 'SimpleModules', '', '', 'ModId', 'OutputResource1', 0, 'Name', 'Ascending', 'Select Module');
});


const Tabs = $('.Tab');
const TabData = $('.TabData');
Tabs.each(function(index, Tab) {
    $(Tab).on('click', function() {
		Tabs.removeClass('active'); // Remove 'active' from all elements
        Tabs.eq(index).addClass('active'); // Add 'active' to the selected element
        TabData.removeClass('active'); // Remove 'active' from all elements
        TabData.eq(index).addClass('active'); // Add 'active' to the selected element
    });
});

// Sort Selection
function SelectSort(){ 
	var SimpleSorterA = $('#SimpleSorterA').val();
	var SimpleSorterB = $('#SimpleSorterB').val();
	if(SimpleSorterA != 'Name'){
		SelectOptions(Modules, 'SimpleModules', '', '', 'ModId', 'OutputResource1', 1, SimpleSorterA, SimpleSorterB, 'Select Module');
	} else {
		SelectOptions(Modules, 'SimpleModules', '', '', 'ModId', 'OutputResource1', 0, SimpleSorterA, SimpleSorterB, 'Select Module');
	}
}

//Sort Table
function sortTable(SortColumn, SortOrder) {
	const FuncTableBody = $('#DataContent tbody');
	const FuncTableRow = FuncTableBody.find('tr').toArray(); // Convert rows to an array
        // Sort rows
	FuncTableRow.sort((a, b) => {
		// Extract and clean primary column values
		const SortValA = $(a).find(`td:eq(${SortColumn})`).text().trim();
		const SortValB = $(b).find(`td:eq(${SortColumn})`).text().trim();

		// Extract and clean secondary column values (example: alphabetically by another column)
		const SecondarySortValA = $(a).find(`td:eq(${SecondaryColumn})`).text().trim();
		const SecondarySortValB = $(b).find(`td:eq(${SecondaryColumn})`).text().trim();

		// Handle numeric vs alphabetical primary sorting
		if (!isNaN(SortValA) && !isNaN(SortValB)) {
			const primaryComparison = SortOrder === 'asc' ? SortValA - SortValB : SortValB - SortValA;
			if (primaryComparison !== 0) return primaryComparison; // Use primary sort if different
		} else {
			const primaryComparison = SortOrder === 'asc'
				? SortValA.localeCompare(SortValB)
				: SortValB.localeCompare(SortValA);
			if (primaryComparison !== 0) return primaryComparison; // Use primary sort if different
		}

		// Handle secondary sorting if primary values are identical
		return SortOrderSecondary === 'asc'
		? SecondarySortValA.localeCompare(SecondarySortValB)
		: SecondarySortValB.localeCompare(SecondarySortValA);
	});
	console.log(FuncTableRow);
	FuncTableBody.empty().append(FuncTableRow);
}

// Generate Select Menu's
function SelectOptions(TarArray, TarField, TarFunct1, TarFunct2, TarClassA, TarClassB, TarCatahead, TarSort, TarSId, TarExtra) {
    let SwapArray = [...TarArray];
    let OptElements = "";
	let FuncGrabArray;
    let currentGroup = null;
    if (TarSId.length > 0) {
        SwapArray = SwapArray.sort((a, b) => {
            if (TarSId === 'Ascending') {
                return a[TarSort] - b[TarSort];
            } else if (TarSId === 'Descending') {
                return b[TarSort] - a[TarSort];
            }
            return 0;
        });
    }
    if (TarExtra.length > 1) {
        OptElements += `<option selected disabled style="display:none;">${TarExtra}</option>`;
    }

    SwapArray.forEach(item => {
        let FuncFunct = TarFunct1.length !== 0 ? ` onclick="${TarFunct1}(${TarFunct2})"` : "";
        let FuncClass = TarClassA.length !== 0 ? ` class="${TarClassA}${item[TarClassB]}"` : "";

		if(TarCatahead != 0){
			if (item[TarSort] !== currentGroup) {
				if (currentGroup !== null) {
					OptElements += `</optgroup>`;
				}
				TarSort = TarSort || '';
				currentGroup = item[TarSort];
				let Indexer = currentGroup - 1;
				let FuncGrabArray = Lookup[TarSort];
				let FuncLabel = FuncGrabArray[Indexer].Name;
				OptElements += `<optgroup label="${FuncLabel}">`;
			}
		}
        OptElements += `<option${FuncClass}${FuncFunct}>${item.Name}</option>`;
    });
    if (currentGroup !== null) {OptElements += `</optgroup>`;}
    $('#' + TarField).html(OptElements);
}
function GenerateContent(){
	Modules.foreach()
}
// Show/Hide
/*
function Revealer(Tar){
	if ($('#' +Tar).is(':visible')) {
		$('#'+Tar).slideUp(500);  
	} else { 
		$('#'+Tar).slideDown(500);
	}
}
*/

//Generate table
function Generate(){
let G1;
let G1label;
	Modules.sort(function(a, b) {
		return a.Name.localeCompare(b.Name);
	});
	$.each(Modules, function(index, value) {
		const G1 = Lookup["Type"];
		const G1label = G1[value.Type-1]?.Name || "Unknown Type";
		const G2 = Lookup["Tier"];
		const G2label = G2[value.Tier-1]?.Name || "Unknown Tier";
		const G3 = Lookup["Style"];
		const G3label = G3[value.Style-1]?.Name || "Unknown Style";
		let FuncAddrow = `<tr id="ModId${value.id}" data-type="${value.Type}" data-tier="${value.Tier}" data-faction="${value.Style}"><td>${value.Name}</td><td>`+G2label+`</td><td>`+G1label+`</td><td>`+G3label+`</td><td><input type="number" value="0"></td><td>🗑️</td></tr>`;		$('#DataContent tbody').append(FuncAddrow);
	});
}