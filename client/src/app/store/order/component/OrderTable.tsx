// import { useState, useEffect } from "react";
// import axiosCall from "@/utils/ApiCall";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Check, MoreHorizontal, X } from "lucide-react";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { getURL } from "@/utils/AWS_Config";
// import { OrderStatusEnum } from "@/constant/order";
// import { useUserContext } from "@/context/userContext";
// import toast from "react-hot-toast";

// const OrderTable = () => {
//   const [orders, setOrders] = useState<any[]>([]);
//   const [searchQuery, setSearchQuery] = useState<string>("");
//   const [isPopupVisible, setIsPopupVisible] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
//   const [isAllOrders, setIsAllOrders] = useState<boolean>(true);
//   const { websiteKey, setLoading } = useUserContext();
//   const [orderPageNo, setOrderPageNo] = useState(1);

//   // Helper function to calculate order total
//   const calculateOrderTotal = (items: any[]) => {
//     if (!items) return 0;
//     return items.reduce((total, item) => {
//       const variant = item.product.variants.find(
//         (v: any) => v.variantId === item.variantId
//       );
//       const price = variant && variant.discountedPrice > 0
//         ? variant.discountedPrice
//         : variant?.price || 0;
//       return total + (price * (item.quantity || 0));
//     }, 0);
//   };
//   const calculateTotalQuantity = (items: any[]) => {
//     if (!items) return 0;
//     return items.reduce((total, item) => total + (item.quantity || 0), 0);
//   };

//   const fetchOrderData = async (url: string) => {
//     setLoading(true);
//     try {
//       const response = await axiosCall("get", url, undefined, { websiteKey });
//       if (Array.isArray(response.data)) {
//         setOrders(response.data);
//       } else {
//         setOrders([]);
//       }
//     } catch (error) {
//       console.error("Error fetching order data:", error);
//       setOrders([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     setOrderPageNo(1);
//   }, [isAllOrders, websiteKey])

//   useEffect(() => {
//     if (websiteKey) {
//       const param = new URLSearchParams();
//       param.append('page', orderPageNo.toString());
//       const url = isAllOrders
//         ? `${process.env.NEXT_PUBLIC_BASE_URL}/order/all?${param.toString()}`
//         : `${process.env.NEXT_PUBLIC_BASE_URL}/order/vendor?${param.toString()}`;

//       fetchOrderData(url);
//     }
//   }, [websiteKey, orderPageNo, isAllOrders]);

//   const filteredOrders = Array.isArray(orders)
//     ? orders.filter((order) => {
//       const customerName = order.user.name.toLowerCase();
//       return customerName.includes(searchQuery.toLowerCase());
//     })
//     : [];

//     const openPopup = (order: any) => {
//       const calculatedTotal = calculateOrderTotal(order.items);
//       const calculatedQuantity = calculateTotalQuantity(order.items);
//       setSelectedOrder({
//         ...order,
//         calculatedTotal,
//         calculatedQuantity
//       });
//       setIsPopupVisible(true);
//     };

//   const closePopup = () => {
//     setIsPopupVisible(false);
//     setSelectedOrder(null);
//   };

//   const cancelOrder = async (orderId: string) => {
//     try {
//       const resp = await axiosCall("patch", `${process.env.NEXT_PUBLIC_BASE_URL}/order/vendor/cancel/${orderId}`, undefined, { websiteKey });

//       if (resp.status === 200 || resp.status === 201) {
//         setOrders((prevOrders) =>
//           prevOrders.map((order) =>
//             order._id === orderId
//               ? { ...order, shippingStatus: "Cancelled" }
//               : order
//           )
//         );
//       }
//     } catch (error) {
//       console.error("Error cancelling order:", error);
//     }
//   };

//   const changeOrderStatus = async (orderId: string, newStatus: OrderStatusEnum) => {
//     try {
//       const resp = await axiosCall("patch", `${process.env.NEXT_PUBLIC_BASE_URL}/order/vendor/update-status/${orderId}`, {
//         status: newStatus,
//       }, { websiteKey });

//       if (resp.status === 200 || resp.status === 201) {
//         toast.success(resp.data.message, { duration: 2000 });
//         setOrders((prevOrders) =>
//           prevOrders.map((order) =>
//             order._id === orderId
//               ? { ...order, shippingStatus: newStatus }
//               : order
//           )
//         );
//       } else {
//         toast.error(resp?.data?.message, { duration: 2000 });
//       }
//     } catch (error) {
//       console.error("Error updating order status:", error);
//     }
//   };

//   const columns = [
//     {
//       header: "Order ID",
//       accessor: "orderId",
//       cell: (row: any) => <div>{row._id}</div>,
//     },
//     {
//       header: "Customer Name",
//       accessor: "customerName",
//       cell: (row: any) => <div>{row.user.name}</div>,
//     },
//     {
//       header: "Total Items",
//       accessor: "totalItems",
//       cell: (row: any) => <div>{calculateTotalQuantity(row.items)}</div>,
//     },
//     {
//       header: "Total Amount",
//       accessor: "totalAmount",
//       cell: (row: any) => <div>₹{calculateOrderTotal(row.items).toFixed(2)}</div>,
//     },
//     {
//       header: "Shipping Status",
//       accessor: "shippingStatus",
//       cell: (row: any) => <div>{row.shippingStatus}</div>,
//     },
//     {
//       header: "Payment Status",
//       accessor: "paymentStatus",
//       cell: (row: any) => <div>{row.paymentStatus}</div>,
//     },
//     {
//       header: "Actions",
//       accessor: "actions",
//       cell: (row: any) => {
//         const { shippingStatus } = row;

//         return (
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="h-8 w-8 p-0">
//                 <span className="sr-only">Open menu</span>
//                 <MoreHorizontal className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="bg-black text-white border-gray-800">
//               <DropdownMenuItem onClick={() => openPopup(row)}>View Order</DropdownMenuItem>

//               {shippingStatus === OrderStatusEnum.PENDING && (
//                 <>
//                   <DropdownMenuItem onClick={() => changeOrderStatus(row._id, OrderStatusEnum.CONFIRM)}>
//                     Confirm Order
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => cancelOrder(row._id)}>
//                     Cancel Order
//                   </DropdownMenuItem>
//                 </>
//               )}

//               {shippingStatus === OrderStatusEnum.CONFIRM && (
//                 <DropdownMenuItem onClick={() => changeOrderStatus(row._id, OrderStatusEnum.SHIPPED)}>
//                   Mark as Shipped
//                 </DropdownMenuItem>
//               )}

//               {shippingStatus === OrderStatusEnum.SHIPPED && (
//                 <DropdownMenuItem onClick={() => changeOrderStatus(row._id, OrderStatusEnum.DELIVERED)}>
//                   Mark as Delivered
//                 </DropdownMenuItem>
//               )}
//             </DropdownMenuContent>
//           </DropdownMenu>
//         );
//       },
//     },
//   ];

//   return (
//     <div className="w-full container mx-auto px-4 overflow-hidden">
//       <div className="flex justify-between items-center py-4">
//         <Input
//           className="w-1/3"
//           type="search"
//           placeholder="Search by customer name"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//         <div className='flex gap-2 flex-row mb-7 items-center flex-wrap text-xs sm:text-sm'>
//           <Button
//             onClick={() => setIsAllOrders(true)}
//             className={`bg-gray-900 px-2 py-1 sm:px-4 sm:py-2 rounded-lg border-[1px] border-gray-800 flex flex-row items-center gap-2 cursor-pointer ${isAllOrders ? 'text-blue-800 border-blue-800' : ''}`}
//           >
//             {isAllOrders ? <Check className='w-4 h-4 sm:w-6 sm:h-6' /> : null}
//             <span>All Orders</span>
//           </Button>
//           <Button
//             onClick={() => setIsAllOrders(false)}
//             className={`bg-gray-900 px-2 py-1 sm:px-4 sm:py-2 rounded-lg border-[1px] border-gray-800 flex flex-row items-center gap-2 cursor-pointer ${!isAllOrders ? 'text-blue-800 border-blue-800' : ''}`}
//           >
//             {!isAllOrders ? <Check className='w-4 h-4 sm:w-6 sm:h-6' /> : null}
//             <span>My Orders</span>
//           </Button>
//         </div>
//       </div>

//       <div className="rounded-md border-[1px] border-gray-800">
//         <Table>
//           <TableHeader className="border-gray-800">
//             <TableRow className="border-gray-800">
//               {columns.map((column) => (
//                 <TableHead
//                   key={column.header}
//                   className="bg-gray-800 text-white text-lg font-bold whitespace-nowrap"
//                 >
//                   {column.header}
//                 </TableHead>
//               ))}
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {filteredOrders.length ? (
//               filteredOrders.map((order: any) => (
//                 <TableRow
//                   key={order._id}
//                   className="border-gray-800 hover:bg-transparent"
//                 >
//                   {columns.map((column) => (
//                     <TableCell key={column.accessor}>
//                       {column.cell
//                         ? column.cell(order)
//                         : order[column.accessor]}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className="h-24 text-center"
//                 >
//                   No orders found.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       <div className="flex items-center justify-end space-x-2 py-4">
//         <div className="space-x-2 flex flex-row items-center gap-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => setOrderPageNo(orderPageNo - 1)}
//             disabled={orderPageNo <= 1}
//             className="text-black font-bold"
//           >
//             Previous
//           </Button>
//           <div className="border-[1px] px-4 py-[4px] rounded-lg border-gray-400">{orderPageNo}</div>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => setOrderPageNo(orderPageNo + 1)}
//             disabled={orders.length < 10}
//             className="text-black font-bold"
//           >
//             Next
//           </Button>
//         </div>
//       </div>

//       {isPopupVisible && selectedOrder && (
//         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={closePopup}>
//           <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-800" 
//                onClick={(e) => e.stopPropagation()}>
//             {/* Modal Header */}
//             <div className="p-6 border-b border-gray-800">
//               <div className="flex justify-between items-center">
//                 <h2 className="text-2xl font-bold text-gray-100">Order Details</h2>
//                 <button
//                   onClick={closePopup}
//                   className="text-gray-400 hover:text-gray-200 transition-colors"
//                 >
//                   <X className="h-6 w-6" />
//                 </button>
//               </div>
//             </div>

//             {/* Modal Content */}
//             <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
//               {/* Order Summary Cards */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
//                 {/* Customer Info Card */}
//                 <div className="bg-gray-800 p-4 rounded-lg space-y-2 border border-gray-700">
//                   <h3 className="text-sm font-medium text-gray-400">Customer Details</h3>
//                   <p className="text-gray-100 font-medium">{selectedOrder.user.name}</p>
//                   <p className="text-gray-300 text-sm">{selectedOrder.user.email}</p>
//                   <div className="mt-2 pt-2 border-t border-gray-700">
//                     <p className="text-xs text-gray-400">Order ID</p>
//                     <p className="font-mono text-sm text-blue-400">{selectedOrder._id}</p>
//                   </div>
//                 </div>

//                 {/* Payment Info Card */}
//                 <div className="bg-gray-800 p-4 rounded-lg space-y-2 border border-gray-700">
//                   <h3 className="text-sm font-medium text-gray-400">Payment Details</h3>
//                   <div className="flex items-baseline justify-between">
//                     <p className="text-gray-300">Total Amount</p>
//                     <p className="text-lg font-semibold text-blue-400">
//                       ₹{selectedOrder.calculatedTotal.toFixed(2)}
//                     </p>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <p className="text-gray-300">Status</p>
//                     <span className={`px-2 py-1 rounded-full text-sm font-medium ${
//                       selectedOrder.paymentStatus === 'paid'
//                         ? 'bg-green-900/50 text-green-400 border border-green-700'
//                         : 'bg-red-900/50 text-red-400 border border-red-700'
//                     }`}>
//                       {selectedOrder.paymentStatus}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Shipping Info Card */}
//                 <div className="bg-gray-800 p-4 rounded-lg space-y-2 border border-gray-700">
//                   <h3 className="text-sm font-medium text-gray-400">Shipping Status</h3>
//                   <div className="flex items-center justify-between">
//                     <p className="text-gray-300">Current Status</p>
//                     <span className={`px-2 py-1 rounded-full text-sm font-medium ${
//                       selectedOrder.shippingStatus === 'delivered'
//                         ? 'bg-green-900/50 text-green-400 border border-green-700'
//                         : selectedOrder.shippingStatus === 'pending'
//                           ? 'bg-blue-900/50 text-blue-400 border border-blue-700'
//                           : selectedOrder.shippingStatus === 'cancelled'
//                             ? 'bg-red-900/50 text-red-400 border border-red-700'
//                             : 'bg-yellow-900/50 text-yellow-400 border border-yellow-700'
//                     }`}>
//                       {selectedOrder.shippingStatus}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Order Items Section */}
//               <div className="bg-gray-900 rounded-lg">
//                 <h3 className="text-lg font-semibold text-gray-100 mb-4">Ordered Items</h3>
//                 <div className="space-y-4 max-h-96 overflow-y-auto pr-2 styledScrollable">
//                   {selectedOrder.items.map((item: any, index: number) => {
//                     const variant = item.product.variants.find(
//                       (v: any) => v.variantId === item.variantId
//                     );
//                     const price = variant && variant.discountedPrice > 0
//                       ? variant.discountedPrice
//                       : variant?.price;
//                     const totalPrice = price * item.quantity;

//                     return (
//                       <div
//                         key={index}
//                         className="flex items-start gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700"
//                       >
//                         <div className="relative w-24 h-24 flex-shrink-0">
//                           <img
//                             src={getURL(variant?.imageKeys[0])}
//                             alt={item.product.title}
//                             className="w-full h-full object-cover rounded-md border border-gray-700"
//                           />
//                         </div>

//                         <div className="flex-grow min-w-0">
//                           <div className="flex justify-between items-start gap-4">
//                             <div>
//                               <h4 className="font-medium text-gray-100 line-clamp-1">
//                                 {item.product.title}
//                               </h4>
//                               <p className="text-sm text-gray-400 mt-1 line-clamp-2">
//                                 {item.product.subDescription}
//                               </p>
//                               <p className="text-sm text-white mt-1 flex items-center gap-2">
//                                 Quantity:
//                                 <span className="text-white flex items-center text-sm font-medium">
//                                   {item.quantity}
//                                 </span>
//                               </p>
//                             </div>
//                             <div className="text-right flex-shrink-0">
//                               <p className="text-sm text-gray-400">Unit Price</p>
//                               <p className="font-medium text-gray-100">₹{price?.toFixed(2)}</p>
//                               <p className="mt-1 text-sm font-medium text-blue-400">
//                                 Total: ₹{totalPrice.toFixed(2)}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>

//             {/* Modal Footer */}
//             <div className="p-6 border-t border-gray-800 bg-gray-800">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <p className="text-sm text-gray-400">Total Items: {selectedOrder.calculatedQuantity}</p>
//                   <p className="text-lg font-semibold text-gray-100">
//                     Order Total: <span className="text-blue-400">₹{selectedOrder.calculatedTotal.toFixed(2)}</span>
//                   </p>
//                 </div>
//                 <button
//                   onClick={closePopup}
//                   className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrderTable;
import { useState, useEffect } from "react";
import axiosCall from "@/utils/ApiCall";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, MoreHorizontal, X } from "lucide-react";
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
  const { websiteKey, setLoading } = useUserContext();
  const [orderPageNo, setOrderPageNo] = useState(1);

  // Helper function to calculate order total
  const calculateOrderTotal = (items: any[]) => {
    if (!items) return 0;
    return items.reduce((total, item) => {
      const variant = item.product.variants.find(
        (v: any) => v.variantId === item.variantId
      );
      const price = variant && variant.discountedPrice > 0
        ? variant.discountedPrice
        : variant?.price || 0;
      return total + (price * (item.quantity || 0));
    }, 0);
  };
  const calculateTotalQuantity = (items: any[]) => {
    if (!items) return 0;
    return items.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  const fetchOrderData = async (url: string) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setOrderPageNo(1);
  }, [isAllOrders, websiteKey])

  useEffect(() => {
    if (websiteKey) {
      const param = new URLSearchParams();
      param.append('page', orderPageNo.toString());
      const url = isAllOrders
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/order/all?${param.toString()}`
        : `${process.env.NEXT_PUBLIC_BASE_URL}/order/vendor?${param.toString()}`;

      fetchOrderData(url);
    }
  }, [websiteKey, orderPageNo, isAllOrders]);

  const filteredOrders = Array.isArray(orders)
    ? orders.filter((order) => {
      const customerName = order.user.name.toLowerCase();
      return customerName.includes(searchQuery.toLowerCase());
    })
    : [];

    const openPopup = (order: any) => {
      const calculatedTotal = calculateOrderTotal(order.items);
      const calculatedQuantity = calculateTotalQuantity(order.items);
      setSelectedOrder({
        ...order,
        calculatedTotal,
        calculatedQuantity
      });
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
      cell: (row: any) => <div>{calculateTotalQuantity(row.items)}</div>,
    },
    {
      header: "Total Amount",
      accessor: "totalAmount",
      cell: (row: any) => <div>₹{calculateOrderTotal(row.items).toFixed(2)}</div>,
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
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-black text-white border-gray-800">
              <DropdownMenuItem onClick={() => openPopup(row)}>View Order</DropdownMenuItem>

              {shippingStatus === OrderStatusEnum.PENDING && (
                <>
                  <DropdownMenuItem onClick={() => changeOrderStatus(row._id, OrderStatusEnum.CONFIRM)}>
                    Confirm Order
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => cancelOrder(row._id)}>
                    Cancel Order
                  </DropdownMenuItem>
                </>
              )}

              {shippingStatus === OrderStatusEnum.CONFIRM && (
                <DropdownMenuItem onClick={() => changeOrderStatus(row._id, OrderStatusEnum.SHIPPED)}>
                  Mark as Shipped
                </DropdownMenuItem>
              )}

              {shippingStatus === OrderStatusEnum.SHIPPED && (
                <DropdownMenuItem onClick={() => changeOrderStatus(row._id, OrderStatusEnum.DELIVERED)}>
                  Mark as Delivered
                </DropdownMenuItem>
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
        <div className='flex gap-2 flex-row mb-7 items-center flex-wrap text-xs sm:text-sm'>
          <Button
            onClick={() => setIsAllOrders(true)}
            className={`bg-gray-900 px-2 py-1 sm:px-4 sm:py-2 rounded-lg border-[1px] border-gray-800 flex flex-row items-center gap-2 cursor-pointer ${isAllOrders ? 'text-blue-800 border-blue-800' : ''}`}
          >
            {isAllOrders ? <Check className='w-4 h-4 sm:w-6 sm:h-6' /> : null}
            <span>All Orders</span>
          </Button>
          <Button
            onClick={() => setIsAllOrders(false)}
            className={`bg-gray-900 px-2 py-1 sm:px-4 sm:py-2 rounded-lg border-[1px] border-gray-800 flex flex-row items-center gap-2 cursor-pointer ${!isAllOrders ? 'text-blue-800 border-blue-800' : ''}`}
          >
            {!isAllOrders ? <Check className='w-4 h-4 sm:w-6 sm:h-6' /> : null}
            <span>My Orders</span>
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
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={closePopup}>
    <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-800 transform transition-all duration-300 ease-in-out hover:scale-105" 
         onClick={(e) => e.stopPropagation()}>
      {/* Modal Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-100">Order Details</h2>
          <button
            onClick={closePopup}
            className="text-gray-400 hover:text-gray-200 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Modal Content */}
      <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
        {/* Order Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Customer Info Card */}
          <div className="bg-gray-800 p-4 rounded-lg space-y-2 border border-gray-700 hover:border-gray-600 transition-all duration-200">
            <h3 className="text-sm font-medium text-gray-400">Customer Details</h3>
            <p className="text-gray-100 font-medium">{selectedOrder.user.name}</p>
            <p className="text-gray-300 text-sm">{selectedOrder.user.email}</p>
            <div className="mt-2 pt-2 border-t border-gray-700">
              <p className="text-xs text-gray-400">Order ID</p>
              <p className="font-mono text-sm text-blue-400">{selectedOrder._id}</p>
            </div>
          </div>

          {/* Payment Info Card */}
          <div className="bg-gray-800 p-4 rounded-lg space-y-2 border border-gray-700 hover:border-gray-600 transition-all duration-200">
            <h3 className="text-sm font-medium text-gray-400">Payment Details</h3>
            <div className="flex items-baseline justify-between">
              <p className="text-gray-300">Total Amount</p>
              <p className="text-lg font-semibold text-blue-400">
                ₹{selectedOrder.calculatedTotal.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-gray-300">Status</p>
              <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                selectedOrder.paymentStatus === 'paid'
                  ? 'bg-green-900/50 text-green-400 border border-green-700'
                  : 'bg-red-900/50 text-red-400 border border-red-700'
              }`}>
                {selectedOrder.paymentStatus}
              </span>
            </div>
          </div>

          {/* Shipping Info Card */}
          <div className="bg-gray-800 p-4 rounded-lg space-y-2 border border-gray-700 hover:border-gray-600 transition-all duration-200">
            <h3 className="text-sm font-medium text-gray-400">Shipping Status</h3>
            <div className="flex items-center justify-between">
              <p className="text-gray-300">Current Status</p>
              <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                selectedOrder.shippingStatus === 'delivered'
                  ? 'bg-green-900/50 text-green-400 border border-green-700'
                  : selectedOrder.shippingStatus === 'pending'
                    ? 'bg-blue-900/50 text-blue-400 border border-blue-700'
                    : selectedOrder.shippingStatus === 'cancelled'
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
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2 styledScrollable">
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
                  className="flex items-start gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200"
                >
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <img
                      src={getURL(variant?.imageKeys[0])}
                      alt={item.product.title}
                      className="w-full h-full object-cover rounded-md border border-gray-700"
                    />
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
                        <p className="text-sm text-white mt-1 flex items-center gap-2">
                          Quantity:
                          <span className="text-white flex items-center text-sm font-medium">
                            {item.quantity}
                          </span>
                        </p>
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
            <p className="text-sm text-gray-400">Total Items: {selectedOrder.calculatedQuantity}</p>
            <p className="text-lg font-semibold text-gray-100">
              Order Total: <span className="text-blue-400">₹{selectedOrder.calculatedTotal.toFixed(2)}</span>
            </p>
          </div>
          <button
            onClick={closePopup}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
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

