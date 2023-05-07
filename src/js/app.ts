import {User} from './user'

interface Isession{
    userId:number,
    token:string
}

interface ILoggedUser{
    id:number,
    role:string,
}


class App {
    sessionsUrl = 'http://localhost:3000/sessions'
    constructor(){
        this.init()
    }

    async init(){
        // let sessionUserId = localStorage.getItem('pma-session-user-id')
        // let sessionToken = localStorage.getItem('pma-session-token')
        let sessionUserId = '1'
        let sessionToken = 'fdagudhea76t4BF78O73Thfnivwefhfewubvwd'
        if (sessionUserId && sessionToken) {
            sessionUserId = JSON.parse(sessionUserId)
            let response = await fetch(this.sessionsUrl+'?userId='+sessionUserId+'&token='+sessionToken)
            let data = await response.json()
            // this.loggedUser.id = data.userId
        }

        this.router()
    }

    router(){
        
    }
}

// localStorage.setItem('pma-session-user-id', '1')
// localStorage.setItem('pma-session-token', 'fdagudhea76t4BF78O73Thfnivwefhfewubvwd')
let myapp = new App()

