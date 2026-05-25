import path from "node:path"
import fs from "node:fs/promises"
import { constants } from "node:fs/promises"

const pathDir = path.join(import.meta.dirname, "tasks.json")

const [,, command, ...args] = process.argv

if (!command) {
    console.log("Command cannot be empty")
    process.exit()
}

async function checkFile() {
    try {
        await fs.access(pathDir, constants.F_OK)
        return true
    } catch {
        return false
    }
}

async function readTasks(){
    const fileExists = await checkFile()
    console.log(fileExists)

    if (fileExists) {
        try {
            const data = await fs.readFile(pathDir, "utf-8")
            return data ? JSON.parse(data) : {latestId: 0, tasks: []};
        }catch (error){
            console.log("Error while reading or parsing file, returning empty array", error)
            return {latestId: 0, tasks: []}
        }
    } else {
        await fs.writeFile(pathDir, JSON.stringify({latestId: 0, tasks: []}))
        return {latestId : 0, tasks: []}
    }
}

async function writeTasks(data) {
    const writeFile = await fs.writeFile(pathDir, JSON.stringify({latestId, tasks : data}, null, 2))
}

let file = await readTasks() || []
let {latestId, tasks} =  file
console.log("What is tasks", latestId, tasks)

function errorMsg(msg) {
    return `Error appeared while ${msg} an item, error:`
}

function displayTasks(statusFilter, actionMessage) {
    console.log("-".repeat(75))
    console.log(actionMessage)

    let foundAny = false

    tasks.forEach((task,i) => {
        if (task.status === statusFilter) {
            foundAny = true
            console.log(`Task ${i + 1}: 
            Task description: ${task.description}
            Task status: ${task.status}
            Task createdAt: ${task.createdAt}
            Task updatedAt: ${task.updatedAt || ""}
            `.trimStart())
            }
        })
    
    if (!foundAny) {
        console.log(`No tasks found with status: ${statusFilter}`)
    }
    console.log("-".repeat(75))
}

async function task_manager() {

    switch (command) {
        case "add":
            try {
                const payload = args.join(" ").trim()
                if (payload === "") {
                    console.log("description cannot be empty!")
                    return 
                }
                latestId += 1 
                const newTask = {
                    id : latestId,
                    description: payload,
                    status : "todo",
                    createdAt : new Date().toLocaleDateString("en-Us"),
                    updatedAt: ""         
                }
                tasks.push(newTask)
                await writeTasks(tasks)
            } catch(error) {
                console.log(errorMsg("add"), error)
            }
            return
        case "delete":
            try {
                console.log("Deleting a task")
                const id = Number(args[0])

                tasks = tasks.filter((task) => task.id !== id)
                await writeTasks(tasks)

                console.log("Successfully deleted a task")
            }catch(error) {
                console.log(errorMsg("delete"), error)
            }
            return
        case "update":
            try {
                const id = Number(args[0])
                const description = args.slice(1).join(" ")
                tasks = tasks.map((task) => task.id === id ? {...task, description, updatedAt : new Date().toLocaleDateString("en-Us")} : task)
                await writeTasks(tasks)
                console.log("Successfully updated a task")
            } catch(error){
                console.log(errorMsg("update"), error)
            }
            return
        case "mark-done":
            try {
                const id = Number(args[0])
                tasks = tasks.map((task) => task.id === id ? {...task, status : "done", updatedAt : new Date().toLocaleDateString("en-Us")} : task)
                await writeTasks(tasks)
                console.log("Successfully mark-done a task")
            } catch(error){
                console.log(errorMsg("mark-done"), error)
            }
            return
        case "mark-in-progress":
            try {
                const id = Number(args[0])
                tasks = tasks.map((task) => task.id === id ? {...task, status : "in-progress", updatedAt : new Date().toLocaleDateString("en-Us")} : task)
                await writeTasks(tasks)
                console.log("Successfully mark-in-progress a task")
            } catch(error){
                console.log(errorMsg("mark-in-progress"), error)
            }
            return
        case "list":
            const cmd = args[0]
            console.log(args[0])
            if (cmd === "done") {
                displayTasks("done", "Listening every done task.....")
                return
            } else if (cmd === "in-progress") {
                displayTasks("in-progress", "Listening every in-progress task.....")
                return
            }
            else if (cmd === "todo") {
                displayTasks("todo", "Listening every todo task.....")
                return
            }
            console.log("-".repeat(75))
            console.log("Listening every task.....")
            tasks.forEach((task,i) => {
                console.log(`Task ${i + 1}: 
                Task description: ${task.description}
                Task status: ${task.status}
                Task createdAt: ${task.createdAt}
                Task updatedAt: ${task.updatedAt || ""}
                `.trimStart())
            })
            console.log("-".repeat(75))
            return
    }
}

task_manager()