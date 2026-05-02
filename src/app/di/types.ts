/**
 * DIコンテナ用の識別子(Symbol)定義
 */
export const TYPES = {
    // インフラストラクチャ層
    IProductRepository: Symbol.for("IProductRepository"),
    IProductCategoryRepository: Symbol.for("IProductCategoryRepository"),
    IUserRepository: Symbol.for("IUserRepository"),

    // サービス(ユースケース)層
    ISearchProductService: Symbol.for("ISearchProductService"),
    IRegisterProductService: Symbol.for("IRegisterProductService"),
    IRegisterUserService: Symbol.for("IRegisterUserService"),
};