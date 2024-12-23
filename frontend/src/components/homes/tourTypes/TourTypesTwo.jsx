import { destinationsNine } from "@/data/destinations";

export default function TourTypesTwo() {
  return (
    <section className="layout-pt-xl">
      <div className="container">
        <div className="row y-gap-10 justify-between items-end">
          <div className="col-auto">
            <h2 data-aos="fade-up" data-aos-delay="" className="text-30">
              Popular things to do
            </h2>
          </div>
        </div>

        <div
          data-aos="fade-up"
          data-aos-delay=""
          className="row y-gap-20 pt-40"
        >
          {destinationsNine.map((elm, i) => (
            <div key={i} className="col-xl-2 col-md-4 col-6">
              <label
                className="featureCard -type-5 "
              >
                <div className="featureCard__icon">
                  <img src={elm.iconSrc} alt="image" />
                </div>

                <h4 className="text-18 fw-500 mt-20">{elm.title}</h4>
                <div className="lh-13 mt-5">{elm.tourCount}+ Tours</div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}