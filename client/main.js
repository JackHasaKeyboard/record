import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

$(document).ready(function() {
	function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
		var angleInRadians = (angleInDegrees + 90) * Math.PI / 180.0;

		return {
			x: centerX + radius * Math.cos(angleInRadians),
			y: centerY + radius * Math.sin(angleInRadians)
		};
	}

	function describeArc(radius, startAngle, endAngle) {
		var start = polarToCartesian(100, 100, radius, endAngle - 3);
		var end = polarToCartesian(100, 100, radius, startAngle + 3);

		var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

		var d = [
			"M",
			start.x,
			start.y,
			"A",
			radius,
			radius,
			0,
			arcSweep,
			0,
			end.x,
			end.y
		].join(" ");

		return d;
	}

	track = [
		{
			title: "Jeopardy",
			len: 202
		},
		{
			title: "Oh My Darling Don't Cry",
			len: 205
		},
		{
			title: "Blockbuster Night Part 1",
			len: 152
		},
		{
			title: "Close Your Eyes (And Count to F-ck) [feat. Zack de la Rocha]",
			len: 234
		},
		{
			title: "All My Life",
			len: 188
		},
		{
			title: "Lie, Cheat, Steal",
			len: 209
		},
		{
			title: "Early (feat. BOOTS)",
			len: 224
		},
		{
			title: "All Due Respect (feat. Travis Barker)",
			len: 168
		},
		{
			title: "Love Again (Akinyele Back)",
			len: 225
		},
		{
			title: "Crown (feat. Diane Coffee)",
			len: 226
		},
		{
			title: "Angel Duster",
			len: 310
		}
	];

	var groove = [];

	var radius = 80;

	var g = 0,
		total = 0,
		pos = [];

	$.each(track, function(i, el) {
		total += el["len"] / 2;

		if (total > 360) {
			g++;

			total = 0;
		}

		pos = {
			start: total,
			end: total + track[i]["len"] / 2
		};

		$("#record").append(
			'<svg height="200px" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="black" stroke-width="4" d="' +
			describeArc(radius - g * 10, pos["start"], pos["end"]) +
			'"><animate class="groove" attributeName="d" attributeType="XML" dur="0.26s" begin="indefinite" fill="freeze" to="' +
			describeArc(radius - g * 10, pos["start"], pos["end"]) +
			'" />' +
			'<animate class="track" attributeName="d" attributeType="XML" dur="0.26s" begin="indefinite" fill="freeze" to="M 20,200 A 100,0 0 0 0 180,200" /></path></svg>'
		);

		// track
		$("#track").append("<li>" + el["title"] + "</li>");

		$('#track li:first-child').attr('id', 'active');
	});

	// label
	$("#record").append('<svg id="label"><circle cx="100" cy="100" r="30" stroke="none" fill="black" /><circle cx="100" cy="100" r="4" fill="white" /></svg>');

	/* track */
	var i = 0,
		p = 0;

	$("#track li").click(function() {
		$("li").attr("id", "");
		$(this).attr("id", "active");

		i = $(this).index();
	});

	$("#tog").click(function() {
		if ($("#record").attr("class") == "-stopped") {
			$(".track")[i].beginElement();

			$("#record").attr("class", "-playing");

			$("#record svg").attr("class", "");
			$("#record svg:not(:nth-child(" + (i + 1) + "))").attr("class", "spin");

			$("#record").append("<svg id='needle'><path d='M 20,190 H 30 L 20,200' /></svg>");

			$("#tog").attr("class", "fa fa-pause");
		} else {
			$(".groove")[p].beginElement();

			$("#record").attr("class", "-stopped");

			$("#record svg").attr("class", "");

			$('#needle').remove();

			$("#tog").attr("class", "fa fa-play");
		}

		p = i;
	});
});
