export interface AuthFormData {
    firstName?: string;
    lastName?: string;
    email: string;
    password: string;
}

export interface IUser {
    
        email: string,
        password: string,
        profilePicture?: string,
        _id?:string,
        accessToken?:string,
        refreshToken?: string,
        firstName?:string,
        lastName?:string
    
}

export interface IAdmin {
    email: string,
    password: string,
    profilePicture?: string,
    _id?:string,
    accessToken?:string,
    refreshToken?: string,
    firstName?:string,
    lastName?:string,
    role: 'admin'
}

export interface IEvent {
    title: string,
    description: string,
    date: Date,
    location: string,
    _id?: string,
    participants?: { _id: string}[],
    createdBy: string,
    hobby:  string[],
    image?: string,
    likes?: string[],
    comments?:string[]
}

export interface IHobby {
    name: string,
    category: string,
    users?: string[]
}