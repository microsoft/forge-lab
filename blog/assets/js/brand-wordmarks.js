const microsoftLogo = document.querySelector("#microsoft-logo-template");

if (microsoftLogo) {
  const excluded = "pre, code, kbd, samp, script, style, textarea, svg, math, .microsoft-name, .forged-accent";
  for (const root of document.querySelectorAll(".prose, .post-list p")) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return !node.parentElement.closest(excluded) && /\b(?:Microsoft|FORGE)\b/.test(node.data)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      const fragment = document.createDocumentFragment();
      let offset = 0;
      for (const match of node.data.matchAll(/\b(?:Microsoft|FORGE)\b/g)) {
        fragment.append(node.data.slice(offset, match.index));
        const wordmark = document.createElement("span");
        if (match[0] === "Microsoft") {
          wordmark.className = "microsoft-name";
          wordmark.append(microsoftLogo.content.cloneNode(true));
          const name = document.createElement("strong");
          name.textContent = match[0];
          wordmark.append(name);
        } else {
          wordmark.className = "forged-accent";
          wordmark.append(match[0]);
        }
        fragment.append(wordmark);
        offset = match.index + match[0].length;
      }
      fragment.append(node.data.slice(offset));
      node.replaceWith(fragment);
    }
  }
}
