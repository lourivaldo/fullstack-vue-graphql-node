const {ApolloServer} = require('apollo-server');
const {ApolloServerPluginLandingPageGraphQLPlayground} = require('apollo-server-core');
const dns = require('dns')

const service = require('./service')

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
        async items(_, { type }) {
            const items = await service.getItemsByType(type)
            return items
        },
    },
    Mutation: {
        async saveItem(_, { item }) {
            item.id = Math.floor(Math.random() * 1000);
            const [newItem] = await service.saveItem(item)
            return newItem;
        },
        async deleteItem(_, { id }) {
            await service.deleteItem(id)
            return true;
        },
        async generateDomains() {
            const domains = [];
            const items = await service.getItems()
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
