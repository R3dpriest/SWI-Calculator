/* Globals */
let calcManiSheet;

$(document).ready(function() {
	$('#SortContainer').on('change', '.Sort', SelectSort);
	//note to self, dont move.
	var FuncMapping = {"Name": 0, "Tier": 1, "Type": 2, "Style": 3 };
	function filterAndSortTable(){
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
	
	$('#SimpleSorterA').on('change', function(){ const selectedValue = $(this).val(); const allowedDataSorts = ['Alphabet', 'Input', 'Options', selectedValue]; const table = $('#DataContent'); table.find('thead th').each(function(index) { const dataSort = $(this).attr('data-sort'); if(allowedDataSorts.includes(dataSort)){ $(this).show(); table.find(`tbody tr td:nth-child(${index + 1})`).show(); } else { $(this).hide(); table.find(`tbody tr td:nth-child(${index + 1})`).hide(); }});});
	$('#SortContainer').on('change', '.Sort', filterAndSortTable);
	Generate();
	SelectOptions(Modules, 'SimpleModules', ' ', 'id', 'ModId', 'id', 1, 'Type', 'Ascending', 'Select Module');
	SelectOptions(Style, 'StylePref', ' ', 'id', 'Pref', 'id', 0, 'Alphabet', 'Ascending', '');
	$('#SimpleModules').change(function(){const selectedOption = $(this).find(':selected'); const selectedValue = selectedOption.val(); const selectedClass = selectedOption.attr('class'); if (selectedValue) { Revealer(selectedValue, 'id', 'ModId'); $('#SimpleModules').prop('selectedIndex', 0);}});
    $(document).on("click",".SwiBin",function(){$(this.parentElement.parentElement).fadeOut(500);this.parentElement.parentElement.children[4].children[0].value="0";});
	$(document).on("click",".SwiClean",function(){this.parentElement.parentElement.children[4].children[0].value = "0";});
	$(".Drop-But").click(function (){const nextSibling = $(this).next();if (nextSibling.is(":visible")){nextSibling.slideUp(200);} else {nextSibling.slideDown(200);}
	});
	$(document).on("change", "input[type=checkbox]", function () {
    const classList = $(this).attr("class").split(" ");
    if (classList[0] === "FilterToggle") {
        const combinedClass = `.${classList[1]}${classList[2]}`;
        if (this.checked) {
            $(combinedClass).css("display", "table-cell"); // Allows "table-cell" when checked
        } else {
            $(combinedClass).attr("style", "display: none !important"); // Overpowers other rules
        }
        console.log('cell');
    }
    if (classList[0] === "FilterToggleRow") {
        const combinedClass = `.${classList[1]}${classList[2]}`;
        if (this.checked) {
            $(combinedClass).css("display", "table-row"); // Allows "table-row" when checked
        } else {
            $(combinedClass).attr("style", "display: none !important"); // Overpowers other rules
        }
        console.log('row');
    }
});

});

const Tabs = $('.Tab');
const TabData = $('.TabData');
Tabs.each(function(index, Tab) {
    $(Tab).on('click', function() {
		Tabs.removeClass('active');
        Tabs.eq(index).addClass('active');
        TabData.removeClass('active');
        TabData.eq(index).addClass('active');
    });
});

// Sort Selection
function SelectSort(){ 
	var SimpleSorterA = $('#SimpleSorterA').val();
	var SimpleSorterB = $('#SimpleSorterB').val();
	if(SimpleSorterA != 'Name'){
		SelectOptions(Modules, 'SimpleModules', ' ', 'id', 'ModId', 'id', 1, SimpleSorterA, SimpleSorterB, 'Select Module');
	} else {
		SelectOptions(Modules, 'SimpleModules', ' ', 'id', 'ModId', 'id', 0, SimpleSorterA, SimpleSorterB, 'Select Module');
	}
}

// Generate Select Menu's
function SelectOptions(TarArray, TarField, TarVal1, TarVal2, TarClassA, TarClassB, TarCatahead, TarSort, TarSId, TarExtra) {
    let SwapArray = [...TarArray];
    let OptElements = "";
	let FuncGrabArray; let FuncClass = "";
	let FuncVal; let FuncTitle;
    let currentGroup = null;
	const G3 = Lookup["Style"];
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
		if(TarVal1.length !== 0){
			if(TarVal2 == "id" || TarVal2 == "class" ){
				if(TarVal1 === " "){
					FuncVal = ` value="${item[TarClassB]}"`;
				} else {
					FuncVal = ` value="${TarVal1} ${item[TarClassB]}"`;
				}
				
			} else {
				FuncVal = ` value="${TarVal1}"`;
			}
		}
		if(TarClassA.length !== 0){
			if(TarField === 'SimpleModules'){
				let G3label = G3[item.Style-1]?.Name || "Unknown Style";
				if(item.Style.length != 0){
						FuncClass = ` class="${TarClassA}${item[TarClassB]} O-${G3label}"`;
				} else { FuncClass = ` class="${TarClassA}${item[TarClassB]}"`; }
			} else { FuncClass = ` class="${TarClassA}${item[TarClassB]}"`; }
		}
//        let FuncClass = TarClassA.length !== 0 ? ` class="${TarClassA}${item[TarClassB]}"` : "";
		
		if(TarCatahead != 0){
			if (item[TarSort] !== currentGroup) {
				if (currentGroup !== null) {
					OptElements += `</optgroup>`;
				}
				TarSort = TarSort || '';
				currentGroup = item[TarSort];
				let Indexer;
				if(TarSort !== "Tier"){
					currentGroup = item[TarSort];
					Indexer = currentGroup - 1;
				} else {
					Indexer = currentGroup;
				}
				let FuncGrabArray = Lookup[TarSort];
				let FuncLabel = FuncGrabArray[Indexer].Name;
				OptElements += `<optgroup label="${FuncLabel}">`;
			}
		}
		if(item.Title){
			if(item.Title.length != 0){
				FuncTitle = ' Title='+item.Title+'"';
			} else { FuncTitle = ""; }
		}
        OptElements += `<option${FuncClass}${FuncVal}${FuncTitle}>${item.Name}</option>`;
    });
    if (currentGroup !== null) {OptElements += `</optgroup>`;}
    $('#' + TarField).html(OptElements);
}

// Show/Hide
function Revealer(Tar, Option1, Option2){
	let Extra1 = "";
	let Extra2 = "";
	if(Option2.length !== 0){ Extra2 = Option2; }
	if(Option1 === "id"){ Extra1 = "#"; } else if(Option1 === "class"){ Extra1 = "Class"; } else { return; }
	if ($(Extra1+Extra2+Tar).is(':visible')) {
		if(Extra2 === "ModId"){
			$(Extra1+Extra2+Tar).fadeOut(500);
			$("#Input_M_" + Tar).val(0);
		}
	} else { 
		$(Extra1+Extra2+Tar).fadeIn(500);
	}
}

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
		const G2label = G2[value.Tier]?.Name || "Unknown Tier";
		const G3 = Lookup["Style"];
		const G3label = G3[value.Style-1]?.Name || "Unknown Style";
		let FuncAddrow = `<tr title	="${value.Title}" id="ModId${value.id}" data-type="${value.Type}" data-tier="${value.Tier}" data-Style="${value.Style}" style="display: none;"><td>${value.Name}</td><td style="display: none;">`+G2label+`</td><td>`+G1label+`</td><td style="display: none;">`+G3label+`</td><td><input class="ModId${value.id} Inp-Style-${value.Style} Inp-Tier-${value.Tier} Inp-Type-${value.Type}" id="Input_M_${value.id}" type="number" value="0"></td><td><span class="SwiClean OptSpan" hover="test" title="Set value to 0">🧹</span><span class="SwiBin OptSpan" title="Set value to 0 and remove">🗑️</span></td></tr>`;		
		$('#DataContent tbody').append(FuncAddrow);
	});
}

function Resources(){
	let SwapResources = JSON.parse(JSON.stringify(resources));
	let FuncAddRow = "";
	$.each(SwapResources, function(index, value) {
		let FuncAddRow = `<tr id="ResId${value.id}" data-type="${value.Type}" data-tier="${value.Tier}" data-Style="${value.Style}"><td>${value.Name}</td><td style="display: none;" >${value.Tier}</td><td style="display: none;">${value.Type}</td><td style="display: none;" >${value.Style}</td><td>${value.OutVolume}</td>`;
		$('#ResourceContent tbody').append(FuncAddRow);
	});
}

function CalculateModules() {
	if($('.App02:visible').length == 0){
		$('.App02').fadeIn(500);
		$('.App03').fadeIn(500);
	}
	$('').fadeIn(500);
    let SwapArray = JSON.parse(JSON.stringify(Modules));		let SwapResources = JSON.parse(JSON.stringify(resources));
	let multiplier = 0; 	let ConsBuffer = "";	let PopBuffer = "";	let RawBuffer = "";	let RawS = 0;	let RawL = 0;
	let StylePref = Number($("#StylePref").val());		let ScalePref = Number($("#ScalePref").val());
	let SithPop = 0;	let GenPop = 0;		let TotPop = 0;			let NegPop = 0;		let EndPop = 0;
	let Sstorage = 0;	let Lstorage = 0;	let Cstorage = 0;	let CalcEffPref = Number($("#CalcEffPref").val()); let CalcMod;
	function SubRoutine(x){
		if (x === 0) {
			filteredArray = SwapArray.filter(item => item.Type === 1 || item.Type === 3);
		} else {
			filteredArray = SwapArray;
		} let FFx;
		// Cycle Through tiers
		for (let MT = 5; MT >= -1; MT--) {
			const Filter = SwapResources.filter((resource) => resource.Tier === MT-1);
			filteredArray.forEach((ModuleItem, index) => {
				FFx = SwapResources.find(resources => resources.id === ModuleItem.OutputResource1);
				if (!FFx || FFx.OutVolume <= Math.abs(FFx.InVolume)) {
					if (ModuleItem.Tier === MT){
						if($(`#Input_M_${ModuleItem.id}`).val() !== "0") {
							multiplier = $(`#Input_M_${ModuleItem.id}`).val();
							//Population calculation
							if(ModuleItem.Population > 0){
								switch(ModuleItem.Race){
									case 1:
										GenPop += ModuleItem.Population * multiplier;
									break;
									case 2:
										SithPop += ModuleItem.Population * multiplier;
									break;
									default:
										GenPop += ModuleItem.Population * multiplier;
									break;
								}
								TotPop += ModuleItem.Population * multiplier;
							} else if (ModuleItem.Population < 0){ 
								NegPop += ModuleItem.Population * multiplier;
							} else {}
							if(ModuleItem.Storage){
								switch(ModuleItem.Storage){
									case 1:
										Cstorage = Math.ceil(Cstorage + Number(ModuleItem.StorageVolume) * multiplier);
									break;
									case 2:
										Sstorage = Math.ceil(Sstorage + Number(ModuleItem.StorageVolume) * multiplier);
									break;
									case 3:
										Lstorage = Math.ceil(Lstorage + Number(ModuleItem.StorageVolume) * multiplier);
									break;
									default:
									break;
								}
							}
							let InpVVal = 0; let ConVVal = 0; let OupVVal = 0;
							for (let RQ = 5; RQ >= 0; RQ--){
								//adds resources for next tier of modules to be added
								let InpR = "InputResource"+RQ; let InpV = "InputVolume"+RQ;
								let InpRVal = ModuleItem[InpR]; InpVVal = ModuleItem[InpV] * multiplier;
								let InpTar = SwapResources.find(item => item.id === InpRVal);
								if(InpTar){
									InpTar.InVolume = InpTar.InVolume + InpVVal;
								}
								//adds resources for building pool
								let ConR = "ConstResource"+RQ; let ConV = "ConstVolume"+RQ;
								let ConRVal = ModuleItem[ConR]; ConVVal = ModuleItem[ConV] * multiplier;
								let ConTar = SwapResources.find(item => item.id === ConRVal);
								if(ConTar){
									ConTar.ConstrVolume = ConTar.ConstrVolume + ConVVal;
								}	
								//adds resource to the output pile.
								let OupR = "OutputResource"+RQ; let OupV = "OutputVolume"+RQ;
								let OupRVal = ModuleItem[OupR]; let OupVVal = ModuleItem[OupV] * multiplier;
								let OupTar = SwapResources.find(item => item.id === OupRVal);
								if(OupTar){
									if(CalcEffPref === 1){
										CalcMod = 1 + (1 * ModuleItem.MaxEffeciency);
									} else {
										CalcMod = 1;
									}
									OupTar.OutVolume = Math.ceil(OupTar.OutVolume + (OupVVal * CalcMod));
								}
							}
						}
					}
				}
			});
			const filteredResources = SwapResources.filter((resource) => resource.Tier === MT-1 && resource.InVolume !== 0);
			filteredResources.forEach(filter => {
				let AdModule = SwapArray.find(item => item.OutputResource1 === filter.id && item.Style === StylePref);
				if (!AdModule) {
					AdModule = SwapArray.find(item => item.OutputResource1 === filter.id);
				}
				if (AdModule) {
				let Modbuffer = Math.abs(filter.InVolume);
				let ModNeed;
				if(CalcEffPref === 1){
					CalcMod = 1 + (1 * AdModule.MaxEffeciency);
				} else {
					CalcMod = 1;
				}
				if(filter.id === 1){
					let SunPref = Number($("#SunPref").val());
					ModNeed = Math.ceil(Modbuffer / (((AdModule.OutputVolume1 * CalcMod) / 100) * SunPref ));
				} else {
					ModNeed = Math.ceil(Modbuffer / AdModule.OutputVolume1 * CalcMod);
				}
				if(ScalePref === 0){
					let ModGrab = document.getElementById(`Input_M_`+AdModule.id).value;
					if(ModGrab < ModNeed){
						$(`#Input_M_${AdModule.id}`).val(ModNeed);
					}
				} else { 
				$(`#Input_M_${AdModule.id}`).val(ModNeed); }
					$(`#Input_M_${AdModule.id}`).parent().parent().slideDown(350);				
				}
			});
		}
	}
	SubRoutine(1);
	//deal with population
	let MathFood = 0; let MathMed = 0; let BufFood = []; let BufMed = [];
	BufFood.length = 0;	BufMed.length = 0;
	if(GenPop !== 0){
		BufFood = SwapResources.find(resource => resource.id === 18);
		MathFood = -Math.ceil(BufFood.InVolume+(GenPop * 2.25));
		BufFood.InVolume = MathFood;
		BufMed = SwapResources.find(resource => resource.id === 22);
		MathMed = -Math.ceil(BufMed.InVolume+(GenPop * 1.35));
		BufMed.InVolume = MathMed;
		PopBuffer += `<tr><td>Generic housing</td><td>${GenPop}</td></tr>`;
	}
	if(SithPop !== 0){
		let BufVat = SwapResources.find(resource => resource.id === 42);
		let MathVat = -Math.ceil(BufVat.InVolume + (SithPop * 1.65));
		BufVat.InVolume = MathVat;
		PopBuffer += `<tr><td>Sith housing</td><td>${SithPop}</td></tr>`;
	}
	if(SithPop !== 0 || GenPop !== 0){
		SubRoutine(0);
		PopBuffer += `<tr><td>Total housing</td><td>${TotPop}</td></tr>`;
	}
	PopBuffer += `<tr><td>Population needed</td><td>${NegPop}</td></tr>`;
	$('#PopulationContent tbody tr').remove();
	$('#PopulationContent tbody').append(PopBuffer);
	$('#PopulationContainer div').slideDown(350);
	
	//Effenciency
	// EfRes = Math.floor(module.outputVolume1 * multiplier * (1 + (PosiPop/NegaPop * module.MaxEffeciency)));
	
	const Rfilt = Type;
	$('#CalcContent tbody tr').remove();
	for (let RT = 0; RT < Rfilt.length; RT++) {
		let TotC = "";
		let I = 0;
		let Rlabel = Rfilt[RT].Name;
		TotC += `<tr class="rch" id="rch${RT}"><td></td><td>${Rlabel}</td><td></td><td></td></tr>`;
		let ResCalcArray = SwapResources.filter(Ritem => Ritem.Storage === 1 && Ritem.Type === Rfilt[RT].id); // Match Type ID
		ResCalcArray.forEach(Ritems => {
			if (Ritems.InVolume !== 0 || Ritems.OutVolume !== 0) {
				TotC += `<tr><td title="Tier ${Ritems.Tier}" class="rc${Ritems.Tier}"></td><td>${Ritems.Name}</td><td>${Ritems.InVolume}</td><td>${Ritems.OutVolume}</td></tr>`;
				I++;
			}
		});
		if (I !== 0) {
			$('#CalcContent tbody').append(TotC);
			$('#rch' + RT).fadeIn(200);
		}
	}
	$('#CalcContainer div').slideDown(350);

	//Add raw resources.
	let ResourceSArray = SwapResources.filter(item => item.Storage === 2);
	ResourceSArray.forEach(ResA => {
		let RawConvert = ResA.InVolume * ResA.StorageVolume;
		RawBuffer += `<tr><td>${ResA.Name}</td><td>${RawConvert}</td><td></td></tr>`;
		RawS += Math.ceil(RawS + RawConvert);
	});
	RawBuffer += `<tr><td><b>Total Solid</b></td><td>${RawS}</td><td>${Sstorage}</td></tr>`;
	let ResourceLArray = SwapResources.filter(item => item.Storage === 3);
	ResourceLArray.forEach(ResB => {
		let RawsConvert = ResB.InVolume * ResB.StorageVolume;
		RawBuffer += `<tr><td>${ResB.Name}</td><td>${RawsConvert}</td><td></td></tr>`;
		RawL = Math.ceil(RawL + RawsConvert);
	});
	RawBuffer += `<tr><td><b>Total Liquid</b></td><td>${RawL}</td><td>${Lstorage}</td></tr>`;
	$('#RawContent tbody tr').remove();
	$('#RawContent tbody').append(RawBuffer);
	$('#RawContainer div').slideDown(350);
	
	//Add construction resources.
	const ConstrResources = SwapResources.filter((resource) => resource.ConstrVolume !== 0);
	ConstrResources.forEach(Constrfilter => {
		ConsBuffer += `<tr id="ConsId${Constrfilter.id}" data-type="${Constrfilter.Type}" data-tier="${Constrfilter.Tier}" data-Style="${Constrfilter.Style}"><td>${Constrfilter.Name}</td><td style="display: none;" >${Constrfilter.Tier}</td><td style="display: none;">${Constrfilter.Type}</td><td style="display: none;" >${Constrfilter.Style}</td><td>${Constrfilter.ConstrVolume}</td></tr>`;
	});
	$('#ConstructionContent tbody tr').remove();
	$('#ConstructionContent tbody').append(ConsBuffer);
	$('#ConstructionContainer div').slideDown(350);
	SwapResources = JSON.parse(JSON.stringify(resources));
//	console.log("Generic pop: " + GenPop + " | " + "Sith pop: " + SithPop + " | " + "Total pop: " + TotPop + " | " + "Required pop: " + NegPop + " | " + "End result :" + EndPop);
}


function ExportData() {
	var data = {};
	$(".TabData.active").find("input, select, textarea").each(function () {
	var firstClass = $(this).attr("class")?.split(" ")[0]; // Get the first class
	if (firstClass) {
		if ($(this).is(":checkbox")) {
			data[firstClass] = $(this).prop("checked");
		} else if ($(this).is(":radio")) {
			if ($(this).prop("checked")) {
				data[firstClass] = $(this).val();
			}
			} else {
			data[firstClass] = $(this).val();
			}
		}
	});
	var jsonString = JSON.stringify(data);
	var compressed = LZString.compressToBase64(jsonString);
	$("#StringID").val(compressed);
}

function ImportData() {
	var compressed = $("#StringID").val();
	if (!compressed) return;
	var jsonString = LZString.decompressFromBase64(compressed);
	if (!jsonString) {
		alert("Decoding failed: Please select the right tab. Or invalid data.");
		return;
	}
	var data = JSON.parse(jsonString);
	$.each(data, function (className, value) {
		var field = $("." + className);
		if (field.length) {
			if (field.is(":checkbox")) {
				field.prop("checked", value);
			} else if (field.is(":radio")) {
				$('input[name="' + field.attr("name") + '"][value="' + value + '"]').prop("checked", true);
			} else {
				field.val(value);
			}
				if (!field.is(":checkbox") && !field.is(":radio")) {
				var numericVal = Number(field.val());
				if (!isNaN(numericVal) && numericVal > 0) {
					var gp = field.parent().parent();
					if (gp.is("tr")) {
						gp.fadeIn(200);
					}
				}
			}
		}
	});
}

function PopulateSubmenu(TarArray, TarOpt, TarIntroA, TarIntroB, UniTar, TarClassA, TarClassB, TarLocA, TarLocB, FolLine, FolClass){
	if(TarLocA && UniTar){
		let SwapArray = JSON.parse(JSON.stringify(TarArray));
		let SwapExit = "";
		if(TarIntroA && TarIntroB){
			SwapExit += `<div class="${TarIntroB}">${TarIntroA}</div>`;
		}
		switch(TarOpt){ 
			case 1:
				SwapArray.forEach(Entry => {
					let Opt = "";
					if (Entry.Check) {
						if (Entry.Check === 1) {
							Opt = "checked";
						}
					}
					SwapExit += `<div class="${TarClassA}"><label for="${UniTar}${Entry.id}"><input id="${UniTar}${Entry.id}" class="${UniTar}${Entry.id} ${TarClassB}" type="checkbox" ${Opt}>${Entry.Name}</label></div>`;
				});
			break;
			default:
			break;
		}
		if(FolLine === 1){
			if(!FolClass){
				SwapExit += `<div class="dropdown-div"></div>`;
			} else { 
				SwapExit += `<div class="${FolClass}"></div>`;
			}
		}
		if(TarLocB == "id" || TarLocB == "class" ){
			if(TarLocB == "id"){
				$('#'+TarLocA).append(SwapExit);
			} else {
				$('.'+TarLocA).append(SwapExit);			
			}
		}
		
	} else { console.log('Critical error. No menu location or unique target selected.'); }
}

//Note to self dump values inside html page to bypass safety
function updateCssRule(selector, property, value) {
    const styleElement = document.querySelector("style"); // Find the <style> element
    if (!styleElement) {
        console.error("No <style> tag found.");
        return;
    }
    const styleSheet = Array.from(document.styleSheets).find(sheet =>
        sheet.ownerNode === styleElement
    );

    if (!styleSheet) {
        console.error("No stylesheet associated with the <style> tag.");
        return;
    }

    $.each(styleSheet.cssRules, (_, rule) => {
        if (rule.selectorText === selector) {
            rule.style[property] = value;
        }
    });
}

function SpreadSheet() {
	let SwapResources = JSON.parse(JSON.stringify(resources));	let SwapArray = JSON.parse(JSON.stringify(Modules));
	SwapArray.sort((a, b) => a.Type - b.Type);
	let Buffer = `<table><thead><tr><th>Module</th><th>Input</th>`;
	SwapResources.forEach(AResA => {
		Buffer += `<th class="Side Tyn${AResA.Type} Stn${AResA.Style} Tin${AResA.Tier} Sto${AResA.Storage}">${AResA.Name}</th>`;
	});
	Buffer += `</tr></thead><tbody><tr><td></td><td>Total</td>`;
	SwapResources.forEach(AResB => {
		Buffer += `<td class="Tyn${AResB.Type} Stn${AResB.Style} Tin${AResB.Tier} Sto${AResB.Storage}" id="SprdTop${AResB.id}">0</td>`;
	});
	Buffer += `</tr>`;
	SwapArray.forEach(moduleA => {
		Buffer += `<tr class="rTyn${moduleA.Type} rStn${moduleA.Style} rTin${moduleA.Tier}"><td>${moduleA.Name}</td><td><input type="number" id="Inp${moduleA.id}"></td>`;
		SwapResources.forEach(AResC => {	let Temp = "";
			if (AResC.id === moduleA.InputResource1 || AResC.id === moduleA.InputResource2 || AResC.id === moduleA.InputResource3 || AResC.id === moduleA.InputResource4 || AResC.id === moduleA.InputResource5 || AResC.id === moduleA.OutputResource1 || AResC.id === moduleA.OutputResource2){
				Temp = "0";
			}
				Buffer += `<td class="Tyn${AResC.Type} Stn${AResC.Style} Tin${AResC.Tier} Sto${AResC.Storage}" id="Mod${moduleA.id}Res${AResC.id}">${Temp}</td>`;
		});
		Buffer += `</tr>`;
	});
	Buffer += `<tr><td></td><td>Total</td>`;
	SwapResources.forEach(AResD => {
		Buffer += `<td class="Tyn${AResD.Type} Stn${AResD.Style} Tin${AResD.Tier} Sto${AResD.Storage}" id="SprdBot${AResD.id}">0</td>`;
	});
	Buffer += `</tr><tr><td>Module</td><td>Input</td>`;
	SwapResources.forEach(AResE => {
		Buffer += `<td class="Side Tyn${AResE.Type} Stn${AResE.Style} Tin${AResE.Tier} Sto${AResE.Storage}">${AResE.Name}</td>`;
	});
	Buffer += `</tr></tbody></table>`;
    $('#SpreadContainer button').remove();
    $('#SpreadContainer').append(Buffer);
}

//Populate spreadsheet
let Firstcheck = 0;
function RunOnce(){
	if(Firstcheck === 0){
		PopulateSubmenu(Type, 1, 'Type', 'dropdown-header Highlight F22', 'FilterToggleRow rTyn ', '', '', 'SRow', 'id', 1, '');
		PopulateSubmenu(Style, 1, 'Faction', 'dropdown-header Highlight F22', 'FilterToggleRow rStn ', '', '', 'SRow', 'id', 1, '');
		PopulateSubmenu(Tier, 1, 'Tier', 'dropdown-header Highlight F22', 'FilterToggleRow rTin ', '', '', 'SRow', 'id', 0, '');
		PopulateSubmenu(Storage, 1, 'Storage', 'dropdown-header Highlight F22', 'FilterToggle Sto ', '', '', 'SColumn', 'id', 1, '');
		PopulateSubmenu(Type, 1, 'Type', 'dropdown-header Highlight F22', 'FilterToggle Tyn ', '', '', 'SColumn', 'id', 1, '');
		PopulateSubmenu(Style, 1, 'Faction', 'dropdown-header Highlight F22', 'FilterToggle Stn ', '', '', 'SColumn', 'id', 1, '');
		PopulateSubmenu(Tier, 1, 'Tier', 'dropdown-header Highlight F22', 'FilterToggle Tin ', '', '', 'SColumn', 'id', 0, '');
		Firstcheck++;
	}
}