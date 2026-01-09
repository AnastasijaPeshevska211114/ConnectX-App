'use server'

import { FilterQuery, SortOrder } from "mongoose";
import Group from "../models/group.model";
import Tweet from "../models/tweet.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface createGroupParams {
    id: string,
    name  : string;
    username: string;
    image: string;
    createdById: string;
}
export const createGroup = async (
    {
      id,
      name,
      username,
      image,
      createdById,
    }: createGroupParams 
  ) =>  {
    try {
      connectToDB();
  
      const user = await User.findOne({ id: createdById });
  
      if (!user) {
        throw new Error("User not found"); 
      }
  
      const newGroup = new Group({
        id,
        name,
        username,
        image,
        createdBy: user._id, 
      });
  
      await newGroup.save();
  
      
  
    } catch (error) {
      console.error("Error creating group:", error);
      throw error;
    }
  }

  export const addMemberToGroup = async (
    groupId: string,
    memberId: string
  ) => {
    try {
      connectToDB();
  
      const group = await Group.findOne({ id: groupId });
  
      if (!group) {
        throw new Error("Group not found");
      }
  
      const user = await User.findOne({ id: memberId });
  
      if (!user) {
        throw new Error("User not found");
      }
  
      if (group.members.includes(user._id)) {
        throw new Error("User is already a member of the group");
      }
  
      group.members.push(user._id);
      await group.save();
  
      user.groups.push(group._id);
      await user.save();
  
      return group;
    } catch (error) {
      console.error("Error adding member to group:", error);
      throw error;
    }
  }


  export const removeUserFromGroup = async (
    userId: string,
    groupId: string
  ) => {
    try {
      connectToDB();
  
      const userIdObject = await User.findOne({ id: userId }, { _id: 1 });
      const groupIdObject = await Group.findOne(
        { id: groupId },
        { _id: 1 }
      );
  
      if (!userIdObject) {
        throw new Error("User not found");
      }
  
      if (!groupIdObject) {
        throw new Error("Group not found");
      }

      await Group.updateOne(
        { _id: groupIdObject._id },
        { $pull: { members: userIdObject._id } }
      );
  
      await User.updateOne(
        { _id: userIdObject._id },
        { $pull: { groups: groupIdObject._id } }
      );
  
      return { success: true };
    } catch (error) {
      console.error("Error removing user from group:", error);
      throw error;
    }
  }

  export const updateGroupInfo = async(
    groupId: string,
    name: string,
    username: string,
    image: string
  ) => {
    try {
      connectToDB();
  
      const updatedGroup = await Group.findOneAndUpdate(
        { id: groupId },
        { name, username, image }
      );
  
      if (!updatedGroup) {
        throw new Error("Group not found");
      }
  
      return updatedGroup;
    } catch (error) {
   
      console.error("Error updating group information:", error);
      throw error;
    }
  }

  export const deleteGroup = async (groupId: string) => {
    try {
      connectToDB();
  
     
      const deletedGroup = await Group.findOneAndDelete({
        id: groupId,
      });
  
      if (!deletedGroup) {
        throw new Error("Group not found");
      }

      await Tweet.deleteMany({ group: groupId });
  
   
      const groupUsers = await User.find({ groups: groupId });
  
   
      const updateUserPromises = groupUsers.map((user) => {
        user.groups.pull(groupId);
        return user.save();
      });
  
      await Promise.all(updateUserPromises);
  
      return deletedGroup;
    } catch (error) {
      console.error("Error deleting group: ", error);
      throw error;
    }
  }

  export const fetchGroups = async ({
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = "desc",
  }: {
    searchString?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: SortOrder;
  }) => {
    try {
      connectToDB();
  
      const skipAmount = (pageNumber - 1) * pageSize;
  
      const regex = new RegExp(searchString, "i");
  
      const query: FilterQuery<typeof Group> = {};
  
      if (searchString.trim() !== "") {
        query.$or = [
          { username: { $regex: regex } },
          { name: { $regex: regex } },
        ];
      }
  
      const sortOptions = { createdAt: sortBy };
  
      const groupsQuery = Group.find(query)
        .sort(sortOptions)
        .skip(skipAmount)
        .limit(pageSize)
        .populate("members");
  
      const totalGroupsCount = await Group.countDocuments(query);
  
      const groups = await groupsQuery.exec();
  
      const isNext = totalGroupsCount > skipAmount + groups.length;
  
      return { groups, isNext };
    } catch (error) {
      console.error("Error fetching groups:", error);
      throw error;
    }
  }

  export const fetchGroupPosts = async (id: string) => {
    try {
      connectToDB();
  
      const groupPosts = await Group.findById(id)
    .populate({
      path: "tweets",
      model: Tweet,
      options:  { 
        sort: { createdAt: 'desc' } 
    
    }, 
      populate: [
        {
          path: "author",
          model: User,
          select: "name image id", 
        },
        {
          path: 'retweetOf', 
          populate: {
            path: 'author',
            model: User,
            select: '_id name image',
          },
        },
        {
          path: "children",
          model: Tweet,
          populate: {
            path: "author",
            model: User,
            select: "image _id", 
          },
        },
      ],
    });
  
  
      return groupPosts;
    } catch (error) {
      console.error("Error fetching group posts:", error);
      throw error;
    }
  }

  export const fetchGroupDetails = async (id: string) => {
    try {
      connectToDB();
  
      const groupDetails = await Group.findOne({ id }).populate([
        "createdBy",
        {
          path: "members",
          model: User,
          select: "name username image _id id",
        },
      ]);
  
      return groupDetails;
    } catch (error) {
      console.error("Error fetching group details:", error);
      throw error;
    }
  }