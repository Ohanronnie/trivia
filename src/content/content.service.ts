import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Content, ILink, IQuestions } from './content.schema';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { link } from 'fs';
// Interface for Text and URL Inputs
export interface TextInputs {
  bio: string; // User Bio
  iframe?: string; // Embedded content URL
  // YouTube URL
  instagram?: string; // Instagram URL
  twitter?: string;
  facebook?: string; // Twitter URL
  question1: string; // Question 1
  'opt-1-quest-1': string; // Option A for Question 1
  'opt-2-quest-1': string; // Option B for Question 1
  'opt-3-quest-1': string; // Option C for Question 1
  'opt-4-quest-1': string; // Option D for Question 1
  question2?: string; // Question 2
  'opt-1-quest-2'?: string; // Option A for Question 2
  'opt-2-quest-2'?: string; // Option B for Question 2
  'opt-3-quest-2'?: string; // Option C for Question 2
  'opt-4-quest-2'?: string; // Option D for Question 2
  question3?: string; // Question 3
  'opt-1-quest-3'?: string; // Option A for Question 3
  'opt-2-quest-3'?: string; // Option B for Question 3
  'opt-3-quest-3'?: string; // Option C for Question 3
  'opt-4-quest-3'?: string; // Option D for Question 3
  image: string;
  prize1: string;
  prize2?: string;
  prize3?: string;
}

export class ContentService {
  constructor(
    @InjectModel(Content.name) private contentModel: Model<Content>,
    private userService: UserService,
  ) {}

  async createContent(userId: any, content: TextInputs) {
    try {
      const { bio, image, facebook, instagram, twitter } = content;
      console.log(bio, image)
      if (bio && image) {
        await this.userService.updateBio(userId, bio, image);
      }
      const links: Array<ILink> = [
        {
          type: 'facebook',
          url: facebook,
        },
        { type: 'instagram', url: instagram },
        { type: 'twitter', url: twitter },
      ];
      let questions: Array<IQuestions> = [
        {
          question: content.question1,
          options: [
            content['opt-1-quest-1'],
            content['opt-2-quest-1'],
            content['opt-3-quest-1'],
            content['opt-4-quest-1'],
          ],
        },
      ];
      if (content.question2) {
        questions.push({
          question: content.question2,
          options: [
            content['opt-1-quest-2'],
            content['opt-2-quest-2'],
            content['opt-3-quest-2'],
            content['opt-4-quest-2'],
          ],
        });
      }
      if (content.question3) {
        questions.push({
          question: content.question3,
          options: [
            content['opt-1-quest-3'],
            content['opt-2-quest-3'],
            content['opt-3-quest-3'],
            content['opt-4-quest-3'],
          ],
        });
      }
      const QUESTIONS = [];
      for (let quest of questions) {
        QUESTIONS.push({
          question: quest.question,
          options: quest.options.filter((val) => val && val.length > 2),
        });
      }
      const prizes = [content.prize1, content.prize2, content.prize3].filter(
        (val) => val,
      );

      const newContent = await this.contentModel.create({
        user: userId,
        iframe: content.iframe,
        links,
        questions: QUESTIONS,
        prizes,
      });
      let kContent = await this.contentModel.findById(newContent._id).populate('user');
      return { contentId: newContent._id, username: kContent.user.username };
    } catch (err: any) {
      console.log(err);
      return false;
    }
  }
  async getContent(username: string, contentId: any) {
    try {
      const content = await this.contentModel
        .findById(contentId)
        .populate('user');
        console.log(content)
      if (!content) return null;
      if (content.user.username != username) return false;
      return {
        username: content.user.username,
        cover: content.user.cover,
        bio: content.user.bio,
        iframe: content.iframe,
        links: content.links,
        questions: content.questions,
        prizes: content.prizes,
      };
    } catch (err: any) {}
  }
}
