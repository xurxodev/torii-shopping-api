import * as dotenv from "dotenv";
import * as hapi from "hapi";
import * as jwt from "jsonwebtoken";
import UserRepository from "../../data/users/UserEnvRepository";
import User from "../../domain/users/entities/User";
import GetUserByIdUseCase from "../../domain/users/usecases/GetUserByIdUseCase";

dotenv.config();

const jwtSecretKey = process.env.JWT_SECRET_KEY;

const userRespository = new UserRepository();
const getProductByIdUseCase = new GetUserByIdUseCase(userRespository);

const jwtAutentication = {
    name: "jwt Authentication",
    secretKey: jwtSecretKey,
    validateHandler: async (decoded, request, h) => {
        const user = await getProductByIdUseCase.execute(decoded.userId);

        if (user) {
            return { isValid: true };
        } else {
            return { isValid: false };
        }
    },
    generateToken: (user: User) => {
        return jwt.sign({
            userId: user.userId
          }, jwtSecretKey, {expiresIn: "24h"});
    }
};

export default jwtAutentication;
