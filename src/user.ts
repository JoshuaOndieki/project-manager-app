// interface IProject{
//     id?:number
//     title:string 
//     DueDate:string
//     status:('Not Started' | 'In Progress' | 'Completed')
// }



// import {Project} from './project'

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
}

User.userSignup({name:'Belinda5',email:'belinda1@jitu',password:'belind7aaa'})

