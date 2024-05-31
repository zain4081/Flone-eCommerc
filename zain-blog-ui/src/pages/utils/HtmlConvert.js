
  // Utility function to convert HTML to plain text
  const convertHtmlToPlainText = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  export default convertHtmlToPlainText;
  