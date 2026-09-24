import { create } from "zustand";
import { persist } from "zustand/middleware";
interface UserInfo{
    token: string,
    session: string,
    username: string,
    _id: string,
    __v: number
}
interface Reduce {
count: number;
setcount: (val: number) => void;
session: UserInfo | null;
setsession: (val: UserInfo) => void
}
export const Zustand = create(persist<Reduce>((set) =>({
    count: 0,
    setcount: (val) => set({count: val}),
    session: null,
    setsession:(val: UserInfo) => set({session: val})
}),{name: "personal"}))


