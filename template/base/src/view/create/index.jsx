import React, { useState } from "react";
import { Button } from "antd";
import WangEditor from "@/components/WangEditor";
import Content from "@/components/Content";
import Header from "@/components/Header";
import { observer } from "mobx-react";
import useStore from "@/store";
import CreateModel from "./CreateModel";
import styles from "./index.less";

const CreateContent = () => {
  const [htmlCode, setHtmlCode] = useState("");
  const [visible, setVisible] = useState(false);

  const { create } = useStore();

  const getHtmlCode = (text) => {
    create.createMackdown(text);
    setHtmlCode(text);
  };

  const onCreate = () => {
    setVisible(true);
  };

  const onHideModel = () => {
    setVisible(false);
  };

  const headerRight = () => {
    return (
      <div className={ styles.left }>
        <Button type="primary" onClick={ onCreate }>
          新建
        </Button>
      </div>
    );
  };

  return (
    <div className={ styles.container }>
      <Header right={ headerRight() }>Create</Header>
      <Content needScroll={ false }>
        <WangEditor getHtmlCode={ getHtmlCode } />
      </Content>
      <CreateModel
        visible={ visible }
        onCancel={ onHideModel }
        htmlCode={ htmlCode }
      />
    </div>
  );
};

export default observer(CreateContent);
