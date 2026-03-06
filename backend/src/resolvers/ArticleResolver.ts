import {
  Arg,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { Article } from "../entities/Article";
import { Category } from "../entities/Category";
import { ObjectId } from "../types";

@InputType()
class CreateArticleInput {
  @Field()
  mainPictureUrl!: string;

  @Field()
  title!: string;

  @Field()
  body!: string;

  @Field(() => Number)
  category!: number;
}

@InputType()
class PaginationInput {
  @Field()
  limit!: number;
}

@Resolver(Article)
export class ArticleResolver {

  @Query(() => [Article])
  async articles(
    @Arg("pagination", () => PaginationInput, { nullable: true })
    pagination?: PaginationInput,

    @Arg("sort", () => String, { nullable: true })
    sort?: string
  ): Promise<Article[]> {

    const limit = pagination?.limit ?? 10;

    let order: any = { createdAt: "DESC" };

    if (sort) {
      const [field, direction] = sort.split(":");
      order = { [field]: direction.toUpperCase() };
    }

    return Article.find({
      relations: { category: true },
      take: limit,
      order,
    });
  }

  @Mutation(() => Article)
  async createArticle(
    @Arg("data") data: CreateArticleInput
  ): Promise<Article> {

    const category = await Category.findOneByOrFail({
      id: data.category,
    });

    const article = Article.create({
      mainPictureUrl: data.mainPictureUrl,
      title: data.title,
      body: data.body,
      category,
    });

    await article.save();

    return article;
  }
}