import { buildInstagramUrl } from "../controller/instagram";
import { getPostsFromUserProfile } from "../controller/instagram";
import { getUserProfile } from "../controller/instagram";
import { PROFILE_MOCK_DATA } from "../mock/profileMock";
import { app } from "../src/app";
import { format } from "date-fns";
import axios from "axios";
import request from "supertest";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
const URL_INSTAGRAM = "https://www.instagram.com/";
const DEFAULT_QUERY_PARAM = "/channel?__a=1";
const username = "simonahalep";

describe("Test root path", () => {
  test("Retruns HTTP 200 if path routed correctly", () => {});
  request(app)
    .get("/instagram/")
    .then((response) => {
      expect(response.statusCode).toBe(200);
    });
});

describe("Test retrieve user profile from instagram api", () => {
  test("returns user profile when called", async () => {
    const config = {
      headers: {
        Cookie: "sessionid=1816607895%3AuD4uLGzQCUeSai%3A9",
      },
    };
    const mockInstagramResponse = buildInstagramResponse(
      200,
      { "content-type": "application/json" },
      { data: PROFILE_MOCK_DATA }
    );
    mockedAxios.get.mockResolvedValueOnce(mockInstagramResponse);
    const response = await getUserProfile(username, config);
    expect(response).toBe(mockInstagramResponse);
  });
});

describe("Test build instagram url", () => {
  test("return instagram url for user", () => {
    expect(buildInstagramUrl(username)).toBe(
      `${URL_INSTAGRAM}${username}${DEFAULT_QUERY_PARAM}`
    );
  });
});

describe("Test extraction of needed data from user profile", () => {
  test("returns object of user profile", () => {
    expect(getPostsFromUserProfile(PROFILE_MOCK_DATA)).toStrictEqual(
      USER_PROFILE_RESPONSE
    );
  });
});

const buildInstagramResponse = (
  status: number,
  headers: any,
  body: any
): any => {
  return { status, headers, body };
};

const USER_PROFILE_RESPONSE = {
  lastRetrievedDateTime: format(new Date(), "yyyy-MM-dd"),
  biography: "Professional tennis player 🙃",
  fullName: "Simona Halep",
  followersCount: 1697048,
  mostRecentPost: {
    mediaUrl:
      "https://instagram.fclj1-2.fna.fbcdn.net/v/t51.2885-15/275222329_4869762259771582_1049193220493076972_n.jpg?stp=dst-jpg_e35&_nc_ht=instagram.fclj1-2.fna.fbcdn.net&_nc_cat=110&_nc_ohc=4XeZUbYb0CUAX_4rAYR&edm=ABfd0MgBAAAA&ccb=7-4&oh=00_AT-c4iZ_eJGqxD3nsUza8M-UcMArsX6_Mm2DOm2O1XX9jA&oe=622C849A&_nc_sid=7bff83",
    numberOfLikes: 32855,
    numberOfComments: 184,
    postType: "GraphVideo",
  },
};
