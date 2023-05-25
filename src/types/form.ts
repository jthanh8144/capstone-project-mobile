export type AuthFormData = {
  email: string
  password: string
  confirmPassword?: string
  fullName?: string
}

export type EditProfileFormData = {
  email?: string
  fullName: string
}

export type UpdatePasswordFormData = {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}
