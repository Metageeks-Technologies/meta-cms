import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { ICart } from "./schema/cart.schema";
import mongoose, { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { UserRoleEnum } from "src/modules/users/schema/user.schema";
import { AddNewItemInCartDto } from "./dto/add-new-item-dto";
import { RemoveItemDto } from "./dto/remove-item-dto";
import { UpdateQuantityDto } from "./dto/update-cart-item-dto";
import { ProductService } from "../product/product.service";
import { ProductStatusEnum } from "../product/schema/product.schema";
import { WebsiteService } from "src/modules/website/website.service";



@Injectable()
export class CartService {

    constructor(
        @InjectModel('Cart') private Cart: Model<ICart>,
        private readonly porductService: ProductService,
        private readonly websiteService: WebsiteService
    ) { }


    async addItemToCart(websiteKey: string, userId: string, userRole: UserRoleEnum, newItem: AddNewItemInCartDto) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey);
        if(!website){
            throw new BadRequestException('Invalid website key')
        }

        const { product, variantId, sku, quantity } = newItem;

        const productData = await this.porductService.getProductById(websiteKey, product, undefined, undefined);

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

        const cart = await this.Cart.findOne({ user: userId, websiteKey, isActive: true });
        if (!cart) {
            // Create a new cart if none exists
            return await this.Cart.create({
                user: userId,
                websiteKey,
                items: [{ product, variantId, sku, quantity }],
            });
        }

        // if user not superadmin, not admin and not cart owner 
        if (userRole !== UserRoleEnum.SUPERADMIN && userRole !== UserRoleEnum.ADMIN && userId !== cart.user.toString()) {
            throw new ForbiddenException();
        }

        // Check if the item is already in the cart
        const existingItemIndex = cart.items.findIndex(
            (item) => item.product.toString() === product && item.variantId === variantId,
        );

        if (existingItemIndex !== -1) {
            // Update the quantity of the existing item
            if(cart.items[existingItemIndex].quantity + quantity > productData.variants[variantIndex].quantity){
                throw new BadRequestException('Insufficient stock available for this variant');
            }
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


    async removeItemFromCart(websiteKey: string, userId: string, userRole: UserRoleEnum, removedItemDetails: RemoveItemDto) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey)
        if(!website){
            throw new BadRequestException('Invalid website key');
        }

        const { productId, variantId } = removedItemDetails;
        const cart = await this.Cart.findOne({ user: userId, websiteKey, isActive: true });
        if (!cart) {
            throw new BadRequestException("Cart not found");
        }

        // if user not superadmin, not admin and not cart owner 
        if (userRole !== UserRoleEnum.SUPERADMIN && userRole !== UserRoleEnum.ADMIN && userId !== cart.user.toString()) {
            throw new ForbiddenException();
        }

        // remove item from cart 
        cart.items = cart.items.filter(
            (item) => !(item.product.toString() === productId && item.variantId === variantId),
        );

        await cart.save();
        return cart;
    }

    async updateItemQuantity(websiteKey: string, userId: string, userRole: UserRoleEnum, updateQuantityDetails: UpdateQuantityDto) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey)
        if(!website){
            throw new BadRequestException('Invalid website key')
        }

        const { productId, variantId, quantity } = updateQuantityDetails;
        // if quantity is less than equal to 0 
        if (quantity <= 0) {
            const cart = await this.removeItemFromCart(websiteKey, userId, userRole, { productId, variantId });
            return cart;
        }

        const cart = await this.Cart.findOne({ user: userId, websiteKey, isActive: true });
        if (!cart) {
            throw new BadRequestException("Cart not found");
        }

        // if user not superadmin, not admin and not cart owner 
        if (userRole !== UserRoleEnum.SUPERADMIN && userRole !== UserRoleEnum.ADMIN && userId !== cart.user.toString()) {
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

    async clearCart(websiteKey: string, userId: string, userRole: UserRoleEnum) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey)
        if(!website){
            throw new BadRequestException('Invalid website key');
        }

        const cart = await this.Cart.findOne({ user: userId, websiteKey, isActive: true });
        if (!cart) {
            throw new BadRequestException("Cart not found");
        }

        // if user not superadmin, not admin and not cart owner 
        if (userRole !== UserRoleEnum.SUPERADMIN && userRole !== UserRoleEnum.ADMIN && userId !== cart.user.toString()) {
            throw new ForbiddenException();
        }

        cart.items = []; // Remove all items
        await cart.save();
        return cart;
    }


    async getCart(websiteKey: string, userId: string) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey)
        if(!website){
            throw new BadRequestException('Invalid website key')
        }

        const cart = await this.Cart.findOne({ user: userId, websiteKey, isActive: true })
            .populate({
                path: 'user', // Populate all fields of the user
            })
            .populate({
                path: 'items.product', // Populate all fields of the product
                populate: {
                    path: 'variants', // Populate all fields of variants inside the product
                    match: { isDeleted: false }, // Filter only not deleted variants
                },
            })
            .lean()
            .exec();

            console.log(cart, "this is cart")


        if (!cart) {
            return null
        }

        return JSON.parse(JSON.stringify(cart));
    }


    async findCart(websiteKey: string, cartId: string) {
        const website = await this.websiteService.getWebsiteByKey(websiteKey);
        if(!website){
            throw new BadRequestException('Invalid website key')
        }

        const cart = await this.Cart.findOne({_id: cartId, websiteKey}).exec();
        return cart;
    }

}