import * as React from "react";
import styled from "styled-components"
import Query from "./Query"
import { INode } from "./Frame";

const NodeWrapper = styled("div")`
	position: relative;
`

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

				return (
					<NodeWrapper
						css={{
							...size,
							top: position.y,
							left: position.x
						}}
					>
						{children}
					</NodeWrapper>
				)
			}}
		</Query>
	)
}
