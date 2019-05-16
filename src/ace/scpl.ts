/*eslint-disable no-useless-escape*/

import * as monaco from "monaco-editor";

/*

tokens = {
punctuation: "punctuation",
variable: "variable",
"support.type": "arglabel",
"support.constant": "stringAndMacro",
"keyword": "keyword",
"entity.name.function": "identifier",
"comment": "comment",
"invalid": "invalid",
"escape": "stringescape"
}


*/

monaco.languages.register({ id: "scpl" });

monaco.editor.defineTheme("scpl-theme", {
	base: "vs",
	inherit: false,
	colors: {},
	rules: [
		{ token: "punctuation", foreground: "000000" },
		{ token: "variable", foreground: "0074D9" },
		{ token: "arglabel", foreground: "3D9970" },
		{ token: "stringAndMacro", foreground: "06960E" },
		{ token: "keyword", foreground: "001F3F", fontStyle: "bold" },
		{ token: "identifier", foreground: "001F3F" },
		{ token: "comment", foreground: "555555" },
		{ token: "invalid", foreground: "FFFFFF", background: "D74C39" },
		{ token: "escape", foreground: "037009" }
	]
});

// Create your own language definition here
// You can safely look at other samples without losing modifications.
// Modifications are not saved on browser refresh/close though -- copy often!
monaco.languages.setMonarchTokensProvider("scpl", {
	// Set defaultToken to invalid to see what you do not tokenize yet
	// defaultToken: 'invalid',

	// The main tokenizer for our languages
	tokenizer: {
		start: [
			[
				/(\")/,
				{
					token: "punctuation",
					next: "@string__1"
				}
			],
			[
				/(\')/,
				{
					token: "punctuation",
					next: "@string__2"
				}
			],
			[
				/(^\s*\|\s*)/,
				{
					token: "punctuation",
					next: "@barlist__1"
				}
			],
			[
				/(:([A-Za-z0-9@._]+))/,
				{
					token: "variable"
				}
			],
			[
				/(([A-Za-z0-9@._]+)=)/,
				{
					token: "arglabel"
				}
			],
			[
				/(@(([A-Za-z0-9@._]+))?)/,
				{
					token: "stringAndMacro"
				}
			],
			[
				/([Ii][Ff]|[Rr][Ee][Pp][Ee][Aa][Tt][Ww][Ii][Tt][Hh][Ee][Aa][Cc][Hh]|[Cc][Hh][Oo][Oo][Ss][Ee][Ff][Rr][Oo][Mm][Mm][Ee][Nn][Uu]|[Rr][Ee][Pp][Ee][Aa][Tt]|[Oo][Tt][Hh][Ee][Rr][Ww][Ii][Ss][Ee]|[Ee][Nn][Dd]|[Ff][Ll][Oo][Ww]|[Ee][Ll][Ss][Ee]|[Cc][Aa][Ss][Ee])/,
				{
					token: "keyword"
				}
			],
			[
				/([A-Za-z0-9@._]+)/,
				{
					token: "identifier"
				}
			],
			[
				/(\/\*)/,
				{
					token: "comment",
					next: "@multi_line_comment__1"
				}
			],
			[
				/(--\[)/,
				{
					token: "comment",
					next: "@multi_line_comment__2"
				}
			],
			[
				/(--.*)/,
				{
					token: "comment"
				}
			],
			[
				/(#.*)/,
				{
					token: "comment"
				}
			],
			[
				/(\/\/.*)/,
				{
					token: "comment"
				}
			],
			[
				/(\()/,
				{
					token: "punctuation",
					next: "@action__1"
				}
			],
			[
				/(\[)/,
				{
					token: "punctuation",
					next: "@action__2"
				}
			],
			[
				/({)/,
				{
					token: "punctuation",
					next: "@action__3"
				}
			],
			[
				/(["\:,;^\->=])/,
				{
					token: "punctuation"
				}
			],
			[
				/(\?\?.+?\?\?)/,
				{
					token: "invalid"
				}
			],
			[
				/([^\s])/,
				{
					token: "invalid"
				}
			]
		],
		action__1: [
			[
				/(\))/,
				{
					token: "punctuation",
					next: "@pop"
				}
			],
			[
				/(\")/,
				{
					token: "punctuation",
					next: "@string__1"
				}
			],
			[
				/(\')/,
				{
					token: "punctuation",
					next: "@string__2"
				}
			],
			[
				/(^\s*\|\s*)/,
				{
					token: "punctuation",
					next: "@barlist__1"
				}
			],
			[
				/(:([A-Za-z0-9@._]+))/,
				{
					token: "variable"
				}
			],
			[
				/(([A-Za-z0-9@._]+)=)/,
				{
					token: "arglabel"
				}
			],
			[
				/(@(([A-Za-z0-9@._]+))?)/,
				{
					token: "stringAndMacro"
				}
			],
			[
				/([Ii][Ff]|[Rr][Ee][Pp][Ee][Aa][Tt][Ww][Ii][Tt][Hh][Ee][Aa][Cc][Hh]|[Cc][Hh][Oo][Oo][Ss][Ee][Ff][Rr][Oo][Mm][Mm][Ee][Nn][Uu]|[Rr][Ee][Pp][Ee][Aa][Tt]|[Oo][Tt][Hh][Ee][Rr][Ww][Ii][Ss][Ee]|[Ee][Nn][Dd]|[Ff][Ll][Oo][Ww]|[Ee][Ll][Ss][Ee]|[Cc][Aa][Ss][Ee])/,
				{
					token: "keyword"
				}
			],
			[
				/([A-Za-z0-9@._]+)/,
				{
					token: "identifier"
				}
			],
			[
				/(\/\*)/,
				{
					token: "comment",
					next: "@multi_line_comment__1"
				}
			],
			[
				/(--\[)/,
				{
					token: "comment",
					next: "@multi_line_comment__2"
				}
			],
			[
				/(--.*)/,
				{
					token: "comment"
				}
			],
			[
				/(#.*)/,
				{
					token: "comment"
				}
			],
			[
				/(\/\/.*)/,
				{
					token: "comment"
				}
			],
			[
				/(\()/,
				{
					token: "punctuation",
					next: "@action__1"
				}
			],
			[
				/(\[)/,
				{
					token: "punctuation",
					next: "@action__2"
				}
			],
			[
				/({)/,
				{
					token: "punctuation",
					next: "@action__3"
				}
			],
			[
				/(["\:,;^\->=])/,
				{
					token: "punctuation"
				}
			],
			[
				/(\?\?.+?\?\?)/,
				{
					token: "invalid"
				}
			],
			[
				/([^\s])/,
				{
					token: "invalid"
				}
			]
		],
		action__2: [
			[
				/(\])/,
				{
					token: "punctuation",
					next: "@pop"
				}
			],
			[
				/(\")/,
				{
					token: "punctuation",
					next: "@string__1"
				}
			],
			[
				/(\')/,
				{
					token: "punctuation",
					next: "@string__2"
				}
			],
			[
				/(^\s*\|\s*)/,
				{
					token: "punctuation",
					next: "@barlist__1"
				}
			],
			[
				/(:([A-Za-z0-9@._]+))/,
				{
					token: "variable"
				}
			],
			[
				/(([A-Za-z0-9@._]+)=)/,
				{
					token: "arglabel"
				}
			],
			[
				/(@(([A-Za-z0-9@._]+))?)/,
				{
					token: "stringAndMacro"
				}
			],
			[
				/([Ii][Ff]|[Rr][Ee][Pp][Ee][Aa][Tt][Ww][Ii][Tt][Hh][Ee][Aa][Cc][Hh]|[Cc][Hh][Oo][Oo][Ss][Ee][Ff][Rr][Oo][Mm][Mm][Ee][Nn][Uu]|[Rr][Ee][Pp][Ee][Aa][Tt]|[Oo][Tt][Hh][Ee][Rr][Ww][Ii][Ss][Ee]|[Ee][Nn][Dd]|[Ff][Ll][Oo][Ww]|[Ee][Ll][Ss][Ee]|[Cc][Aa][Ss][Ee])/,
				{
					token: "keyword"
				}
			],
			[
				/([A-Za-z0-9@._]+)/,
				{
					token: "identifier"
				}
			],
			[
				/(\/\*)/,
				{
					token: "comment",
					next: "@multi_line_comment__1"
				}
			],
			[
				/(--\[)/,
				{
					token: "comment",
					next: "@multi_line_comment__2"
				}
			],
			[
				/(--.*)/,
				{
					token: "comment"
				}
			],
			[
				/(#.*)/,
				{
					token: "comment"
				}
			],
			[
				/(\/\/.*)/,
				{
					token: "comment"
				}
			],
			[
				/(\()/,
				{
					token: "punctuation",
					next: "@action__1"
				}
			],
			[
				/(\[)/,
				{
					token: "punctuation",
					next: "@action__2"
				}
			],
			[
				/({)/,
				{
					token: "punctuation",
					next: "@action__3"
				}
			],
			[
				/(["\:,;^\->=])/,
				{
					token: "punctuation"
				}
			],
			[
				/(\?\?.+?\?\?)/,
				{
					token: "invalid"
				}
			],
			[
				/([^\s])/,
				{
					token: "invalid"
				}
			]
		],
		action__3: [
			[
				/(})/,
				{
					token: "punctuation",
					next: "@pop"
				}
			],
			[
				/(\")/,
				{
					token: "punctuation",
					next: "@string__1"
				}
			],
			[
				/(\')/,
				{
					token: "punctuation",
					next: "@string__2"
				}
			],
			[
				/(^\s*\|\s*)/,
				{
					token: "punctuation",
					next: "@barlist__1"
				}
			],
			[
				/(:([A-Za-z0-9@._]+))/,
				{
					token: "variable"
				}
			],
			[
				/(([A-Za-z0-9@._]+)=)/,
				{
					token: "arglabel"
				}
			],
			[
				/(@(([A-Za-z0-9@._]+))?)/,
				{
					token: "stringAndMacro"
				}
			],
			[
				/([Ii][Ff]|[Rr][Ee][Pp][Ee][Aa][Tt][Ww][Ii][Tt][Hh][Ee][Aa][Cc][Hh]|[Cc][Hh][Oo][Oo][Ss][Ee][Ff][Rr][Oo][Mm][Mm][Ee][Nn][Uu]|[Rr][Ee][Pp][Ee][Aa][Tt]|[Oo][Tt][Hh][Ee][Rr][Ww][Ii][Ss][Ee]|[Ee][Nn][Dd]|[Ff][Ll][Oo][Ww]|[Ee][Ll][Ss][Ee]|[Cc][Aa][Ss][Ee])/,
				{
					token: "keyword"
				}
			],
			[
				/([A-Za-z0-9@._]+)/,
				{
					token: "identifier"
				}
			],
			[
				/(\/\*)/,
				{
					token: "comment",
					next: "@multi_line_comment__1"
				}
			],
			[
				/(--\[)/,
				{
					token: "comment",
					next: "@multi_line_comment__2"
				}
			],
			[
				/(--.*)/,
				{
					token: "comment"
				}
			],
			[
				/(#.*)/,
				{
					token: "comment"
				}
			],
			[
				/(\/\/.*)/,
				{
					token: "comment"
				}
			],
			[
				/(\()/,
				{
					token: "punctuation",
					next: "@action__1"
				}
			],
			[
				/(\[)/,
				{
					token: "punctuation",
					next: "@action__2"
				}
			],
			[
				/({)/,
				{
					token: "punctuation",
					next: "@action__3"
				}
			],
			[
				/(["\:,;^\->=])/,
				{
					token: "punctuation"
				}
			],
			[
				/(\?\?.+?\?\?)/,
				{
					token: "invalid"
				}
			],
			[
				/([^\s])/,
				{
					token: "invalid"
				}
			]
		],
		barlist__1: [
			[
				/($)/,
				{
					token: "punctuation",
					next: "@pop"
				}
			],
			[
				/(\\["'\\n])/,
				{
					token: "stringescape"
				}
			],
			[
				/(\\\()/,
				{
					token: "stringescape",
					next: "@escape__1"
				}
			],
			[
				/([^\\]+)/,
				{
					token: "stringAndMacro"
				}
			]
		],
		escape__1: [
			[
				/(\))/,
				{
					token: "stringescape",
					next: "@pop"
				}
			],
			[
				/(\")/,
				{
					token: "punctuation",
					next: "@string__1"
				}
			],
			[
				/(\')/,
				{
					token: "punctuation",
					next: "@string__2"
				}
			],
			[
				/(^\s*\|\s*)/,
				{
					token: "punctuation",
					next: "@barlist__1"
				}
			],
			[
				/(:([A-Za-z0-9@._]+))/,
				{
					token: "variable"
				}
			],
			[
				/(([A-Za-z0-9@._]+)=)/,
				{
					token: "arglabel"
				}
			],
			[
				/(@(([A-Za-z0-9@._]+))?)/,
				{
					token: "stringAndMacro"
				}
			],
			[
				/([Ii][Ff]|[Rr][Ee][Pp][Ee][Aa][Tt][Ww][Ii][Tt][Hh][Ee][Aa][Cc][Hh]|[Cc][Hh][Oo][Oo][Ss][Ee][Ff][Rr][Oo][Mm][Mm][Ee][Nn][Uu]|[Rr][Ee][Pp][Ee][Aa][Tt]|[Oo][Tt][Hh][Ee][Rr][Ww][Ii][Ss][Ee]|[Ee][Nn][Dd]|[Ff][Ll][Oo][Ww]|[Ee][Ll][Ss][Ee]|[Cc][Aa][Ss][Ee])/,
				{
					token: "keyword"
				}
			],
			[
				/([A-Za-z0-9@._]+)/,
				{
					token: "identifier"
				}
			],
			[
				/(\/\*)/,
				{
					token: "comment",
					next: "@multi_line_comment__1"
				}
			],
			[
				/(--\[)/,
				{
					token: "comment",
					next: "@multi_line_comment__2"
				}
			],
			[
				/(--.*)/,
				{
					token: "comment"
				}
			],
			[
				/(#.*)/,
				{
					token: "comment"
				}
			],
			[
				/(\/\/.*)/,
				{
					token: "comment"
				}
			],
			[
				/(\()/,
				{
					token: "punctuation",
					next: "@action__1"
				}
			],
			[
				/(\[)/,
				{
					token: "punctuation",
					next: "@action__2"
				}
			],
			[
				/({)/,
				{
					token: "punctuation",
					next: "@action__3"
				}
			],
			[
				/([":,;^\->=])/,
				{
					token: "punctuation"
				}
			],
			[
				/(\?\?.+?\?\?)/,
				{
					token: "invalid"
				}
			],
			[
				/([^\s])/,
				{
					token: "invalid"
				}
			]
		],
		multi_line_comment__1: [
			[
				/(\*\/)/,
				{
					token: "comment",
					next: "@pop"
				}
			]
		],
		multi_line_comment__2: [
			[
				/(--\])/,
				{
					token: "comment",
					next: "@pop"
				}
			]
		],
		string__1: [
			[
				/(\")/,
				{
					token: "punctuation",
					next: "@pop"
				}
			],
			[
				/(\\["'\\n])/,
				{
					token: "stringescape"
				}
			],
			[
				/(\\\()/,
				{
					token: "stringescape",
					next: "@escape__1"
				}
			],
			[
				/([^"\\]+)/,
				{
					token: "stringAndMacro"
				}
			]
		],
		string__2: [
			[
				/(\')/,
				{
					token: "punctuation",
					next: "@pop"
				}
			],
			[
				/(\\["'\\n])/,
				{
					token: "stringescape"
				}
			],
			[
				/(\\\()/,
				{
					token: "stringescape",
					next: "@escape__1"
				}
			],
			[
				/([^'\\]+)/,
				{
					token: "stringAndMacro"
				}
			]
		],
		root: [
			{
				include: "@start"
			}
		]
	}
});

monaco.editor.setTheme("scpl-theme");

monaco.editor.create(<HTMLElement>document.getElementById("container"), {
	value: "My to-do list:\n* buy milk\n* buy coffee\n* write awesome code",
	language: "scpl",
	automaticLayout: true
});
