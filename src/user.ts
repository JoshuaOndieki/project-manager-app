type TStatus = 'Not Started' | 'In Progress' | 'Completed'

interface IProject{
    id?:number
    title:string 
    dueDate:string
    status:TStatus
}



import {Project} from './project'

interface IUser
    {
        id?: number
        name: string
        role?: ("Admin" | "User")
        email: string,
        password: string
      }


 class User{
    static userEndPoint = 'http://localhost:3000/users'
    loggedUser: number
    constructor(loggedUser:number){
       this.loggedUser = loggedUser;
    }

     static async userSignup(user:IUser){
        const user1 = await User.getUserByEmail(user.email)
        if (user1.length){return false}
       user.role="User"
        const response = await fetch(User.userEndPoint,{
            method:"POST",
            body:JSON.stringify(user),
            headers:{
                "Content-Type": "application/json"
            }
        })
        
        return response

    }

    static async userSignin(email:string, password:string){
        const response = await fetch(User.userEndPoint+'?email='+email+'&password='+password)
        const user = (await response.json())[0]
        delete user.password
        return user

    }

    static async getUserByEmail(email:string){
        const response = await fetch(User.userEndPoint+'?email='+email)
        return await response.json()

    }

    async getLoggedUser(){
       
        const response = await fetch(User.userEndPoint+"/"+this.loggedUser)
        const loggedUser = await response.json()
        delete loggedUser.password
        // console.log(loggedUser)
    }
    async userProjects(statuses:string[]){
        let projects = await Project.getUserProjects(this.loggedUser)
        return projects.filter((project:IProject)=>{return statuses.includes(project.status)})

    }
    statusButtons(status:TStatus){
        let notStartedButton = `<button class="not-started-btn">Not Started</button>`
        let inProgressButton = `<button class="in-progress-btn">In Progress</button>`
        let completeButton = `<button class="complete-btn">Completed</button>`

        return status== 'Not Started'?inProgressButton+completeButton:notStartedButton+completeButton
    }

    async renderAssignedProject(){
        let assignedProject:IProject = (await this.userProjects(['Not Started','In Progress']))[0]
        let projectsContainer = document.getElementById("projects-container") ! as HTMLDivElement
        
        if (assignedProject.title && projectsContainer) {

           let projectHTML = 
           ` <div class="card">
            <h3> Title: ${assignedProject.title}</h3>
            <p>Due Date: ${assignedProject.dueDate}</p>
            <p>Status: ${assignedProject.status}</p>
            <div class="buttons">
                
                ${this.statusButtons(assignedProject.status)}
            </div>
            
        </div>`
            projectsContainer.innerHTML= projectHTML          
        } 
        
    }
    async renderCompletedProjects(){
        let completedProjects = await this.userProjects(['Completed'])
        let projectsContainer = document.getElementById("projects-container") ! as HTMLDivElement
        if (completedProjects .title && projectsContainer) {    
           let projectHTML = 
           ` <div class="card">
            <h3> Title: ${completedProjects.title}</h3>
            <p>Due Date: ${completedProjects.dueDate}</p>
            <p>Status: ${completedProjects.status}</p>
            <div class="buttons">
                
                <button id="completed">Completed</button>
            </div>
            
        </div>`
            projectsContainer.innerHTML= projectHTML          
        } 
        
    }
}
 let userInstance = new User(2)

 userInstance.getLoggedUser()
userInstance.renderCompletedProjects()


userInstance.renderAssignedProject()
