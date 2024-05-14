import React from "react";
import useStore from "@/store";
import Header from "@/components/Header";
import Content from "@/components/Content";
import Preview from "@/components/Preview";

const CreateMarkdown = () => {
  const { create } = useStore();
  return (
    <div>
      <Header>Preview markdown</Header>
      <Content>
        <Preview mackdown={ create.mackdown } />
      </Content>
    </div>
  );
};

export default CreateMarkdown;
