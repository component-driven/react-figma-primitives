import * as React from "react"
import { rgba } from "polished"
import GoogleFontLoader from "react-google-font-loader"
import Query from "./Query"
import { INode } from "./Frame"

export default function Text({ nodeName, children }: INode) {
	return (
		<Query
			variables={{
				nodeName
			}}
		>
			{({ data }) => {
				const theme = data.file.pages[0].frames[0]
				if (!theme.children.length) {
					console.warn(
						`No children returned from the query. Check if Figma file has a corresponding layer with name ${nodeName}`
					)
					return null
				}
				const { position, style, size, fill, visible } = theme.children[0]
				const { r, g, b, a } = fill
				const color = rgba(r * 255, g * 255, b * 255, a)
				const relativeX = position.x - theme.position.x
				const relativeY = position.y - theme.position.y
				const { fontFamily, fontWeight } = style

				if (!visible) {
					return null
				}

				return (
					<React.Fragment>
						<GoogleFontLoader
							fonts={[
								{
									font: fontFamily,
									weights: [fontWeight]
								}
							]}
						/>
						{children({
							...style,
							...size,
							position: "absolute",
							left: relativeX,
							top: relativeY,
							color
						})}
					</React.Fragment>
				)
			}}
		</Query>
	)
}
