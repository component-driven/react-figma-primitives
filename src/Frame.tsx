import * as React from "react"
import styled from "styled-components"
import Query from "./Query"

const NodeWrapper = styled("div")`
	position: relative;
`

export interface INode {
	nodeName: string
	children?: any
	styles?: object
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

				return (
					<NodeWrapper
						style={{
							...size,
							background: `url(${image})`,
							backgroundSize: "cover"
						}}
					>
						{children}
					</NodeWrapper>
				)
			}}
		</Query>
	)
}
