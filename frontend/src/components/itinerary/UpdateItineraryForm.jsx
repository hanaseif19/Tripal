import { Modal, Form, Input, Button, Row, Col, Select } from 'antd';
import { useState, useEffect } from 'react';
import ActivitySelectionModal from './ActivitySelectionModal';
import languages from '@/assets/constants/Languages';
import AccessibilityTags from '@/assets/constants/AccessibiltyTags';
import MapPopUp from '@/components/common/MapPopUp';

const UpdateItineraryModal = ({ itinerary, visible, onCancel, onUpdate }) => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pickupLocation, setPickUpLocation] = useState(itinerary.pickupLocation || '');  
  const [dropoffLocation, setDropOffLocation] = useState(itinerary.dropoffLocation || '');  
  const [pickupMarkerPosition, setPickUpMarkerPosition] = useState([51.505, -0.09]);
  const [dropoffMarkerPosition, setDropOffMarkerPosition] = useState([51.505, -0.09]);
  const [selectedActivities, setSelectedActivities] = useState(itinerary.activities || []);
  const duration = (new Date(itinerary.endDate) - new Date(itinerary.startDate)) / (1000 * 60 * 60 * 24) + 1;

  useEffect(() => {
    if (itinerary.activities) {
      setSelectedActivities(itinerary.activities);
    }
  }, [itinerary]);

  const handleSelectActivities = (activities) => {
    setSelectedActivities(activities);
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const updatedItinerary = { ...form.getFieldsValue(), activities: selectedActivities };
      updatedItinerary.startDate = itinerary.startDate;
      updatedItinerary.endDate = itinerary.endDate;
      updatedItinerary.pickupLocation = pickupLocation;
      updatedItinerary.dropoffLocation = dropoffLocation;
      onUpdate(updatedItinerary);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      visible={visible}
      title="Update Itinerary"
      onCancel={onCancel}
      footer={null}
      width="50%"
    >
      <Form
        form={form}
        initialValues={{
          title: itinerary.title,
          description: itinerary.description,
          serviceFee: itinerary.serviceFee,
          language: itinerary.language,
          accessibility: itinerary.accessibility || [],
          activities: itinerary.activities || [],
        }}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
        style={{ width: '100%' }}
      >
        {/* Itinerary Title */}
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: 'Please enter the itinerary title' }]}
        >
          <Input size="large" />
        </Form.Item>

        {/* Description */}
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please enter a description' }]}
        >
          <Input.TextArea rows={4} size="large" />
        </Form.Item>

        {/* Activities Button */}
        <Form.Item>
          <Button
            style={{
              color: 'black',
              borderColor: '#036264',
              ':hover': { borderColor: '#5a9ea0' },
              ':focus': { borderColor: '#5a9ea0' },
            }}
            onClick={() => setIsModalVisible(true)}
          >
            Select Activities
          </Button>
          <ActivitySelectionModal
            isVisible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            onSelectActivities={handleSelectActivities}
            preSelectedActivities={selectedActivities}
            maxActivities={duration}
          />
        </Form.Item>

        {/* Service Fee and Language */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Service Fee"
              name="serviceFee"
              rules={[{ required: true, message: 'Please enter the service fee' }]}
            >
              <Input prefix="EGP" size="large" placeholder="0" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Language"
              name="language"
              rules={[{ required: true, message: 'Please select a language' }]}
            >
              <Select placeholder="Select language" size="large" style={{ borderColor: '#e0829d' }}>
                {languages.map((language) => (
                  <Select.Option key={language} value={language}>
                    {language}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Accessibility Tags */}
        <Form.Item
          label="Accessibility Tags"
          name="accessibility"
          tooltip="Add accessibility options such as wheelchair access, braille, etc."
        >
          <Select
            mode="tags"
            placeholder="Enter tags and press Enter"
            size="large"
            style={{ width: '100%', borderColor: '#5a9ea0' }}
          >
            {AccessibilityTags.map((accessibility) => (
              <Select.Option key={accessibility} value={accessibility}>
                {accessibility}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Locations */}
        <Form.Item>
          <label>Pickup Location:</label>
          <Input
            type="text"
            name="pickupLocation"
            value={pickupLocation}
            required
          />
          <MapPopUp
            markerPosition={pickupMarkerPosition}
            setMarkerPosition={setPickUpMarkerPosition}
            setSelectedLocation={setPickUpLocation}
            selectedLocation={pickupLocation}
          />
        </Form.Item>
        <Form.Item>
          <label>Dropoff Location:</label>
          <Input
            type="text"
            name="dropoffLocation"
            value={dropoffLocation}
            required
          />
          <MapPopUp
            markerPosition={dropoffMarkerPosition}
            setMarkerPosition={setDropOffMarkerPosition}
            setSelectedLocation={setDropOffLocation}
            selectedLocation={dropoffLocation}
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={false}
            className="custom-button"
            style={{ width: '100%', height: '50px' }}
          >
            Update Itinerary
          </Button>
        </Form.Item>
      </Form>
      <style>{`
      .custom-button {
        background-color: var(--color-dark-purple) !important;
        border-color: var(--color-dark-purple) !important;
      }
      .custom-button:hover {
        background-color: var(--color-light-purple) !important;
        border-color: var(--color-light-purple) !important;
      }
    `}</style>
    </Modal>
  );
};

export default UpdateItineraryModal;
