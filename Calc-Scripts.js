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
	
	$('#SimpleSorterA').on('change', function(){ const selectedValue = $(this).val(); const allowedDataSorts = ['Alphabet', 'Input', 'Options', selectedValue]; const table = $('#DataContent'); table.find('thead th').each(function(index) { const dataSort = $(this).attr('data-sort'); if(allowedDataSorts.includes(dataSort)){ $(this).show(); table.find(`tbody tr td:nth-child(${index + 1})`).show(); } else { $(this).hide(); table.find(`tbody tr td:nth-child(${index + 1})`).hide(); }});});
	$('#SortContainer').on('change', '.Sort', filterAndSortTable);
	Generate();
	SelectOptions(Modules, 'SimpleModules', ' ', 'id', 'ModId', 'id', 1, 'Type', 'Ascending', 'Select Module');
	SelectOptions(Style, 'StylePref', ' ', 'id', 'Pref', 'id', 0, 'Alphabet', 'Ascending', '');
	$('#SimpleModules').change(function(){const selectedOption = $(this).find(':selected'); const selectedValue = selectedOption.val(); const selectedClass = selectedOption.attr('class'); if (selectedValue) { Revealer(selectedValue, 'id', 'ModId'); $('#SimpleModules').prop('selectedIndex', 0);}});
    $(document).on("click",".SwiBin",function(){$(this.parentElement.parentElement).fadeOut(500);this.parentElement.parentElement.children[4].children[0].value="0";});
	$(document).on("click",".SwiClean",function(){this.parentElement.parentElement.children[4].children[0].value = "0";});
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
		let FuncAddrow = `<tr title	="${value.Title}" id="ModId${value.id}" data-type="${value.Type}" data-tier="${value.Tier}" data-Style="${value.Style}" style="display: none;"><td>${value.Name}</td><td style="display: none;">`+G2label+`</td><td>`+G1label+`</td><td style="display: none;">`+G3label+`</td><td><input class="Inp-Style-${value.Style} Inp-Tier-${value.Tier} Inp-Type-${value.Type}" id="Input_M_${value.id}" type="number" value="0"></td><td><span class="SwiClean OptSpan" hover="test" title="Set value to 0">🧹</span><span class="SwiBin OptSpan" title="Set value to 0 and remove">🗑️</span></td></tr>`;		
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
    let SwapArray = JSON.parse(JSON.stringify(Modules));		let SwapResources = JSON.parse(JSON.stringify(resources));
	let multiplier = 0; 	let ConsBuffer = "";	let PopBuffer = "";	let RawBuffer = "";	let RawS = "";	let RawL = "";
	let StylePref = Number($("#StylePref").val());		let ScalePref = Number($("#ScalePref").val());
	let SithPop = 0;	let GenPop = 0;		let TotPop = 0;			let NegPop = 0;		let EndPop = 0;
	let Sstorage = 0;	let Lstorage = 0;	let Cstorage = 0;
	function SubRoutine(x){
		if (x === 0) {
			filteredArray = SwapArray.filter(item => item.Type === 1 || item.Type === 3);
			console.log(x);
		} else {
			filteredArray = SwapArray;
		}
		// Cycle Through tiers
		for (let MT = 5; MT >= -1; MT--) {
			const Filter = SwapResources.filter((resource) => resource.Tier === MT-1);
			filteredArray.forEach((ModuleItem, index) => {
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
								OupTar.OutVolume = OupTar.OutVolume + OupVVal;
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
				if(filter.id === 1){
					let SunPref = Number($("#SunPref").val());
					ModNeed = Math.ceil(Modbuffer / ((AdModule.OutputVolume1 / 100) * SunPref));
				} else {
					ModNeed = Math.ceil(Modbuffer / AdModule.OutputVolume1);
				}
				if(ScalePref === 0){
					let ModGrab = document.getElementById(`Input_M_`+AdModule.id).value;
					if(ModGrab < ModNeed){
						$(`#Input_M_${AdModule.id}`).val(ModNeed);
					}
				} else { 
				$(`#Input_M_${AdModule.id}`).val(ModNeed); }
					$(`#Input_M_${AdModule.id}`).parent().parent().fadeIn(500);				
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
	$('#PopulationContainer div').fadeIn(500);
	
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
	$('#CalcContainer div').fadeIn(500);

	//Add raw resources.
	let ResourceSArray = SwapResources.filter(item => item.Storage === 2);
	ResourceSArray.forEach(ResA => {
		RawBuffer += `<tr><td>${ResA.Name}</td><td>${ResA.InVolume}</td><td></td></tr>`;
		RawS = Math.ceil(RawS + Number(ResA.InVolume));
	});
	RawBuffer += `<tr><td><b>Total Solid</b></td><td>${RawS}</td><td>${Sstorage}</td></tr>`;
	let ResourceLArray = SwapResources.filter(item => item.Storage === 3);
	ResourceLArray.forEach(ResB => {
		RawBuffer += `<tr><td>${ResB.Name}</td><td>${ResB.InVolume}</td><td></td></tr>`;
		RawL = Math.ceil(RawL + Number(ResB.InVolume));
	});
	RawBuffer += `<tr><td><b>Total Liquid</b></td><td>${RawL}</td><td>${Lstorage}</td></tr>`;
	$('#RawContent tbody tr').remove();
	$('#RawContent tbody').append(RawBuffer);
	$('#RawContainer div').fadeIn(500);
	
	//Add construction resources.
	const ConstrResources = SwapResources.filter((resource) => resource.ConstrVolume !== 0);
	ConstrResources.forEach(Constrfilter => {
		ConsBuffer += `<tr id="ConsId${Constrfilter.id}" data-type="${Constrfilter.Type}" data-tier="${Constrfilter.Tier}" data-Style="${Constrfilter.Style}"><td>${Constrfilter.Name}</td><td style="display: none;" >${Constrfilter.Tier}</td><td style="display: none;">${Constrfilter.Type}</td><td style="display: none;" >${Constrfilter.Style}</td><td>${Constrfilter.ConstrVolume}</td></tr>`;
	});
	$('#ConstructionContent tbody tr').remove();
	$('#ConstructionContent tbody').append(ConsBuffer);
	$('#ConstructionContainer div').fadeIn(500);
	SwapResources = JSON.parse(JSON.stringify(resources));
//	console.log("Generic pop: " + GenPop + " | " + "Sith pop: " + SithPop + " | " + "Total pop: " + TotPop + " | " + "Required pop: " + NegPop + " | " + "End result :" + EndPop);
}