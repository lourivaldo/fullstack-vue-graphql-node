const {ApolloServer} = require('apollo-server');
const {ApolloServerPluginLandingPageGraphQLPlayground} = require('apollo-server-core');
const dns = require('dns')

const typeDefs = `
    type Item {
        id: Int
        type: String
        description: String
    }
    
    type Domain {
        name: String
        checkout: String
        available: Boolean
    }
    
    type Query {
        items (type: String): [Item]
    }
    
    input ItemInput {
        type: String
        description: String    
    }
    
    type Mutation {
        saveItem(item: ItemInput): Item
        deleteItem(id: Int): Boolean
        generateDomains: [Domain]
        generateDomain(name: String): [Domain]
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

const isDomainAvailable = function (url) {
    return new Promise((resolve) => {
        resolve(true);
        // dns.resolve(url, function (error) {
        //     error ? resolve(true) : resolve(false)
        // })
    })
}

const resolvers = {
    Query: {
        items(_, { type }) {
            return items.filter(item => item.type === type)
        },
    },
    Mutation: {
        saveItem(_, { item }) {
            item.id = Math.floor(Math.random() * 1000);
            items.push(item);
            return item;
        },
        deleteItem(_, { id }) {
            const item = items.find(item => item.id === id);
            if (!item) return false;
            items.splice(items.indexOf(item), 1);
            return true;
        },
        async generateDomains() {
            const domains = [];
            for (const prefix of items.filter(item => item.type === 'prefix')) {
                for (const suffix of items.filter(item => item.type === 'suffix')) {
                    const name = prefix.description + suffix.description;
                    const url = name.toLowerCase();
                    const checkout = `https://checkout.hostgator.com.br/?a=add&sld=${url}&tld=.com`;
                    const available = await isDomainAvailable(`${url}.com.br`)
                    domains.push({
                        name,
                        checkout,
                        available,
                    });
                }
            }
            return domains;
        },
        async generateDomain(_, { name }) {
            const extensions = ['.com.br', '.com', '.net', '.org']
            const domains = []
            for (const extension of extensions) {
                const url = name.toLowerCase();
                const checkout = `https://checkout.hostgator.com.br/?a=add&sld=${url}&tld=${extension}`;
                const available = await isDomainAvailable(`${url}${extension}`)
                domains.push({
                    name,
                    extension,
                    checkout,
                    available,
                });
            }
            return domains
        }
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
