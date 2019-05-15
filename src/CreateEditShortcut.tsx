import React, { Component } from "react";

import {
	GlyphName,
	objectGlyphs,
	peopleGlyphs,
	symbolGlyphs,
	ColorName,
	colors
} from "./data/ShortcutMeta";
import { ModalContainer } from "./ModalContainer";

import "./CreateEditShortcut.css";

type CreateEditShortcutProps = {
	onCancel: () => void;
	onResult: (name: string, color: undefined, glyph: undefined) => void;
};

export class CreateEditShortcut extends Component<
	CreateEditShortcutProps,
	{ chosenGlyph: GlyphName; chosenColor: ColorName }
> {
	constructor(props: Readonly<CreateEditShortcutProps>) {
		super(props);
		this.state = { chosenGlyph: "magicwand", chosenColor: "purple" };
	}
	render() {
		return (
			<ModalContainer onCancel={() => this.props.onCancel()}>
				<div
					className="modal dialog"
					id="create-edit-shortcut"
					style={{ display: "block" }}
				>
					<div
						className="cancel-btn"
						id="close-new"
						onClick={() => this.props.onCancel()}
					>
						Cancel
					</div>
					<h2>New ScPL File</h2>
<div className="new-grid">
<div>
<div
	className="color-icon-preview"
	id={`color-${this.state.chosenColor}`}
>
	<div
		className="icon-preview"
		id={`glyph-${this.state.chosenGlyph}`}
	/>
</div>
</div>
						<div>
						<input
							type="text"
							placeholder="Shortcut Name"
							id="new-name"
							autoFocus
						/>
						</div>
					</div>
					<br/>
					<div className="input-label">Glyph</div>
					<div className="glyphs-container">
						<div className="glyph-cat" id="gc-objects">
							<div className="glyph-header">Objects</div>

							{objectGlyphs.map(id => (
								<div className="radio glyph-radio" key={id}>
									<input
										type="radio"
										name="selected-glyph"
										id={`glyph-${id}`}
										value={id}
										checked={this.state.chosenGlyph === id}
										onChange={() =>
											this.setState({ chosenGlyph: id })
										}
									/>
									<label htmlFor={`glyph-${id}`} />
								</div>
							))}
						</div>

						<div className="glyph-cat" id="gc-objects">
							<div className="glyph-header">People</div>

							{peopleGlyphs.map(id => (
								<div className="radio glyph-radio" key={id}>
									<input
										type="radio"
										name="selected-glyph"
										id={`glyph-${id}`}
										value={id}
										checked={this.state.chosenGlyph === id}
										onChange={() =>
											this.setState({ chosenGlyph: id })
										}
									/>
									<label htmlFor={`glyph-${id}`} />
								</div>
							))}
						</div>

						<div className="glyph-cat" id="gc-objects">
							<div className="glyph-header">Symbols</div>

							{symbolGlyphs.map(id => (
								<div className="radio glyph-radio" key={id}>
									<input
										type="radio"
										name="selected-glyph"
										id={`glyph-${id}`}
										value={id}
										checked={this.state.chosenGlyph === id}
										onChange={() =>
											this.setState({ chosenGlyph: id })
										}
									/>
									<label htmlFor={`glyph-${id}`} />
								</div>
							))}
						</div>
					</div>
					<div className="input-label color-label">Color</div>
					<div className="color-select">
						{colors.map(color => (
							<div className="radio color-radio" key={color}>
								<input
									type="radio"
									name="color"
									id={`color-${color}`}
									checked={color === this.state.chosenColor}
									onChange={() =>
										this.setState({ chosenColor: color })
									}
								/>
								<label htmlFor={`color-${color}`} />
							</div>
						))}
					</div>

					<br />
					<div className="btn large-btn" id="close-new">
						Create
					</div>
				</div>
			</ModalContainer>
		);
	}
}
