import React, { useState, useEffect } from "react";
import { Row, Col, Container, Button } from "react-bootstrap";
import Editor from "./WebEditor/Editor";
import Footer from "./Footer";
import { useLocalStorage } from "../Hooks/LocalStorage";
import fileDownload from "js-file-download";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import logo from "./../Assets/icon.png";

function LaunguageManager() {
  const getBlobURL = (code, type) => {
    const blob = new Blob([code], { type });
    return URL.createObjectURL(blob);
  };
  const htmlDefault = `<h2>Hello User</h2>`;

  const cssDefault = `body{
  text-align:center;
}`;

  const [htmlVal, updateHtmlStrorage] = useLocalStorage("html", htmlDefault);
  const [cssVal, updateCssStrorage] = useLocalStorage("css", cssDefault);
  const [jsVal, updateJsStrorage] = useLocalStorage("js", "");

  const [html, updateHtml] = useState(htmlVal);
  const [css, updateCss] = useState(cssVal);
  const [js, updateJs] = useState(jsVal);
  const [name, setName] = useState("untitled");

  const clickHandler = () => {
    var zip = new JSZip();
    var project = zip.folder(name);
    project.file("index.html", html);
    project.file("styles.css", css);
    project.file("index.js", js);
    zip.generateAsync({ type: "blob" }).then(function (content) {
      // see FileSaver.js
      saveAs(content, name + ".zip");
    });
    //    fileDownload(html, "index.html");
  };

  const cssURL = getBlobURL(css, "text/css");
  const jsURL = getBlobURL(js, "text/javascript");

  const srcDoc = `
      <!DOCTYPE html>
      <html>
      <head>
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
      ${css && `<link rel="stylesheet" type="text/css" href="${cssURL}" />`}
      <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
      </head>
        <body>${html}
        ${js && `<script src="${jsURL}"></script>`}
        </body>
      </html>`;

  useEffect(() => {
    setTimeout(() => {}, 500);
    updateHtmlStrorage(html);
    updateCssStrorage(css);
    updateJsStrorage(js);
  }, [html, css, js]);

  return (
    <div>
      <div
        style={{
          width: "100%",
          display: "inline-block",
          padding: "5px 1% 0px",
          backgroundColor: "#5c4360",
        }}
      >
        <img
          style={{
            marginTop: "5px",
            maxHeight: "32px",
            maxWidth: "32px",
          }}
          src={logo}
          alt="logo"
        />
        <div style={{ float: "right" }}>
          <input
            style={{
              margin: "10px 20px 0px",
              border: "3px solid #5c4399",
            }}
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.currentTarget.value);
            }}
          />
          <Button
            style={{
              margin: "10px 20px 10px",
              // marginLeft: "80vw",
              backgroundColor: "#5c4389",
              border: "none",
            }}
            onClick={clickHandler}
          >
            <i className="fas fa-download"></i>
          </Button>
        </div>
      </div>

      <Container fluid={true} className="pane pane-top">
        <Row noGutters={true}>
          <Col md={4} className="editor-lang">
            <div className="editor-text">
              <i className="fab fa-html5"> </i> Html
            </div>
            <Editor
              launguage="xml"
              value={html}
              onChange={(newVal) => {
                updateHtml(newVal);
              }}
            />
          </Col>

          <Col md={4} className="editor-lang">
            <div className="editor-text">
              <i className="fab fa-css3-alt"></i> Css
            </div>
            <Editor
              launguage="css"
              value={css}
              onChange={(newVal) => {
                updateCss(newVal);
              }}
            />
          </Col>
          <Col md={4} className="editor-lang">
            <div className="editor-text">
              <i className="fab fa-js-square"></i> Js
            </div>
            <Editor
              launguage="javascript"
              value={js}
              onChange={(newVal) => {
                updateJs(newVal);
              }}
            />
          </Col>
        </Row>
      </Container>

      <Container fluid={true} className="pane pane-bottom">
        <Row noGutters={true}>
          <iframe
            title="preview"
            srcDoc={srcDoc}
            className="output-pane"
            allowFullScreen
          ></iframe>
        </Row>
      </Container>

      <Footer />
    </div>
  );
}

export default LaunguageManager;
