class Node {
    constructor(name, attributes) {
      this.name = name;
      this.attributes = attributes;
      this.children = [];
    }
  }
  
  function parseHTML(html) {
    const rootNode = new Node('document', {});
    let currentNode = rootNode;
    let currentTagName = '';
    let currentAttribute = {};
    let inTag = false;
  
    for (let i = 0; i < html.length; i++) {
      const char = html[i];
  
      if (char === '<') {
        if (inTag) {
          // This means we have encountered '<' within a tag, which is invalid in HTML
          throw new Error('Invalid HTML');
        }
        inTag = true;
        continue;
      }
  
      if (char === '>') {
        if (!inTag) {
          // This means we have encountered '>' outside of a tag, which is invalid in HTML
          throw new Error('Invalid HTML');
        }
  
        // Process the tag that has just ended
        inTag = false;
        if (currentTagName) {
          const newNode = new Node(currentTagName, currentAttribute);
          currentNode.children.push(newNode);
          currentNode = newNode;
          currentTagName = '';
          currentAttribute = {};
        }
        continue;
      }
  
      if (inTag) {
        // We are inside a tag
        if (char === ' ' && currentTagName === '') {
          // Ignore spaces before the tag name starts
          continue;
        } else if (char === ' ' && currentTagName !== '') {
          // Space after tag name indicates start of attribute parsing
          let attributeName = '';
          let attributeValue = '';
          let inQuotes = false;
          let isAttributeName = true;
  
          for (let j = i + 1; j < html.length; j++) {
            const nextChar = html[j];
  
            if (nextChar === '=') {
              isAttributeName = false;
            } else if (nextChar === '"' || nextChar === "'") {
              if (!inQuotes) {
                inQuotes = true;
              } else {
                // End of attribute value
                inQuotes = false;
                currentAttribute[attributeName] = attributeValue;
                attributeName = '';
                attributeValue = '';
              }
            } else if (nextChar === ' ' && !inQuotes) {
              // End of attribute name-value pair
              if (attributeName && attributeValue) {
                currentAttribute[attributeName] = attributeValue;
                attributeName = '';
                attributeValue = '';
              }
            } else if (!isAttributeName) {
              // Collecting attribute value
              if (nextChar !== ' ' && nextChar !== '"' && nextChar !== "'") {
                attributeValue += nextChar;
              }
            } else {
              // Collecting attribute name
              if (nextChar !== ' ') {
                attributeName += nextChar;
              }
            }
  
            if (nextChar === '>') {
              i = j;
              break;
            } else if (nextChar === '/' && html[j + 1] === '>') {
              // Self-closing tag
              i = j + 1;
              break;
            }
          }
        } else {
          // Collecting tag name
          currentTagName += char;
        }
      } else {
        // We are outside a tag (i.e., within text nodes or spaces between tags)
        // We need to find the beginning of the next tag
        let textNode = '';
  
        for (let k = i; k < html.length; k++) {
          if (html[k] === '<') {
            currentNode.children.push(textNode.trim());
            i = k - 1;
            break;
          } else {
            textNode += html[k];
          }
        }
      }
    }
  
    return rootNode;
  }
  
  // Example usage:
  const htmlString = `
  <html>
    <head>
      <title>Sample HTML</title>
    </head>
    <body>
      <h1>Hello, World!</h1>
      <p>This is a paragraph.</p>
    </body>
  </html>
  `;
  
  const parsedDocument = parseHTML(htmlString);
  console.log(parsedDocument);
  