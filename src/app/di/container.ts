import { Container } from "inversify";
import { IProductRepository } from "../domain/repository/IProductRepository";
import { ProductRepository } from "../infrastructure/ProductRepository";
import { TYPES } from "./types";
import { IProductCategoryRepository } from "../domain/repository/IProductCategoryRepository";
import { ProductCategoryRepository } from "../infrastructure/ProductCategoryRepository";
import { IUserRepository } from "../domain/repository/IUserRepository";
import { UserRepository } from "../infrastructure/UserRepository";
/**
 * DIコンテナの初期化と依存関係の登録
 */
const container = new Container();
// インフラストラクチャ層
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository);
container.bind<IProductRepository>(TYPES.IProductRepository).to(ProductRepository);
container.bind<IProductCategoryRepository>(TYPES.IProductCategoryRepository).to(ProductCategoryRepository);