import React from "react";
import { observer } from "mobx-react";
import useStore from "@/store";
import Header from "@/components/Header";
import Content from "@/components/Content";
import TuiEditor from "@/components/TuiEditor";

import styles from "./index.less";

const CreateArticle = () => {
  const { create } = useStore();

  const onGetMarkdown = (markdown) => {
    create.createMackdown(markdown);
  };

  return (
    <div className={ styles.container }>
      <Header>Create Article</Header>
      <Content needScroll={ false }>
        <TuiEditor onGetMarkdown={ onGetMarkdown } />
      </Content>
    </div>
  );
};

export default observer(CreateArticle);
