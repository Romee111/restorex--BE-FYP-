import { globalErrorHandling } from "./middlewares/GlobalErrorHandling.js";
import addressRouter from "./modules/address/address.routes.js";
import authRouter from "./modules/auth/auth.routes.js";
import brandRouter from "./modules/brand/brand.routes.js";
import cartRouter from "./modules/cart/cart.routes.js";
import categoryRouter from "./modules/category/category.routes.js";
// import couponRouter from "./modules/coupon/coupon.routes.js";
import orderRouter from "./modules/order/order.routes.js";
import productRouter from "./modules/product/product.routes.js";
import reviewRouter from "./modules/review/review.routes.js";
import requestRouter from "./modules/request/request.routes.js";
import subCategoryRouter from "./modules/subcategory/subcategory.routes.js";
import userRouter from "./modules/user/user.routes.js";
// import wishListRouter from "./modules/wishlist/wishlist.routes.js";
import queryRouter from "./modules/query/query.routes.js";
import { AppError } from "./utils/AppError.js";

export function bootstrap(app) {
  app.use("/restorex/categories", categoryRouter);
  app.use("/restorex/subcategories", subCategoryRouter);
  app.use("/restorex/brands", brandRouter);
  app.use("/api/v1/products", productRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/review", reviewRouter);
  app.use("/api/v1/address", addressRouter);
  app.use("/restorex/carts", cartRouter);
  // app.use("/api/v1/orders", orderRouter);
  app.use("/restorex/request", requestRouter); 
  app.use("/restorex/queries", queryRouter);

  app.all("*", (req, res, next) => {
    next(new AppError("Endpoint was not found", 404));
  });

  app.use(globalErrorHandling);
}
