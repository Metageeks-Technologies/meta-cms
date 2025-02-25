'use client'
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

const VendorOrder = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const { websiteKey, setLoading } = useUserContext()
  const [orderPageNo, setOrderPageNo] = useState(1);



  const fetchOrderData = async () => {
    setLoading(true);
    try {
      const param = new URLSearchParams();
      param.append('page', orderPageNo.toString())
      const response = await axiosCall("get", `${process.env.NEXT_PUBLIC_BASE_URL}/order/my?${param.toString()}`, undefined, { websiteKey });

      if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching order data:", error);
      setOrders([]);
    }
    finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    if (websiteKey) {
      fetchOrderData();
    }
  }, [websiteKey, orderPageNo]);

  const filteredOrders = Array.isArray(orders) ? orders.filter((order) => {
    const customerName = order.user.name.toLowerCase();
    return customerName.includes(searchQuery.toLowerCase());
  }) : [];


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
      const response = await axiosCall("patch", `${process.env.NEXT_PUBLIC_BASE_URL}/order/my/cancel/${orderId}`, undefined, { websiteKey });

      if (response.status === 200 || response.status === 201) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? { ...order, shippingStatus: "Cancelled" }
              : order
          )
        );
        fetchOrderData();
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  const changeOrderStatus = async (orderId: string, newStatus: OrderStatusEnum) => {
    try {
      const response = await axiosCall("patch", `${process.env.NEXT_PUBLIC_BASE_URL}/order/vendor/update-status/${orderId}`, {
        status: newStatus,
      }, { websiteKey });

      if (response.status === 200 || response.status === 201) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? { ...order, shippingStatus: newStatus }
              : order
          )
        );
        fetchOrderData();
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
      cell: (row: any) => {
        const shippingStatus = row.shippingStatus;
        let statusClass = '';
    
        switch (shippingStatus) {
          case 'delivered':
            statusClass = 'bg-green-900/50 text-green-400 text-center border border-green-700';
            break;
          case 'shipped':
            statusClass = 'bg-blue-900/50 text-blue-400 text-center border border-blue-700';
            break;
          case 'cancelled':
            statusClass = 'bg-red-900/50 text-red-400 text-center border border-red-700';
            break;
          case 'confirm':
            statusClass = 'bg-yellow-900/50 text-center text-yellow-400 border border-yellow-700';
            break;
          default:
            statusClass = 'bg-gray-900/50 text-center text-gray-400 border border-gray-700'; 
            break;
        }
    
        return (
          <div className={`px-2 py-[1px] max-w-min rounded-xl text-xs font-medium ${statusClass}`}>
            {shippingStatus}
          </div>
        );
      },
    },
    
    
    
    
    {
      header: "Payment Status",
      accessor: "paymentStatus",
      cell: (row: any) => {
        const paymentStatus = row.paymentStatus;
        let statusClass = '';
    
        switch (paymentStatus) {
          case 'paid':
            statusClass = 'bg-green-900/50 text-green-400 text-center border border-green-700';
            break;
          case 'unpaid':
            statusClass = 'bg-red-900/50 text-red-400 text-center border border-red-700';
            break;
          default:
            statusClass = 'bg-gray-900/50 text-center text-gray-400 border border-gray-700';
            break;
        }
    
        return (
          <div className={`px-2 py-[1px] max-w-min rounded-xl text-xs font-medium ${statusClass}`}>
            {paymentStatus}
          </div>
        );
      },
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
    <div className="w-full container mx-auto px-4">
      <div className="flex justify-between items-center py-4">
        <Input
          className="w-1/3"
          type="search"
          placeholder="Search by customer name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
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
                <TableRow key={order._id} className="border-gray-800 hover:bg-transparent">
                  {columns.map((column) => (
                    <TableCell key={column.accessor}>
                      {column.cell ? column.cell(order) : order[column.accessor]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>


      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2 flex flex-row items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOrderPageNo(orderPageNo - 1)}
            disabled={orderPageNo <= 1}
            className="text-black font-bold"
          >
            Previous
          </Button>
          <div className="border-[1px] px-4 py-[4px] rounded-lg border-gray-400">{orderPageNo}</div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOrderPageNo(orderPageNo + 1)}
            disabled={orders.length < 10}
            className="text-black font-bold"
          >
            Next
          </Button>
        </div>
      </div>



      {isPopupVisible && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg max-w-4xl w-full shadow-lg space-y-6">
            <h2 className="text-3xl font-bold text-white mb-4">Order Details</h2>
            <div className="grid grid-cols-2 gap-x-8 mb-6">
              <div>
                <p className="text-lg"><strong>Customer Name:</strong> {selectedOrder.user.name}</p>
                <p className="text-lg"><strong>Email:</strong> {selectedOrder.user.email}</p>
                <p className="text-lg"><strong>Order ID:</strong> <span className="font-semibold text-blue-800">{selectedOrder._id}</span></p>
              </div>
              <div>
                <p className="text-lg"><strong>Total Amount:</strong> <span className="font-semibold text-green-600">₹{selectedOrder.totalAmount}</span></p>
                <p className="text-lg"><strong>Payment Status:</strong> <span className={`font-semibold ${selectedOrder.paymentStatus === 'Paid' ? 'text-green-500' : 'text-red-500'}`}>{selectedOrder.paymentStatus}</span></p>
                <p className="text-lg"><strong>Shipping Status:</strong> <span className={`font-semibold ${selectedOrder.shippingStatus === 'Shipped' ? 'text-blue-500' : 'text-yellow-500'}`}>{selectedOrder.shippingStatus}</span></p>
              </div>
            </div>

            <h3 className="text-2xl font-semibold text-gray-800">Items:</h3>
            <div className="space-y-4">
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {selectedOrder.items.map((item: any, index: number) => (
                  <div key={index} className="flex bg-gray-600 p-4 rounded-lg shadow-sm space-x-6">
                    <img
                      src={getURL(item.product.variants.find((variant: any) => variant.variantId === item.variantId)?.imageKeys[0])}
                      alt={item.product.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-grow">
                      <p className="font-semibold text-xl">{item.product.title}</p>
                      <p className="text-lg text-gray-800">{item.product.subDescription}</p>
                      <p className="text-lg text-gray-800 mt-2"><strong>Price:</strong> ₹{item.product.variants.find((variant: any) => variant.variantId === item.variantId)?.discountedPrice}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={closePopup}
              className="mt-6 w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


export default VendorOrder;
