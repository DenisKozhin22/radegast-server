export class UserDto {
	email
	id
	isAdmin
	name
	constructor(model) {
		this.email = model.email
		this.name = model.name
		this.id = model._id
		this.isAdmin = model.isAdmin
	}
}
