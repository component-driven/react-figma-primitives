import * as React from "react"
import { Query as ApolloQuery } from "react-apollo"
import { FigmaContext, FIGMA_FILE_QUERY } from "./File"

interface IQuery {
	variables: any
	children?: any
}
export default function Query({ children, variables }: IQuery) {
	return (
		<FigmaContext.Consumer>
			{({ fileId, pageName, frameName }) => (
				<ApolloQuery
					query={FIGMA_FILE_QUERY}
					variables={{ fileId, pageName, frameName, ...variables }}
				>
					{({ loading, data, error }) => {
						if (error) {
							console.error(error)
							return "Oh no!"
						} else if (loading) {
							return "Loading..."
						} else if (!data) {
							return null
						}
						return children({ data })
					}}
				</ApolloQuery>
			)}
		</FigmaContext.Consumer>
	)
}
