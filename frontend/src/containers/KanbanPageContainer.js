import React, { useState, useEffect } from "react";
import axios from "axios";
import { Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { insertTask, setInitTask } from "../modules/tasks";
import { useHistory } from "react-router";

import KanbanPage from "../components/KanbanPage";
import "bootstrap/dist/css/bootstrap.min.css";
import Kanban from "../components/Kanban";

import { Cookies } from "react-cookie";

//아무리해도 서버에서 쿠키로 Auth검증하는 것이 되지않아 임시로 이렇게 처리
const cookies = new Cookies();
axios.defaults.headers.common["Authorization"] =
  `Bearer ` + cookies.get("token");

//KanbanPage의 match에 projectId를 받아와서 API서버에 넣어서 통신예정
//api통신할 때 componentDidMount 적당히 활용할 것

function KanbanPageContainer({ match }, props) {
  const projectId = parseInt(match.params.projectId);
  const KanbanPageUrl = "/project/" + projectId + "/kanban";
  const SprintPageUrl = "/project/" + projectId + "/sprint";
  const apiUrl =
    process.env.REACT_APP_API_URL + "/api/project/" + projectId + "/task";
  const urlForSprint =
    process.env.REACT_APP_API_URL +
    "/api/project/" +
    projectId +
    "/task/sprint";
  const urlForTask = process.env.REACT_APP_API_URL + "/api/task";

  const history = useHistory();

  const [curTask, setCurTask] = useState("");

  const tasks = useSelector((state) => state.tasks);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const dispatch = useDispatch();

  let todoTodo = [];
  let doingTodo = [];
  let doneTodo = [];

  useEffect(() => {
    axios
      .get(apiUrl)
      .then(function (response) {
        dispatch(setInitTask(response.data));
      })
      .catch(function (err) {
        console.error(err);
      });

    axios
      .get(urlForSprint)
      .then(function (response) {
        setSelectedTasks(response.data);
      })
      .catch(function (err) {
        console.error(err);
      });
  }, []);

  const curTaskHandler = (e) => {
    e.preventDefault();

    setCurTask(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const t = {
      projectId: projectId,
      task: curTask,
    };

    axios
      .post(urlForTask, t)
      .then((response) => {
        dispatch(insertTask(projectId, response.data[0].insertId, curTask));
        setCurTask("");
      })
      .catch((err) => {
        setCurTask("");
        window.alert("올바르지 않은 입력입니다.");
        console.error(err);
      });
  };

  const historyHandler1 = (e) => {
    e.preventDefault();

    history.push(KanbanPageUrl);
  };

  const historyHandler2 = (e) => {
    e.preventDefault();

    console.log(history);
    history.push(SprintPageUrl);
  };

  //if (selectedTasks.length > 0) {
  doingTodo =
    selectedTasks &&
    selectedTasks
      .map((item, index) => {
        if (item.todo === 1) {
          return <Kanban task={item.task} />;
        }
      })
      .filter((item) => item !== undefined);

  doneTodo =
    selectedTasks &&
    selectedTasks
      .map((item, index) => {
        if (item.todo === 0) {
          return <Kanban task={item.task} />;
        }
      })
      .filter((item) => item !== undefined);

  const selectedTaskIdArray =
    selectedTasks && selectedTasks.map((t) => t.task_id);

  todoTodo = tasks.data
    .map((item, index) => {
      if (!selectedTaskIdArray.includes(item.task_id)) {
        return <Kanban task={item.task} />;
      }
    })
    .filter((item) => item !== undefined);
  //}

  return (
    <KanbanPage
      todoTodo={todoTodo}
      doingTodo={doingTodo}
      doneTodo={doneTodo}
      curTask={curTask}
      curTaskHandler={curTaskHandler}
      submitHandler={submitHandler}
      historyHandler1={historyHandler1}
      historyHandler2={historyHandler2}
    />
  );
}

export default KanbanPageContainer;
