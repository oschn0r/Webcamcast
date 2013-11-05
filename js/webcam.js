/*
** Webcamcast 
**
** 2013 Ingo Eberhardt ingo@twinlabs.de
**
*/

var Webcam = {
		camNr : 1,
	    camStreams : [],
	    addCamera :function(title, el, streamurl) {
	    	var camNr = Webcam.camNr;
	    	camNr++;
	    	Webcam.camNr = camNr;

	    	//console.log(title+' '+camNr);
	    	if(Webcam.camStreams[camNr] == undefined) {
				Webcam.camStreams[camNr] = { imageNr : 1};
				Webcam.camStreams[camNr].el = el;
				Webcam.camStreams[camNr].streamurl = streamurl;
				Webcam.camStreams[camNr].camtitle = title;

				Webcam.camStreams[camNr].previous_time = new Date();
			    Webcam.camStreams[camNr].fNi = 0;
			    Webcam.camStreams[camNr].msAvg = 0;
			    Webcam.camStreams[camNr].fpsAvg = 0;
			    Webcam.camStreams[camNr].fcnt = 0;
			    Webcam.camStreams[camNr].fN = 80;
			    Webcam.camStreams[camNr].msa = [];
			    Webcam.camStreams[camNr].wsize = 4;

			    Webcam.createPanel(camNr);
			}

			Webcam.createImageLayer(camNr);
	    },
	    createPanel : function(camNr) {
	    	var html = '';
	    	html += '<div class="panel panel-default">';
				html += '<div class="panel-heading">';
					html += '<h3 class="panel-title">Webcam 2 ';
					html += '<span class="label label-success pull-right" id="webcam2-status">Online</span> ';
					html += '<span class="label label-primary pull-right">';
					html += '<span id="webcam2-ms">-</span> ms (<span id="webcam2-fps">-</span> fps)';
					html += '</span> ';
					html += '<span class="label label-info pull-right">Avg<sub id="webcam2-fN">-</sub> :  ';
					html += '<span  id="webcam2-ravgms">-</span> ms (<span  id="webcam2-ravgfps">-</span> fps)';
					html += '</span> ';
					html += '</h3>';
				html += '</div>';

				html += '<div class="panel-body" id="webcam2">';
					html += '<noscript>';
					html += '<img src="http://192.168.1.253:8080//?action=snapshot" />';
					html += '</noscript>';
				html += '</div>';
			html += '</div>';

			var el = Webcam.camStreams[camNr].el;
			var panelContainer = document.getElementById(el+"-container");

			var panelDefault = document.createElement("div");
				panelDefault.className = "panel panel-default";

				panelContainer.appendChild(panelDefault);

				var panelHeading = document.createElement("div");					
					panelHeading.className = "panel-heading";

					panelDefault.appendChild(panelHeading);

				var panelH3 = document.createElement("h3");
					panelH3.className ="panel-title";
					
					panelHeading.appendChild(panelH3);
					
				var panelH3Node = document.createTextNode(Webcam.camStreams[camNr].camtitle);
					panelH3.appendChild(panelH3Node);

				var panelStatus = document.createElement("span");
					
					panelStatus.className = "label label-success pull-right";
					panelStatus.id = el+"-status";

					panelH3.appendChild(panelStatus);

				var panelStatusNode = document.createTextNode("online");
					panelStatus.appendChild(panelStatusNode);

				var panelMsFpsStatus = document.createElement("span");
					panelMsFpsStatus.className = "label label-primary pull-right";
					panelMsFpsStatus.id = "foobar";
					panelH3.appendChild(panelMsFpsStatus);

				var panelFoo = document.createTextNode("foo");
					//panelMsFpsStatus.appendChild(panelFoo);
					

				var panelMs = document.createElement("span");
					panelMs.className = "moohba";
					panelMs.id = el+"-ms";
					panelMsFpsStatus.appendChild(panelMs);

				var panelMsNode = document.createTextNode("-");
					panelMs.appendChild(panelMsNode);

				var panelMsLabel = document.createTextNode("ms (");
					panelMsFpsStatus.appendChild(panelMsLabel);

				var panelFps = document.createElement("span");
					panelFps.id = el+"-fps";
					panelMsFpsStatus.appendChild(panelFps);

				var panelFpsNode = document.createTextNode("-");
					panelFps.appendChild(panelFpsNode);

				var panelFpsLabel = document.createTextNode("fps)");
					panelMsFpsStatus.appendChild(panelFpsLabel);

			var panelBody = document.createElement("div");
				panelBody.className = "panel-body";
				panelBody.id = el;
				panelDefault.appendChild(panelBody);

			var panelNoscript = document.createElement("noscript");
				panelBody.appendChild(panelNoscript);

			var panelImg = document.createElement("img");
				panelImg.src = Webcam.camStreams[camNr].streamurl;
				panelNoscript.appendChild(panelImg);
			//Webcam.camStreams[camNr].innerHTML(html);
	    },
		createImageLayer : function(camNr) {
		var img = new Image();
		img.style.position = "absolute";
		img.style.zIndex = -1;
		img.style.width = "95%";
		img.style.display ="block";

		Webcam.camStreams[camNr].imageNr = Webcam.camStreams[camNr].imageNr+1;

		img.camNr = camNr;
		img.imageNr = Webcam.camStreams[camNr].imageNr;
		img.src = Webcam.camStreams[camNr].streamurl; //+(Webcam.camStreams[camNr].imageNr);
		img.paused = false;
		img.el = Webcam.camStreams[camNr].el;
		img.streamurl = Webcam.camStreams[camNr].streamurl;
		img.onload = Webcam.imageOnload;
		img.onclick = Webcam.imageOnclick;
		img.id = Webcam.camStreams[camNr].el+"-image";

		Webcam.camStreams[camNr].ms = document.getElementById(Webcam.camStreams[camNr].el+'-ms').firstChild;
		Webcam.camStreams[camNr].fps = document.getElementById(Webcam.camStreams[camNr].el+'-fps').firstChild;
		//Webcam.camStreams[camNr].ravgFps = document.getElementById(Webcam.camStreams[camNr].el+'-ravgfps').firstChild;
		//Webcam.camStreams[camNr].ravgMs = document.getElementById(Webcam.camStreams[camNr].el+'-ravgms').firstChild;

		var webcamContent = document.getElementById(Webcam.camStreams[camNr].el);
		webcamContent.style.height = "200px";

		webcamContent.insertBefore(img, webcamContent.firstchild);
		var webcamImage = document.getElementById(Webcam.camStreams[camNr].el+"-image");
		webcamContent.style.height = webcamImage.height+"px";
		webcamContent.style.padding = 0;

		//document.getElementById('fN').firstChild.nodeValue = fN;


		/*var basauthdum = document.getElementById(el+"-basauthdum");
		if(basauthdum != undefined) {
		  basauthdum.style.display = "none";
		}*/
	},
	imageOnload : function() {
		//if(this.style != undefined) { 

		this.style.zIndex = Webcam.camStreams[this.camNr].imageNr; // Image finished, bring to front!
		if(Webcam.camStreams[this.camNr].finished == undefined) {
		   Webcam.camStreams[this.camNr].finished = new Array();
		}

		while (1 <  Webcam.camStreams[this.camNr].finished.length) {
		  var del = Webcam.camStreams[this.camNr].finished.shift(); // Delete old image(s) from document
		  del.parentNode.removeChild(del);
		}

		Webcam.camStreams[this.camNr].finished.push(this);

		/*Webcam.camStreams[camNr].fNi
	    Webcam.camStreams[camNr].msAvg
	    Webcam.camStreams[camNr].fpsAvg
	    Webcam.camStreams[camNr].fcnt
	    Webcam.camStreams[camNr].fN
	    Webcam.camStreams[camNr].msa
	    Webcam.camStreams[camNr].wsize*/

		var current_time = new Date();
        var delta = current_time.getTime() - Webcam.camStreams[this.camNr].previous_time.getTime();
        var fps   = (1000.0 / delta).toFixed(1);

		Webcam.runningAvgs(this.camNr, delta);

        Webcam.camStreams[this.camNr].ms.nodeValue = delta;
        Webcam.camStreams[this.camNr].fps.nodeValue = fps;
		//Webcam.camStreams[this.camNr].ravgFps.nodeValue = Webcam.camStreams[this.camNr].fpsAvg.toFixed(1);
		//Webcam.camStreams[this.camNr].ravgMs.nodeValue = Webcam.camStreams[this.camNr].msAvg.toFixed(0);
		Webcam.camStreams[this.camNr].previous_time = current_time;


		if (!Webcam.camStreams[this.camNr].paused) Webcam.createImageLayer(this.camNr, Webcam.camStreams[this.camNr].el, Webcam.camStreams[this.camNr].streamurl);
		//}
	},
	imageOnclick : function() { // Clicking on the image will pause the stream
		//console.log("click");
		Webcam.camStreams[this.camNr].paused = !Webcam.camStreams[this.camNr].paused;
		if (!Webcam.camStreams[this.camNr].paused) Webcam.createImageLayer(this.camNr, Webcam.camStreams[this.camNr].el, Webcam.camStreams[this.camNr].streamurl);
	},
	runningAvgs : function(camNr, delta) {

		Webcam.camStreams[camNr].previous_time = new Date();
		// delta is the measured frame period
		var len;
		if (Webcam.camStreams[camNr].fcnt < Webcam.camStreams[camNr].fN) {

			Webcam.camStreams[camNr].fcnt++;
			// we need to populate the sample array
			Webcam.camStreams[camNr].msa.push(delta);
			// calculate average period so far
			Webcam.camStreams[camNr].msAvg += (delta - Webcam.camStreams[camNr].msAvg) / Webcam.camStreams[camNr].fcnt;
			
		} else {
			/*
				running average (fN samples) according to the formula:
				rAvg = rAvg - value_fN_samples_back / fN + newest_value / fN
			*/
			Webcam.camStreams[camNr].msAvg += (delta - Webcam.camStreams[camNr].msa[0])/Webcam.camStreams[camNr].fN;
			// drop oldest ms value, msa[0]
			Webcam.camStreams[camNr].msa = Webcam.camStreams[camNr].msa.slice(1);
			// append newest value, delta
			Webcam.camStreams[camNr].msa.push(delta);
		}
		// calculate average fps
		Webcam.camStreams[camNr].fpsAvg = 1000 / Webcam.camStreams[camNr].msAvg;
		/*
			once every fN frames, check if we need to adjust the averaging window
			since faster rates seem to need more samples to reach a stable(er) readout
		*/
		if (++Webcam.camStreams[camNr].fNi == Webcam.camStreams[camNr].fN) {

			Webcam.camStreams[camNr].fNi = 0;
			// new window size
			Webcam.camStreams[camNr].fN = parseInt(Webcam.camStreams[camNr].fpsAvg * Webcam.camStreams[camNr].wsize);
			len = Webcam.camStreams[camNr].fcnt - Webcam.camStreams[camNr].fN;
			// if our sample array, msa, has extra samples, then trim it to the new size
			if (len > 0) {

				// adjust averaging window (nr of samples)
				Webcam.camStreams[camNr].msa = Webcam.camStreams[camNr].msa.splice(len);
				// avoid populating the sample array again
				Webcam.camStreams[camNr].fcnt = Webcam.camStreams[camNr].fN;
			}
		}
	}
}