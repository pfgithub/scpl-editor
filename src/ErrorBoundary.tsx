import React, { Component } from "react";

type ErrorBoundaryProps = {
	errorDisplay: (error: Error) => React.ReactNode;
};
export class ErrorBoundary extends Component<
	ErrorBoundaryProps,
	{ error: Error | undefined }
> {
	constructor(props: Readonly<ErrorBoundaryProps>) {
		super(props);
		this.state = { error: undefined };
	}
	componentDidCatch(error: Error) {
		this.setState({ error: error });
	}
	render() {
		if (this.state.error) {
			console.log(this.state.error);
			return this.props.errorDisplay(this.state.error);
		}
		return this.props.children;
	}
}
