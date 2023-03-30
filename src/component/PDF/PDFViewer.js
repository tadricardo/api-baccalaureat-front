import React, { Component } from "react";
// import pdfFile from "./chart.pdf";

const pdfFile = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

export default class PDFViewer extends Component {
  handlePrint = () => {
    // is getElementById an anti pattern even if I'm not modyfying the DOM?
    const node = document.getElementById("print-file");
    node.contentWindow.focus();
    node.contentWindow.print();
  };

  render() {
    return (
      <>
        <h2>PDF Viewer Component</h2>
        <button onClick={this.handlePrint}>Print</button>
        <object data={pdfFile} type="application/pdf">
          <iframe
            title="pdf document"
            id="print-file"
            src={`https://docs.google.com/viewer?url=${pdfFile}&embedded=true`}
          />
        </object>
      </>
    );
  }
}
