import React, { ChangeEvent, KeyboardEvent,useRef,useState } from 'react';
import {FiltersValueType, TasksType} from "./App";
import { Button } from './components/Button';
import {useAutoAnimate} from '@formkit/auto-animate/react'

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
    
    let onChangeRef = useRef<HTMLInputElement>(null)

    const onChangeTaskTitleHandler = (e:ChangeEvent<HTMLInputElement>) => {
        setTaskTitle(e.currentTarget.value)
    }

    const AddTaskOnKey = (e:KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && filterInputHandler()) {
            addTaskHandler()
        }
    }

    const filterInputHandler = () => {
        return taskTitle.length !== 0 && taskTitle.length <10
    }

    const changeFilter = (value:FiltersValueType) => {
        setFilter(value)

        
    }
    const [listRef] = useAutoAnimate<HTMLUListElement>()
    return (
        <div>
            <h3>{title}</h3>
            <div>
                <input value={taskTitle} ref={onChangeRef} onChange={onChangeTaskTitleHandler} onKeyUp={AddTaskOnKey} />
                <Button
          title={'+'}
          onClick={addTaskHandler}
          disabled={!filterInputHandler()}
          />
            </div>
            {tasks.length === 0 ?
                (<p>No tasks</p>) :
                (<ul ref={listRef}>
                    {filteredTasks.map(t => {
                        const removeTaskHandler = () => {
                            removeTask(t.id)
                        }
                        return(
                            <li key={t.id}>
                            <input type="checkbox" checked={t.isDone}/>
                            <span>{t.title}</span>
                            <button onClick={removeTaskHandler}>x</button>
                        </li>
                    )}
                        )
                    }
                       
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

