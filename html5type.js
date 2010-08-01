// Helpers
$ = function(x) { return document.getElementById(x) };
getVars = getUrlVars();
if(typeof console == 'undefined') console = { log: function() {} };

function renderFromContent() {
	if(getVars.text == $('content').value) {
		$('saveResults').style.display = 'block';
		$('saveButtonHolder').style.display = 'none';
	} else {
		$('saveResults').style.display = 'none';
		$('saveButtonHolder').style.display = 'block';
	}
	
	render($('content').value);
}

function render(content) {
	// Default boxtweaks
	var font = window.getComputedStyle($('rendered'), null).fontFamily;
	var boxTweaks = boundingBoxTweaks[font];
	
	var lines = content.split("\n");
	var i, y = 10;
	
	var desiredWidth = $('rendered').offsetWidth - 20;

	$('rendered').innerHTML = "";
	
	for(i=0;i<lines.length;i++) {
		var p = document.createElement('p');
		var span = document.createElement('span');
		
		var text = lines[i].replace(/([ \t]+$)|(^[ \t]+)/g,'').toUpperCase();
		if(!text) continue;
		
		span.innerHTML = text;
		p.appendChild(span);
		$('rendered').appendChild(p);
		
		var firstChar = lines[i].charAt(0).toLowerCase();
		var lastChar = lines[i].charAt(lines[i].length-1).toLowerCase();
		
		var topFudge = boxTweaks.top;
		var bottomFudge = boxTweaks.bottom;
		var leftFudge = boxTweaks.left[firstChar];
		if(leftFudge == null) leftFudge = boxTweaks.left.default;
		var rightFudge = boxTweaks.right[lastChar];
		if(rightFudge == null) rightFudge = boxTweaks.right.default;

		// Two-pass scaling method
		span.style.fontSize = '100px';
		var scale = (desiredWidth / fudgedWidth(span, leftFudge, rightFudge));
		span.style.fontSize = (scale * parseFloat(span.style.fontSize)) + 'px';
		scale = (desiredWidth / fudgedWidth(span, leftFudge, rightFudge));
		span.style.fontSize = (scale * parseFloat(span.style.fontSize)) + 'px';

		// Get a final scale to apply via CSS transforms
		scale = (desiredWidth / fudgedWidth(span, leftFudge, rightFudge));
		
		// Apply fudge (it needs to be block for this to work)

		span.style.display = 'block';
		span.style.marginTop = calcFudge(topFudge, span) + 'px';
		span.style.marginBottom = calcFudge(bottomFudge, span) + 'px';
		span.style.marginLeft = calcFudge(leftFudge, span) + 'px';
		
		if(parseInt(scale * desiredWidth) != parseInt(desiredWidth)) {
			p.style.MozTransform = span.style.webkitTransform = "scale(" + scale + ")";
		}
	}
}

/**
 * The margin fudging that can't be applied such that offsetWidth factors it in, so we need
 * to manually adjust for this
 */
function fudgedWidth(span, leftFudge, rightFudge) {
 	return span.offsetWidth + calcFudge(leftFudge, span) + calcFudge(rightFudge, span);
}

function calcFudge(fudge, span) {
	if(typeof fudge != 'number') {
		return (parseFloat(span.style.fontSize) * fudge[0]) + fudge[1];
	} else {
		return (parseFloat(span.style.fontSize) * fudge);
	}
}

function loadText() {
	if(typeof getVars.text == 'string') {
		$('content').value = getVars.text;
		$('saveResults').style.display = 'block';
		$('currentPageLink').href = window.location.href;
	}

}

function getUrlVars() {
	var vars = {}, hash;
	
	if(window.location.href.indexOf('?') == -1) return vars;
	
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		vars[unescape(hash[0])] = decodeURIComponent(hash[1]);
	}

	return vars;
}

function save() {
	var url;
	if(window.location.href.indexOf('?') == -1) url = window.location.href;
	else url = window.location.href.slice(0, window.location.href.indexOf('?'));
	
	url += '?text=' + encodeURIComponent($('content').value);
	
	window.location.href = url;
}
/**
 * TweakMaker code
 */
TweakMaker = {
	init: function() {
		window.onload = function() {
			TweakMaker.loadVars();
			TweakMaker.update();
		}
		$('topBottomRadio').onclick = TweakMaker.update;
		$('leftRightRadio').onclick = TweakMaker.update;
		$('top').onchange = function() { TweakMaker.saveVar('top'); }
		$('bottom').onchange = function() { TweakMaker.saveVar('bottom'); }
		$('left0').onchange = function() { TweakMaker.saveVar('left0'); }
		$('left1').onchange = function() { TweakMaker.saveVar('left1'); }
		$('right0').onchange = function() { TweakMaker.saveVar('right0'); }
		$('right1').onchange = function() { TweakMaker.saveVar('right1'); }

		$('top').onkeypress =  $('bottom').onkeypress =  $('left0').onkeypress = 
		$('left1').onkeypress = $('right0').onkeypress = $('right1').onkeypress = 
			TweakMaker.upDownHandler;

		$('character').onchange = function() {
			TweakMaker.loadVars()
			TweakMaker.update()
		}
	},
	
	update: function() {
		if($('topBottomRadio').checked) {
			$('topBottom').style.display = 'block';
			$('leftRight').style.display = 'none';
		
			render("ab\ncde\nfghi\njklmn\nopqrst\nuvwxyz");
		
		} else {
			$('topBottom').style.display = 'none';
			$('leftRight').style.display = 'block';

			render(TweakMaker.repeatedChar($('character').value));
		}
	},
	
	loadVars: function() {
		var font = window.getComputedStyle($('rendered'), null).fontFamily;
		var boxTweaks = boundingBoxTweaks[font];
		
		$('top').value = boxTweaks.top;
		$('bottom').value = boxTweaks.bottom;
		if($('character').value) {
			var character = $('character').value;
			if(!boxTweaks.left[character]) {
				boundingBoxTweaks[font].left[character] = boxTweaks.left[character] = 
					[boxTweaks.left.default[0], boxTweaks.left.default[1]];
			}
			if(!boxTweaks.right[character]) {
				boxTweaks.right[character] = boxTweaks.right.default;
				boundingBoxTweaks[font].right[character] = boxTweaks.right[character] = 
					[boxTweaks.right.default[0], boxTweaks.right.default[1]];
			}
			if(typeof boxTweaks.left[character] == 'number') {
				$('left0').value = boxTweaks.left[character];
				$('left1').value = 0;
			} else {
				$('left0').value = boxTweaks.left[character][0];
				$('left1').value = boxTweaks.left[character][1];
			}
			$('right0').value = boxTweaks.right[character][0];
			$('right1').value = boxTweaks.right[character][1];
		}
	},
	
	saveVar: function(varName) {
		var font = window.getComputedStyle($('rendered'), null).fontFamily;

		switch(varName) {
		case 'top': case 'bottom':
			boundingBoxTweaks[font][varName] = parseFloat($(varName).value);
			break;

		case 'left0': case 'right0': case 'left1': case 'right1':

			var character = $('character').value;
			varName.match(/^(.*)([01])$/);
			boundingBoxTweaks[font][RegExp.$1][character][RegExp.$2] = parseFloat($(varName).value);
		}
		
		$('tweakOutput').innerHTML = JSON.stringify(boundingBoxTweaks);
		
		TweakMaker.update();
	},
	
	upDownHandler: function(evt) {
		if(this.id == 'right1' || this.id == 'left1') var delta = evt.shiftKey ? 0.1 : 1;
		else var delta = evt.shiftKey ? 0.001 : 0.01;
		switch(evt.keyCode) {
			case 38:
				this.value = fixFloat(parseFloat(this.value) + delta);
				this.onchange();
				break;
			
			case 40:
				this.value = fixFloat(parseFloat(this.value) - delta);
				this.onchange();
				break;
			
			default:
				return null;
		}
		return false;
	},
	
	repeatedChar: function(character) {
		var output = "";
		for(var i = 2; i < 10; i++) {
			for(var j = 0; j < i; j++) {
				if(j > 0) output += ' ';
				output += character;
			}
			output += "\n";
		}
		return output;
	}
}

function fixFloat(val) {
	return Math.round(val*1000) * 1.0 / 1000;
}

// Overall set-up
switch(document.body.id) {
case 'index':
	window.onload = function() { 
		loadText();
		renderFromContent(); 
	}
	window.onresize = function() { renderFromContent(); }
	$('content').onchange = function() { renderFromContent(); }
	$('saveBtn').onclick  = function() { save(); }
	break;

case 'tweak-maker':
	TweakMaker.init();
	break;
}
