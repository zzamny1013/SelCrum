import "./ProjectInfoPage.css";
import moment from "moment";

import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Nav } from "react-bootstrap";
import SprintCard from "../components/SprintCard";

function ProjectInfoPage(props) {
  return (
    <div className="ProjectInfoPage">
      <h4>project</h4>
      <label className="color_blue">
        {props.project && props.project.name}
      </label>
      <h4>term</h4>
      <label className="color_blue">
        {moment(props.project && props.project.start_date).format("YYYY-MM-DD")}{" "}
        ~ {moment(props.project && props.project.end_date).format("YYYY-MM-DD")}
      </label>
      <h4>sprints</h4>
      {props.sprintElements}

      <Button className="addSprintBtn" variant="primary">
        +
      </Button>
      <Nav
        variant="pills"
        defaultActiveKey={props.SprintPageUrl}
        className="SprintPageNav justify-content-center"
      >
        <Nav.Item key="1">
          <Nav.Link href={props.KanbanPageUrl}>칸반 보드</Nav.Link>
        </Nav.Item>
        <Nav.Item key="2">
          <Nav.Link href={props.SprintPageUrl}>스프린트</Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
}

export default ProjectInfoPage;
