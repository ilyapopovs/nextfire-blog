import { Context, createContext } from "react";
import { UserInterface } from "structures/userModel";

export const UserContext: Context<{ user?: UserInterface; username?: string }> =
  createContext({
    user: null,
    username: null,
  });
