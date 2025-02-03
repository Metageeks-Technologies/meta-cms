import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { ICart } from "./schema/cart.schema";
import mongoose, { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { UserStoreRoleEnum } from "src/modules/users/schema/user.schema";
import { AddNewItemInCartDto } from "./dto/add-new-item-dto";
import { RemoveItemDto } from "./dto/remove-item-dto";
import { UpdateQuantityDto } from "./dto/update-cart-item-dto";
import { ProductService } from "../product/product.service";
import { ProductStatusEnum } from "../product/schema/product.schema";



@Injectable()
export class CartService {

    constructor(
        @InjectModel('Cart') private Cart: Model<ICart>,
        private readonly porductService: ProductService
    ) { }


    async addItemToCart(userId: string, storeRole: UserStoreRoleEnum, newItem: AddNewItemInCartDto) {
        const { product, variantId, sku, quantity } = newItem;

        const productData = await this.porductService.getProductById(product, undefined, undefined);

        if (productData?.status !== ProductStatusEnum.PUBLISHED) {
            throw new ForbiddenException();
        }

        const variantIndex = productData.variants.findIndex((variant: any) => variant.variantId === variantId);
        if (variantIndex === -1) {
            throw new NotFoundException(`Variant not found`);
        }

        if(productData.variants[variantIndex].quantity < quantity){
            throw new BadRequestException('Insufficient stock available for this variant');
        }

        const cart = await this.Cart.findOne({ user: userId, isActive: true });
        if (!cart) {
            // Create a new cart if none exists
            return await this.Cart.create({
                user: userId,
                items: [{ product, variantId, sku, quantity }],
            });
        }

        // if user not superadmin and not cart owner 
        if (storeRole !== UserStoreRoleEnum.SUPERADMIN && userId !== cart.user.toString()) {
            throw new ForbiddenException();
        }

        // Check if the item is already in the cart
        const existingItemIndex = cart.items.findIndex(
            (item) => item.product.toString() === product && item.variantId === variantId,
        );

        if (existingItemIndex !== -1) {
            // Update the quantity of the existing item
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add the new item to the cart
            cart.items.push({
                product: mongoose.Types.ObjectId.createFromHexString(product),
                variantId,
                sku,
                quantity,
            });
        }

        await cart.save();
        return cart;
    }


    async removeItemFromCart(userId: string, storeRole: UserStoreRoleEnum, removedItemDetails: RemoveItemDto) {
        const { productId, variantId } = removedItemDetails;
        const cart = await this.Cart.findOne({ user: userId, isActive: true });
        if (!cart) {
            throw new BadRequestException("Cart not found");
        }

        // if user not superadmin and not cart owner 
        if (storeRole !== UserStoreRoleEnum.SUPERADMIN && userId !== cart.user.toString()) {
            throw new ForbiddenException();
        }

        cart.items = cart.items.filter(
            (item) => !(item.product.toString() === productId && item.variantId === variantId),
        );

        await cart.save();
        return cart;
    }

    async updateItemQuantity(userId: string, storeRole: UserStoreRoleEnum, updateQuantityDetails: UpdateQuantityDto) {
        const { productId, variantId, quantity } = updateQuantityDetails;
        // if quantity is less than equal to 0 
        if (quantity <= 0) {
            const cart = await this.removeItemFromCart(userId, storeRole, { productId, variantId })
            return cart;
        }

        const cart = await this.Cart.findOne({ user: userId, isActive: true });
        if (!cart) {
            throw new BadRequestException("Cart not found");
        }

        // if user not superadmin and not cart owner 
        if (storeRole !== UserStoreRoleEnum.SUPERADMIN && userId !== cart.user.toString()) {
            throw new ForbiddenException();
        }

        const item = cart.items.find(
            (item) => item.product.toString() === productId && item.variantId === variantId,
        );

        if (!item) {
            throw new BadRequestException("Item not found in cart");
        }


        item.quantity = quantity; // Update quantity
        await cart.save();
        return cart;
    }

    async clearCart(userId: string, storeRole: UserStoreRoleEnum) {
        const cart = await this.Cart.findOne({ user: userId, isActive: true });
        if (!cart) {
            throw new BadRequestException("Cart not found");
        }

        // if user not superadmin and not cart owner 
        if (storeRole !== UserStoreRoleEnum.SUPERADMIN && userId !== cart.user.toString()) {
            throw new ForbiddenException();
        }

        cart.items = []; // Remove all items
        await cart.save();
        return cart;
    }


    async getCart(userId: string) {
        const cart = await this.Cart.findOne({ user: userId, isActive: true })
            .populate({
                path: 'user', // Populate all fields of the user
            })
            .populate({
                path: 'items.product', // Populate all fields of the product
                populate: {
                    path: 'variants', // Populate all fields of variants inside the product
                    match: { isDeleted: false }, // Optional: Filter only not deleted variants
                },
            })
            .lean()
            .exec();

        if (!cart) {
            return null
        }

        return JSON.parse(JSON.stringify(cart));
    }


    async findCart(cartId: string) {
        const cart = await this.Cart.findById(cartId).exec();
        return cart;
    }

}