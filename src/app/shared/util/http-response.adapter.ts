import { Response } from "express";

export class HttpResponse {
    public static fieldNotProvided(res: Response, field: string) {
        return res.status(400).send({
            ok: false,
            message: `${field} not provided`,
        });
    }
}
