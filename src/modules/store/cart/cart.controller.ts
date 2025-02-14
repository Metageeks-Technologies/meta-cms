import { Body, Controller, Delete, Get, Headers, Patch, Post, Req, UseGuards } from "@nestjs/common";
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
    async addItemInCart(@Headers('websiteKey') websiteKey: string, @Req() req: Request, @Body() newItem: AddNewItemInCartDto) {
        const user = (req as any)?.user;
        await this.cartService.addItemToCart(websiteKey, user._id, user.role, newItem);
        return { message: "Item add in Cart" }
    }

    @Get()
    @UseGuards(AuthGuard)
    async getCart(@Headers('websiteKey') websiteKey: string, @Req() req: Request){
        const user = (req as any).user
        const cart = await this.cartService.getCart(websiteKey, user._id);
        return cart;
    }

    @Delete('remove')
    @UseGuards(AuthGuard)
    async removeFromCart(@Headers('websiteKey') websiteKey: string, @Req() req: Request, @Body() removedItemDetails: RemoveItemDto) {
        const user = (req as any).user;
        await this.cartService.removeItemFromCart(websiteKey, user._id, user.role, removedItemDetails)
        return { message: "Item remove from Cart" }
    }

    @Patch('update-quantity')
    @UseGuards(AuthGuard)
    async updateQuantity(@Headers('websiteKey') websiteKey: string, @Req() req: Request, @Body() updateQuantityDetails: UpdateQuantityDto) {
        const user = (req as any).user;
        await this.cartService.updateItemQuantity(websiteKey, user._id, user.role, updateQuantityDetails)
        return { message: "Item quantity updated" }
    }

    @Delete('clear')
    @UseGuards(AuthGuard)
    async clearCart(@Headers('websiteKey') websiteKey: string, @Req() req: Request) {
        const user = (req as any).user;
        await this.cartService.clearCart(websiteKey, user._id, user.role)
        return { message: "Cart clear" }
    }

}