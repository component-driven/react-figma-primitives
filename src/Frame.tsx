import * as React from "react"
import styled from "styled-components"
import Query from "./Query"

const NodeWrapper = styled("div")`
	position: relative;
`

export interface INode {
	nodeName: string,
	children?: any
}

export default function Frame({ nodeName, children }: INode) {
	return (
		<Query
			variables={{
				nodeName
			}}
		>
			{({ data }) => {
				const frame = data.file.pages[0].frames[0]
				const { size } = frame
				const { image } = frame.children[0]

				return (
					<NodeWrapper
						css={{
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
