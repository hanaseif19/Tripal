import React, { useState } from "react";
import { Tag, Modal } from 'antd';
import CommentBox from '../common/Comment'

const touristId = '670d4e900cb9ea7937cc9968';

const PaidActivitiesList = ({ activities,onBook }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const showCommentModal = (activity) => {
    setSelectedActivity(activity);
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="list">
      {activities.map((activity) => (
        <div className="list-item" key={activity._id}>
          <div className="list-item-header">{activity.title}</div>
          <div className="list-item-attributes">
            <div className="list-item-attribute">{activity.description}</div>
            <div className="list-item-attribute">Date: {new Date(activity.date).toLocaleDateString()}</div>
            <div className="list-item-attribute">Time: {activity.time}</div>
            <div className="list-item-attribute">Location: {activity.location}</div>
            <div className="list-item-attribute">Price: {activity.price}</div>
            <div className="list-item-attribute">Category: {activity.category ? activity.category.Name : "N/A"}</div>
            <div className="list-item-attribute">
              Tags: {activity.tags.map((tag) => (
                <Tag key={tag._id} color="geekblue">
                  {tag.name}
                </Tag>
              ))}
            </div>
            <div className="list-item-attribute">Rating: {activity.averageRating}</div>
            <div className="list-item-attribute">Special Discounts: {activity.specialDiscounts || "N/A"}</div>
            <div className="list-item-attribute">Booking Open: {activity.isBookingOpen ? "Yes" : "No"}</div>
          </div>
          <button onClick={() => showCommentModal(activity)}>
            Comment
          </button>
        </div>
      ))}
      <Modal
        title="Leave a Comment"
        visible={isModalVisible}
        onCancel={handleClose}
        footer={null} 
      >
        <CommentBox />
      </Modal>
    </div>
  );
};

export default PaidActivitiesList;