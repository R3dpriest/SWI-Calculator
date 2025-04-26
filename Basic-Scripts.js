$(document).ready(function() {
	$('#ShipDisclaimer').draggable();
});
let WarnOnce = 0;
function ShipDisclaimer(){
	let Message = "";
	if(WarnOnce === 0){
		Message += `<div class=""><b class="Highlight F22"><u>Please read carefully:</u></b><br><br><div class="dropdown-div"></div><br><b class="Highlight">1.</b> Do not expect this tool to be highly accurate. Hover over <b class="Highlight" title="Small tooltips appear.">highlighted</b> words for more info. <br><b class="Highlight">2. </b>There are many <u class="Highlight" title="Station Layout, Station location, Distance between ore nodes, Captain level, Mining drones, cargo drones, Unpredictable docking and undocking times, objects in the path, in and out sector behavior, etc...">variables </u> that make it <b class="Highlight" title="There is just to many variables to be spot on.">impossible</b> to give an spot on calculation.<br><b class="Highlight">3.</b> I can accurately calculate speed per <b class="Highlight" title="the first (0) sector is counted as half a sector. Thus 125000 meters, but the rest are full 250000 meters. This influences travel time for your miners and can give you a better idea how much miners you need.">sector</b> travaled.<br><b class="Highlight">4.</b> I can accurately calculate how many <b class="Highlight" title="Resources have a set 'volume/space' they take up. By doing some math on your station and running that against your ships i can calculate how many loads per hour you need.">loads</b> you need per hour.<br><b class="Highlight">5. </b>In order to make this work i need to make <b class="Highlight" title="Things like: How big is a sector, how much on avarage can a ship fill per minute. The station is in the center of a zone. Etc...">assumptions</b> anyone who has more accurate info can let me know.<br><b class="Highlight">6.</b> I made this for free and invested ample time into it. So if you feel the need to critize keep it constructive.<br><b class="Highlight">7. Currently not fully implemented. For now the ship and sector selectors are done.</b><br><br><div class="dropdown-div"></div><br><button class="Op-But" onclick="CloseDisc()">I UNDERSTAND</button></div>`;
		$('#ShipDisclaimer').fadeIn(500);
		$('#ShipDisclaimer').append(Message);
		WarnOnce++;
	}
}
function CloseDisc(){
	$('#ShipDisclaimer').fadeOut(300);
}