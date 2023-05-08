import { Admin } from './admin'
import {User, IUser} from './user'
import { DateUtil } from './utils/date'
import { generateUUID } from './utils/hash'

const Admin1 = Admin


interface Isession{
    id?:number
    userId:number,
    token:string,
    expiryDate:string,
    revoked:boolean
}

interface IStoredSession {
    id:number,
    token:string
}

interface ILoggedUser{
    id:number,
    role:'Admin' | 'User',
}


class App {
    sessionsUrl = 'http://localhost:3000/sessions'
    origin;
    route;
    constructor(){
        this.origin = window.location.origin
        this.route = window.location.href
        this.init()
    }

    async init(){
        let storedSession = this.getStoredSession()
        let userData;
        if (storedSession) {
            let sessionData:Isession = await this.getSession(storedSession)
            
            if (sessionData && !sessionData.revoked && new Date() < new Date(sessionData.expiryDate)) {
                userData = await new User(sessionData.userId).getLoggedUser()
            }
        }

        this.globalEvents()
        this.router(userData)
    }

    dashboardpath(dashboardType:'admin'|'user') {
        let dashboardpath = this.route.includes(`/html/${dashboardType}.html`)?null: this.origin + `/html/${dashboardType}.html`        
        if (dashboardpath) { window.location.href = dashboardpath}
    }

    router(userData:Partial<IUser>){
        if (userData) {
            switch (userData.role) {
                case 'Admin':
                    this.dashboardpath('admin')
                    if(userData && userData.id){                            
                        new Admin(userData.id).init()
                    }
                    this.dashboardEvents()
                    break;
                    case 'User':
                        this.dashboardpath('user')
                        if(userData && userData.id){                            
                            new User(userData.id).init()
                        }
                        this.dashboardEvents()
                default:
                    break;
            }   
        } else {
            let toLogin = this.route.includes('admin.html') || this.route.includes('user.html')? true: false
            if (toLogin) {
                window.location.href = '/html/signin.html'
            }
        }

        if (this.route.includes('signup.html')) {
            this.signupEvents()
        }
        if (this.route.includes('signin.html')) {
            this.signinEvents()
        }
        if (this.route.includes('forgot-password.html')) {
            this.resetPasswordEvents()
        }
 

    }

    confirmPassword(event:SubmitEvent, password:FormDataEntryValue, confirmPassword:FormDataEntryValue) {
        if (password != confirmPassword) {
            event.preventDefault()
            alert('Confirm Password Does Not Match')
            return false
        }
        return true
    }

    async signupAction(event:SubmitEvent, signupForm:HTMLFormElement) {
        event.preventDefault()
        const formData = new FormData(signupForm);
        const data = Object.fromEntries(formData.entries())
        if (this.confirmPassword(event, data.password, data['confirm-password'])) {
            // delete data['confirm-password']
            let userData = {
                name: data.name.toString(),
                email: data.email.toString(),
                password: data.password.toString()
            }
            
            let response = await User.userSignup(userData)  
            console.log('response', response);
            if (response && response.ok) {
                window.location.href = '/html/signin.html'
            }else{
                alert('Error signing up')
            }
        }
    }

    async signinAction(event:SubmitEvent, signinForm:HTMLFormElement) {
        event.preventDefault()
        const formData = new FormData(signinForm)
        let data = Object.fromEntries(formData.entries())
        let email = data.email.toString()
        let password = data.password.toString()
        let user = await User.userSignin(email, password)
        
        if (user && user.id) {
            await this.addSession(user.id)
            location.reload()
        }else{
            alert('Error signing in')
        }

        
    }

    async resetPasswordAction(event:SubmitEvent, resetForm:HTMLFormElement) {
        event.preventDefault()
        const formData = new FormData(resetForm)
        const data = Object.fromEntries(formData.entries())
        if (this.confirmPassword(event, data.password, data['confirm-password'])) {
            let email = document.getElementById('email') as HTMLInputElement
            let newPassword = document.getElementById('password') as HTMLInputElement
            let user = (await User.getUserByEmail(email.value))[0]
            
            if (Object.keys(user).length) {
                let response = await fetch(Admin.userEndPoint+'/'+user.id,{
                    method: "PATCH",
                    headers: {
                        'Content-Type': "application/json"
                    },
                    body: JSON.stringify({"password":newPassword.value})
                })
                if(response.ok){
                    alert('Successfully update password')
                }
            }else{
                alert('user does not exist')
            }
        }else{
            alert('Confirm Password does not match')
        }

    }

    globalEvents(){
        (document.getElementById('logo') as HTMLDivElement).addEventListener('click', ()=>{
            let homepagePath = this.route.includes('index.html') ? null: this.origin + '/index.html'
            if (homepagePath) { window.location.href = homepagePath}
            if (this.route.includes('admin.html') || this.route.includes('user.html')) {
                location.reload()
            }
        })
    }

    async dashboardEvents() {
        let signOutElement = document.getElementById('sign-out') as HTMLButtonElement
        signOutElement.addEventListener('click', async (event)=>{
            event.preventDefault()
            let storedSession = this.getStoredSession()
            if (storedSession) {
                await this.revokeSession(storedSession)
                location.reload()
            }
        })
    }

    signupEvents() {
        let signupForm = document.getElementById('form') as HTMLFormElement
        signupForm.addEventListener('submit', (event)=>{
            this.signupAction(event, signupForm)
        })
    }

    signinEvents() {
        let signinForm = document.getElementById('signin-form') as HTMLFormElement
        signinForm.addEventListener('submit', (event)=>{
            this.signinAction(event, signinForm)
        })
    }

    resetPasswordEvents() {
        let resetForm = document.getElementById('forgot-password-form') as HTMLFormElement
        resetForm.addEventListener('submit', (event)=>{
            this.resetPasswordAction(event, resetForm)
        })
    }

    
    getStoredSession() {
        let id = (localStorage.getItem('pma-session-user-id'))
        let token = localStorage.getItem('pma-session-token')
        let session = id && token? {id:+id, token} : undefined
        return session
    }

    async getSession(storedSession:IStoredSession) {
        let response = await fetch(this.sessionsUrl+'?userId='+storedSession.id+'&token='+storedSession.token)
        let sessionData:Isession = (await response.json())[0]
        return sessionData
    }

    async addSession(userId:number) {
        let token = generateUUID()
        let currentDate = new Date()
        let expiryDate = DateUtil.formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 30))
        let session:Isession = {
            userId,
            token,
            revoked: false,
            expiryDate
        }
        let response = await fetch(this.sessionsUrl,{
            method:"POST",
            body: JSON.stringify(session),
                headers: {
                    "Content-Type": 'application/json'
                }
            })
        
            console.log(response);
            
        if (response.ok) {
            localStorage.setItem('pma-session-user-id', userId.toString())
            localStorage.setItem('pma-session-token', token)
        }
    }

    async revokeSession(storedSession:IStoredSession) {
        let session = await this.getSession(storedSession)
        if (session) {
            let response = await fetch(this.sessionsUrl+'/'+session.id,{
                method:"PATCH",
                body: JSON.stringify({revoked:true}),
                    headers: {
                        "Content-Type": 'application/json'
                    }
                })
        if (response.ok) {
            localStorage.removeItem('pma-session-token')
            localStorage.removeItem('pma-session-user-id')
        }
        return response.status
        }

    }
}

let myapp = new App()

