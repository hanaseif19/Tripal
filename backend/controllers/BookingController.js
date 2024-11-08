const Activity = require("../models/Activity");
const itineraryModel = require('../models/Itinerary');
const Tourist = require('../models/users/Tourist');

const bookResource = async (req, res) => {
    const { resourceType, resourceId } = req.params;
    const { touristId, selectedDate, selectedTime,tickets} = req.body;

    const model = resourceType === 'activity' ? Activity : itineraryModel;
  
    try {
        const resource = await model.findById(resourceId);
        if (!resource) 
            return res.status(404).json({ error: `${resourceType} not found` });
        
        if (resourceType === 'activity' && resource.isBookingOpen === false) 
            return res.status(400).json({ error: 'Booking is closed for this activity' });
        
        const tourist = await Tourist.findById(touristId);
        if (!tourist) 
            return res.status(404).json({ error: 'Tourist not found' });
        
        if (tourist.calculateAge() < 18) 
            return res.status(403).json({ error: 'You must be at least 18 years old to book' });
    
        if (resourceType === 'itinerary') {
            if (!selectedDate || !selectedTime) {
                return res.status(400).json({ error: 'Please provide a date and time for booking this itinerary' });
            }

            const dateIsAvailable = resource.availableDates.some(
                date => date.toISOString() === new Date(selectedDate).toISOString()
            );
            const timeIsAvailable = resource.availableTime.includes(selectedTime);

            if (!dateIsAvailable || !timeIsAvailable) {
                return res.status(400).json({ error: 'Selected date or time is not available for this itinerary' });
            }
            
            const existingBooking = resource.bookings.find(booking => booking.touristId.toString() === touristId);
            if (existingBooking) {
                existingBooking.selectedDate = selectedDate;
                existingBooking.selectedTime = selectedTime;
                existingBooking.tickets += 1;
            } else {
                resource.bookings.push({ touristId, selectedDate, selectedTime, tickets});
            }
            
            tourist.wallet.amount -= resource.price*tickets+resource.serviceFee;

            
        } 
        else{
            const existingBooking = resource.bookings.find(booking => booking.touristId.toString() === touristId);
            if (existingBooking) {
                existingBooking.tickets += 1;
            } else {
                resource.bookings.push({ touristId,tickets});
            }
            resource.booked = true; // i added an attribute in activity to check whether this activity has been booked
            tourist.wallet.amount -= resource.price;
        }
        if(tourist.wallet.amount<0)
            return res.status(400).json({ error: 'Insufficient money in wallet, Why are you so poor?' });
        
        await tourist.save();
        await resource.save();

        let pointsToReceive=0;

        if(tourist.totalPoints<=100000){
            pointsToReceive=resource.price*0.5;
        }else if(tourist.totalPoints<=500000){
            pointsToReceive=resource.price*1;
        } else {
            pointsToReceive=resource.price*1.5;
        }

        await Tourist.findByIdAndUpdate(
            touristId,
            {
                $inc: {
                    totalPoints: pointsToReceive,
                    currentPoints: pointsToReceive,
                },
            },
            { new: true }
        );
    
        res.status(200).json({ message: `Congratulations, ${resourceType} booked successfully` });
        } catch (error) {
        res.status(500).json({ error: error.message });
        }
  };

const cancelResource = async (req, res) => {
const { resourceType, resourceId } = req.params;
const { touristId } = req.body;
const model = resourceType === 'activity' ? Activity : itineraryModel;

try {
    const resource = await model.findById(resourceId);
    const tourist = await Tourist.findById(touristId);

    if (!resource) 
    return res.status(404).json({ error: `${resourceType} not founddd` });
    

    if (resourceType === 'activity') {
            // For activities, find and remove the tourist from `tourists` array
            const bookingIndex = resource.bookings.findIndex(
                booking => booking.touristId.toString() === touristId
            );
            if (bookingIndex === -1) {
                return res.status(400).json({ error: `You have no booking for this ${resourceType}` });
            }            
    
            if (tourist){
                tourist.wallet.amount += resource.price*resource.bookings[bookingIndex].tickets;
                await tourist.save();
            } 
            resource.bookings.splice(bookingIndex, 1);   
            resource.markModified('bookings');
    } 
    else if (resourceType === 'itinerary') {
        
        const bookingIndex = resource.bookings.findIndex(
            booking => booking.touristId.toString() === touristId
        );
        if (bookingIndex === -1) {
            return res.status(400).json({ error: `You have no booking for this ${resourceType}` });
        }            

        if (tourist){
            tourist.wallet.amount += resource.price*resource.bookings[bookingIndex].tickets+resource.serviceFee;
            await tourist.save();
        } 
        resource.bookings.splice(bookingIndex, 1);   
        resource.markModified('bookings');
    }
    await resource.save();

        if (!tourist) 
            return res.status(404).json({ error: 'Tourist not found' });

    let pointsToDecrement=0;
    if(tourist.totalPoints<=100000){
        pointsToDecrement=resource.price*0.5;
    }else if(tourist.totalPoints<=500000){
        pointsToDecrement=resource.price*1;
    } else {
        pointsToDecrement=resource.price*1.5;
    }

    await Tourist.findByIdAndUpdate(
        touristId,
        {
            $inc: {
                totalPoints: -pointsToDecrement,
                currentPoints: -pointsToDecrement,
            },
        },
        { new: true }
    );

    res.status(200).json({ message: `${resourceType} booking canceled successfully, kindly check your balance.` });
} catch (error) {
    res.status(500).json({ message: 'Error canceling booking', error });
}
};
  
module.exports = {cancelResource, bookResource};