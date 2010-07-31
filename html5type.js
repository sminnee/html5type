$ = function(x) { return document.getElementById(x) };

window.onload = function() { 
	loadText();
	generate(); 
}
window.onresize = function() { generate(); }
$('content').onchange = function() { generate(); }
$('saveBtn').onclick  = function() { save(); }


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

function loadText() {
	var vars = getUrlVars();
	if(typeof vars.text == 'string') {
		$('content').value = vars.text;
	}

}

function getUrlVars() {
	var vars = {}, hash;
	
	if(window.location.href.indexOf('?') == -1) return vars;
	
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	console.log(hashes);
	for(var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
//		vars.push(hash[0]);
		vars[unescape(hash[0])] = decodeURIComponent(hash[1]);
	}

	return vars;
}

function save() {
	var url;
	if(window.location.href.indexOf('?') == -1) url = window.location.href;
	else url = window.location.href.slice(0, window.location.href.indexOf('?'));
	console.log(url);
	
	url += '?text=' + encodeURIComponent($('content').value);
	
	$('link').href = url;
	$('linkText').innerHTML = url;
	$('saveResults').style.display = 'block';
}