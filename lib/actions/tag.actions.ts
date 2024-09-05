"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import Tag, { ITag } from "@/database/tag.model";
import Question from "@/database/question.model";
import { FilterQuery } from "mongoose";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Add the tags displayed in the image to the userTags list
    const userTags = [
      { _id: "1", name: "test" },
      { _id: "2", name: "React" },
      { _id: "3", name: "Android" },
      { _id: "4", name: "VSCODE" },
      { _id: "5", name: "VSCODE-EXT" },
      { _id: "6", name: "Node.js" },
      { _id: "7", name: "aws" },
      { _id: "8", name: "amazon" },
      { _id: "9", name: "javascript" },
      { _id: "10", name: "python" },
      { _id: "11", name: "recursion" },
      { _id: "12", name: "sys" },
    ];

    // Shuffle the tags to return different tags each time
    const shuffledTags = userTags.sort(() => 0.5 - Math.random());

    // Return the top two tags (or more, as needed)
    return shuffledTags.slice(0, 2);

  } catch (error) {
    console.error(error);
    throw error;
  }
}


export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase();
    const { searchQuery, filter, page = 1, pageSize = 12 } = params;
    const skipAmount = (page - 1) * pageSize;
    const query: FilterQuery<typeof Tag> = {};

    let sortOptions = {};

    switch (filter) {
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;
      case "popular":
        sortOptions = { questions: -1 };
        break;
      case "name":
        sortOptions = { name: 1 };
        break;
      default:
        break;
    }

    if (searchQuery) {
      query.$or = [{ name: { $regex: searchQuery, $options: "i" } }];
    }
    const totalTags = await Tag.countDocuments(query);
    const tags = await Tag.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);
    const isNext = totalTags > skipAmount + tags.length;
    return { tags, isNext };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    connectToDatabase();

    const { tagId, page = 1, pageSize = 10, searchQuery } = params;
    const skipAmount = (page - 1) * pageSize;

    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        sort: { createdAt: -1 },
        skip: skipAmount,
        limit: pageSize + 1,
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    if (!tag) {
      throw new Error("Tag not found");
    }

    const isNext = tag.questions.length > pageSize;

    const questions = tag.questions;

    return { tagTitle: tag.name, questions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getPopularTags() {
  try {
    connectToDatabase();

    const popularTags = await Tag.aggregate([
      {
        $project: {
          name: 1,
          totalQuestions: { $size: "$questions" },
        },
      },
      { $sort: { totalQuestions: -1 } },
      { $limit: 5 },
    ]);
    return popularTags;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
