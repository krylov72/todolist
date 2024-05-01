import { useState } from 'react';
import './App.css';
import {Todolist} from "./Todolist";

export type TaskType = {
	id: number
	title: string
	isDone: boolean
}

export type FilterValuesType = 'all' | 'completed' | 'active';

function App() {
	
	let [tasks,setTasks] = useState<Array<TaskType>>([
		{ id: 1, title: 'HTML&CSS', isDone: true },
		{ id: 2, title: 'JS', isDone: true },
		{ id: 3, title: 'ReactJS', isDone: false },
		{ id: 4, title: 'Redux', isDone: false },
		{ id: 5, title: 'Typescript', isDone: false },
		{ id: 6, title: 'RTK query', isDone: false },
	])

	let [filter,setFilter] = useState<FilterValuesType>('all');

	function deleteTask (id: number) {
		let filteredTasks = tasks.filter(t =>  t.id !== id)
		setTasks(filteredTasks)
	}

	function changeFilter (value:FilterValuesType) {
		setFilter(value)
	}


	let tasksForTodoList = tasks;
	if (filter === 'completed') {
		tasksForTodoList = tasks.filter(t=>t.isDone===true)
	}
	if (filter === 'active') {
		tasksForTodoList = tasks.filter(t=>t.isDone===false)
	} 

	return (
		<div className="App">
			<Todolist title="What to learn" tasks={tasksForTodoList} removeTask={deleteTask} changeFilter={changeFilter} />
			{/* <Todolist title="Songs" tasks={tasks2}/> */}
		</div>
	);
}

export default App;
