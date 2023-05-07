import { Project, IProject} from "./project";
import { IUser } from "./user";

export class Admin {
    static userEndPoint = 'http://localhost:3000/users'
    loggedAdmin: number
    constructor(loggedAdmin:number){
       this.loggedAdmin = loggedAdmin;
    }

    init(){
        this.renderAdminData()
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
}