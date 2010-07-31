$ = function(x) { return document.getElementById(x) };

window.onload = function() { generate(); }
window.onresize = function() { generate(); }
$('regenerateBtn').onclick  = function() { generate(); }
$('content').onchange = function() { generate(); }

function generate() {
	var lines = $('content').value.split("\n");
	var i, y = 10;
	
	var desiredWidth = $('rendered').offsetWidth - 20;

	$('rendered').innerHTML = "";
	
	for(i=0;i<lines.length;i++) {
		var p = document.createElement('p');
		var span = document.createElement('span');
		span.innerHTML = lines[i].toUpperCase();
		p.appendChild(span);
		$('rendered').appendChild(p);
		
		// Get the scaling factor
		var scale = (desiredWidth / span.offsetWidth);
		
		span.style.width = (span.offsetWidth+5) + 'px';
		span.style.display = 'block';
		span.style.MozTransformOrigin = span.style.webkitTransformOrigin = 'top left';
		span.style.MozTransform = span.style.webkitTransform = 'scale(' + scale + ')';

		// Adjust the paragraph height in response ot the scaling
		p.style.height = (span.offsetHeight * scale) + 'px';
		
		// Futura
		// var topFudge = 8; var bottomFudge = 7;
		// Helvetica
		var topFudge = 2.8; var bottomFudge = 5.9;
		var spacing = 10;
		
		p.style.marginTop = (-topFudge * scale + spacing) + 'px';
		p.style.marginBottom =  (-bottomFudge * scale + spacing) + 'px';

	}
	
	
}