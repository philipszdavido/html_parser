const testTokens = [
    {
        index: 0,
        name: 'html',
        attributes: [],
        startTag: true,
        type: 'node'
    },
    {
        index: 1,
        name: 'head',
        attributes: [],
        startTag: true,
        type: 'node'
    },
    { index: 2, name: '  ', type: 'text' },
    { index: 3, name: '  ', type: 'text' },
    {
        index: 4,
        name: 'title',
        attributes: [],
        startTag: true,
        type: 'node'
    },
    { index: 5, name: 'Document Title', type: 'text' },
    { index: 6, name: '/title', endTag: true, type: 'node' },
    { index: 7, name: '  ', type: 'text' },
    {
        index: 8,
        name: 'meta',
        attributes: [ [Object] ],
        startTag: true,
        type: 'node'
    },
    { index: 9, name: '  ', type: 'text' },
    {
        index: 10,
        name: 'link',
        attributes: [ [Object], [Object] ],
        startTag: true,
        type: 'node'
    },
    { index: 11, name: '  ', type: 'text' },
    {
        index: 12,
        name: 'script',
        attributes: [ [Object], [Object] ],
        startTag: true,
        type: 'node'
    },
    { index: 13, name: '/script', endTag: true, type: 'node' },
    { index: 14, name: '/head', endTag: true, type: 'node' },
    {
        index: 15,
        name: 'body',
        attributes: [],
        startTag: true,
        type: 'node'
    },
    { index: 16, name: '  ', type: 'text' },
    {
        index: 17,
        name: 'h1',
        attributes: [],
        startTag: true,
        type: 'node'
    },
    { index: 18, name: 'Hello, World!', type: 'text' },
    { index: 19, name: '/h1', endTag: true, type: 'node' },
    { index: 20, name: '/body', endTag: true, type: 'node' },
    { index: 21, name: '/html', endTag: true, type: 'node' }
]

function sojourn(parent, tokens) {

    const rootNodes = {}
    let currentNode

    for (let i = 0; i < tokens.length; i++) {

        const token = tokens[i]

        // if its a node .
        // find its closing tag
        if(token?.type === "node" && !token?.name?.startsWith("/")) {

            currentNode = token

            const {
                children,
                closingTagIndex
            } = findTokenClosingTag(token, i, tokens)

            const _children = sojourn(currentNode, children)
            currentNode = {
                ...token,
                children: _children,
            }

        }


        // if a text
        // append to current node

    }

    return currentNode

}

function findTokenClosingTag(token, currentTokenIndex, tokens) {

    const tokenName = token?.name;
    const children = []
    let closingTagIndex

    for (let i = 0; i < tokens.length; i++) {

        if(i === currentTokenIndex) {
            continue
        }

        const currentToken = tokens[i]

        if(currentToken.name === "/" + tokenName) {

            closingTagIndex = i

            break;

        } else {

            children.push(currentToken)

        }

    }

    return {
        closingTagIndex,
        children
    }

}

const node = sojourn(null, testTokens)