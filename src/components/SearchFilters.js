export default function SearchFilter({ handleClick }) {
  return (
    <div className="searchFilters">
      <div className="top-tier">
        <div onClick={handleClick} className="accomodations item">
          Accomodations
        </div>
        <div onClick={handleClick} className="amusements item">
          Amusements
        </div>
        <div onClick={handleClick} className="sport item">
          Sport
        </div>
      </div>
      <div className="interesting_places">
        <p className="title">Interesting Places</p>
        <div className="intresting_items">
          <div onClick={handleClick} className="architecture item">
            Architecture
          </div>
          <div onClick={handleClick} className="cultural item">
            Cultural
          </div>
          <div onClick={handleClick} className="historic item">
            Historic
          </div>
          <div onClick={handleClick} className="natural item">
            Natural
          </div>
          <div onClick={handleClick} className="religion item">
            Religion
          </div>
          <div onClick={handleClick} className="other item">
            Other
          </div>
        </div>
      </div>
      <div className="tourist_facility">
        <p className="title">Tourist Facility</p>
        <div className="tourist_items">
          <div onClick={handleClick} className="banks item">
            Banks
          </div>
          <div onClick={handleClick} className="foods item">
            Foods
          </div>
          <div onClick={handleClick} className="shops item">
            Shops
          </div>
          <div onClick={handleClick} className="transport item">
            Transport
          </div>
        </div>
      </div>
    </div>
  );
}
