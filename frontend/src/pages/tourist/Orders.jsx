import { useState, useEffect } from "react";
import { message } from "antd";
import TouristHeader from "../../components/layout/header/TouristHeader";
import FooterThree from "@/components/layout/footers/FooterThree";
import MetaComponent from "@/components/common/MetaComponent";
import Pagination from "../../components/common/Pagination";
import { getOrders } from "@/api/OrderService";
import { Link } from "react-router-dom";

const metadata = {
  title: "Orders || Tripal",
};

const tabs = ["Current Orders", "Past Orders"];

const statusClass = (status) => {
  if (status === "Delivered") return "text-purple-1";
  if (status === "Pending") return "text-yellow-1";
  if (status === "Cancelled") return "text-red-2";
  return "";
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [currentTab, setCurrentTab] = useState("Current Orders");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders();
        setOrders(response.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        message.error(error.message);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (currentTab === "Current Orders") {
      return order.status === "Pending";
    }
    return order.status === "Delivered" || order.status === "Cancelled";
  });

  return (
    <>
      <MetaComponent meta={metadata} />
      <div>
        <TouristHeader />
        <main>
          <div className="dashboard__content">
            <div className="dashboard__content_content">
              <div className="rounded-12 bg-white shadow-2 px-40 pt-40 pb-30 md:px-20 md:pt-20 md:mb-20 mt-50">
                <h1>My Orders</h1>
                <div className="tabs -underline-2 js-tabs mt-30">
                  <div className="tabs__controls row x-gap-40 y-gap-10 lg:x-gap-20">
                    {tabs.map((tab, index) => (
                      <div
                        key={index}
                        className="col-auto"
                        onClick={() => setCurrentTab(tab)}
                      >
                        <button
                          className={`tabs__button text-20 lh-12 fw-500 pb-15 lg:pb-0 ${
                            tab === currentTab ? "is-tab-el-active" : ""
                          }`}
                        >
                          {tab}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="overflowAuto mt-30">
                  <table className="tableTest mb-30">
                    <thead className="bg-light-1 rounded-12">
                      <tr>
                        <th>Order ID</th>
                        <th>Title</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Total Price</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders?.length === 0 ? (
                        <tr>
                          <td colSpan="6" style={{ textAlign: "center" }}>
                            No {currentTab.toLowerCase()} found.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders?.map((order, index) => (
                          <tr key={index}>
                            <td>#{order._id.slice(-6)}</td>
                            <td className="min-w-300">
                              <div className="d-flex items-center">
                                {/* Placeholder for Image */}
                                <img
                                  src={order.imageUrl || "/placeholder.jpg"}
                                  alt="Order"
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    borderRadius: "4px",
                                    objectFit: "cover",
                                  }}
                                />
                              </div>
                            </td>
                            <td>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td>
                              <div
                                className={`circle ${statusClass(
                                  order.status
                                )}`}
                              >
                                {order.status}
                              </div>
                            </td>
                            <td>${order.totalPrice.toFixed(2)}</td>
                            <td>
                              <div className="d-flex items-center">
                                <Link
                                  to={`/order-details/${order._id}`}
                                  className="button -dark-1 size-35 bg-light-1 rounded-full flex-center"
                                >
                                  <i className="icon-pencil text-14"></i>
                                </Link>
                                <button className="button -dark-1 size-35 bg-light-1 rounded-full flex-center ml-10">
                                  <i className="icon-delete text-14"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <Pagination />
                <div className="text-14 text-center mt-20">
                  Showing results 1-{filteredOrders?.length} of{" "}
                  {filteredOrders?.length}
                </div>
              </div>
            </div>
          </div>
        </main>
        <FooterThree />
      </div>
    </>
  );
};

export default Orders;
