import axios, { Axios, AxiosError, AxiosResponse } from "axios";
import express, { Request, response, Response } from "express";
import Joi, { any, boolean } from "joi";
import dotenv from "dotenv";
import { UserProfile } from "../models/instagramProfileInterface";
import { PROFILE_MOCK_DATA } from "../mock/profileMock";
import { format } from "date-fns";

const router = express.Router();
dotenv.config();

const URL_INSTAGRAM: string | undefined = process.env.URL_INSTAGRAM;
const DEFAULT_QUERY_PARAM: string | undefined = process.env.DEFAULT_QUERY_PARM;

router.get("/", async (req: Request, res: Response): Promise<Response> => {
  return res.status(200);
});

router.get("/posts", async (req: Request, res: Response): Promise<Response> => {
  const { error } = validateUserDetails(req.query);
  if (error) {
    return res.status(400).send(error);
  }

  const username = String(req.query.username);
  const sessionId = String(req.query.sessionId);

  try {
    return res.json(await getPostsByUser(username, sessionId));
  } catch (error: any) {
    return res.status(500).send(`${error}`);
  }
});

/**
 * Queries instagram API for user profile data.
 * @param username
 * @param session_id
 * @returns A object with requested information about the user.
 */
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
  if (isLoginRedirect(userProfile)) {
    return getPostsFromUserProfile(PROFILE_MOCK_DATA);
  }
  return getPostsFromUserProfile(userProfile.data);
};

export const getUserProfile = async (
  username: string,
  config: {}
): Promise<AxiosResponse> => {
  return await axios.get(buildInstagramUrl(username), config);
};

export function buildInstagramUrl(username: string): string {
  return `${URL_INSTAGRAM}${username}${DEFAULT_QUERY_PARAM}`;
}
/**
 * Joi library used to validate input data.
 * @param credentials - user credentials = username and seesionid.
 * @returns error if erroneous data was received.
 */
function validateUserDetails(credentials: {}) {
  const schema = Joi.object({
    username: Joi.string().min(1).required(),
    sessionId: Joi.string().required(),
  });
  return schema.validate(credentials);
}

/**
 * The method checks if the request is redirected to the instagram login page.
 * @param response resulted from axios get request.
 * @returns true - if the request had been redirected
            false - if the request was not redirected
 */
const isLoginRedirect = (response: AxiosResponse): boolean => {
  let result: boolean = true;
  const responseType: string = response.headers["content-type"];

  if (responseType && responseType.includes("application/json")) {
    result = false;
    return result;
  }
  return result;
};

export const getPostsFromUserProfile = (profileData: any): UserProfile => {
  return {
    lastRetrievedDateTime: format(new Date(), "yyyy-MM-dd"),
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
