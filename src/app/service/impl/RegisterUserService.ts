import { TYPES } from "@/app/di/types";
import { inject, injectable } from "inversify";
import type { IRegisterUserService } from "../IRegisterUserService";
import type { IUserRepository } from "@/app/domain/repository/IUserRepository";
import type { User } from "@/app/domain/models/User";

/**
 * ユーザー登録サービス実装クラス
 */
@injectable()
export class RegisterUserService implements IRegisterUserService {
    private userRepository: IUserRepository;
    /**
     * コンストラクタ
     * @param userRepository UserRepository のインスタンスを注入する
     */
    constructor(
        @inject(TYPES.IUserRepository) userRepository: IUserRepository
    ) {
        this.userRepository = userRepository;
    }

    /**
     * ユーザー名またはメールアドレスが既に存在するかチェックする
     * @param username ユーザー名
     * @param email メールアドレス
     */
    async checkExists(username: string, email: string): Promise<void> {
        // リポジトリの処理をそのまま呼び出す
        await this.userRepository.checkExists(username, email);
    }

    /**
     * ユーザーを登録する
     * @param user 登録ユーザー
     */
    async register(user: User): Promise<void> {
        // リポジトリの処理をそのまま呼び出す
        await this.userRepository.register(user);
    }
}