import { User } from "../domain/models/User";

/**
 * ユーザー登録サービスインターフェイス
 */
export interface IRegisterUserService {
    /**
     * ユーザー名またはメールアドレスが既に存在するかチェックする
     * @param username ユーザー名
     * @param email メールアドレス
     */
    checkExists(username: string, email: string): Promise<void>;
    /**
     * ユーザーを登録する
     * @param user 登録ユーザー
     */
    register(user: User): Promise<void>;
}