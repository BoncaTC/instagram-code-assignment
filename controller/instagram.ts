import axios, { Axios, AxiosError, AxiosResponse } from "axios";
import express, { Request, Response } from "express";
import Joi, { any } from "joi";
import dotenv from "dotenv";
import { UserProfile } from "../models/instagramProfileInterface";

const router = express.Router();
dotenv.config();

const URL_INSTAGRAM: string | undefined = process.env.URL_INSTAGRAM;
const DEFAULT_QUERY_PARAM: string | undefined = process.env.DEFAULT_QUERY_PARM;

router.get("/posts", async (req: Request, res: Response) => {
  const { error } = validateUserDetails(req.query);
  if (error) {
    res.status(400).send(error);
    return;
  }

  const username = String(req.query.username);
  const sessionId = String(req.query.sessionId);

  try {
    res.json(await getPostsByUser(username, sessionId));
  } catch (error: any) {
    res.status(500).send(`${error}`);
  }
});

const getPostsByUser = async (
  username: string,
  session_id: string
): Promise<UserProfile> => {
  const config = {
    headers: {
      Cookie: `sessionid=${session_id}`,
    },
  };

  const userProfile = await getUserProfile(username, config);
  return getPostsFromUserProfile(userProfile.data);
};

const getUserProfile = async (
  username: string,
  config: {}
): Promise<AxiosResponse> => {
  return await axios.get(buildInstagramUrl(username), config);
};

function buildInstagramUrl(username: string): string {
  return `${URL_INSTAGRAM}${username}${DEFAULT_QUERY_PARAM}`;
}

function validateUserDetails(credentials: {}) {
  const schema = Joi.object({
    username: Joi.string().min(1).required(),
    sessionId: Joi.string().min(1).required(),
  });
  return schema.validate(credentials);
}

const getPostsFromUserProfile = (profileData: any): UserProfile => {
  return {
    lastRetrievedDateTime: new Date(),
    biography: profileData.graphql.user.biography,
    fullName: profileData.graphql.user.full_name,
    followersCount: profileData.graphql.user.edge_followed_by.count,
    mostRecentPost: {
      mediaUrl:
        profileData.graphql.user.edge_owner_to_timeline_media.edges[0].node
          .display_url,
      numberOfLikes:
        profileData.graphql.user.edge_owner_to_timeline_media.edges[0].node
          .edge_liked_by.count,
      numberOfComments:
        profileData.graphql.user.edge_owner_to_timeline_media.edges[0].node
          .edge_media_to_comment.count,
      postType:
        profileData.graphql.user.edge_owner_to_timeline_media.edges[0].node
          .__typename,
    },
  };
};

export { router };
