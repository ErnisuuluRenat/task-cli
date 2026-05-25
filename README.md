# Task cli

## task cli application to manage your tasks

Task-cli - is a software to help you manage your tasks, it's main points are: lightweighted, fast, simple to use
and written in NodeJS

`To run task-cli you need:`
- Have nodeJS installed in your computer
- Install this project via github
    ```git clone <this repo>```
    ```cd task-cli```
- Then run the command `node task-cli.js`

## How to use it:
To use and work with task-cli they are plenty of commands such as:
- `node task-cli.js add "buy groceries"`
- `node task-cli.js update 1 "write down a business plan"`
- `node task-cli.js delete 1`

- `node task-cli.js mark-in-progress 1`
- `node task-cli.js mark-done 1`
- `node task-cli.js list (to see every task)`
## Listening tasks by status
- `node task-cli.js list done`
- `node task-cli.js list todo`
- `node task-cli.js list in-progress`

Project idea from: https://roadmap.sh/projects/task-tracker