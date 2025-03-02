const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json()

  if (!response.ok) {
    const error = data.message || response.statusText
    throw new Error(error)
  }

  return data
}

// Authentication functions
export const register = async (name, email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
    credentials: "include",
  })

  return handleResponse(response)
}

export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  })

  return handleResponse(response)
}

export const logout = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  })

  return handleResponse(response)
}

export const checkAuth = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    credentials: "include",
  })

  return handleResponse(response)
}

// Recipe functions
export const getRecipes = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString()
  const url = `${API_BASE_URL}/recipes${queryParams ? `?${queryParams}` : ""}`

  const response = await fetch(url, {
    credentials: "include",
  })

  return handleResponse(response)
}

export const getRecipeById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
    credentials: "include",
  })

  return handleResponse(response)
}

export const createRecipe = async (recipeData) => {
  const response = await fetch(`${API_BASE_URL}/recipes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recipeData),
    credentials: "include",
  })

  return handleResponse(response)
}

export const updateRecipe = async (id, recipeData) => {
  const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(recipeData),
    credentials: "include",
  })

  return handleResponse(response)
}

export const deleteRecipe = async (id) => {
  const response = await fetch(`${API_BASE_URL}/recipes/${id}`, {
    method: "DELETE",
    credentials: "include",
  })

  return handleResponse(response)
}

export const uploadImage = async (file) => {
  const formData = new FormData()
  formData.append("image", file)

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
    credentials: "include",
  })

  return handleResponse(response)
}

// User functions
export const getUserProfile = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    credentials: "include",
  })

  return handleResponse(response)
}

export const updateUserProfile = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/users/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
    credentials: "include",
  })

  return handleResponse(response)
}

// Comment functions
export const addComment = async (recipeId, content) => {
  const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
    credentials: "include",
  })

  return handleResponse(response)
}

// Like functions
export const toggleLike = async (recipeId) => {
  const response = await fetch(`${API_BASE_URL}/recipes/${recipeId}/like`, {
    method: "POST",
    credentials: "include",
  })

  return handleResponse(response)
}

