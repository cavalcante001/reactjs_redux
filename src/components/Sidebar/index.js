import React, { Component } from "react";
import { connect } from 'react-redux';
import * as CourseActions from '../store/actions/course';
import { bindActionCreators } from "redux";

const Sidebar = ({modules, toggleLesson}) => (
      <aside>
        {modules.map((module) => (
          <div key={module.id}>
            <strong>{module.title}</strong>
            <ul>
              {module.lessons.map((lesson) => (
                <li key={lesson.id}>
                  {lesson.title}
                  <button onClick={() => toggleLesson(module, lesson)}>Selecionar</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>
);

const mapStateToProps = state => ({
  modules: state.course.modules
});

const mapDispatchToProps = dispatch => (
    bindActionCreators(CourseActions, dispatch)
    // toggleLesson: (module, lesson) => dispatch(CourseActions.toggleLesson(module,lesson))
    // ({})
)

export default connect(mapStateToProps , mapDispatchToProps)(Sidebar);