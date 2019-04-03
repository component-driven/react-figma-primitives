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
				if (!frame.children.length) {
					console.warn(
						`No children returned from the query. Check if Figma file has a corresponding layer with name ${nodeName}`
					)
					return null
				}
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
