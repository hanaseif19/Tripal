import { useEffect, useState } from "react";
import { getBookmarkedEvents } from "../../api/TouristService"
import FooterThree from "@/components/layout/footers/FooterThree";
import TouristHeader from "@/components/layout/header/TouristHeader";
import { Link } from "react-router-dom";
import { getConversionRate,getTouristCurrency } from "@/api/ExchangeRatesService";

export default function BookmarkedEvents() {

    const [bookmarkedEvents, setBookmarkedEvents] = useState([]);
    const images = [
        "https://viatour-reactjs.ibthemespro.com/img/tourCards/3/4.png",

      ];
      const [exchangeRate, setExchangeRate] = useState(1);
      const [currency, setCurrency] = useState( "EGP");

      const getExchangeRate = async () => {
        if (currency) {
          const rate = await getConversionRate(currency);
          setExchangeRate(rate);
        }
      };
    
      useEffect(() => {
        const intervalId = setInterval(() => {
          const newCurrency = getTouristCurrency();
          setCurrency(newCurrency);
          getExchangeRate();
        }, 1);  return () => clearInterval(intervalId);
      }, [currency]);
  
  useEffect(() => {
    const fetchBookmarked = async () => {
      try {
        const data = await getBookmarkedEvents();
        setBookmarkedEvents(data);
      } catch (error) {
        console.error("Error fetching bookmarked events:", error);
      }
    };
    fetchBookmarked();
  }, []);

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };
  return (
    <div>
    <TouristHeader />
    <section className="layout-pb-xl" style={{ marginTop: "80px"}}>
    
      <div className="container" >
        <div className="row">
          

          <div className="col-xl-15 col-lg-14" >
            <div className="row y-gap-30 pt-30">
            {bookmarkedEvents?.map((event, index) => (
                <div className="col-12" key={index}>
                  <div className="tourCard -type-2">
                    <div className="tourCard__image">
                    <img src={images[0]} alt="Tour Image" />

                    </div>

                    <div className="tourCard__content">
                      <div className="tourCard__location">
                        <i className="icon-pin"></i>
                        {event.type === "activity" ? event.location : event.pickupLocation}
                      </div>

                      <h3 className="tourCard__title mt-5">
                        <span>{event.title}</span>
                      </h3>

                      <p className="tourCard__text mt-5">{truncateText(event.description, 700)}
                      </p>

                    </div>

                    <div className="tourCard__info">
                      <div>
                        <div className="d-flex items-center text-14">
                          <i className="icon-clock mr-10"></i>
                          {event.type === "activity" 
                                ? event.date 
                                    ? new Date(event.date).toLocaleDateString() 
                                    : "No date available"
                                : event.timeline && event.timeline.length > 0 
                                    ? new Date(event.timeline[0].date).toLocaleDateString() 
                                    : "No date available"}
                        </div>

                        <div >
                          
                          <div className="d-flex items-center">
                            <span className="text-20 fw-500 ">
                              price: {currency} {(event.price*exchangeRate).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button className="button -outline-accent-1 text-accent-1">
                      <Link to={event.type === "activity" 
                                    ? `/activity/${event._id}` 
                                    : `/itinerary/${event._id}`}>
                            View Details
                            <i className="icon-arrow-top-right ml-10"></i>
                        </Link>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
    <FooterThree />

    </div>
  );
}
