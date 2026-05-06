import { Container } from "inversify";
import { IProductRepository } from "../domain/repository/IProductRepository";
import { ProductRepository } from "../infrastructure/ProductRepository";
import { TYPES } from "./types";
import { IProductCategoryRepository } from "../domain/repository/IProductCategoryRepository";
import { ProductCategoryRepository } from "../infrastructure/ProductCategoryRepository";
import { IUserRepository } from "../domain/repository/IUserRepository";
import { UserRepository } from "../infrastructure/UserRepository";
import { ISearchProductService } from "../service/ISearchProductService";
import { SearchProductService } from "../service/impl/SearchProductService";
import { IRegisterProductService } from "../service/IRegisterProductService";
import { RegisterProductService } from "../service/impl/RegisterProductService";
import { IRegisterUserService } from "../service/IRegisterUserService";
import { RegisterUserService } from "../service/impl/RegisterUserService";
import { IUpdateProductService } from "../service/IUpdateProductService";
import { UpdateProductService } from "../service/impl/UpdateProductService";
/**
 * DIコンテナの初期化と依存関係の登録
 */
const container = new Container();
// インフラストラクチャ層
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
container.bind<IProductRepository>(TYPES.IProductRepository).to(ProductRepository);
container.bind<IProductCategoryRepository>(TYPES.IProductCategoryRepository).to(ProductCategoryRepository);
// サービス(ユースケース)層
container.bind<ISearchProductService>(TYPES.ISearchProductService).to(SearchProductService);
container.bind<IRegisterProductService>(TYPES.IRegisterProductService).to(RegisterProductService);
container.bind<IRegisterUserService>(TYPES.IRegisterUserService).to(RegisterUserService);
container.bind<IUpdateProductService>(TYPES.IUpdateProductService).to(UpdateProductService);
export { container };