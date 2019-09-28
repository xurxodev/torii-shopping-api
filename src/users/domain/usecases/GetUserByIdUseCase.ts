import UserRepository from "../Boundaries";
import User from "../entities/User";

export default class GetUserByIdUseCase {
    private repository: UserRepository;

    constructor(resository: UserRepository) {
        this.repository = resository;
    }

    public execute(userId: string): Promise<User> {
        return this.repository.getByUserId(userId);
    }
}
