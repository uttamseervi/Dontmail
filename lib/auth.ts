// Dummy user data for authentication demo
export const users = {
  demoUser: { password: "1234", email: "demo@example.com", phone: "1234567890" },
  somanath: { password: "1234", email: "somanath@example.com", phone: "+1234567890" },
  design: { password: "design123", email: "design@example.com", phone: "+9876543210" },
}

// Auth helper functions
export const checkPassword = (username: string, password: string): boolean => {
  if (!users[username]) return false
  return users[username].password === password
}

export const getUserData = (username: string) => {
  return users[username] || null
}

export const isExistingUser = (username: string): boolean => {
  return !!users[username]
}

export const createUser = (username: string, password: string, email: string, phone: string) => {
  users[username] = { password, email, phone }
  return users[username]
}

export const updateUserProfile = (username: string, email: string, phone: string) => {
  if (users[username]) {
    users[username].email = email
    users[username].phone = phone
    return true
  }
  return false
}

export const resetUserPassword = (username: string, newPassword: string) => {
  if (users[username]) {
    users[username].password = newPassword
    return true
  }
  return false
}
