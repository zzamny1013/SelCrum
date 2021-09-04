
import './IndexPage.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProjectsPageContainer from './ProjectsPageContainer';
import ProjectAddPageContainer from './ProjectAddPageContainer';
import KanbanPageContainer from './KanbanPageContainer';
import ProjectInfoPageContainer from './ProjectInfoPageContainer';
import SprintAddPageContainer from './SprintAddPageContainer';
import SprintInfoPageContainer from './SprintInfoPageContainer';
import LoginPageContainer from './LoginPageContainer';
import MorePageContainer from './MorePageContainer';
import { Route } from 'react-router-dom';

function IndexPage() {
  return (
    <div className="IndexPage">
    	<Route path='/' component={Header} />
		<Route path='/' component={ProjectsPageContainer} exact/>
		<Route path='/login' component={LoginPageContainer} exact/>
		<Route path='/project' component={ProjectsPageContainer} exact/>
		<Route path='/project/postpage' component={ProjectAddPageContainer} exact/>
		<Route path='/project/:projectId/kanban' component={KanbanPageContainer} exact/>
		<Route path='/project/:projectId/sprint' component={ProjectInfoPageContainer} exact/>
		<Route path='/sprint/postpage' component={SprintAddPageContainer} exact/>
		<Route path='/sprint/:sprintId' component={SprintInfoPageContainer} exact/>
		<Route path='/more' component={MorePageContainer} exact/>
		<Route path='/' component={Footer} exact/>
		<Route path='/project' component={Footer} />
		<Route path='/sprint' component={Footer} />
		<Route path='/more' component={Footer} />
    </div>
  );
}

export default IndexPage;