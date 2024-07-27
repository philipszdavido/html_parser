import {Token} from "./tokenizer";

export class ElementNode {

    constructor(
        public name: string,
        public attributes: Array<any>,
        public children: ElementNode[]) {
    }

}

export class TextNode {
    constructor(public name: string) {}
}

type NodeContainer = ElementNode;

type NodeType = ElementNode | Text;

export interface TagDefinition {
    closedByParent: boolean;
    implicitNamespacePrefix: string | null;
    isVoid: boolean;
    ignoreFirstLf: boolean;
    canSelfClose: boolean;
    preventNamespaceInheritance: boolean;

    isClosedByChild(name: string): boolean;
}

export class ParseTokens {

    _index = -1
    _peek!: Token;
    private _containerStack: NodeContainer[] = [];
    rootNodes: NodeType[] = [];


    constructor(private tokens: Array<Token>) {
        this._advance();
    }

    // start() {
    //
    //     let currentToken
    //
    //     let tree = {}
    //
    //     for (let index = 0; index < this.tokens.length; index++) {
    //
    //               const token = this.tokens[index];
    //
    //               const isElement = token.type === "node";
    //
    //               // start
    //               if(Object.entries(tree)?.length === 0 && isElement) {
    //
    //                   tree = {
    //                       ...token,
    //                       childNodes: []
    //                   };
    //
    //                   currentToken = token;
    //
    //                   for (let j = index; j < this.tokens.length; j++) {
    //                       const jToken = this.tokens[j];
    //                       if(jToken.name === "/" + token.name) {
    //                           index = j
    //                           break;
    //                       }
    //
    //                       currentToken.childNodes.push(jToken)
    //                   }
    //               } else {
    //
    //               }
    //     }
    // }

    build() {
        while (this._peek !== undefined) {
            if(this._peek.type === "node") {
                this._consumeStartTag(this._advance())
            } else if (this._peek.type === "text") {
                this._consumeText(this._advance())
            }
            else {
                this._advance()
            }
        }

        console.log(this.rootNodes)
    }

    private _consumeStartTag(startTagToken: any) {
        const node = this._peek
        const el = new ElementNode(node.name, node.attributes, []);
        const parentEl = this._getContainer();
        //const isClosedByChild = this.tokens
        this._pushContainer(
            el,
            parentEl instanceof ElementNode /*&&
            this.getTagDefinition(parentEl.name).isClosedByChild(el.name),*/
        );

    }


    _advance() {
        const prev = this._peek;
        if (this._index < this.tokens.length - 1) {
            this._index++;
        }
        this._peek = this.tokens[this._index];
        return prev as Token
    }

    private _getContainer() {
        return this._containerStack.length > 0
            ? this._containerStack[this._containerStack.length - 1]
            : null;
    }

    private _getClosestParentElement() {
        for (let i = this._containerStack.length - 1; i > -1; i--) {
            if (this._containerStack[i] instanceof ElementNode) {
                return this._containerStack[i]
            }
        }

        return null;
    }

    private _addToParent(node: NodeType) {
        const parent = this._getContainer();

        if (parent === null) {
            this.rootNodes.push(node);
        } else {
            parent.children.push(node);
        }
    }

    private _pushContainer(node: NodeType, isClosedByChild: boolean) {
        if (isClosedByChild) {
            this._containerStack.pop();
        }

        this._addToParent(node);
        this._containerStack.push(node);
    }

    private _consumeText(token: Token) {
        const text = token?.name;

        this._addToParent(
            new Text(
                text
            ),
        );

    }


    }
