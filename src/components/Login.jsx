import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import authService from "../appwrite/auth";
import { login as setSession } from "../store/authSlice";
import { Button, Input, Logo } from "./index";

export default function Login() {
    const navigate = useNavigate(); const dispatch = useDispatch(); const [serverError, setServerError] = useState(""); const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const submit = async (credentials) => { setServerError(""); try { await authService.login(credentials); const userData = await authService.getCurrentUser(); if (!userData) throw new Error("Your session could not be restored."); dispatch(setSession({ userData })); navigate("/"); } catch (error) { setServerError(error.message); } };
    return <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-7 shadow-xl shadow-slate-200/60 dark:shadow-slate-950/40 sm:p-9"><div className="mb-8"><Logo /><h1 className="mt-7 text-2xl font-bold tracking-tight text-foreground">Welcome back</h1><p className="mt-2 text-sm text-muted-foreground">Sign in to return to your writing workspace.</p></div>{serverError && <p role="alert" className="mb-5 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{serverError}</p>}<form onSubmit={handleSubmit(submit)} className="space-y-5"><Input label="Email address" type="email" autoComplete="email" placeholder="you@example.com" error={errors.email?.message} {...register("email", { required: "Enter your email address", pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address" } })} /><Input label="Password" type="password" autoComplete="current-password" placeholder="Your password" error={errors.password?.message} {...register("password", { required: "Enter your password" })} /><Button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 text-white hover:bg-indigo-700">{isSubmitting ? "Signing in…" : "Sign in"}</Button></form><p className="mt-7 text-center text-sm text-muted-foreground">New to Inkwell? <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-700">Create an account</Link></p></div>;
}
