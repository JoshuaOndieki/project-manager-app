type TStatus = 'Not Started' | 'In Progress' | 'Completed'

interface IProject{
    id?:number
    title:string 
    dueDate:string
    status:TStatus
}



import {Project} from './project'

export interface IUser
    {
        id?: number
        name: string
        role?: ("Admin" | "User")
        email: string,
        password: string
      }


 export class User{
    

    static userEndPoint = 'http://localhost:3000/users'
    loggedUser: number
    constructor(loggedUser:number){
       this.loggedUser = loggedUser;
       
    }
    init(){
        let assignedSectionBtn = document.getElementById('assigned-section-btn') as HTMLButtonElement
        let completedSectionBtn = document.getElementById('completed-section-btn') as HTMLButtonElement
        assignedSectionBtn.addEventListener('click',()=>{this.renderAssignedProject()})
        completedSectionBtn.addEventListener('click',()=>{this.renderCompletedProjects()})
        this.renderAssignedProject()
        this.renderUserData()

  
    }
     static async userSignup(user:IUser){
        const user1 = await User.getUserByEmail(user.email)
        if (user1.length)
        {
            return false
        }else{
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

    }

    static async userSignin(email:string, password:string){
        const response = await fetch(User.userEndPoint+'?email='+email+'&password='+password)
        const user = (await response.json())[0]
        if(user){delete user.password}
        return user

    }

    static async getUserByEmail(email:string){
        const response = await fetch(User.userEndPoint+'?email='+email)
        return await response.json()

    }

    async getLoggedUser(){
       
        const response = await fetch(User.userEndPoint+"/"+this.loggedUser)
        const loggedUser = await response.json()
        if(loggedUser){delete loggedUser.password}
        return loggedUser
    }
    async renderUserData(){
        let userData:Partial<IUser>= await this.getLoggedUser()
        document.getElementById('user-name')!.innerHTML= 'Name: '+ userData.name
        document.getElementById('user-id')!.innerHTML= 'ID: '+ userData.id
        document.getElementById('user-email')!.innerHTML= 'Email: '+ userData.email

    }
    async userProjects(statuses:string[]){
        let projects = await Project.getUserProjects(this.loggedUser)
        return projects.filter((project:IProject)=>{return statuses.includes(project.status)})

    }
    statusButtons(cProject:Required<IProject>){
        let notStartedButton = `<button class="not-started-btn">Not Started</button>`
        let inProgressButton = `<button class="in-progress-btn">In Progress</button>`
        let completeButton = `<button class="complete-btn">Complete</button>`
        return cProject.status== 'Not Started'?inProgressButton+completeButton:notStartedButton+completeButton
        }

    async renderAssignedProject(){
        let assignedProject:Required<IProject>
        assignedProject = (await this.userProjects(['Not Started','In Progress']))[0]
        let projectsContainer = document.getElementById("projects-container") ! as HTMLDivElement
        
        if (assignedProject && projectsContainer) {
          

           let projectHTML = 
           ` <div class="card">
            <h3> Title: ${assignedProject.title}</h3>
            <p>Due Date: ${assignedProject.dueDate}</p>
            <p>Status: ${assignedProject.status}</p>
            <div class="buttons">
            
            ${this.statusButtons(assignedProject)}
            </div>
            
        </div>`
            projectsContainer.innerHTML= projectHTML 
            let notStartedButton = document.querySelector('.not-started-btn') 
            let inProgressButton= document.querySelector('.in-progress-btn') 
            let completeButton = document.querySelector('.complete-btn') 
            notStartedButton?.addEventListener('click',()=>{Project.updateProject(assignedProject.id,{status:'Not Started'})})
            inProgressButton?.addEventListener('click',()=>{Project.updateProject(assignedProject.id,{status:'In Progress'})})
            completeButton?.addEventListener('click',()=>{Project.updateProject(assignedProject.id,{status:'Completed'})})
            

        } 
        else{
            projectsContainer.innerHTML= "You have not been assigned any project"
        }
        
    }
    async renderCompletedProjects(){        
        let completedProjects = await this.userProjects(['Completed'])
        let projectsContainer = document.getElementById("projects-container") ! as HTMLDivElement
        projectsContainer.innerHTML=""
       if (completedProjects.length) {
            completedProjects.map((cProject:Required<IProject>)=>{
                    let projectHTML = 
                    ` <div class="card">
                     <h3> Title: ${cProject.title}</h3>
                     <p>Due Date: ${cProject.dueDate}</p>
                     
                 </div>`
                     projectsContainer.innerHTML+= projectHTML          
                 } 
            )
        
       } else {
        projectsContainer.innerHTML+='You have not completed any project'
       }
        
    }
}
//  let userInstance = new User(2)
// userInstance.init()
// userInstance.getLoggedUser()

