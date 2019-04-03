import * as React from "react"
import Query from "./Query"
import { FigmaContext } from "./File"

export interface INode {
	nodeName: string
	children?: (styles: object) => JSX.Element
}

interface IFrame extends INode {
	frameName: string
}

export default function Frame({ frameName, nodeName, children }: IFrame) {
	return (
		<Query
			variables={{
				frameName,
				nodeName
			}}
		>
			{({ data }) => {
				const frame = data.file.pages[0].frames[0]
				const { size } = frame
				const { image } = frame.children[0]

				const styles = {
					...size,
					position: "relative",
					background: `url(${image})`,
					backgroundSize: "cover"
				}

				return (
					<FigmaContext.Consumer>
						{({ fileId, pageName }) => (
							<FigmaContext.Provider
								value={{
									fileId,
									pageName,
									frameName
								}}
							>
								{children(styles)}
							</FigmaContext.Provider>
						)}
					</FigmaContext.Consumer>
				)
			}}
		</Query>
	)
}
