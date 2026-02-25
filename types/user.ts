export interface LoginUser {
	email: string
	password: string
}

export interface RegisterUser {
	name: string
	email: string
	password: string
}

export interface UserPayload {
	name?: string
	email: string
	password: string
}
