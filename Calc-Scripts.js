/* Globals */
let calcManiSheet;	let current;
$(document).ready(function() {
	$('#SortContainer').on('change', '.Sort', SelectSort);
	SelectOptions(Ships, 'SolidMiners', ' ', 'id', 'Solid', 'id', 0, 'Alphabet', 'Ascending', 'Solid Miner', 'Storage', 2);
	SelectOptions(Ships, 'LiquidMiners', ' ', 'id', 'Liquid', 'id', 0, 'Alphabet', 'Ascending', 'Gas Miner', 'Storage', 3);
	SelectOptions(Modules, 'SimpleModules', ' ', 'id', 'ModId', 'id', 1, 'Type', 'Ascending', 'Select Module', '', '');
	SelectOptions(Style, 'StylePref', ' ', 'id', 'Pref', 'id', 0, 'Alphabet', 'Ascending', '', '', '');
	SelectOptions(Jumps, 'IceJumps', ' ', 'id', 'Ij', 'id', 0, 'Alphabet', 'Ascending', 'Ice', '', '');
	SelectOptions(Jumps, 'OreJumps', ' ', 'id', 'Oj', 'id', 0, 'Alphabet', 'Ascending', 'Ore', '', '');
	SelectOptions(Jumps, 'SiliconJumps', ' ', 'id', 'Sj', 'id', 0, 'Alphabet', 'Ascending', 'Sil', '', '');
	SelectOptions(Jumps, 'RhydoniumJumps', ' ', 'id', 'Rj', 'id', 0, 'Alphabet', 'Ascending', 'Rhy', '', '');
	SelectOptions(Jumps, 'MethaneJumps', ' ', 'id', 'Mj', 'id', 0, 'Alphabet', 'Ascending', 'Met', '', '');
	SelectOptions(Jumps, 'HeliumJumps', ' ', 'id', 'Hj', 'id', 0, 'Alphabet', 'Ascending', 'Hel', '', '');
	SelectOptions(Jumps, 'TibJumps', ' ', 'id', 'Tj', 'id', 0, 'Alphabet', 'Ascending', 'Tib', '', '');
	
	$(".Drop-But").click(function (){ const nextSibling = $(this).next();if (nextSibling.is(":visible")){nextSibling.slideUp(200);} else {nextSibling.slideDown(200);}});
	//note to self, dont move.
	var FuncMapping = {"Name": 0, "Tier": 1, "Type": 2, "Style": 3 };
	function filterAndSortTable(){
		var FuncSortA = $('#SimpleSorterA').val(); var FuncSortIndex = FuncMapping[FuncSortA];
		var sortOrderRaw = $('#SimpleSorterB').val(); var sortOrder = (sortOrderRaw.toLowerCase() === "ascending") ? "asc" : "desc";
		var selectedModule = $('#SimpleModules').val(); var $FuncTar = $('#DataContent tbody');
		var $Funcrows  = $FuncTar.children('tr'); var $filteredRows = $Funcrows;
		if (selectedModule && selectedModule !== "Select Module") {
			$filteredRows = $Funcrows.filter(function() {
			return $(this).find('td').first().text().trim() === selectedModule;
			});
		}
		var sortedRows = $filteredRows.toArray().sort(function(a, b) {
		var $cellA = $(a).find('td').eq(FuncSortIndex); var $cellB = $(b).find('td').eq(FuncSortIndex);
		var valA = $cellA.text().trim(); var valB = $cellB.text().trim();
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
	RunOnce();
	$FuncTar.empty().append(sortedRows);
	}
	Generate();
	$(document).on("change", "#MiningOpt", function(){ let xm = $('#MiningOpt').val(); if (xm === "1") { ShipDisclaimer(); Revealer('', 'id', 'ShipContainer', '1'); } else { Revealer('', 'id', 'ShipContainer'); }});
	$('#SimpleSorterA').on('change', function(){ const selectedValue = $(this).val(); const allowedDataSorts = ['Alphabet', 'Input', 'Options', selectedValue]; const table = $('#DataContent'); table.find('thead th').each(function(index) { const dataSort = $(this).attr('data-sort'); if(allowedDataSorts.includes(dataSort)){ $(this).show(); table.find(`tbody tr td:nth-child(${index + 1})`).show(); } else { $(this).hide(); table.find(`tbody tr td:nth-child(${index + 1})`).hide(); }});});
	$('#SortContainer').on('change', '.Sort', filterAndSortTable);
	$('#SimpleModules').change(function(){const selectedOption = $(this).find(':selected'); const selectedValue = selectedOption.val(); const selectedClass = selectedOption.attr('class'); if (selectedValue) { Revealer(selectedValue, 'id', 'ModId'); $('#SimpleModules').prop('selectedIndex', 0);}});
    $(document).on("click",".SwiBin",function(){$(this.parentElement.parentElement).fadeOut(500);this.parentElement.parentElement.children[4].children[0].value="0";});
	$(document).on("click",".SwiClean",function(){this.parentElement.parentElement.children[4].children[0].value = "0";});
	$(document).on("change", "#SolidMiners", () => ShipPreview(2, Number($("#SolidMiners").val())));
	$(document).on("change", "#LiquidMiners", () => ShipPreview(3, Number($("#LiquidMiners").val())));
	$(document).on("change", "input[type=checkbox]", function(){const classList = $(this).attr("class").split(" "); if(classList[0] === "FilterToggle"){ const combinedClass = `.${classList[1]}${classList[2]}`; if (this.checked) { $(combinedClass).css("display", "table-cell"); } else { $(combinedClass).attr("style", "display: none !important");}}
	
	
	
	if (classList[0] === "FilterToggleRow") {const combinedClass = `.${classList[1]}${classList[2]}`; if (this.checked) { $(combinedClass).css("display", "table-row"); } else { $(combinedClass).attr("style", "display: none !important");}}});
	$('#SpreadTable').on('mouseenter', 'td', function (){const table = $(this).closest('table'); const colIndex = $(this).index();	table.find('tr').each(function(){ $(this).find('td').eq(colIndex).addClass('highlight-column'); }); $(this).parent().addClass('highlight-row');});
	$('#SpreadTable').on('mouseleave', 'td', function (){const table = $(this).closest('table'); const colIndex = $(this).index(); table.find('tr').each(function(){ $(this).find('td').eq(colIndex).removeClass('highlight-column');}); $(this).parent().removeClass('highlight-row');});
	const $root = $("html"); const savedTheme = localStorage.getItem("theme"); if (savedTheme) { $root.addClass(savedTheme); } else { $root.addClass("light-mode"); }
	$("#theme-toggle").on("click", () => { if ($root.hasClass("dark-mode")) { $root.removeClass("dark-mode").addClass("light-mode"); localStorage.setItem("theme", "light-mode"); } else { $root.removeClass("light-mode").addClass("dark-mode"); localStorage.setItem("theme", "dark-mode");};});
});
const Tabs = $('.Tab'); const TabData = $('.TabData'); Tabs.each(function(index, Tab) {
    $(Tab).on('click', function() {
		Tabs.removeClass('active'); Tabs.eq(index).addClass('active'); TabData.removeClass('active'); TabData.eq(index).addClass('active'); current = index;
    });
});
// Sort Selection
function SelectSort(){ 
	var SimpleSorterA = $('#SimpleSorterA').val();
	var SimpleSorterB = $('#SimpleSorterB').val();
	if(SimpleSorterA != 'Name'){
		SelectOptions(Modules, 'SimpleModules', ' ', 'id', 'ModId', 'id', 1, SimpleSorterA, SimpleSorterB, 'Select Module', '', '');
	} else {
		SelectOptions(Modules, 'SimpleModules', ' ', 'id', 'ModId', 'id', 0, SimpleSorterA, SimpleSorterB, 'Select Module', '', '');
	}
}// Generate Select Menu's
function SelectOptions(TarArray, TarField, TarVal1, TarVal2, TarClassA, TarClassB, TarCatahead, TarSort, TarSId, TarExtra, TarFilta, TarFiltb) {
    let TempArray = [...TarArray];
    let OptElements = "";
	let FuncGrabArray; let FuncClass = "";
	let FuncVal; let FuncTitle;
    let currentGroup = null;
	let SwapArray;
	if (TarFilta && TarFilta.length > 0) {
		SwapArray = TempArray.filter(item => item[TarFilta] === TarFiltb);
	} else {
		SwapArray = TempArray;
	}
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
				} else { FuncVal = ` value="${TarVal1} ${item[TarClassB]}"`; }
			} else { FuncVal = ` value="${TarVal1}"`; }
		}
		if(TarClassA.length !== 0){
			if(TarField === 'SimpleModules'){
				let G3label = G3[item.Style-1]?.Name || "Unknown Style";
				if(item.Style.length != 0){
						FuncClass = ` class="${TarClassA}${item[TarClassB]} O-${G3label}"`;
				} else { FuncClass = ` class="${TarClassA}${item[TarClassB]}"`; }
			} else { FuncClass = ` class="${TarClassA}${item[TarClassB]}"`; }
		}
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
function Revealer(Tar, Option1, Option2){
	let Extra1 = "";
	let Extra2 = "";
	if(Option2.length !== 0){ Extra2 = Option2; }
	if(Option1 === "id"){ Extra1 = "#"; } else if(Option1 === "class"){ Extra1 = "Class"; } else { return; }
	if ($(Extra1+Extra2+Tar).is(':visible')) {
		if(Extra2 === "ModId"){
			$("#Input_M"+current+"_" + Tar).val(0);
		}
		$(Extra1+Extra2+Tar).fadeOut(500);
	} else {
		$(Extra1+Extra2+Tar).fadeIn(500);
	}
}
function ShipPreview(TarStorage, TarValue){
	let Iz = Lookup["Size"];
	let Buffer = ""; let TarTarget = "";
	let SwapArray = Ships.find(Item => Item.id === TarValue);
	if(TarStorage === 2){
		Buffer += `<td class="Sol">Solid</td>`; TarTarget = "#PreSolid";
	} else { Buffer += `<td class="Liq">Liquid</td>`; TarTarget = "#PreLiquid"; }
	Buffer += `<td>${SwapArray.Name}</td><td>`+Iz[SwapArray.Size].Name+`</td><td>${SwapArray.Population}</td><td>${SwapArray.StorageVolume}</td><td>${SwapArray.Supply}</td><td>${SwapArray.SpNorm}</td><td><u class="C-H Highlight" title="Spool up time: ${SwapArray.Spool} seconds">${SwapArray.SpTrav}</u></td>`;
	$(TarTarget).empty();
	$(TarTarget).append(Buffer);
}
function Generate(){ //Generate table
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
		let FuncAddrow = `<tr title	="${value.Title}" id="ModId${value.id}" data-type="${value.Type}" data-tier="${value.Tier}" data-Style="${value.Style}" style="display: none;"><td>${value.Name}</td><td style="display: none;">`+G2label+`</td><td>`+G1label+`</td><td style="display: none;">`+G3label+`</td><td><input class="z${value.id} ModId${value.id} Inp-Style-${value.Style} Inp-Tier-${value.Tier} Inp-Type-${value.Type}" id="Input_M1_${value.id}" type="number" value="0"></td><td><span class="SwiClean OptSpan" title="Set value to 0">🧹</span><span class="SwiBin OptSpan" title="Set value to 0 and remove">🗑️</span></td></tr>`;		
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
let SwapResources = JSON.parse(JSON.stringify(resources));	//let ModNeed;
function NormalResources(TarA, TarB, TarC){
const Rfilt = Type;
	$('#CalcContent tbody tr').remove();
	for (let RT = 0; RT < Rfilt.length; RT++) {
		let TotC = ""; let TempA = 0;
		let I = 0;
		let Rlabel = Rfilt[RT].Name;
		TotC += `<tr class="rch" id="rch${RT}"><td></td><td>${Rlabel}</td><td></td><td></td></tr>`;
		let ResCalcArray = SwapResources.filter(Ritem => Ritem.Storage === 1 && Ritem.Type === Rfilt[RT].id);
		ResCalcArray.forEach(Ritems => {
			if (Ritems.InVolume !== 0 || Ritems.OutVolume !== 0) {
				if(Ritems.id === 1){
					TempA = "";
				}
				TotC += `<tr><td title="Tier ${Ritems.Tier}" class="rc${Ritems.Tier}"></td><td>${Ritems.Name}</td><td>${Ritems.InVolume}</td><td>${Ritems.OutVolume}</td></tr>`;
				I++;
			}
		});
		if (I !== 0) {
			$(TarA).append(TotC);
			$(TarB + RT).fadeIn(200);
		}
	}
	$(TarC).slideDown(350);
}
function RawResource(TarA, TarB, TarC){
let RawBuffer = "";	let RawS = 0;	let RawL = 0; let StoreLConvert; let StoreSConvert; let StoreS = 0; let StoreL = 0; let Sstorage = 0;	let Lstorage = 0;	let Cstorage = 0;
let ResourceSArray = SwapResources.filter(item => item.Storage === 2);
	ResourceSArray.forEach(ResA => {
		let RawConvert = ResA.InVolume;
		let StoreSConvert = ResA.InVolume * ResA.StorageVolume;
		RawBuffer += `<tr><td>${ResA.Name}</td><td>${RawConvert}</td><td>${StoreSConvert}<td></td><td></td></tr>`;
		RawS = Math.ceil(RawS + RawConvert);
		StoreS = Math.ceil(StoreS + StoreSConvert);
	});
	RawBuffer += `<tr><td><b>Total Solid</b></td><td>${RawS}</td><<td>${StoreS}</td><td>${Sstorage}</td></tr>`;
	let ResourceLArray = SwapResources.filter(item => item.Storage === 3);
	ResourceLArray.forEach(ResB => {
		let RawsConvert = ResB.InVolume;
		let StoreLConvert = ResB.InVolume * ResB.StorageVolume;
		RawBuffer += `<tr><td>${ResB.Name}</td><td>${RawsConvert}</td><td>${StoreLConvert}</td><td></td></tr>`;
		RawL = Math.ceil(RawL + RawsConvert);
		StoreL = Math.ceil(StoreL + StoreLConvert);
	});
	RawBuffer += `<tr><td><b>Total Liquid</b></td><td>${RawL}</td><td>${StoreL}</td><td>${Lstorage}</td></tr>`;
	$(TarA).remove();
	$(TarB).append(RawBuffer);
	$(TarC).slideDown(350);
}
function ConstrResource(TarA, TarB, TarC){
let ConsBuffer = "";  const ConstrResources = SwapResources.filter((resource) => resource.ConstrVolume !== 0);
ConstrResources.forEach(Constrfilter => {
	ConsBuffer += `<tr id="ConsId${Constrfilter.id}" data-type="${Constrfilter.Type}" data-tier="${Constrfilter.Tier}" data-Style="${Constrfilter.Style}"><td>${Constrfilter.Name}</td><td style="display: none;" >${Constrfilter.Tier}</td><td style="display: none;">${Constrfilter.Type}</td><td style="display: none;" >${Constrfilter.Style}</td><td>${Constrfilter.ConstrVolume}</td></tr>`;
});
$(TarA).remove();
$(TarB).append(ConsBuffer);
$(TarC).slideDown(350);
}
function CalculateModules(){
	let RawBuffer = "";	let RawS = 0;	let RawL = 0; let StoreLConvert; let StoreSConvert; let StoreS = 0; let StoreL = 0; let Sstorage = 0;	let Lstorage = 0;	let Cstorage = 0;
	let SwapArray = JSON.parse(JSON.stringify(Modules));
	let multiplier = 0;	let ModNeed;	let SunPref = Number($("#SunPref").val());
	let StylePref = Number($("#StylePref").val());		let ScalePref = Number($("#ScalePref").val());
	let SithPop = 0;	let GenPop = 0;		let TotPop = 0;			let NegPop = 0;		let EndPop = 0;
	let CalcEffPref = Number($("#CalcEffPref").val()); let CalcMod;
	if($('.App02:visible').length == 0){
		$('.App02').fadeIn(500);
		$('.App03').fadeIn(500);
	}
	$('').fadeIn(500);

	function CalcPop(TarA, TarB, TarC){	let MathFood = 0; let MathMed = 0; let BufFood = []; let BufMed = []; let PopBuffer = ""; BufFood.length = 0;	BufMed.length = 0;
	if(GenPop !== 0){ BufFood = SwapResources.find(resource => resource.id === 18); MathFood = -Math.ceil(BufFood.InVolume+(GenPop * 2.25));
		BufFood.InVolume = MathFood; BufMed = SwapResources.find(resource => resource.id === 22); MathMed = -Math.ceil(BufMed.InVolume+(GenPop * 1.35));
		BufMed.InVolume = MathMed; PopBuffer += `<tr><td>Generic housing</td><td>${GenPop}</td></tr>`;
	}
	if(SithPop !== 0){ let BufVat = SwapResources.find(resource => resource.id === 42);
		let MathVat = -Math.ceil(BufVat.InVolume + (SithPop * 1.65)); BufVat.InVolume = MathVat;
		PopBuffer += `<tr><td>Sith housing</td><td>${SithPop}</td></tr>`;
	}
	if(SithPop !== 0 || GenPop !== 0){ SubRoutine(0); PopBuffer += `<tr><td>Total housing</td><td>${TotPop}</td></tr>`; }
	PopBuffer += `<tr><td>Population needed</td><td>${NegPop}</td></tr>`;
	$(TarA).remove();
	$(TarB).append(PopBuffer);
	$(TarC).slideDown(350);
	}
	function SubRoutine(x){
		if (x === 0) {
			filteredArray = SwapArray.filter(item => item.Type === 1 || item.Type === 3);
		} else {
			filteredArray = SwapArray;
		} let FFx;
		// Cycle Through tiers
		for(let MT = 5; MT >= -1; MT--){	
			const Filter = SwapResources.filter((resource) => resource.Tier === MT-1);
			filteredArray.forEach((ModuleItem, index) => {
				FFx = SwapResources.find(resources => resources.id === ModuleItem.OutputResource1);
				if (!FFx || FFx.OutVolume <= Math.abs(FFx.InVolume)) {
					if (ModuleItem.Tier === MT){
						if($(`#Input_M${current}_${ModuleItem.id}`).val() !== "0") {
							multiplier = $(`#Input_M${current}_${ModuleItem.id}`).val();
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
								var Temp = SwapResources.find(item => item.id === 18);
								console.log(Temp.InVolume);
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
									if(OupTar.id === 1){
										OupTar.OutVolume = Math.ceil((OupTar.OutVolume + (OupVVal * CalcMod) /100) * SunPref);
									} else {
										OupTar.OutVolume = Math.ceil(OupTar.OutVolume + (OupVVal * CalcMod));
									}
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
					ModNeed = Math.ceil(Modbuffer / (((AdModule.OutputVolume1 * CalcMod) / 100) * SunPref ));
				} else {
					ModNeed = Math.ceil(Modbuffer / AdModule.OutputVolume1 * CalcMod);
				}
				if(ScalePref === 0){
					let ModGrab = document.getElementById(`Input_M${current}_`+AdModule.id).value;
					if(ModGrab < ModNeed){
						$(`#Input_M${current}_${AdModule.id}`).val(ModNeed);
					}
				} else { 
				$(`#Input_M${current}_${AdModule.id}`).val(ModNeed); }
					$(`#Input_M${current}_${AdModule.id}`).parent().parent().slideDown(350);				
				}
			});
		}
	}
	SubRoutine(1);
	if(current === 1){
		CalcPop('#PopulationContent tbody tr', '#PopulationContent tbody', '#PopulationContainer div');
		NormalResources('#CalcContent tbody', '#rch', '#CalcContainer div');
		RawResource('#RawContent tbody tr', '#RawContent tbody', '#RawContainer div')
		ConstrResource('#ConstructionContent tbody tr', '#ConstructionContent tbody','#ConstructionContainer div');
	}
	if(current === 2){
		CalcPop('#PopulationContenta tbody tr', '#PopulationContenta tbody', '#PopulationContainera div');
		NormalResources('#CalcContenta tbody', '#rch', '#CalcContainera div');
		RawResource('#RawContenta tbody tr', '#RawContenta tbody', '#RawContainera div')
		ConstrResource('#ConstructionContenta tbody tr', '#ConstructionContenta tbody','#ConstructionContainera div');
		update();
	}
	SwapResources = JSON.parse(JSON.stringify(resources));
}
function ExportData() {
    var data = {};
    $(".TabData.active").find("input, select, textarea").each(function () {
        var firstClass = $(this).attr("class")?.split(" ")[0];
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
    $(".Op2").find("input, select").each(function () {
        var fieldId = $(this).attr("id");
        if (fieldId) {
            if ($(this).is(":checkbox")) {
                data[fieldId] = $(this).prop("checked");
            } else {
                data[fieldId] = $(this).val();
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
    if (!jsonString){ alert("Decoding failed: Please select the right tab. Or invalid data."); return; }
    var data = JSON.parse(jsonString);
    $.each(data, function (className, value) {
        var field = $("." + className);
        if (field.length) {
            if (field.is(":checkbox")) {
                field.prop("checked", value);
            } else if (field.is(":radio")) {
                $('input[name="' + field.attr("name") + '"][value="' + value + '"]').prop("checked", true); // Import selected radio buttons
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
    $.each(data, function (fieldId, value) {
        var field = $("#" + fieldId);
        if (field.length) {
            if (field.is(":checkbox")) {
                field.prop("checked", value);
            } else {
                field.val(value);
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
function updateCssRule(selector, property, value) {
    const styleElement = document.querySelector("style"); // Find the <style> element
	if (!styleElement){console.error("<Style> Not Found"); return;}
	const styleSheet = Array.from(document.styleSheets).find(sheet => sheet.ownerNode === styleElement );
    if(!styleSheet){console.error("Style Not Found"); return;}
	$.each(styleSheet.cssRules, (_, rule) => {
		if (rule.selectorText === selector) {
			rule.style[property] = value;
		}
	});
}
function SpreadSheet(){
	let SwapResources = JSON.parse(JSON.stringify(resources));	let SwapArray = JSON.parse(JSON.stringify(Modules));
	let Z = 0;	let c1 = 0; let E1 =  ""; let c2 = 0; let E2 =  ""; let c3 = 0; let E3 =  ""; let c4 = 0; let E4 =  "";
	SwapArray.sort((a, b) => a.Type - b.Type);
	SwapResources.sort((a, b) => b.Storage - a.Storage);
	let Buffer = `<thead><tr><th>Module</th><th>Input</th>`;
	SwapResources.forEach(AResA => {
		if(c1 % 2 === 0) { E1 = " caSto"+AResA.Storage; } else { E1 = " cbSto"+AResA.Storage;}
		Buffer += `<th class="Side Tyn${AResA.Type} Stn${AResA.Style} Tin${AResA.Tier} Sto${AResA.Storage}${E1}">${AResA.Name}</th>`;
		c1++;
	});
	Buffer += `<th>Module</th></tr></thead><tbody><tr><td></td><td>Total</td>`;
	SwapResources.forEach(AResB => {
		if(c2 % 2 === 0) { E2 = " caSto"+AResB.Storage; } else { E2 = " cbSto"+AResB.Storage;}
		Buffer += `<td class="Tyn${AResB.Type} Stn${AResB.Style} Tin${AResB.Tier} Sto${AResB.Storage}${E2}" id="SprdTop${AResB.id}">0</td>`;
		c2++;
	});	
	Buffer += `</tr>`;
	SwapArray.forEach(moduleA => {
		let Ex = "";
		if(Z % 2 === 0) { Ex = " raTyn"+moduleA.Type; } else { Ex = " rbTyn"+moduleA.Type;  }
		Buffer += `<tr class="rTyn${moduleA.Type} rStn${moduleA.Style} rTin${moduleA.Tier}${Ex}"><td>${moduleA.Name}</td><td><input class="z${moduleA.id} ModEd${moduleA.id}" type="number" onchange="update();" id="Input_M2_${moduleA.id}"></td>`;
		SwapResources.forEach(AResC => {	let Temp = ""; 
			if(AResC.id === moduleA.InputResource1 || AResC.id === moduleA.InputResource2 || AResC.id === moduleA.InputResource3 || AResC.id === moduleA.InputResource4 || AResC.id === moduleA.InputResource5 || AResC.id === moduleA.OutputResource1 || AResC.id === moduleA.OutputResource2){
				Temp = "0";
			}
				Buffer += `<td class="Tyn${AResC.Type} Stn${AResC.Style} Tin${AResC.Tier} Sto${AResC.Storage}" id="Mod${moduleA.id}Res${AResC.id}">${Temp}</td>`;
		});
		Buffer += `<td>${moduleA.Name}</td></tr>`;
		Z++;	
	});
	Buffer += `<tr><td></td><td>Total</td>`;
	SwapResources.forEach(AResD => {
		if(c3 % 2 === 0) { E3 = " caSto"+AResD.Storage; } else { E3 = " cbSto"+AResD.Storage;}
		Buffer += `<td class="Tyn${AResD.Type} Stn${AResD.Style} Tin${AResD.Tier} Sto${AResD.Storage}${E3}" id="SprdBot${AResD.id}">0</td>`;
		c3++;
	});
	Buffer += `</tr><tr><td>Module</td><td>Input</td>`;
	SwapResources.forEach(AResE => {
		if(c4 % 2 === 0) { E4 = " caSto"+AResE.Storage; } else { E4 = " cbSto"+AResE.Storage;}
		Buffer += `<td class="Side Tyn${AResE.Type} Stn${AResE.Style} Tin${AResE.Tier} Sto${AResE.Storage}${E4}">${AResE.Name}</td>`;
		c4++;
	});
	Buffer += `<td>Module</td></tr></tbody>`;
	$('#SpreadTable').append(Buffer);
	
}
function Render(){
	updateCssRule('.rTyn5' ,'display', 'none');
	updateCssRule('.rTyn6' ,'display', 'none');
	$('.MainSwitch').remove();
	$('#SpreadContainer').fadeIn(200);
}
let Firstcheck = 0;
function RunOnce(){
	if(Firstcheck === 0){
		SpreadSheet();
		PopulateSubmenu(Type, 1, 'Type', 'dropdown-header Highlight F22', 'FilterToggleRow rTyn ', '', '', 'SRow', 'id', 1, '');
		PopulateSubmenu(Style, 1, 'Faction', 'dropdown-header Highlight F22', 'FilterToggleRow rStn ', '', '', 'SRow', 'id', 1, '');
		PopulateSubmenu(Tier, 1, 'Tier', 'dropdown-header Highlight F22', 'FilterToggleRow rTin ', '', '', 'SRow', 'id', 0, '');
		PopulateSubmenu(Storage, 1, 'Storage', 'dropdown-header Highlight F22', 'FilterToggle Sto ', '', '', 'SColumn', 'id', 1, '');
		PopulateSubmenu(Type, 1, 'Type', 'dropdown-header Highlight F22', 'FilterToggle Tyn ', '', '', 'SColumn', 'id', 1, '');
		PopulateSubmenu(Style, 1, 'Faction', 'dropdown-header Highlight F22', 'FilterToggle Stn ', '', '', 'SColumn', 'id', 1, '');
		PopulateSubmenu(Tier, 1, 'Tier', 'dropdown-header Highlight F22', 'FilterToggle Tin ', '', '', 'SColumn', 'id', 0, '');
		Render();
		Firstcheck++;
	}	
}
function update(){
	let SwapResources = JSON.parse(JSON.stringify(resources));	let SwapArray = JSON.parse(JSON.stringify(Modules));
	let inp; let outp;	let CalcEffPref = Number($("#CalcEffPref").val());	let CalcMod;	let SunPref = Number($("#SunPref").val());
	let numa = 0; let numb = 0; let ResCalcArray = []; let UpdateResa = []; let UpdateResb = []; let I = 0;
	const InpField = document.querySelectorAll('#SpreadTable input');
	InpField.forEach((input) => {
		if (input.value.trim() !== '') {
			I++;
			const Target = input.classList.length > 0 ? input.classList[0] : null;
			let multiplier = $(`#Input_M${current}_${Target}`).val();
			ResCalcArray = SwapArray.find(Mitem => Mitem.id === Number(Target));
			if(ResCalcArray){
				for(let MT = 5; MT >= 0; MT--){
					inp = "InputResource"+MT; outp = "OutputResource"+MT;
					inpv = "InputVolume"+MT;	outpv = "OutputVolume"+MT;
					numa = Math.ceil(ResCalcArray[inpv] * multiplier);
					UpdateResa = SwapResources.find(Raitem => Raitem.id === ResCalcArray[inp]);
					$('#Mod'+Target+'Res'+ResCalcArray[inp]).html(numa);
					$('#Mod'+Target+'Res'+ResCalcArray[inp]).css({'color': '#ff7a7a', 'font-weight': 'bold'});
					if(UpdateResa){
						UpdateResa.InVolume = UpdateResa.InVolume + numa;
					} else {}
					if(CalcEffPref === 1){
						CalcMod = 1 + (1 * ResCalcArray.MaxEffeciency);
					} else {
						CalcMod = 1;
					}
					if(outp === 1){
 						numb = Math.ceil(((ResCalcArray[outpv] * CalcMod) /100) * SunPref * multiplier);
 					} else {
 						numb = Math.ceil((ResCalcArray[outpv] * CalcMod) * multiplier);
 					}
					UpdateResb = SwapResources.find(Rbitem => Rbitem.id === ResCalcArray[outp]);
					if(UpdateResb){
						UpdateResb.OutVolume = UpdateResb.OutVolume + numb;
					} else {}
					$('#Mod'+Target+'Res'+ResCalcArray[outp]).html(numb);
					$('#Mod'+Target+'Res'+ResCalcArray[outp]).css({'color': '#4caf50', 'font-weight': 'bold'});
				}
			}
		}
	});
	if(I > 0){
		SwapResources.forEach(AResA => {
			x = AResA.OutVolume + AResA.InVolume;
			if(x < 0){
				$('#SprdTop'+AResA.id).css({'color': '#ff7a7a', 'font-weight': 'bold'});
				$('#SprdBot'+AResA.id).css({'color': '#ff7a7a', 'font-weight': 'bold'});
			} else if(x === 0){
				$('#SprdTop'+AResA.id).css({'color': '#000000', 'font-weight': 'normal'});
				$('#SprdBot'+AResA.id).css({'color': '#000000', 'font-weight': 'normal'});
			} else {
				$('#SprdTop'+AResA.id).css({'color': 'var(--Tx1)', 'font-weight': 'bold'});
				$('#SprdBot'+AResA.id).css({'color': 'var(--Tx1)', 'font-weight': 'bold'});
			}
			$('#SprdTop'+AResA.id).html(x);
			$('#SprdBot'+AResA.id).html(x);
		});
	}
}