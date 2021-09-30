import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Route, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { matchTaskWithSprint, setInitTaskForAdd } from "../modules/tasks";
import {
  matchTask_Sprint,
  removeTask,
  setInitArr,
} from "../modules/sprintTaskArr";

import "bootstrap/dist/css/bootstrap.min.css";
import { ListGroup } from "react-bootstrap";

import SprintInfoPage from "../components/SprintInfoPage";
import TaskList from "../components/TaskList";

//https://velog.io/@dhlee91/this.props.history.push%EB%A1%9C-props-%EB%84%98%EA%B2%A8%EC%A3%BC%EA%B8%B0

function SprintInfoPageContainer(props) {
  const [name, setName] = useState("");
  const [selectedTasks, setSelectedTasks] = useState("");
  const [deadline, setDeadline] = useState("");
  const [btnState, setBtnState] = useState(false);

  const taskListRef = useRef();

  const tasks = useSelector((state) => state.tasks);
  const sprintTaskArr = useSelector((state) => state.sprintTaskArr);
  const dispatch = useDispatch();

  const [sprintObj, setSprintObj] = useState({});

  const curId = props.match.params.sprintId;

  useEffect(() => {
    //dispatch(setInitTaskForAdd());
    //dispatch(setInitArr());
    //여기서 sprintObj를 api로 받아올 것
    axios
      .get("/api/sprint/" + props.match.params.sprintId)
      .then((response) => {
        /*
        setSprintObj({
          ...response.data[0],
          end_date: response.data[0].end_date.substring(0, 10),
        });*/
        setSprintObj(response.data[0]);

        /*
        setSelectedTasks(
          tasks.data.filter((element) => {
            return element.sprint_id === sprintObj.sprint_id;
          })
        );*/

        //setDeadline(moment(sprintObj.end_date).format("YYYY-MM-DD"));
        //setName(sprintObj.name);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const nameHandler = (e) => {
    e.preventDefault();
    //setName(e.target.value);
    setSprintObj({
      ...sprintObj,
      name: e.target.value,
    });
  };

  const deadlineHandler = (e) => {
    e.preventDefault();
    //setDeadline(e.target.value);
    setSprintObj({
      ...sprintObj,
      end_date: e.target.value,
    });
  };

  const addTaskHandler = (e) => {
    e.preventDefault();

    if (tasksNotInSprint.length > 0) {
      setBtnState(!btnState);
      taskListRef.current.style = "display:block";
    } else {
      alert("해야할 일이 없습니다.");
    }
  };

  const removeTaskHandler = (e) => {
    e.preventDefault();

    //sprint=0 -> 아직 스프린트에 적용되지 않았다.
    //dispatch(matchTaskWithSprint(e.target.id, 0));
    //setSelectedTasks(selectedTasks.filter((item) => item !== e.target.id));
    dispatch(removeTask(curId, parseInt(e.target.id)));
  };

  const taskHandler = (e) => {
    e.preventDefault();

    //dispatch(matchTaskWithSprint(e.target.id, sprintObj.sprint_id));
    dispatch(matchTask_Sprint(curId, [parseInt(e.target.id)]));
    //setSelectedTasks([...selectedTasks, e.target.id]);

    setBtnState(!btnState);
    taskListRef.current.style = "display:none";
  };

  const history = useHistory();

  const submitHandler = (e) => {
    e.preventDefault();

    // state에 저장한 값을 가져옵니다.
    let body = {
      sprint_id: curId,
      name: sprintObj.name,
      tasks: sprintTaskArr[curId],
      project_id: props.match.params.projectId,
      //end_date: sprintObj.end_date,
    };

    console.log(body);

    axios
      .put("http://localhost:4000/api/sprint", body)
      .then((res) => {})
      .catch((err) => {
        console.error(err);
      });
    history.goBack();
  };

  /*
  let tasksNotInSprint = [];
  if (Object.keys(sprintObj).length !== 0 && selectedTasks !== undefined) {
    //selectedTask로 해야됌
    const uniqueTaskId = [
      ...new Set(selectedTasks.map((item) => (item = item.task_id))),
    ];
    const nameById = (task_id) => {
      for (let t of selectedTasks) {
        if (t.task_id === task_id) return t.task;
      }

      return null;
    };

    tasksNotInSprint = uniqueTaskId.map((item) => {
      if (item.sprint_id !== sprintObj.sprint_id) {
        return (
          <ListGroup.Item key={item} id={item} onClick={taskHandler}>
            {nameById(item)}
          </ListGroup.Item>
        );
      }
    });
  }*/

  const taskById = (task_id) => {
    for (let t of tasks.data) {
      if (t.task_id === task_id) return t.task;
    }

    return null;
  };

  let tasksNotInSprint = [];
  let taskLi = [];
  if (sprintTaskArr[curId] !== undefined) {
    tasksNotInSprint = tasks.data.map((element) => {
      if (!sprintTaskArr[curId].includes(element.task_id)) {
        return (
          <ListGroup.Item
            key={element.task_id}
            id={element.task_id}
            onClick={taskHandler}
          >
            {element.task}
          </ListGroup.Item>
        );
      }
    });
    //task Listitem 만들기
    if (
      sprintTaskArr[curId] !== undefined &&
      sprintTaskArr[curId].length !== 0
    ) {
      taskLi = sprintTaskArr[curId].map((item, index) => {
        return (
          <li onClick={removeTaskHandler} id={item}>
            {taskById(item)}{" "}
          </li>
        );
      });
    }
  }

  return (
    <div>
      <SprintInfoPage
        submitHandler={submitHandler}
        nameHandler={nameHandler}
        addTaskHandler={addTaskHandler}
        tasks={tasks}
        taskLi={taskLi}
        btnState={btnState}
        sprintObj={sprintObj}
        deadline={deadline}
        name={name}
        deadlineHandler={deadlineHandler}
        removeTaskHandler={removeTaskHandler}
      />
      <TaskList
        tasks={tasks}
        taskHandler={taskHandler}
        taskListRef={taskListRef}
        isInfoPage={true}
        taskLi={tasksNotInSprint}
      />
    </div>
  );
}

export default SprintInfoPageContainer;
