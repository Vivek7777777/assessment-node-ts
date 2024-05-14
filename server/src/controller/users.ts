import express, { Request, Response } from 'express';
import User from '../model/user';


export const getUsers = async (req: Request, res: Response) => {
    try{
        const data = await User.find().select({__v: 0, password: 0})
        console.log(data);
        res.status(200).send(data);
    }
    catch{
        (err: unknown) => {
            res.status(500).send({message: err});
        }
    }
}