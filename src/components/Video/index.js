import React, { Component } from "react";
import { connect } from "react-redux";

const Video = ({activeLesson, activeModule}) => (
  <div>
    <strong>Módulo {activeModule.title}</strong><br />
    <span>Aula {activeLesson.title}</span>
  </div>
);

export default connect((state) => ({
  activeModule: state.course.activeModule,
  activeLesson: state.course.activeLesson
}))(Video);