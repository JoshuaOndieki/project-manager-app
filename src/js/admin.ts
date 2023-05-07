import { Project, IProject} from "./project";
import { IUser } from "./user";

type TprojectCategory = 'Unassigned' | 'Assigned' | 'Completed'


export class Admin {
    static userEndPoint = 'http://localhost:3000/users'
    loggedAdmin: number
    constructor(loggedAdmin:number){
       this.loggedAdmin = loggedAdmin;
    }

    init(){
        this.addEvents()
        this.renderAdminData()
        this.renderProjects('Unassigned')
    }

    addEvents() {
        let addForm = document.getElementById('add-project') as HTMLFormElement
        // const formData = new FormData(addForm);
        // const data = Object.fromEntries(formData.entries())
        const title = document.getElementById('new-project-name') as HTMLInputElement
        const dueDate = document.getElementById('new-project-duedate') as HTMLInputElement
        addForm.addEventListener('submit', (event)=>{
            let project:IProject = {
                title: title.value,
                dueDate: dueDate.value,
                status: 'Not Started',
                assignedUser: 0,
                assignedDate: "",
                completedDate: ""
            }
            Project.addProject(project)
        })

        document.getElementById('unassigned-section-btn')!.addEventListener('click', ()=>{
            this.renderProjects('Unassigned')
        })
        document.getElementById('assigned-section-btn')!.addEventListener('click', ()=>{
            this.renderProjects('Assigned')
        })
        document.getElementById('completed-section-btn')!.addEventListener('click', ()=>{
            this.renderProjects('Completed')
        })
    }

    async renderAdminData(){
        let adminData:Partial<IUser>= await this.getUser(this.loggedAdmin)
        if (adminData && adminData.id && adminData.name && adminData.email) {
            document.getElementById('admin-name')!.innerHTML= adminData.name
            document.getElementById('admin-id')!.innerHTML= adminData.id.toString()
            document.getElementById('admin-email')!.innerHTML= adminData.email
        }

    }

    async getUser(userId:number){
        const response = await fetch(Admin.userEndPoint+"/"+ userId)
        const user = await response.json()
        if(user){delete user.password}
        return user
    }

    async getUserByEmail(email:string){
        const response = await fetch(Admin.userEndPoint+'?email='+email)
        return await response.json()

    }
    async getAllUsers(){
        const response = await fetch(Admin.userEndPoint)
        let users = await response.json()
        users = users.map((user:Partial<IUser>)=>{
            delete user.password
            return user
        })
        return users
    }

    async getCategoryProjects(filter:TprojectCategory | false) {
        let projects =  await Project.getProjects()        
        if (filter) {
            switch (filter) {
                case 'Unassigned':
                    projects = projects.filter((project:IProject)=>{
                        return project.status != 'Completed' && !project.assignedUser
                    })
                    break;
                case 'Assigned':
                    projects = projects.filter((project:IProject)=>{
                        return project.status != 'Completed' && project.assignedUser
                    })
                    break;
                case 'Completed':
                    projects = projects.filter((project:IProject)=>{
                        return project.status == 'Completed'
                    })
                default:
                    break;
            }
        }
        
        return projects
    }

    async renderProjects(category:TprojectCategory) {
        let projects = await this.getCategoryProjects(category)        
        let container = document.getElementById('container') as HTMLDivElement
        let html = ``
        container.innerHTML = ''
        projects.forEach((project:IProject) => {            
            let assignedUser = project.assignedUser? project.assignedUser: ''
            let projectHTML = `
            <div class="project-card">
                <div class="project-main-details">
                    <div class="project-id">#${project.id}</div>
                    <div class="project-title">${project.title}</div>
                    <div class="project-status">${project.status}</div>
                </div>
                <div class="project-extra-details">
                    <div class="project-assigned-user">Assigned to: ${assignedUser}</div>
                    <hr>
                    <div class="project-due-date">Due: ${project.dueDate}</div>
                    <div class="project-timestamps">
                        <div class="project-assigned-date">Assigned: ${project.assignedDate}</div>
                        <div class="project-completed-date">Completed: ${project.completedDate}</div>
                    </div>
                    <hr>
                    <div class="project-actions">
                        <button class="project-action project-update-btn">UPDATE</button>
                        <button class="project-action project-delete-btn">DELETE</button>
                    </div>
                </div>
            </div>
        `
        html += projectHTML
        })
        
        if(html) { container.innerHTML = html }
        else { container.innerHTML = `No projects found under ${category}`}

        document.getElementById('current-section')!.innerHTML = category + ' Projects'

        document.querySelectorAll('.selected-section')!.forEach((element:Element) => {
            element.classList.remove('selected-section')            
        })
        document.getElementById(category.toLowerCase()+'-section-btn')!.classList.add('selected-section')
    }
}

