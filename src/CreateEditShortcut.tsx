import React, { Component } from "react";

import "./CreateEditShortcut.css";



export class CreateEditShortcut extends Component<{}> {
	render() {
		return (
			<div>
				<h1>New ScPL File</h1>
				<div className="input-label">Shortcut Name</div>
				<input type="text" placeholder="My New Shortcut, Cool Idea, etc." id="new-name"/>

				<br/><br/>

				<div className="input-label">Glyph</div>
				<div className="glyphs-select">
					<div className="radio glyph-radio">
						<label htmlFor="glyph-car">Car</label>
						<input type="radio" name="icon" id="glyph-car"/>
					</div>
				</div>

				<br/><br/>

				<div className="input-label">Color</div>
				<br/>
				<div className="color-select">
					<div className="radio color-radio">
						<input type="radio" name="color" id="color-red" defaultChecked/>
						<label htmlFor="color-red"></label>
					</div>

					<div className="radio color-radio">
						<input type="radio" name="color" id="color-darkorange"/>
						<label htmlFor="color-darkorange"></label>
					</div>

					<div className="radio color-radio">
						<input type="radio" name="color" id="color-orange"/>
						<label htmlFor="color-orange"></label>
					</div>

					<div className="radio color-radio">
						<input type="radio" name="color" id="color-yellow"/>
						<label htmlFor="color-yellow"></label>
					</div>

					<div className="radio color-radio">
						<input type="radio" name="color" id="color-green"/>
						<label htmlFor="color-green"></label>
					</div>

					<div className="radio color-radio">
						<input type="radio" name="color" id="color-seagreen"/>
						<label htmlFor="color-seagreen"></label>
					</div>

					<div className="radio color-radio">
						<input type="radio" name="color" id="color-lightblue"/>
						<label htmlFor="color-lightblue"></label>
					</div>

					<div className="radio color-radio">
						<input type="radio" name="color" id="color-blue"/>
						<label htmlFor="color-blue"></label>
					</div>

					<div className="radio color-radio">
						<input type="radio" name="color" id="color-darkblue"/>
						<label htmlFor="color-darkblue"></label>
					</div>

					<div className="radio color-radio">
						<input type="radio" name="color" id="color-darkpurple"/>
						<label htmlFor="color-darkpurple"></label>
					</div>

					<div className="radio color-radio">
						<input type="radio" name="color" id="color-purple"/>
						<label htmlFor="color-purple"></label>
					</div>

					<div className="radio color-radio">
						<input type="radio" name="color" id="color-pink"/>
						<label htmlFor="color-pink"></label>
					</div>

					<div className="radio color-radio">
						<input type="radio" name="color" id="color-black"/>
						<label htmlFor="color-black"></label>
					</div>

					<div className="radio color-radio">
						<input type="radio" name="color" id="color-brown"/>
						<label htmlFor="color-brown"></label>
					</div>

					<div className="radio color-radio">
						<input type="radio" name="color" id="color-grey"/>
						<label htmlFor="color-grey"></label>
					</div>
				</div>

				<br/>
				<div className="large-btn" id="close-new">Save Changes</div>
				<div className="large-btn cancel-btn" id="close-new">Cancel</div>
			</div>
		);
	}
}
