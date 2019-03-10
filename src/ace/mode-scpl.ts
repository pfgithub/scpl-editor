/*eslint-disable func-names*/

import ace from "brace";

// @ts-ignore
ace.define("ace/mode/scpl_highlight_rules", function(require: any, exports: any, _module: any) {
	"use strict";
	const oop = require("../lib/oop");
	const TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
	/* --------------------- START ----------------------------- */
	const ScplHighlightRules = function() {
		// @ts-ignore
		this.$rules = {
			start: [
				{
					token: "punctuation.operator",
					regex: "(\\\")",
					push: "string__1"
				},
				{
					token: "punctuation.operator",
					regex: "(^\\s*\\|\\s*)",
					push: "barlist__1"
				},
				{
					token: "variable",
					regex: "(:([A-Za-z0-9@._]+))"
				},
				{
					token: "keyword",
					regex: "([A-Za-z0-9@._]+)"
				},
				{
					token: "comment",
					regex: "(/\\*)",
					push: "multi_line_comment__1"
				},
				{
					token: "comment",
					regex: "(--\\[)",
					push: "multi_line_comment__2"
				},
				{
					token: "comment",
					regex: "(--.*)"
				},
				{
					token: "comment",
					regex: "(#.*)"
				},
				{
					token: "comment",
					regex: "(//.*)"
				},
				{
					token: "punctuation.operator",
					regex: "(\\()",
					push: "action__1"
				},
				{
					token: "punctuation.operator",
					regex: "(\\[)",
					push: "action__2"
				},
				{
					token: "punctuation.operator",
					regex: "({)",
					push: "action__3"
				},
				{
					token: "punctuation.operator",
					regex: "([\"\\:,;^\\->=])"
				},
				{
					token: "invalid",
					regex: "([^\\s])"
				},
				{
					defaultToken: "text",
				}
			],
			action__1: [
				{
					token: "punctuation.operator",
					regex: "(\\))",
					next: "pop"
				},
				{
					token: "punctuation.operator",
					regex: "(\\\")",
					push: "string__1"
				},
				{
					token: "punctuation.operator",
					regex: "(^\\s*\\|\\s*)",
					push: "barlist__1"
				},
				{
					token: "variable",
					regex: "(:([A-Za-z0-9@._]+))"
				},
				{
					token: "keyword",
					regex: "([A-Za-z0-9@._]+)"
				},
				{
					token: "comment",
					regex: "(/\\*)",
					push: "multi_line_comment__1"
				},
				{
					token: "comment",
					regex: "(--\\[)",
					push: "multi_line_comment__2"
				},
				{
					token: "comment",
					regex: "(--.*)"
				},
				{
					token: "comment",
					regex: "(#.*)"
				},
				{
					token: "comment",
					regex: "(//.*)"
				},
				{
					token: "punctuation.operator",
					regex: "(\\()",
					push: "action__1"
				},
				{
					token: "punctuation.operator",
					regex: "(\\[)",
					push: "action__2"
				},
				{
					token: "punctuation.operator",
					regex: "({)",
					push: "action__3"
				},
				{
					token: "punctuation.operator",
					regex: "([\"\\:,;^\\->=])"
				},
				{
					token: "invalid",
					regex: "([^\\s])"
				},
				{
					defaultToken: "text",
				}
			],
			action__2: [
				{
					token: "punctuation.operator",
					regex: "(\\])",
					next: "pop"
				},
				{
					token: "punctuation.operator",
					regex: "(\\\")",
					push: "string__1"
				},
				{
					token: "punctuation.operator",
					regex: "(^\\s*\\|\\s*)",
					push: "barlist__1"
				},
				{
					token: "variable",
					regex: "(:([A-Za-z0-9@._]+))"
				},
				{
					token: "keyword",
					regex: "([A-Za-z0-9@._]+)"
				},
				{
					token: "comment",
					regex: "(/\\*)",
					push: "multi_line_comment__1"
				},
				{
					token: "comment",
					regex: "(--\\[)",
					push: "multi_line_comment__2"
				},
				{
					token: "comment",
					regex: "(--.*)"
				},
				{
					token: "comment",
					regex: "(#.*)"
				},
				{
					token: "comment",
					regex: "(//.*)"
				},
				{
					token: "punctuation.operator",
					regex: "(\\()",
					push: "action__1"
				},
				{
					token: "punctuation.operator",
					regex: "(\\[)",
					push: "action__2"
				},
				{
					token: "punctuation.operator",
					regex: "({)",
					push: "action__3"
				},
				{
					token: "punctuation.operator",
					regex: "([\"\\:,;^\\->=])"
				},
				{
					token: "invalid",
					regex: "([^\\s])"
				},
				{
					defaultToken: "text",
				}
			],
			action__3: [
				{
					token: "punctuation.operator",
					regex: "(})",
					next: "pop"
				},
				{
					token: "punctuation.operator",
					regex: "(\\\")",
					push: "string__1"
				},
				{
					token: "punctuation.operator",
					regex: "(^\\s*\\|\\s*)",
					push: "barlist__1"
				},
				{
					token: "variable",
					regex: "(:([A-Za-z0-9@._]+))"
				},
				{
					token: "keyword",
					regex: "([A-Za-z0-9@._]+)"
				},
				{
					token: "comment",
					regex: "(/\\*)",
					push: "multi_line_comment__1"
				},
				{
					token: "comment",
					regex: "(--\\[)",
					push: "multi_line_comment__2"
				},
				{
					token: "comment",
					regex: "(--.*)"
				},
				{
					token: "comment",
					regex: "(#.*)"
				},
				{
					token: "comment",
					regex: "(//.*)"
				},
				{
					token: "punctuation.operator",
					regex: "(\\()",
					push: "action__1"
				},
				{
					token: "punctuation.operator",
					regex: "(\\[)",
					push: "action__2"
				},
				{
					token: "punctuation.operator",
					regex: "({)",
					push: "action__3"
				},
				{
					token: "punctuation.operator",
					regex: "([\"\\:,;^\\->=])"
				},
				{
					token: "invalid",
					regex: "([^\\s])"
				},
				{
					defaultToken: "text",
				}
			],
			barlist__1: [
				{
					token: "punctuation.operator",
					regex: "($)",
					next: "pop"
				},
				{
					token: "constant.language.escape",
					regex: "(\\\\[\"'\\\\n])"
				},
				{
					token: "constant.language.escape",
					regex: "(\\\\\\()",
					push: "escape__1"
				},
				{
					token: "string",
					regex: "([^\\\\]+)"
				},
				{
					defaultToken: "text",
				}
			],
			escape__1: [
				{
					token: "constant.language.escape",
					regex: "(\\))",
					next: "pop"
				},
				{
					token: "punctuation.operator",
					regex: "(\\\")",
					push: "string__1"
				},
				{
					token: "punctuation.operator",
					regex: "(^\\s*\\|\\s*)",
					push: "barlist__1"
				},
				{
					token: "variable",
					regex: "(:([A-Za-z0-9@._]+))"
				},
				{
					token: "keyword",
					regex: "([A-Za-z0-9@._]+)"
				},
				{
					token: "comment",
					regex: "(/\\*)",
					push: "multi_line_comment__1"
				},
				{
					token: "comment",
					regex: "(--\\[)",
					push: "multi_line_comment__2"
				},
				{
					token: "comment",
					regex: "(--.*)"
				},
				{
					token: "comment",
					regex: "(#.*)"
				},
				{
					token: "comment",
					regex: "(//.*)"
				},
				{
					token: "punctuation.operator",
					regex: "(\\()",
					push: "action__1"
				},
				{
					token: "punctuation.operator",
					regex: "(\\[)",
					push: "action__2"
				},
				{
					token: "punctuation.operator",
					regex: "({)",
					push: "action__3"
				},
				{
					token: "punctuation.operator",
					regex: "([\"\\:,;^\\->=])"
				},
				{
					token: "invalid",
					regex: "([^\\s])"
				},
				{
					defaultToken: "text",
				}
			],
			multi_line_comment__1: [
				{
					token: "comment",
					regex: "(\\*/)",
					next: "pop"
				},
				{
					defaultToken: "comment",
				}
			],
			multi_line_comment__2: [
				{
					token: "comment",
					regex: "(--\\])",
					next: "pop"
				},
				{
					defaultToken: "comment",
				}
			],
			string__1: [
				{
					token: "punctuation.operator",
					regex: "(\\\")",
					next: "pop"
				},
				{
					token: "constant.language.escape",
					regex: "(\\\\[\"'\\\\n])"
				},
				{
					token: "constant.language.escape",
					regex: "(\\\\\\()",
					push: "escape__1"
				},
				{
					token: "string",
					regex: "([^\"\\\\]+)"
				},
				{
					defaultToken: "text",
				}
			]
		};
		// @ts-ignore
		this.normalizeRules();
	};
	/* ------------------------ END ------------------------------ */
	oop.inherits(ScplHighlightRules, TextHighlightRules);
	exports.ScplHighlightRules = ScplHighlightRules;
});

// @ts-ignore
ace.define("ace/mode/scpl", ["ace/mode/scpl_highlight_rules"], function(require, exports, _module) {
	const oop = require("ace/lib/oop");
	const TextMode = require("ace/mode/text").Mode;
	const ExampleHighlightRules = require("ace/mode/scpl_highlight_rules").ScplHighlightRules;

	const Mode = function() {
	// @ts-ignore
		this.HighlightRules = ExampleHighlightRules;
	};
	oop.inherits(Mode, TextMode);

	(function() {
		// Extra logic goes here. (see below)
	}).call(Mode.prototype);

	exports.Mode = Mode;
});
// (function() {
// // @ts-ignore
// 	ace.require(["ace/mode/scpl"], function(m) {
// 		if (typeof module === "object" && typeof exports === "object" && module) {
// 			module.exports = m;
// 		}
// 	});
// }());
