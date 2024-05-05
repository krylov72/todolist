import React, { useState } from 'react';
import {FiltersValueType, TasksType} from "./App";

type TodoListPropsType = {
    id?: number,
    title: string,
    tasks: TasksType[]
    removeTask:(taskId:number)=> void
    deleteAllTasks:() => void
} 

export const TodoList = ({
                             id,
                             title,
                             tasks,
                             removeTask,
                             deleteAllTasks
                         }: TodoListPropsType) => {

    const [filter,setFilter] = useState<FiltersValueType>('all');
    let filteredTasks = tasks;
    if (filter === 'completed') {
        filteredTasks = tasks.filter(t=>t.isDone === true)
    } else if (filter === "active") {
        filteredTasks = tasks.filter(t=>t.isDone === false)
    } else if (filter === 'firstThree') {
        filteredTasks = tasks.filter(t=>t.id === 1 || t.id === 2 || t.id === 3)
    }
    

    const changeFilter = (value:FiltersValueType) => {
        setFilter(value)
    }
    return (
        <div>
            <h3>{title}</h3>
            <div>
                <input/>
                <button>+</button>
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

