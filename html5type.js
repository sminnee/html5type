$ = function(x) { return document.getElementById(x) };

if(typeof console == 'undefined') console = { log: function() {} };

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
		
		// Two-pass scaling method
		span.style.fontSize = '20px';
		var scale = (desiredWidth / span.offsetWidth);
		span.style.fontSize = (scale * parseFloat(span.style.fontSize)) + 'px';
		scale = (desiredWidth / span.offsetWidth);
		span.style.fontSize = (scale * parseFloat(span.style.fontSize)) + 'px';
		
		// Helvetica (font-size fudge)
		var topFudge = -0.2; var bottomFudge = -0.23;

		// Apply fudge (it needs to be block for this to work)
		span.style.display = 'block';
		span.style.marginTop = (topFudge * parseFloat(span.style.fontSize)) + 'px';
		span.style.marginBottom = (bottomFudge * parseFloat(span.style.fontSize)) + 'px';

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