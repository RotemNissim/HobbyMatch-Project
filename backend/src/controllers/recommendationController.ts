import { Request, Response } from "express";
import OpenAI from "openai";
import User from "../models/User.models";
import Event from "../models/Event.models";


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const getEventRecommendation = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).populate("hobbies");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // קבלת התחביבים של המשתמש
    const userHobbies = user.hobbies.map((hobby) => hobby).join(", ");
    
    // קבלת אירועים קרובים
    const events = await Event.find({ date: { $gte: new Date() } })
                              .limit(10)
                              .populate("hobby");

    const eventDescriptions = events.map((event) => ({
      title: event.title,
      description: event.description,
      hobby: event.hobby,
    }));

    // יצירת השאלה ל-GPT
    const prompt = `The user is interested in the following hobbies: ${userHobbies}.
    Here are upcoming events: ${JSON.stringify(eventDescriptions)}.
    Recommend the most suitable event for the user.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    return res.json({ recommendation: response.choices[0].message.content });
  } catch (error) {
    console.error("Error generating recommendation:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
