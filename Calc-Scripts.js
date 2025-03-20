	//globals
	var TotPop = 0;
	let PosiPop = 0;
	let NegaPop = 0; 
	var EfRes = 0;
	let IM = 0;
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

//thanks to stackexchange and copilot for the save and load inspiration :)
function Save() {
    const inputElements = document.querySelectorAll("input[type='number']");
    const extraFields = ["ExtrOpt1", "ExtrOpt2", "ExtrOpt3"];
    
    const numberValues = Array.from(inputElements).map(input => input.value || "0");
    const extraValues = extraFields.map(id => {
        const field = document.getElementById(id);
        if (id === "ExtrOpt2" && field?.type === "checkbox") {
            return field.checked ? "1" : "0";
        }
        return field?.value || "0";
    });

    const allValues = [...numberValues, ...extraValues];
    const uniqueString = btoa(allValues.join(",")); // Encode as a base64 string
    document.getElementById("StringID").value = uniqueString; // Save to text input field
}

function Load() {
    const uniqueString = document.getElementById("StringID").value;
    try {
        const decodedValues = atob(uniqueString).split(",");
        const inputElements = document.querySelectorAll("input[type='number']");
        const extraFields = ["ExtrOpt1", "ExtrOpt2", "ExtrOpt3"];
        
        Array.from(inputElements).forEach((input, index) => {
            input.value = decodedValues[index] || "0";
        });

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

        CalcOpt();
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
			const multiplier = parseFloat(document.getElementById(`moduleInput_${module.name}`).value) || 0;
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
                const multiplier = parseFloat(document.getElementById(`moduleInput_${module.name}`).value) || 0;
                // Update input and output values based on input, i also decidedd to add a simple color change if the value is negative.
                if (module.resource1) {
                    document.getElementById(`input_${module.name}_res${module.resource1}`).textContent = Math.floor(module.volume1 * multiplier);
					if(module.volume1 * multiplier < 0){
						document.getElementById(`input_${module.name}_res${module.resource1}`).style.cssText = 'color: red;';
					} else {
						document.getElementById(`input_${module.name}_res${module.resource1}`).style.cssText = '';
					}
                }
                if (module.resource2) {
                    document.getElementById(`input_${module.name}_res${module.resource2}`).textContent = Math.floor(module.volume2 * multiplier);
					if(module.volume2 * multiplier  < 0){
						document.getElementById(`input_${module.name}_res${module.resource2}`).style.cssText = 'color: red;';
					} else {
						document.getElementById(`input_${module.name}_res${module.resource2}`).style.cssText = '';
					}
                }
                if (module.resource3) {
                    document.getElementById(`input_${module.name}_res${module.resource3}`).textContent = Math.floor(module.volume3 * multiplier);
					if(module.volume3 * multiplier  < 0){
						document.getElementById(`input_${module.name}_res${module.resource3}`).style.cssText = 'color: red;';
					} else {
						document.getElementById(`input_${module.name}_res${module.resource3}`).style.cssText = ' ';
					}
                }
				if (module.resource4) {
                    document.getElementById(`input_${module.name}_res${module.resource4}`).textContent = Math.floor(module.volume4 * multiplier);
					if(module.volume4 * multiplier  < 0){
						document.getElementById(`input_${module.name}_res${module.resource4}`).style.cssText = 'color: red;';
					} else {
						document.getElementById(`input_${module.name}_res${module.resource4}`).style.cssText = ' ';
					}
                }
				if (module.resource5) {
                    document.getElementById(`input_${module.name}_res${module.resource5}`).textContent = Math.floor(module.volume5 * multiplier);
					if(module.volume5 * multiplier  < 0){
						document.getElementById(`input_${module.name}_res${module.resource5}`).style.cssText = 'color: red;';
					} else {
						document.getElementById(`input_${module.name}_res${module.resource5}`).style.cssText = ' ';
					}
                }
				if (module.Race) {
                    document.getElementById(`output_${module.name}_res${module.Race}`).textContent = Math.floor(module.Population * multiplier);
					if(module.Population * multiplier  < 0){
						document.getElementById(`output_${module.name}_res${module.Race}`).style.cssText = 'color: red;';
					} else {
						document.getElementById(`output_${module.name}_res${module.Race}`).style.cssText = ' ';
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
						document.getElementById(`output_${module.name}_res${module.outputResource1}`).textContent = (EfRes / 100) * ExtrOpt1; //sunlight
						if(module.outputVolume1 * multiplier  < 0){
							document.getElementById(`output_${module.name}_res${module.outputResource1}`).style.cssText = 'color: red;';
						} else {
							document.getElementById(`output_${module.name}_res${module.outputResource1}`).style.cssText = 'color: green; font-weight: bold;';
						}
					} else {
						document.getElementById(`output_${module.name}_res${module.outputResource1}`).textContent = EfRes;
						if(module.outputVolume1 * multiplier  < 0){
							document.getElementById(`output_${module.name}_res${module.outputResource1}`).style.cssText = 'color: red;';
						} else {
							document.getElementById(`output_${module.name}_res${module.outputResource1}`).style.cssText = 'color: green; font-weight: bold;';
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
						document.getElementById(`output_${module.name}_res${module.outputResource2}`).textContent = (EfRes / 100) * ExtrOpt1; //sunlight
						if(module.outputVolume1 * multiplier  < 0){
							document.getElementById(`output_${module.name}_res${module.outputResource2}`).style.cssText = 'color: red;';
						} else {
							document.getElementById(`output_${module.name}_res${module.outputResource2}`).style.cssText = 'color: green; font-weight: bold;';
						}
					} else {
						document.getElementById(`output_${module.name}_res${module.outputResource2}`).textContent = EfRes;
						if(module.outputVolume1 * multiplier  < 0){
							document.getElementById(`output_${module.name}_res${module.outputResource2}`).style.cssText = 'color: red;';
						} else {
							document.getElementById(`output_${module.name}_res${module.outputResource2}`).style.cssText = 'color: green; font-weight: bold;';
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
                const multiplier = parseFloat(document.getElementById(`moduleInput_${module.name}`).value) || 0;
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
				} else {
					document.getElementById(`total_${resource.id}`).style.cssText = 'color: green; font-weight: bold;';
				}
                document.getElementById(`total_${resource.id}`).textContent = Math.floor(totals[resource.id]);
            });
        }
	
	//Simple hide/display script
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