
type Token = {
    name: string;
    attributes?: string;
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
        let attributes = ""

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

                if(nextChar !== " ") {

                    elementName += char

                } else {

                    // attribute
                    attributes += char

                }

                if(nextChar === ">") {

                    if(elementName.startsWith("/")) {

                        tokens.push({
                            name: elementName,
                            attributes,
                            endTag: true,
                            type: "node"
                        })
    
                    } else {

                        tokens.push({
                            name: elementName,
                            attributes,
                            startTag: true,
                            type: "node"
                        })
    
                    }

                    elementName = ""
                    attributes = ""

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
