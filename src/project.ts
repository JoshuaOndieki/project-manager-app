 interface IProject{
    id?:number
    title:string
    assignedUser:string
    status:('Not Started'| 'In Progress' | 'Completed')
    dueDate:string
 }
 
 
 
 export class Project{
    // http://localhost:3000/projects
    addProject(project:IProject){
        // receives a project object posts and returns true if successful otherwise false
        //fetch method POST


    }
    getProject(id:number){
        //fetches project with the id 
        //fetch method GET

    }
    getProjects(){
        //fetches all project 
        //fetch method GET

    }
    getUserProjects(userId:number){
        //fetch method GET 
        //for a specific user 
    }
    deleteProject(id:number){
        //fetch method DELETE

    }
    updateProject(id:number, project:Partial<IProject>){
        //fetch method PATCH

    }

    

}

