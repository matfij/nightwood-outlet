import { requireAuth, validateRequest } from "@nightwood/common";
import { Router } from "express";
import { OrdersController } from "../controllers/orders.controller";
import { body } from "express-validator";

export interface Routes {
  path?: string;
  router: Router;
}

export class OrdersRouter implements Routes {
  public path = "/orders";
  public router = Router();
  public ordersController = new OrdersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @openapi
     * /api/orders:
     *  get:
     *   tags:
     *   - Orders
     *   security:
     *    - cookieAuth: []
     *   responses:
     *    200:
     *     description: Success
     *     content:
     *      application/json:
     *       schema:
     *        type: array
     *        items:
     *         $ref: '#/components/schemas/Order'
     */
    this.router.get(
      `${this.path}`,
      requireAuth,
      this.ordersController.getOrders
    );
    /**
     * @openapi
     * /api/orders/{id}:
     *  get:
     *   tags:
     *   - Orders
     *   parameters:
     *    - name: id
     *      required: true
     *      in: path
     *      schema:
     *       type: string
     *   responses:
     *    200:
     *     description: Success
     *     content:
     *      application/json:
     *       schema:
     *        type: array
     *        items:
     *         $ref: '#/components/schemas/Order'
     */
    this.router.get(
      `${this.path}/:id`,
      requireAuth,
      this.ordersController.getOrderById
    );
    /**
     * @openapi
     * /api/orders:
     *  post:
     *   tags:
     *   - Orders
     *   requestBody:
     *    required: true
     *    content:
     *     application/json:
     *      schema:
     *       type: object
     *       properties:
     *        itemId:
     *         type: string
     *   responses:
     *    200:
     *     description: Success
     *     content:
     *      application/json:
     *       schema:
     *        $ref: '#/components/schemas/Order'
     */
    this.router.post(
      `${this.path}`,
      requireAuth,
      [body("itemId").not().isEmpty().withMessage("Invalid itemId.")],
      validateRequest,
      this.ordersController.createOrder
    );
    /**
     * @openapi
     * /api/orders/{id}:
     *  delete:
     *   tags:
     *   - Orders
     *   parameters:
     *    - name: id
     *      required: true
     *      in: path
     *      schema:
     *       type: string
     *   responses:
     *    200:
     *     description: Cancelled
     */
    this.router.delete(
      `${this.path}/:id`,
      requireAuth,
      this.ordersController.deleteOrder
    );
  }
}
