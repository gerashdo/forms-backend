import { Request, Response } from "express";
import { getAllTopics } from "../services/topicService";
import { handleControllerError } from "../helpers/errorHandler";


export const getAllTopicsController = async (req: Request, res: Response) => {
  try {
    const topics = await getAllTopics();
    res.status(200).json({
      ok: true,
      data: topics,
    });
  } catch (error) {
    handleControllerError(res, error);
  }
}
