import * as React from "react"
import ApolloClient from "apollo-client"
import { ApolloProvider } from "react-apollo"
import {
	InMemoryCache,
	IntrospectionFragmentMatcher
} from "apollo-cache-inmemory"
import { HttpLink } from "apollo-link-http"
import { WebSocketLink } from "apollo-link-ws"
import { split } from "apollo-link"
import { getMainDefinition } from "apollo-utilities"
import { persistCache } from "apollo-cache-persist"
import * as introspectionQueryResultData from "../fragmentTypes.json"

interface IProvider {
	host: string
	wsHost: string
	children?: any
}

export default function Provider({ children, host, wsHost }: IProvider) {
	const fragmentMatcher = new IntrospectionFragmentMatcher({
		introspectionQueryResultData
	})

	const cache = new InMemoryCache({ fragmentMatcher })

	persistCache({
		cache,
		storage: window.localStorage
	})

	const httpLink = new HttpLink({
		uri: `${host}/graphql`
	})

	const wsLink = new WebSocketLink({
		uri: `${wsHost}/graphql`,
		options: {
			reconnect: true
		}
	})

	const link = split(
		({ query }) => {
			const { kind, operation } = getMainDefinition(query)
			return kind === "OperationDefinition" && operation === "subscription"
		},
		wsLink,
		httpLink
	)

	const client = new ApolloClient({
		link,
		cache
	})

	return <ApolloProvider client={client}>{children}</ApolloProvider>
}
