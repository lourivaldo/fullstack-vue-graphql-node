const {ApolloServer} = require('apollo-server');
const {ApolloServerPluginLandingPageGraphQLPlayground} = require('apollo-server-core');

const typeDefs = `
    type Item {
        id: Int
        type: String
        description: String
    }
    
    type Query {
        items (type: String): [Item]
    }
`;

const items = [
    {id: 1, type: 'prefix', description: 'Air'},
    {id: 2, type: 'prefix', description: 'Jet'},
    {id: 3, type: 'prefix', description: 'Flight'},
    {id: 4, type: 'suffix', description: 'Hub'},
    {id: 5, type: 'suffix', description: 'Station'},
    {id: 6, type: 'suffix', description: 'Mart'},
];

const resolvers = {
    Query: {
        items(_, {type}) {
            return items.filter(item => item.type === type)
        },
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
})
server.listen();