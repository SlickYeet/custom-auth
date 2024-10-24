"use client"

import { useFormState } from "react-dom"

import { signUp } from "./actions"

const initialState = {
  message: "",
}

export function SignUpForm() {
  const [state, action] = useFormState(signUp, initialState)

  return (
    <form action={action} className="flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-1">
        <label className="text-xs">Username</label>
        <input
          type="text"
          name="name"
          placeholder="Username..."
          className="rounded-none border-b border-neutral-500 bg-transparent placeholder:text-neutral-500"
        />
      </div>

      <div className="flex flex-col gap-y-1">
        <label className="text-xs">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Email..."
          className="rounded-none border-b border-neutral-500 bg-transparent placeholder:text-neutral-500"
        />
      </div>

      <div className="flex flex-col gap-y-1">
        <label className="text-xs">Password</label>
        <input
          type="password"
          name="password"
          placeholder="********"
          className="rounded-none border-b border-neutral-500 bg-transparent placeholder:text-neutral-500"
        />
      </div>

      <button type="submit" className="w-full rounded-sm bg-blue-500">
        Sign Up
      </button>

      <p className="text-xs text-red-500">{state.message}</p>
    </form>
  )
}
