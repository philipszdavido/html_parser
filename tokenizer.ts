
type Token = {
    name: string;
    attributes?: Array<{
        name?: string;
        value?: string | undefined;
    }>;
    startTag?: boolean;
    endTag?: boolean;
    type: "node" | "text"
}

class Toekenizer {

    constructor(private html: string) {}

    public start() {

        this.html = this.html.split("").filter(char => {
            if(char === "\n") {
                return false
            }

            return true;
        }).join("")

        let openTag = false;
        let comment = false;
        let DOCTYPE = false;

        let elementName = ""

        const tokens: Array<Token> = [];

        for (let index = 0; index < this.html.length; index++) {

            const char = this.html[index];
            const nextChar = this.html[index + 1];

            if(char === "<") {

                // check for comment
                if(nextChar === "!") {
                    if(this.html[index + 2] === "-") {

                        comment = true;
                        continue;

                    } else if(this.html[index + 2] === "D") {
                        // we have "DOCTYPE"
                        DOCTYPE = true;
                        continue;
                    }

                }

                openTag = true;
                continue;
            }

            if(comment) {
                if(char === "-" && nextChar === ">") {
                    comment = false;
                    continue;
                }
                continue
            }

            if(DOCTYPE) {
                if(char === ">") {
                    DOCTYPE = false;
                    continue;
                }
                continue
            }

            if(openTag) {

                elementName += char

                if(nextChar === ">") {

                    if(elementName.startsWith("/")) {

                        tokens.push({
                            name: elementName,
                            endTag: true,
                            type: "node"
                        })
    
                    } else {

                        // gather attributes
                        const elementNameParts = elementName.split(" ")

                        // first is the element name
                        const name = elementNameParts[0];

                        const elementAttributes = this.processAttributes(elementNameParts.slice(1))

                        tokens.push({
                            name,
                            attributes: elementAttributes,
                            startTag: true,
                            type: "node"
                        })
    
                    }

                    elementName = ""

                    openTag = false;
                    continue;

                }

            } else if(!comment || !DOCTYPE) {

                if(char === ">") {
                    continue;
                }

                let textName = ""

                for (let j = index; j < this.html.length; j++) {

                    const textChar = this.html[j];
                    textName += textChar;

                    if(this.html[j + 1] === "<") {

                        tokens.push({
                            name: textName,
                            type: "text"
                        })
                        textName = ""

                        index = j;
                        break;

                    }
                    
                }

            }
            
        }

        console.log(tokens)

    }

    private processAttributes(attributes: string[]) {

        return attributes.map((attr) => {
            const parts = attr.split("=")

            if(parts.length == 2) {
                return {
                    name: parts[0],
                    value: parts[1]
                }
            } else {
                return {
                    name: parts[0]
                }
            }

        })
        
    }

}

const html = `
<html>
  <head>
  <!-- This is a comment -->

    <title>Sample HTML</title>
  </head>
  <body>
    <h1>Hello, World!</h1>
    <p>This is a paragraph.</p>
  </body>
</html>
`;

const html2 = `

<!DOCTYPE html>
<html>
<head>
  <!-- This is a comment -->
  <title>Document Title</title>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="styles.css">
  <script src="script.js" defer></script>
</head>
<body>
  <h1>Hello, World!</h1>
</body>
</html>

`

new Toekenizer(html2).start();
