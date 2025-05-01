let S0 = 0; let L0 = 0;
$(document).ready(function() {
	$('#ShipDisclaimer').draggable();
	$(document).on("change", "#SolidMiners", () => S0++);
	$(document).on("change", "#LiquidMiners", () => L0++);
});

function ShipRequirement(){
	//Variable
	let SecDis = 250000;
	if(S0 === 0 || L0 === 0){
		alert('Both ships must be selected'); 
	} else { 
	//Script
		let Res = ""; let Calc = 0;
		let S1 = Number($("#SolidMiners").val());
		let S2 = Ships.find(SItem => SItem.id === S1);
		let L1 = Number($("#LiquidMiners").val());
		let L2 = Ships.find(LItem => LItem.id === L1);
		console.log(S2);
		console.log(L2);
		
		
		for (let SQ = 8; SQ >= 2; SQ--){
			Calc = 0;
			Res = $(".GrJumps"+SQ).val();
			if(SQ > 5){
				Calc = ((SecDis/2) + (SecDis * Res)) / L2.SpTrav + (L2.Spool * Res + L2.Spool);
			} else { 
				Calc = ((SecDis/2) + (SecDis * Res)) / S2.SpTrav + (S2.Spool * Res + S2.Spool);
			}
			console.log(SQ + "||"+Calc);
		}
	}
}

/*  ((250000/11548) * sectors / 60 ) + ((storage/100) *Time it takes to fill 100 / 60)+ 2 [the last is two minutes extra for docking and undocking] */