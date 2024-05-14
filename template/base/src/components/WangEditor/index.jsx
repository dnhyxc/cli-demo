import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import React, { useState, useEffect } from "react";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import { Scrollbars } from "react-custom-scrollbars";
import { toolbarConfig, editorConfig } from "./config";
import styles from "./index.less";

const WangEditor = ({ getHtmlCode }) => {
  const [editor, setEditor] = useState(null); // 存储 editor 实例
  const [html, setHtml] = useState(""); // 编辑器内容

  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  const onEditValueChange = (value) => {
    getHtmlCode(value.getText());
    setHtml(value.getHtml());
    console.log(value.getHtml());
  };

  return (
    <div className={ styles.container }>
      <Toolbar
        editor={ editor }
        defaultConfig={ toolbarConfig }
        mode="default"
        style={ { borderBottom: "1px solid #ddd" } }
      />
      <Scrollbars>
        <Editor
          defaultConfig={ editorConfig }
          value={ html }
          onCreated={ setEditor }
          onChange={ (value) => onEditValueChange(value) }
          mode="default"
        />
      </Scrollbars>
    </div>
  );
};

export default WangEditor;
