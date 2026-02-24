export interface LoginUser {
	email: string
	password: string
}

export interface RegisterUser {
	name: string
	email: string
	password: string
}

// Generic user payload where `name` may be optional in some contexts
export interface UserPayload {
	name?: string
	email: string
	password: string
}
