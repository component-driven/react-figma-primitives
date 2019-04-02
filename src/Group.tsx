import * as React from "react"
import Query from "./Query"
import { INode } from "./Frame"

export default function Group({ nodeName, children }: INode) {
	return (
		<Query
			variables={{
				nodeName
			}}
		>
			{({ data }) => {
				const frame = data.file.pages[0].frames[0]
				const { size, position } = frame.children[0]

				const styles = {
					...size,
					position: "relative",
					top: position.y,
					left: position.x
				}

				return children(styles)
			}}
		</Query>
	)
}
