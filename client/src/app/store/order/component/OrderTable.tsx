import { useState, useEffect } from "react";
import axiosCall from "@/utils/ApiCall";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getURL } from "@/utils/AWS_Config";
import { OrderStatusEnum } from "@/constant/order";
import { useUserContext } from "@/context/userContext";
import toast from "react-hot-toast";

const OrderTable = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isAllOrders, setIsAllOrders] = useState<boolean>(true);
  const { websiteKey } = useUserContext();

  const fetchOrderData = async (url: string) => {
    try {
      const response = await axiosCall("get", url, undefined, { websiteKey });
      if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching order data:", error);
      setOrders([]);
    }
  };

  useEffect(() => {
    if(websiteKey){
      const url = isAllOrders
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/order/all`
        : `${process.env.NEXT_PUBLIC_BASE_URL}/order/my`;

      fetchOrderData(url);
    }
  }, [isAllOrders, websiteKey]);

  const filteredOrders = Array.isArray(orders)
    ? orders.filter((order) => {
        const customerName = order.user.name.toLowerCase();
        return customerName.includes(searchQuery.toLowerCase());
      })
    : [];

  const openPopup = (order: any) => {
    setSelectedOrder(order);
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setSelectedOrder(null);
  };

  const cancelOrder = async (orderId: string) => {
    try {
      const resp = await axiosCall("patch", `${process.env.NEXT_PUBLIC_BASE_URL}/order/vendor/cancel/${orderId}`, undefined, { websiteKey });

      if (resp.status === 200 || resp.status === 201) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? { ...order, shippingStatus: "Cancelled" }
              : order
          )
        );
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  const changeOrderStatus = async (orderId: string, newStatus: OrderStatusEnum) => {
    try {
      const resp = await axiosCall("patch", `${process.env.NEXT_PUBLIC_BASE_URL}/order/vendor/update-status/${orderId}`, {
        status: newStatus,
      }, { websiteKey });

      if (resp.status === 200 || resp.status === 201) {
        toast.success(resp.data.message, { duration: 2000 });
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? { ...order, shippingStatus: newStatus }
              : order
          )
        );
      } else {
        toast.error(resp?.data?.message, { duration: 2000 });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const columns = [
    {
      header: "Order ID",
      accessor: "orderId",
      cell: (row: any) => <div>{row._id}</div>,
    },
    {
      header: "Customer Name",
      accessor: "customerName",
      cell: (row: any) => <div>{row.user.name}</div>,
    },
    {
      header: "Total Items",
      accessor: "totalItems",
      cell: (row: any) => <div>{row.items.length}</div>,
    },
    {
      header: "Total Amount",
      accessor: "totalAmount",
      cell: (row: any) => <div>{row.totalAmount}</div>,
    },
    {
      header: "Shipping Status",
      accessor: "shippingStatus",
      cell: (row: any) => <div>{row.shippingStatus}</div>,
    },
    {
      header: "Payment Status",
      accessor: "paymentStatus",
      cell: (row: any) => <div>{row.paymentStatus}</div>,
    },
    {
      header: "Actions",
      accessor: "actions",
      cell: (row: any) => {
        const { shippingStatus } = row;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-black text-white border-gray-800">
              <DropdownMenuItem onClick={() => openPopup(row)}>View Order</DropdownMenuItem>

              {shippingStatus === OrderStatusEnum.PENDING && (
                <>
                  <DropdownMenuItem onClick={() => changeOrderStatus(row._id, OrderStatusEnum.CONFIRM)}>Confirm Order</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => cancelOrder(row._id)}>Cancel Order</DropdownMenuItem>
                </>
              )}

              {shippingStatus === OrderStatusEnum.CONFIRM && (
                <DropdownMenuItem onClick={() => changeOrderStatus(row._id, OrderStatusEnum.SHIPPED)}>Mark as Shipped</DropdownMenuItem>
              )}

              {shippingStatus === OrderStatusEnum.SHIPPED && (
                <DropdownMenuItem onClick={() => changeOrderStatus(row._id, OrderStatusEnum.DELIVERED)}>Mark as Delivered</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="w-full container mx-auto px-4 overflow-hidden">
      <div className="flex justify-between items-center py-4">
        <Input
          className="w-1/3"
          type="search"
          placeholder="Search by customer name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div>
          <Button
            onClick={() => setIsAllOrders(true)}
            className={`mr-2 ${isAllOrders ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'} hover:bg-blue-600`}
          >
            All Orders
          </Button>
          <Button
            onClick={() => setIsAllOrders(false)}
            className={`${!isAllOrders ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'} hover:bg-blue-600`}
          >
            My Orders
          </Button>
        </div>
      </div>

      <div className="rounded-md border-[1px] border-gray-800">
        <Table>
          <TableHeader className="border-gray-800">
            <TableRow className="border-gray-800">
              {columns.map((column) => (
                <TableHead
                  key={column.header}
                  className="bg-gray-800 text-white text-lg font-bold whitespace-nowrap"
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredOrders.length ? (
              filteredOrders.map((order: any) => (
                <TableRow
                  key={order._id}
                  className="border-gray-800 hover:bg-transparent"
                >
                  {columns.map((column) => (
                    <TableCell key={column.accessor}>
                      {column.cell
                        ? column.cell(order)
                        : order[column.accessor]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {isPopupVisible && selectedOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
        <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-800">
          {/* Modal Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-100">Order Details</h2>
              <button 
                onClick={closePopup}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg> */}
              </button>
            </div>
          </div>
    
          {/* Modal Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Order Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {/* Customer Info Card */}
              <div className="bg-gray-800 p-4 rounded-lg space-y-2 border border-gray-700">
                <h3 className="text-sm font-medium text-gray-400">Customer Details</h3>
                <p className="text-gray-100 font-medium">{selectedOrder.user.name}</p>
                <p className="text-gray-300 text-sm">{selectedOrder.user.email}</p>
                <div className="mt-2 pt-2 border-t border-gray-700">
                  <p className="text-xs text-gray-400">Order ID</p>
                  <p className="font-mono text-sm text-blue-400">{selectedOrder._id}</p>
                </div>
              </div>
    
              {/* Payment Info Card */}
              <div className="bg-gray-800 p-4 rounded-lg space-y-2 border border-gray-700">
                <h3 className="text-sm font-medium text-gray-400">Payment Details</h3>
                <div className="flex items-baseline justify-between">
                  <p className="text-gray-300">Total Amount</p>
                  <p className="text-lg font-semibold text-blue-400">₹{selectedOrder.totalAmount}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-300">Status</p>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                    selectedOrder.paymentStatus === 'Paid' 
                      ? 'bg-green-900/50 text-green-400 border border-green-700'
                      : 'bg-red-900/50 text-red-400 border border-red-700'
                  }`}>
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
              </div>
    
              {/* Shipping Info Card */}
              <div className="bg-gray-800 p-4 rounded-lg space-y-2 border border-gray-700">
                <h3 className="text-sm font-medium text-gray-400">Shipping Status</h3>
                <div className="flex items-center justify-between">
                  <p className="text-gray-300">Current Status</p>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                    selectedOrder.shippingStatus === 'Delivered'
                      ? 'bg-green-900/50 text-green-400 border border-green-700'
                      : selectedOrder.shippingStatus === 'Shipped'
                      ? 'bg-blue-900/50 text-blue-400 border border-blue-700'
                      : selectedOrder.shippingStatus === 'Cancelled'
                      ? 'bg-red-900/50 text-red-400 border border-red-700'
                      : 'bg-yellow-900/50 text-yellow-400 border border-yellow-700'
                  }`}>
                    {selectedOrder.shippingStatus}
                  </span>
                </div>
              </div>
            </div>
    
            {/* Order Items Section */}
            <div className="bg-gray-900 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-100 mb-4">Ordered Items</h3>
              <div className="space-y-4">
                {selectedOrder.items.map((item: any, index: number) => {
                  const variant = item.product.variants.find(
                    (v: any) => v.variantId === item.variantId
                  );
                  const price = variant && variant.discountedPrice > 0
                    ? variant.discountedPrice
                    : variant?.price;
                  const totalPrice = price * item.quantity;
    
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700"
                    >
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <img
                          src={getURL(variant?.imageKeys[0])}
                          alt={item.product.title}
                          className="w-full h-full object-cover rounded-md border border-gray-700"
                        />
                        {/* <div className="absolute -top-2 -right-2 bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
                          {item.quantity}
                        </div> */}
                      </div>
                      
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h4 className="font-medium text-gray-100 line-clamp-1">
                              {item.product.title}
                            </h4>
                            <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                              {item.product.subDescription}
                            </p>
                            <p className="text-sm text-white mt-1 flex items-center gap-2">Quantity: 
      <span className=" text-white   flex items-center  text-sm font-medium">
        {item.quantity}
      </span></p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm text-gray-400">Unit Price</p>
                            <p className="font-medium text-gray-100">₹{price?.toFixed(2)}</p>
                            <p className="mt-1 text-sm font-medium text-blue-400">
                              Total: ₹{totalPrice.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
    
          {/* Modal Footer */}
          <div className="p-6 border-t border-gray-800 bg-gray-800">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-400">Total Items: {selectedOrder.items.length}</p>
                <p className="text-lg font-semibold text-gray-100">
                  Order Total: <span className="text-blue-400">₹{selectedOrder.totalAmount}</span>
                </p>
              </div>
              <button
                onClick={closePopup}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default OrderTable;
