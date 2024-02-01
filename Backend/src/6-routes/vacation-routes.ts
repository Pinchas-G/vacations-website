import express, { NextFunction, Request, Response } from "express";
import { addVacation, deleteVacation, updateVacation, getVacation, getVacations } from "../5-services/vacations-service";
import VacationModel from "../2-models/vacation-model";
import { getImagePath } from "../4-utils/file-handler";
import verifyAdmin from "../3-middleware/verify-admin";
import verifyLoggedIn from "../3-middleware/verify-logged-in";

const router = express.Router();

// GET http://localhost:4000/api/vacations?offset=_&limit=_&userId=_
router.get('/', verifyLoggedIn, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, limit, userId, filterBy } = req.query;
        const vacations = await getVacations(+page, +limit, +userId, +filterBy);
        res.json(vacations);
    } catch (error: any) {
        next(error);
    }
})

// GET http://localhost:4000/api/vacations?userId=_&vacationId=_
router.get('/:id([0-9]+)', verifyLoggedIn, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = +req.params.id;
        const userId = +req.query.userId;
        const vacation = await getVacation(id, userId);
        res.json(vacation);
    } catch (error: any) {
        next(error);
    }
})

// POST http://localhost:4000/api/vacations
router.post('/', verifyAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        req.body.image = req.files?.image;
        const vacation = new VacationModel(req.body);
        const savedVacation = await addVacation(vacation);
        res.status(201).json(savedVacation);
    } catch (error: any) {
        next(error);
    }
})

// PUT http://localhost:4000/api/vacations/:id
router.put('/:id([0-9]+)', verifyAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        req.body.id = +req.params.id;
        req.body.image = req.files?.image;
        const vacation = new VacationModel(req.body);
        const editedVacation = await updateVacation(vacation);
        res.json(editedVacation);
    } catch (error: any) {
        next(error);
    }
})

// DELETE http://localhost:4000/api/vacations/:id
router.delete('/:id([0-9]+)', verifyAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = +req.params.id;
        await deleteVacation(id);
        res.sendStatus(204);
    } catch (error: any) {
        next(error);
    }
})

// GET http://localhost:4000/api/vacations/images/:imageName
router.get('/images/:imageName', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const imageName = req.params.imageName;
        const imagePath = getImagePath(imageName);
        res.sendFile(imagePath);
    } catch (error: any) {
        next(error);
    }
})

export default router;
