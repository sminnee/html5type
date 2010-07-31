$ = function(x) { return document.getElementById(x) };

window.onload = function() { generate(); }
$('regenerateBtn').onclick  = function() { generate(); }
$('content').onchange = function() { generate(); }

function generate() {
	var lines = $('content').value.split("\n");
	var i, y = 10;

	$('rendered').innerHTML = "";
	
	for(i=0;i<lines.length;i++) {
		var p = document.createElement('p');
		var span = document.createElement('span');
		span.innerHTML = lines[i].toUpperCase();
		p.appendChild(span);
		$('rendered').appendChild(p);
		
		// Get the scaling factor
		var scale = (380 / span.offsetWidth);
		
		span.style.MozTransformOrigin = span.style.webkitTransformOrigin = 'top left';
		span.style.MozTransform = span.style.webkitTransform = 'scale(' + scale + ')';

		// Adjust the paragraph height in response ot the scaling
		p.style.height = (span.offsetHeight * scale) + 'px';
		p.style.marginTop = (-8 * scale + 10) + 'px';
		p.style.marginBottom =  (-7 * scale + 10) + 'px';
	}
	
	
}