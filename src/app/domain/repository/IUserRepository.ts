import { User } from "../models/User";

/**
 * ユーザーリポジトリインターフェース
 */
export interface IUserRepository {
   /**
     * 指定したユーザー名またはメールアドレスが既に存在するかチェックする
     * @param username ユーザー名
     * @param email メールアドレス
     * @exception 重複チェック処理に失敗した場合は例外をスローする 
     */
    checkExists(username: string, email: string): Promise<void>;
    /**
     * ユーザーを登録する
     * @param user 登録ユーザー
     * @exception ユーザー登録処理に失敗や重複があった場合は例外をスローする
     */
    register(user: User): Promise<void>;    
}