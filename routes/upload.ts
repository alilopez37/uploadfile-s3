import express from 'express'
import * as uploadController from '../controllers/upload';

export const uploadRouter = express.Router()


uploadRouter.post("/", uploadController.saveFile)