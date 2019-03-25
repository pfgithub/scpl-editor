import React, { Component } from "react";

import { ModalContainer } from "./ModalContainer";

import "./CreateEditShortcut.css";

export class CreateEditShortcut extends Component<{
	onCancel: () => void;
	onResult: (name: string, color: undefined, glyph: undefined) => void;
}> {
	render() {
		return (
			<ModalContainer onCancel={() => this.props.onCancel()}>
				<div
					className="modal dialog"
					id="create-edit-shortcut"
					style={{ display: "block" }}
				>
					<div
						className="large-btn cancel-btn"
						id="close-new"
						onClick={() => this.props.onCancel()}
					>
						Cancel
					</div>
					<h1>New ScPL File</h1>
					<div className="input-label">Shortcut Name</div>
					<input
						type="text"
						placeholder="My New Shortcut, Cool Idea, etc."
						id="new-name"
					/>

					<br />
					<br />

					<div className="input-label">Glyph</div>
					<br />
					<div className="glyphs-container">
						<div className="glyph-cat" id="gc-objects">
							<div className="glyph-header">Objects</div>

							<div className="radio glyph-radio">
								<input
									type="radio"
									name="selected-glyph"
									id="glyph-car"
									defaultChecked
								/>
								<label htmlFor="glyph-car" />
							</div>

							{[
								"amb",
								"house",
								"cart",
								"forkknife",
								"sun",
								"cloud",
								"tree",
								"footprints",
								"compass",
								"photo",
								"bus",
								"plane",
								"hospital",
								"purse",
								"gaspump",
								"moon",
								"rain",
								"flower",
								"signs",
								"earth",
								"film",
								"motorcycle",
								"boat",
								"city",
								"stand",
								"temp",
								"snow",
								"umbrella",
								"fire",
								"binoculars",
								"mountain",
								"filmfull",
								"camera",
								"videomarker",
								"calendar",
								"comment",
								"paperairplane",
								"creditcard",
								"smartphone",
								"emptykeyboard",
								"printer",
								"database",
								"cube",
								"videocamera",
								"playbutton-one",
								"message",
								"letter",
								"suitcase",
								"watch",
								"laptop",
								"calculator",
								"harddrive",
								"servers",
								"television",
								"microphone",
								"clipboard",
								"messages",
								"openletter",
								"folder",
								"phone",
								"keyboard",
								"stats",
								"serverset",
								"inbox",
								"controller",
								"puzzle",
								"speaker",
								"bookmark",
								"mask",
								"dice",
								"soccer",
								"lifesaver",
								"chess",
								"stopwatch",
								"platter",
								"trophy",
								"headphones",
								"books",
								"emptyglasses",
								"ticket",
								"baseball",
								"tennisball",
								"telescope",
								"clock",
								"volume",
								"heart",
								"lightbulb",
								"musicnote",
								"book",
								"glasses",
								"masks",
								"basketball",
								"football",
								"microscope",
								"alarmclock",
								"bell",
								"star",
								"lightning",
								"flag",
								"hourglass",
								"battery",
								"paintbrush",
								"scissors",
								"colorpicker",
								"hammerwrench",
								"screwdriver",
								"trashcan",
								"soupbowl",
								"fish",
								"tag",
								"locked",
								"magicwand",
								"pencil",
								"magnify",
								"tool",
								"gears",
								"hand",
								"teardrop",
								"apple",
								"cake",
								"key",
								"unlocked",
								"magicstar",
								"paperclip",
								"link",
								"wrench",
								"hammer",
								"privacy",
								"cup",
								"carrot",
								"bottle",
								"wineglass",
								"oven",
								"showerhead",
								"pillbottle",
								"scope",
								"beaker",
								"pawprint",
								"gift",
								"stairs",
								"hanger",
								"shirt",
								"pill",
								"bandaid",
								"needle",
								"cat",
								"like",
								"alien",
								"rocket",
								"laundry",
								"bath",
								"pills",
								"inhaler",
								"atom",
								"dog",
								"cap",
								"bed"
							].map(id => (
								<div className="radio glyph-radio">
									<input
										type="radio"
										name="selected-glyph"
										id={`glyph-${id}`}
										value={id}
									/>
									<label htmlFor={`glyph-${id}`} />
								</div>
							))}
						</div>

						<div className="glyph-cat" id="gc-objects">
							<div className="glyph-header">People</div>

							{[
								"girlbaby",
								"mansymbol",
								"user",
								"accessibility",
								"dance",
								"snowboard",
								"activity",
								"boybaby",
								"womansymbol",
								"users",
								"podium",
								"gym",
								"swim",
								"sprint",
								"person",
								"handicap",
								"group",
								"handraised",
								"hike",
								"hiking",
								"cane"
							].map(id => (
								<div className="radio glyph-radio">
									<input
										type="radio"
										name="selected-glyph"
										id={`glyph-${id}`}
										value={id}
									/>
									<label htmlFor={`glyph-${id}`} />
								</div>
							))}
						</div>

						<div className="glyph-cat" id="gc-objects">
							<div className="glyph-header">Symbols</div>

							{[
								"alert",
								"bookmarkthis",
								"stopfilled",
								"left",
								"up",
								"play",
								"stop",
								"checked",
								"moneysign",
								"yensign",
								"info",
								"shareleft",
								"barcode",
								"frame",
								"right",
								"down",
								"prev",
								"next",
								"plus",
								"eurosign",
								"bitcoinsign",
								"smile",
								"shareright",
								"qrcode",
								"sizes",
								"download",
								"upload",
								"power",
								"help",
								"xfilled",
								"pounds",
								"pi",
								"cssfile",
								"money",
								"yen",
								"filefilled",
								"list",
								"more",
								"share",
								"spinner",
								"target",
								"location",
								"crop",
								"move",
								"euro",
								"bitcoin",
								"file",
								"document",
								"listitems",
								"infinite",
								"loading",
								"podcasts",
								"mapmarker",
								"exit",
								"repeat",
								"poundsign",
								"asterisk",
								"filedoc",
								"fourgrid",
								"sixgrid",
								"recycle",
								"playvideo",
								"bigtarget",
								"squarep",
								"resize",
								"sync",
								"playsolo",
								"rss",
								"quotes",
								"text",
								"shuffle",
								"signal",
								"peace",
								"cloudservice",
								"settings",
								"wifi",
								"nuclear"
							].map(id => (
								<div className="radio glyph-radio">
									<input
										type="radio"
										name="selected-glyph"
										id={`glyph-${id}`}
										value={id}
									/>
									<label htmlFor={`glyph-${id}`} />
								</div>
							))}
						</div>
					</div>

					<br />

					<div className="input-label">Color</div>
					<br />
					<div className="color-select">
						<div className="radio color-radio">
							<input
								type="radio"
								name="color"
								id="color-red"
								defaultChecked
							/>
							<label htmlFor="color-red" />
						</div>

						<div className="radio color-radio">
							<input
								type="radio"
								name="color"
								id="color-darkorange"
							/>
							<label htmlFor="color-darkorange" />
						</div>

						<div className="radio color-radio">
							<input
								type="radio"
								name="color"
								id="color-orange"
							/>
							<label htmlFor="color-orange" />
						</div>

						<div className="radio color-radio">
							<input
								type="radio"
								name="color"
								id="color-yellow"
							/>
							<label htmlFor="color-yellow" />
						</div>

						<div className="radio color-radio">
							<input type="radio" name="color" id="color-green" />
							<label htmlFor="color-green" />
						</div>

						<div className="radio color-radio">
							<input
								type="radio"
								name="color"
								id="color-seagreen"
							/>
							<label htmlFor="color-seagreen" />
						</div>

						<div className="radio color-radio">
							<input
								type="radio"
								name="color"
								id="color-lightblue"
							/>
							<label htmlFor="color-lightblue" />
						</div>

						<div className="radio color-radio">
							<input type="radio" name="color" id="color-blue" />
							<label htmlFor="color-blue" />
						</div>

						<div className="radio color-radio">
							<input
								type="radio"
								name="color"
								id="color-darkblue"
							/>
							<label htmlFor="color-darkblue" />
						</div>

						<div className="radio color-radio">
							<input
								type="radio"
								name="color"
								id="color-darkpurple"
							/>
							<label htmlFor="color-darkpurple" />
						</div>

						<div className="radio color-radio">
							<input
								type="radio"
								name="color"
								id="color-purple"
							/>
							<label htmlFor="color-purple" />
						</div>

						<div className="radio color-radio">
							<input type="radio" name="color" id="color-pink" />
							<label htmlFor="color-pink" />
						</div>

						<div className="radio color-radio">
							<input type="radio" name="color" id="color-black" />
							<label htmlFor="color-black" />
						</div>

						<div className="radio color-radio">
							<input type="radio" name="color" id="color-brown" />
							<label htmlFor="color-brown" />
						</div>

						<div className="radio color-radio">
							<input type="radio" name="color" id="color-grey" />
							<label htmlFor="color-grey" />
						</div>
					</div>

					<br />
					<div className="large-btn" id="close-new">
						Create
					</div>
				</div>
			</ModalContainer>
		);
	}
}
