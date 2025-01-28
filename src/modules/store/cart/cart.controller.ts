import { Body, Controller, Delete, Get, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { CartService } from "./cart.service";
import { AddNewItemInCartDto } from "./dto/add-new-item-dto";
import { RemoveItemDto } from "./dto/remove-item-dto";
import { UpdateQuantityDto } from "./dto/update-cart-item-dto";
import { AuthGuard } from "src/modules/auth/auth.guard";



@Controller('cart')
export class CartController {

    constructor(private readonly cartService: CartService) { }


    @Post()
    @UseGuards(AuthGuard)
    async addItemInCart(@Req() req: Request, @Body() newItem: AddNewItemInCartDto) {
        const user = (req as any)?.user;
        await this.cartService.addItemToCart(user._id, user.storeRole, newItem);
        return { message: "Item add in Cart" }
    }

    @Get()
    @UseGuards(AuthGuard)
    async getCart(@Req() req: Request){
        const user = (req as any).user
        const cart = await this.cartService.getCart(user._id);
        return cart;
    }

    @Delete('remove')
    @UseGuards(AuthGuard)
    async removeFromCart(@Req() req: Request, @Body() removedItemDetails: RemoveItemDto) {
        const user = (req as any).user;
        await this.cartService.removeItemFromCart(user._id, user.storeRole, removedItemDetails)
        return { message: "Item remove from Cart" }
    }

    @Patch('update-quantity')
    @UseGuards(AuthGuard)
    async updateQuantity(@Req() req: Request, @Body() updateQuantityDetails: UpdateQuantityDto) {
        const user = (req as any).user;
        await this.cartService.updateItemQuantity(user._id, user.storeRole, updateQuantityDetails)
        return { message: "Item quantity updated" }
    }

    @Delete('clear')
    @UseGuards(AuthGuard)
    async clearCart(@Req() req: Request) {
        const user = (req as any).user;
        await this.cartService.clearCart(user._id, user.storeRole)
        return { message: "Cart clear" }
    }

}