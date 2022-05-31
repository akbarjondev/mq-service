import Editor from "@uiw/react-textarea-code-editor";
import style from "./CodeEditor.module.css";

const CodeEditor = ({ code, ...params }) => {
  return (
    <div className={style.editor}>
      <Editor
        {...params}
        value={code}
        language="js"
        placeholder="Please enter JS code."
        padding={15}
        style={{
          height: 230,
          fontSize: 12,
          backgroundColor: "#f5f5f5",
          fontFamily:
            "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
        }}
      />
    </div>
  );
};

export default CodeEditor;
