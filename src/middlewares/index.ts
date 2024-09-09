import express from "express";
import { get, merge } from "lodash";

import { getUserById, getUserBySessiionToken } from "../db/users";

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as string;
console.log("ASDS", id, currentUserId.toString());
    if (id !== currentUserId.toString()) {
      console.log("IS NOT OWNER");
      return res.sendStatus(403);
    }
    if (currentUserId.toString() !== id) {
      return res.sendStatus(403);
    }

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["KWES-AUTH"];
    console.log(sessionToken);
    if (!sessionToken) {
      console.log("no session token");
      return res.sendStatus(403);

    }

    console.log(req.params["id"])

    const existingUser = await getUserById(req.params["id"]);

    if (!existingUser) {
      console.log("USER!");
      return res.sendStatus(403);
    }

    console.log(existingUser);
    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
