	//globals
	var TotPop = 0;
	let PosiPop = 0;
	let NegaPop = 0; 
	var EfRes = 0;
	const SimpleR = resources.map(resource => resource);
	
//TODO: Styling, Add calculate station, update on change

//tabselector
const Tabs = document.querySelectorAll('.Tab');
const TabData = document.querySelectorAll('.TabData');

Tabs.forEach((Tab, index) => {
	Tab.addEventListener('click', () => {
		TabData.forEach(data => data.classList.remove('active'));
		TabData[index].classList.add('active');
	});
});

// Highlight row/column script
document.addEventListener('DOMContentLoaded', () => { 
  document.querySelectorAll('td').forEach(cell => { 

    cell.addEventListener('mouseenter', () => {
      const table = cell.closest('table');
      const colIndex = cell.cellIndex;

      Array.from(table.rows).forEach(row => {
        row.cells[colIndex].classList.add('highlight-column');
      });

      cell.parentElement.classList.add('highlight-row');
    });

    cell.addEventListener('mouseleave', () => {
      const table = cell.closest('table');
      const colIndex = cell.cellIndex;

      Array.from(table.rows).forEach(row => {
        row.cells[colIndex].classList.remove('highlight-column');
      });

      cell.parentElement.classList.remove('highlight-row');
    });
  });
});
//Auto update fields on input field change
const inpf = document.getElementsByClassName('SWI_Manual');
Array.from(inpf).forEach(input => {
    input.addEventListener('change', (event) => {
		CalcOpt();
	});
});
	

//thanks to stackexchange and copilot for the save and load inspiration :)
function Save() {
    // Step 1: Find the element with the class "active"
    const activeElement = document.querySelector('.active');
    if (!activeElement) {
        alert("No active element found.");
        return;
    }

    // Step 2: Check the class before "active" (Simple or Complex)
    const classList = Array.from(activeElement.classList);
    const activeIndex = classList.indexOf('active');
    const prefix = activeIndex > 0 ? classList[activeIndex - 1] : null;

    if (!prefix) {
        alert("No class found before 'active' (e.g., Simple or Complex).");
        return;
    }

    // Step 3: Find all input fields with IDs that start with the prefix
    const inputElements = document.querySelectorAll(`input[type="number"][id^="${prefix}"]`);

    // Step 4: Collect their values
    const numberValues = Array.from(inputElements).map(input => input.value || "0");

    // Step 5: Include extra fields
    const extraFields = ["ExtrOpt1", "ExtrOpt2", "ExtrOpt13"];
    const extraValues = extraFields.map(id => {
        const field = document.getElementById(id);
        if (id === "ExtrOpt2" && field?.type === "checkbox") {
            return field.checked ? "1" : "0";
        }
        return field?.value || "0";
    });

    // Step 6: Encode all values
    const allValues = [...numberValues, ...extraValues];
    const uniqueString = btoa(allValues.join(",")); // Encode as a base64 string
    document.getElementById("StringID").value = uniqueString; // Save to a text input field
}



function Load() {
    // Step 1: Find the element with the class "active"
    const activeElement = document.querySelector('.active');
    if (!activeElement) {
        alert("No active element found.");
        return;
    }

    // Step 2: Check the class before "active" (Simple or Complex)
    const classList = Array.from(activeElement.classList);
    const activeIndex = classList.indexOf('active');
    const prefix = activeIndex > 0 ? classList[activeIndex - 1] : null;

    if (!prefix) {
        alert("No class found before 'active' (e.g., Simple or Complex).");
        return;
    }

    // Step 3: Decode the stored data
    const uniqueString = document.getElementById("StringID").value;
    try {
        const decodedValues = atob(uniqueString).split(",");

        // Step 4: Find all input fields with IDs that start with the prefix
        const inputElements = document.querySelectorAll(`input[type="number"][id^="${prefix}"]`);

        // Step 5: Apply the decoded values to the input fields
        Array.from(inputElements).forEach((input, index) => {
            input.value = decodedValues[index] || "0";
        });

        // Step 6: Apply the remaining decoded values to the extra fields
        const extraFields = ["ExtrOpt1", "ExtrOpt2", "ExtrOpt13"];
        extraFields.forEach((id, index) => {
            const fieldIndex = inputElements.length + index; // Offset for additional fields
            const field = document.getElementById(id);
            if (field) {
                if (id === "ExtrOpt2" && field.type === "checkbox") {
                    field.checked = decodedValues[fieldIndex] === "1"; // Set checkbox state
                } else {
                    field.value = decodedValues[fieldIndex] || "0";
                }
            }
        });

        CalcOpt(); // Call CalcOpt if necessary
    } catch (e) {
        alert("Invalid... Sorry");
    }
}

// If you want you can uplug one of the options. 
function CalcOpt() {
	checkpop(); // Needed for effeciency
	CalcModules(); // calculate just the module
	CalcStation(); // calculate just the station
}
		
	function checkpop(){
		TotPop = 0;
		PosiPop = 0;
		NegaPop = 0; 
		resources.forEach(resource => {
			TotPop[resource.id] = 0;
			PosiPop[resource.id] = 0;
			NegaPop[resource.id] = 0;
		});
		modules.forEach(module => { 
			const multiplier = parseFloat(document.getElementById(`ComplexmoduleInput_${module.name}${module.Style}`).value) || 0;
			const calculatedValue = module.Population * multiplier;
			TotPop[module.Population] += calculatedValue;
			if (calculatedValue > 0) {
				PosiPop += calculatedValue;
			} else if (calculatedValue < 0) {
				NegaPop += calculatedValue;
			}
		});
		NegaPop = String(NegaPop).replace("-", "");
		NegaPop = Number(NegaPop);
	}
        // Math for modules
        function CalcModules() {
            modules.forEach(module => {
                const multiplier = parseFloat(document.getElementById(`ComplexmoduleInput_${module.name}${module.Style}`).value) || 0;
                // Update input and output values based on input, i also decidedd to add a simple color change if the value is negative.
                if (module.resource1) {
                    document.getElementById(`input_${module.name}${module.Style}_res${module.resource1}`).textContent = Math.floor(module.volume1 * multiplier);
					if(module.volume1 * multiplier < 0){
						document.getElementById(`input_${module.name}${module.Style}_res${module.resource1}`).style.cssText = 'color: red;';
					} else {
						document.getElementById(`input_${module.name}${module.Style}_res${module.resource1}`).style.cssText = '';
					}
                }
                if (module.resource2) {
                    document.getElementById(`input_${module.name}${module.Style}_res${module.resource2}`).textContent = Math.floor(module.volume2 * multiplier);
					if(module.volume2 * multiplier  < 0){
						document.getElementById(`input_${module.name}${module.Style}_res${module.resource2}`).style.cssText = 'color: red;';
					} else {
						document.getElementById(`input_${module.name}${module.Style}_res${module.resource2}`).style.cssText = '';
					}
                }
                if (module.resource3) {
                    document.getElementById(`input_${module.name}${module.Style}_res${module.resource3}`).textContent = Math.floor(module.volume3 * multiplier);
					if(module.volume3 * multiplier  < 0){
						document.getElementById(`input_${module.name}${module.Style}_res${module.resource3}`).style.cssText = 'color: red;';
					} else {
						document.getElementById(`input_${module.name}${module.Style}_res${module.resource3}`).style.cssText = ' ';
					}
                }
				if (module.resource4) {
                    document.getElementById(`input_${module.name}${module.Style}_res${module.resource4}`).textContent = Math.floor(module.volume4 * multiplier);
					if(module.volume4 * multiplier  < 0){
						document.getElementById(`input_${module.name}${module.Style}_res${module.resource4}`).style.cssText = 'color: red;';
					} else {
						document.getElementById(`input_${module.name}${module.Style}_res${module.resource4}`).style.cssText = ' ';
					}
                }
				if (module.resource5) {
                    document.getElementById(`input_${module.name}${module.Style}_res${module.resource5}`).textContent = Math.floor(module.volume5 * multiplier);
					if(module.volume5 * multiplier  < 0){
						document.getElementById(`input_${module.name}${module.Style}_res${module.resource5}`).style.cssText = 'color: red;';
					} else {
						document.getElementById(`input_${module.name}${module.Style}_res${module.resource5}`).style.cssText = ' ';
					}
                }
				if (module.Race) {
                    document.getElementById(`output_${module.name}${module.Style}_res${module.Race}`).textContent = Math.floor(module.Population * multiplier);
					if(module.Population * multiplier  < 0){
						document.getElementById(`output_${module.name}${module.Style}_res${module.Race}`).style.cssText = 'color: red;';
					} else {
						document.getElementById(`output_${module.name}${module.Style}_res${module.Race}`).style.cssText = ' ';
					}
                }
                if (module.outputResource1) {
					if(document.getElementById('ExtrOpt2').checked){
					if(multiplier == 0){
						EfRes = 0; 
					} else { 
						if(NegaPop < PosiPop){
							PosiPop = NegaPop;
						}
						EfRes = Math.floor(module.outputVolume1 * multiplier * (1 + (PosiPop/NegaPop * module.MaxEffeciency)));
					}					
				} else {
					EfRes = module.outputVolume1 * multiplier ;
				}
					if(module.outputResource1 == 1){
						const ExtrOpt1 = document.getElementById("ExtrOpt1").value;
						document.getElementById(`output_${module.name}${module.Style}_res${module.outputResource1}`).textContent = (EfRes / 100) * ExtrOpt1; //sunlight
						if(module.outputVolume1 * multiplier  < 0){
							document.getElementById(`output_${module.name}${module.Style}_res${module.outputResource1}`).style.cssText = 'color: red;';
						} else {
							document.getElementById(`output_${module.name}${module.Style}_res${module.outputResource1}`).style.cssText = 'color: green; font-weight: bold;';
						}
					} else {
						document.getElementById(`output_${module.name}${module.Style}_res${module.outputResource1}`).textContent = EfRes;
						if(module.outputVolume1 * multiplier  < 0){
							document.getElementById(`output_${module.name}${module.Style}_res${module.outputResource1}`).style.cssText = 'color: red;';
						} else {
							document.getElementById(`output_${module.name}${module.Style}_res${module.outputResource1}`).style.cssText = 'color: green; font-weight: bold;';
						}
					}
                }
				if (module.outputResource2) {
					if(document.getElementById('ExtrOpt2').checked){
					if(multiplier == 0){
						EfRes = 0; 
					} else { 
						if(NegaPop < PosiPop){
							PosiPop = NegaPop;
						}
						EfRes = Math.floor(module.outputVolume1 * multiplier * (1 + (PosiPop/NegaPop * module.MaxEffeciency)));
					}					
				} else {
					EfRes = module.outputVolume1 * multiplier ;
				}
					if(module.outputResource2 == 1){
						const ExtrOpt1 = document.getElementById("ExtrOpt1").value;
						document.getElementById(`output_${module.name}${module.Style}_res${module.outputResource2}`).textContent = (EfRes / 100) * ExtrOpt1; //sunlight
						if(module.outputVolume1 * multiplier  < 0){
							document.getElementById(`output_${module.name}${module.Style}_res${module.outputResource2}`).style.cssText = 'color: red;';
						} else {
							document.getElementById(`output_${module.name}${module.Style}_res${module.outputResource2}`).style.cssText = 'color: green; font-weight: bold;';
						}
					} else {
						document.getElementById(`output_${module.name}${module.Style}_res${module.outputResource2}`).textContent = EfRes;
						if(module.outputVolume1 * multiplier  < 0){
							document.getElementById(`output_${module.name}${module.Style}_res${module.outputResource2}`).style.cssText = 'color: red;';
						} else {
							document.getElementById(`output_${module.name}${module.Style}_res${module.outputResource2}`).style.cssText = 'color: green; font-weight: bold;';
						}
					}
                }
            });
        }

        // Math station
        function CalcStation() {
            const totals = {};
			const ExtrOpt1 = document.getElementById("ExtrOpt1").value;
            resources.forEach(resource => {
                totals[resource.id] = 0;
            });

            modules.forEach(module => {
                const multiplier = parseFloat(document.getElementById(`ComplexmoduleInput_${module.name}${module.Style}`).value) || 0;
                totals[module.resource1] += module.volume1 * multiplier;
                totals[module.resource2] += module.volume2 * multiplier;
                totals[module.resource3] += module.volume3 * multiplier;
				totals[module.resource4] += module.volume4 * multiplier;
				totals[module.resource5] += module.volume5 * multiplier;
				totals[module.Race] += module.Population * multiplier;
				if(document.getElementById('ExtrOpt2').checked){
					if(multiplier == 0){
						EfRes = 0; 
					} else { 
						if(NegaPop < PosiPop){
							PosiPop = NegaPop;
						}
						EfRes = Math.floor(module.outputVolume1 * multiplier * (1 + (PosiPop/NegaPop * module.MaxEffeciency)));
					}					
				} else {
					EfRes = module.outputVolume1 * multiplier ;
				}
				if(module.outputResource1 == 1){
					totals[module.outputResource1] += (EfRes / 100) * ExtrOpt1;
				} else {
					totals[module.outputResource1] += EfRes;
				}
            });

            // Update the total row in the table and gives it color
            resources.forEach(resource => {
				if(totals[resource.id] < 0){
					document.getElementById(`total_${resource.id}`).style.cssText = 'color: red; font-weight: bold;';
					document.getElementById(`Copy_${resource.id}`).style.cssText = 'color: red; font-weight: bold;';
				} else {
					document.getElementById(`total_${resource.id}`).style.cssText = 'color: green; font-weight: bold;';
					document.getElementById(`Copy_${resource.id}`).style.cssText = 'color: green; font-weight: bold;';
				}
					document.getElementById(`total_${resource.id}`).textContent = Math.floor(totals[resource.id]);
					document.getElementById(`Copy_${resource.id}`).textContent = Math.floor(totals[resource.id]);
            });
        }

function Display(Elem, Tar, Opt){
	var OptA;
	var ChangeA = document.getElementsByClassName(Elem);
	var ChangeB = document.getElementsByClassName(Elem+"-m");
	if(document.getElementById(Tar).checked){
		for(let i = 0; i < ChangeA.length; i++) {ChangeA[i].removeAttribute('style');}
		for(let i = 0; i < ChangeB.length; i++) {ChangeB[i].removeAttribute('style');}
	} else {
		for(let i = 0; i < ChangeA.length; i++) {ChangeA[i].style.display = 'none';}
		for(let i = 0; i < ChangeB.length; i++) {ChangeB[i].style.display = 'none';}
	}
}
/*
function Display(Elem, Tar) {
    // Checkbox state: checked or unchecked
    let isChecked = document.getElementById(Tar).checked;

    // Target rows with the specific class
    let rows = document.querySelectorAll(`tr.${Elem}`);
    // Target cells (columns) with the specific class
    let cells = document.querySelectorAll(`td.${Elem}, th.${Elem}`);

    if (isChecked) {
        // Show the targeted rows and cells
        rows.forEach(row => row.style.display = ''); // Unhide rows
        cells.forEach(cell => cell.style.display = ''); // Unhide columns
    } else {
        // Hide the targeted rows and cells
        rows.forEach(row => row.style.display = 'none'); // Hide rows
        cells.forEach(cell => cell.style.display = 'none'); // Hide columns
    }
}
*/

//like 60% o.g. code and 40% ai fixxing my borked script
function Indepthcalc() {

//Functionality to adept to simple and complex
/*const Active = document.querySelector('.active');
const Classes = Array.from(Active.classList);
const Index = Classes.indexOf('active');
let SorC = Classes[Index - 1];

//check for tier 4

var T4 = document.getElementsByClassName(SorC+'M-T4');
Array.from(T4).forEach(input => {
	const value = parseFloat(input.value); 
	if (!isNaN(value) && value > 0) { // Ensure valid number and check > 0
		const classes = input.className.split(' ');
		if (classes.length > 1) {
			console.log(classes[1]);
			let Mid = classes[0].replace(SorC, '');
			const module = modules.find(module => module.outputResource1 === Mid);

			// Logs the second class
			let multiplier = parseFloat(document.getElementById(SorC+`moduleInput_${module.name}${module.Style}`)?.value) || 0;
			if (multiplier > 0) {
			//	runModule(module, multiplier);
			}
		}
	}
});*/


const Active = document.querySelector('.active');
const Classes = Array.from(Active.classList);
const Index = Classes.indexOf('active');
let SorC = Classes[Index - 1];

let Buffer = resources.map(r => ({
	id: r.id,
	volume: 0,
	tier: r.Tier
}));

//The loop appearently struggled to work if 3 was empty.
var T3 = document.getElementsByClassName(SorC+'M-T3');
var T3Array = Array.from(T3);
var T3Exists = T3Array.some(function(T3) { return parseFloat(T3.value) > 0; });
if(T3Exists) {
    var TMod = "M-T3";
} else {
    var TMod = "M-T2";
}

//Res Req
let moduleRequirements = {};
function addModule(module, count) {
	const key = module.outputResource1;
	if (!moduleRequirements[key]) {
		moduleRequirements[key] = 0;
	}
	moduleRequirements[key] += count;
}

// Check for tier 4
var T4 = document.getElementsByClassName(SorC + 'M-T4');
Array.from(T4).forEach(input => {
	const value = parseFloat(input.value);
	if (!isNaN(value) && value > 0) {
	const classes = input.className.split(' ');
		if (classes.length > 1) {
			let Mid = parseInt(classes[0].replace(SorC, ''), 10);
			const module = modules.find(module => module.outputResource1 === Mid);
			let multiplier = parseFloat(document.getElementById(SorC+`moduleInput_${module.name}${module.Style}`)?.value) || 0;
			if(!module) {
				return;
				}
			const inputId = SorC + `moduleInput_${module.name}${module.Style}`;
			if (multiplier > 0) {
				runModule(module, multiplier, 4);
			}
		}
	}
});


//Check active

function runModule(module, count, opt) {
	if(opt === 4){
		for (let k = 1; k <= 5; k++) {
			const MInIdRes = "resource" + k;
			const MInVoRes = "volume" + k;
			if (module[MInIdRes] && module[MInVoRes] !== undefined) {
				let bufItem = Buffer.find(item => item.id === module[MInIdRes]);
				if (bufItem) {
					bufItem.volume += module[MInVoRes] * count;
					let Swap = modules.find(module => module.outputResource1 === bufItem.id);
					if(Swap.Tier === "M-T3"){
						let SubNumA = module[MInVoRes];
						let	SubNumB = String(SubNumA).replace("-", "");
						let	SubNumC = Number(SubNumB);
						let ModNum = Math.ceil(Swap.outputVolume1/SubNumC);
						let get = document.getElementById(SorC+`moduleInput_`+Swap.name+Swap.Style).value;
						let calc = Math.ceil(get+ModNum);
				//		alert(calc);
						document.getElementById(SorC+`moduleInput_`+Swap.name+Swap.Style).value = calc;
						} else {}
				}
			}
		}/* fix later 
		for (let k = 1; k <= 5; k++) {
			const MOuIdRes = "outputResource" + k;
			const MOuVoRes = "outputVolume" + k;
			if (module[MOuIdRes] && module[MOuVoRes] !== undefined) {
				let bufItem = Buffer.find(item => item.id === module[MOuIdRes]);
				if (bufItem) {
					bufItem.volume += module[MOuVoRes] * count;
					console.log('ID: '+bufItem.id+' outVolume: '+bufItem.volume);
				}
			}
		}*/
	} else {
		for (let k = 1; k <= 5; k++) {
			const MInIdRes = "resource" + k;
			const MInVoRes = "volume" + k;
			if (module[MInIdRes] && module[MInVoRes] !== undefined) {
				let bufItem = Buffer.find(item => item.id === module[MInIdRes]);
				if (bufItem) {
					bufItem.volume += module[MInVoRes] * count;
				}
			}
		}
		for (let k = 1; k <= 5; k++) {
			const MOuIdRes = "outputResource" + k;
			const MOuVoRes = "outputVolume" + k;
			if (module[MOuIdRes] && module[MOuVoRes] !== undefined) {
				let bufItem = Buffer.find(item => item.id === module[MOuIdRes]);
				if (bufItem) {
					bufItem.volume += module[MOuVoRes] * count;
				}
			}
		}
		addModule(module, count);
	}
}

//Grab selected
const TModules = modules.filter(m => m.Tier === TMod);
TModules.forEach(module => {
	let multiplier = parseFloat(document.getElementById(SorC+`moduleInput_${module.name}${module.Style}`)?.value) || 0;
	if (multiplier > 0) {
		runModule(module, multiplier, 0);
	}
});

const tierMapping = [
	{ moduleTier: "M-T3", targetResourceTier: "R-T2" },
	{ moduleTier: "M-T2", targetResourceTier: "R-T1" },
	{ moduleTier: "M-T1", targetResourceTier: "R-T0" }
];

for(let idx = 0; idx < tierMapping.length - 1; idx++) {
	let currentMapping = tierMapping[idx];
	let nextMapping = tierMapping[idx + 1];    
	let deficits = Buffer.filter(item => item.tier === currentMapping.targetResourceTier && item.volume < 0);
	deficits.forEach(deficit => {
	let candidates = modules.filter(m => m.Tier === nextMapping.moduleTier && m.outputResource1 === deficit.id);
	if (!candidates.length) {
		console.log(`No module: ${nextMapping.moduleTier} => ${deficit.id}`);
		return;
	}
	let prodModule = candidates[0];
	let needed = Math.ceil(Math.abs(deficit.volume) / prodModule.outputVolume1);
	runModule(prodModule, needed);
	});
}

for (let key in moduleRequirements) {
	const Tar = document.querySelector(`[class~="` + SorC + key + `"]`);
	if (Tar){
		Tar.value = moduleRequirements[key];
    } else {}  
	/* Debug log */
	console.log("Modules " + key + ": " + moduleRequirements[key]);
}

// Return the module requirements if needed.
if(SorC === "Complex"){ CalcOpt(); }
}
