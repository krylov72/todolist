import React, { useRef, useState } from 'react';
import {FiltersValueType, TasksType} from "./App";
import { Button } from './components/Button';

type TodoListPropsType = {
    id?: string,
    title: string,
    tasks: TasksType[]
    removeTask:(taskId:string)=> void
    deleteAllTasks:() => void
    addTask:(title:string) => void
} 

export const TodoList = ({
                             id,
                             title,
                             tasks,
                             removeTask,
                             deleteAllTasks,
                             addTask
                         }: TodoListPropsType) => {

    const [filter,setFilter] = useState<FiltersValueType>('all');
    let filteredTasks = tasks;
    if (filter === 'completed') {
        filteredTasks = tasks.filter(t=>t.isDone === true)
    } else if (filter === "active") {
        filteredTasks = tasks.filter(t=>t.isDone === false)
    } else if (filter === 'firstThree') {
        filteredTasks = tasks.slice(0,3)
    }

    const addTaskHandler = () => {
        addTask(taskTitle)
          setTaskTitle('')
    }
    
    const [taskTitle,setTaskTitle] = useState('')

    const changeFilter = (value:FiltersValueType) => {
        setFilter(value)
    }
    return (
        <div>
            <h3>{title}</h3>
            <div>
                <input value={taskTitle} onChange={(event)=>{setTaskTitle(event.currentTarget.value)}}/>
                <Button
          title={'+'}
          onClick={addTaskHandler}/>
            </div>
            {tasks.length === 0 ?
                (<p>No tasks</p>) :
                (<ul>
                    {filteredTasks.map((t) =>
                        <li key={t.id}>
                            <input type="checkbox" checked={t.isDone}/>
                            <span>{t.title}</span>
                            <button onClick={() =>{removeTask(t.id)}}>x</button>
                        </li>
                    )}
                </ul>)
            }
            <button onClick={() => {deleteAllTasks()}} style={{marginLeft:25, marginBottom:20}}>Remove All Tasks</button>
            <div>
                <button onClick={() => {changeFilter('all')}}>All</button>
                <button onClick={() => {changeFilter('active')}}>Active</button>
                <button onClick={() => {changeFilter('completed')}}>Completed</button>
                <button onClick={() => {changeFilter('firstThree')}}>First Three</button>
            </div>
        </div>
    );
};

