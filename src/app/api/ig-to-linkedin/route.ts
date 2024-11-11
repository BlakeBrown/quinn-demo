import { NextResponse } from "next/server";
import { getJson } from "serpapi";
import { OpenAI } from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const MatchConfidenceSchema = z.object({
  match_confidence: z.number(),
});

const openai = new OpenAI();

export async function POST(request: Request) {
  try {
    console.log("receieved request");
    // Get Instagram handle from request body
    const { igHandle } = await request.json();
    console.log("igHandle", igHandle);

    if (!igHandle) {
      return NextResponse.json(
        { error: "Instagram handle is required" },
        { status: 400 }
      );
    }

    // Add Instagram API call
    const instagramUrl = `https://instagram-scraper-api2.p.rapidapi.com/v1/info?username_or_id_or_url=${igHandle}`;
    const instagramOptions = {
      method: "GET",
      headers: {
        "x-rapidapi-key":
          process.env.RAPIDAPI_KEY ||
          "7f4a0454d4mshccd52341a1c0459p15d560jsn44c7b7d8db07",
        "x-rapidapi-host": "instagram-scraper-api2.p.rapidapi.com",
      },
    };

    const instagramResponse = await fetch(instagramUrl, instagramOptions);
    const instagramResult = await instagramResponse.json();
    console.log("instagramResult", instagramResult);
    const instagramFullName = instagramResult.data.full_name;
    console.log("instagramFullName", instagramFullName);
    const instagramBiography = instagramResult.data.biography;
    console.log("instagramBiography", instagramBiography);
    const instagramProfileImageUrl = instagramResult.data.profile_pic_url_hd;
    console.log("instagramProfileImageUrl", instagramProfileImageUrl);

    // const fullName = "Blakelock Brown";
    // const biography =
    //   "2nd time founder, previously CEO @jpgstoreNFT, SWE @instagram, @uwaterloo valedictorian.";

    // const fullName = "Emily Cox";
    // const biography = `budding ecologist, sunset chaser, park lover 🌱🌅🏔`;

    const openAIResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Your going to be given an Instagram biography.
          Your goal is to extract any relevant information for finding that person's LinkedIn: schools, companies, job titles, etc.

          You need to return this in the form of an optional Google search query, which looks like this: "(SCHOOL1 OR JOB1 OR JOB2 OR TITLE1)"

          Just return the list of schools, companies, and job titles separated by the word OR with brackets around it. No additional text.

          Example #1: If the biography contains the text "2019-2021 engineer @instagram", you should return "(Instagram OR engineer)".
          Example #2: If the biography contains "@Yale graduate, @airbnb, pm", you should return "(Yale University OR Airbnb OR product manager)".
          Example #3: If the biography contains "budding ecologist, sunset chaser, park lover 🌱🌅🏔" you should return (ecologist)`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Here is the biography: ${instagramBiography}`,
            },
          ],
        },
      ],
    });

    const searchQuery = openAIResponse.choices[0].message.content;
    // const searchQuery = "(ecologist)";
    console.log("searchQuery", searchQuery);

    const searchResults = await getJson({
      engine: "google",
      q: `${instagramFullName} site:linkedin.com ${searchQuery}`,
      api_key:
        "be911c5f28ab2e734761dbe24264bcc985c31f41e84c24919245550f9e7ea4a0",
    });

    // Filter LinkedIn URLs to only include profile URLs
    const linkedInUrls = searchResults.organic_results
      .map((profile: any) => profile.link)
      .filter((url: string) => {
        // Match URLs that contain /in/ but not /posts/, /pulse/, or /activity/
        return (
          url.match(/linkedin\.com\/in\/[^\/]+$/) &&
          !url.includes("/posts/") &&
          !url.includes("/pulse/") &&
          !url.includes("/activity/")
        );
      })
      .slice(0, 4); // Limit to first 4 results

    // const linkedInUrls = [
    //   "https://www.linkedin.com/in/blakelock",
    //   "https://www.linkedin.com/in/williezhou",
    //   "https://www.linkedin.com/in/william-zhou",
    //   "https://www.linkedin.com/in/wz-ml",
    //   "https://www.linkedin.com/in/w-zhou",
    //   "https://cn.linkedin.com/in/william-zhou-298140154",
    // ];

    // const linkedInUrls = [
    //   "https://www.linkedin.com/in/emily-t-cox",
    //   "https://www.linkedin.com/in/emily-cox-69a32683",
    //   "https://www.linkedin.com/in/emily-cox-974367194",
    //   "https://www.linkedin.com/in/emily-cox-379084180",
    //   "https://www.linkedin.com/in/emily-cox-5a1a7324b",
    // ];
    console.log("linkedInUrls", linkedInUrls);

    // Process all LinkedIn URLs in parallel
    const linkedInProfiles = await Promise.all(
      linkedInUrls.map(async (url: string) => {
        const linkedInUrl = `https://fresh-linkedin-profile-data.p.rapidapi.com/get-linkedin-profile?linkedin_url=${url}`;
        const linkedInOptions = {
          method: "GET",
          headers: {
            "x-rapidapi-key":
              "7f4a0454d4mshccd52341a1c0459p15d560jsn44c7b7d8db07",
            "x-rapidapi-host": "fresh-linkedin-profile-data.p.rapidapi.com",
          },
        };

        const linkedInResponse = await fetch(linkedInUrl, linkedInOptions);
        const linkedInResult = await linkedInResponse.json();
        // console.log("linkedInResult", linkedInResult);

        // Get confidence score for this profile
        const allLinkedInData = [
          linkedInResult.data?.company,
          linkedInResult.data?.full_name,
          linkedInResult.data?.headline,
          linkedInResult.data?.location,
          linkedInResult.data?.school,
        ].join("\n");
        const linkedInProfileImageUrl = linkedInResult.data?.profile_image_url;
        console.log("allLinkedInData", allLinkedInData);

        const allInstagramData = `${instagramFullName}\n${instagramBiography}`;

        const messages = [
          {
            role: "system",
            content: `You will be handed an Instagram profile and a LinkedIn profile.
            Your goal is to determine the match confidence between the two.
            You will return a JSON object with the following fields:
            - match_confidence: a number between 0 and 100 that indicates the match confidence between the two.
            `,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Here is the data we have about their Instagram, followed by their Instagram profile picture: ${allInstagramData}`,
              },
              {
                type: "image_url",
                image_url: {
                  url: instagramProfileImageUrl,
                },
              },
              {
                type: "text",
                text: `Here is the data we have about their LinkedIn${
                  linkedInProfileImageUrl
                    ? ", followed by their LinkedIn profile picture"
                    : ""
                }: ${allLinkedInData}`,
              },
            ],
          },
        ];

        // Only add LinkedIn profile image if it exists
        if (linkedInProfileImageUrl) {
          messages[1].content.push({
            type: "image_url",
            image_url: {
              url: linkedInProfileImageUrl,
            },
          });
        }
        // console.log("messages", messages);

        const matchConfidenceResponse = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages,
          response_format: zodResponseFormat(
            MatchConfidenceSchema,
            "json_object"
          ),
        });

        const content = matchConfidenceResponse.choices[0].message.content;
        console.log("content", content);
        const confidence = JSON.parse(content || "{}").match_confidence;

        return {
          url,
          confidence,
          profileData: linkedInResult.data,
        };
      })
    );

    console.log("linkedInProfiles", linkedInProfiles);

    // Find the profile with highest confidence
    const bestMatch = linkedInProfiles.reduce(
      (max, current) => (current.confidence > max.confidence ? current : max),
      linkedInProfiles[0]
    );
    console.log("bestMatch", bestMatch);

    return NextResponse.json({
      matchConfidence: bestMatch.confidence,
      linkedInUrl: bestMatch.url,
    });

    // return NextResponse.json({ linkedInUrls });
  } catch (error) {
    console.error("Error fetching Instagram profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch Instagram profile" },
      { status: 500 }
    );
  }
}
