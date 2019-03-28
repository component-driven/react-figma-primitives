import * as React from "react"
import { Query } from "react-apollo"
import gql from "graphql-tag"

export const FigmaContext = React.createContext({
	fileId: null,
	pageName: null
})

export const rectFragment = gql`
	fragment Rect on Node {
		position {
			x
			y
		}
		size {
			width
			height
		}
	}
`

export const childrenFragment = gql`
	fragment ChildrenOfName on Frame {
		children(name: $nodeName) {
			... on Frame {
				id
				image(params: { format: "svg" })
				...Rect
			}
			... on Text {
				id
				name
				visible
				style {
					fontSize
					fontFamily
					fontWeight
					letterSpacing
					lineHeight
					textAlign
					verticalAlign
				}
				fill {
					r
					g
					b
					a
				}
				...Rect
			}
		}
	}

	${rectFragment}
`

const pageFragment = gql`
	fragment Page on File {
		lastModified
		pages(name: $pageName) {
			name
			frames {
				name
				...Rect
				...ChildrenOfName
			}
		}
	}
`
export const FIGMA_FILE_QUERY = gql`
	query FigmaFileQuery($fileId: ID!, $pageName: String!, $nodeName: String!) {
		file(id: $fileId) {
			...Page
		}
	}

	${pageFragment}
	${childrenFragment}
	${rectFragment}
`

const FIGMA_FILE_SUBSCRIPTION = gql`
	subscription onFigmaFileUpdated(
		$fileId: ID!
		$pageName: String!
		$nodeName: String!
	) {
		file(id: $fileId) {
			...Page
		}
	}

	${pageFragment}
	${childrenFragment}
	${rectFragment}
`

interface IFile {
	fileId: string
	pageName: string
	children?: any
}

export default function File({ fileId, pageName, children }: IFile) {
	return (
		<Query
			query={FIGMA_FILE_QUERY}
			variables={{ fileId, pageName, nodeName: "" }}
		>
			{({ loading, data, error, subscribeToMore }) => {
				if (error) {
					console.error(error)
					return "Oh no!"
				} else if (loading) {
					return "Loading..."
				} else if (!data) {
					return null
				}
				const subscribeToFileUpdates = () =>
					subscribeToMore({
						document: FIGMA_FILE_SUBSCRIPTION,
						variables: { fileId, pageName, nodeName: "" },
						updateQuery: (prev, { subscriptionData }) => {
							console.log(subscriptionData)
							if (!subscriptionData.data) return prev
							const newFile = subscriptionData.data
							console.log("Figma file updated!")
							return newFile
						}
					})

				subscribeToFileUpdates()

				return (
					<FigmaContext.Provider
						value={{
							fileId,
							pageName
						}}
					>
						{children({ data })}
					</FigmaContext.Provider>
				)
			}}
		</Query>
	)
}
