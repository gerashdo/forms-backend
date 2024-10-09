import { Request, Response } from "express";
import { getAllTags } from "../services/tagService";
import { handleControllerError } from "../helpers/errorHandler";


export const getAllTagsController = async (req: Request, res: Response) => {
  try {
    const tags = await getAllTags();
    res.status(200).json({
      ok: true,
      data: tags,
    });
  } catch (error) {
    handleControllerError(res, error);
  }
}
