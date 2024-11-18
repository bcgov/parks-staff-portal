import groupBy from "lodash/groupBy";
import DateRange from "@/components/DateRange";
import PropTypes from "prop-types";

function DateTypeRow({ dateTypeName, dateRanges }) {
  return (
    <tr>
      <td>{dateTypeName} dates</td>
      <td>
        {dateRanges.map((date) => (
          <DateRange key={date.id} start={date.startDate} end={date.endDate} />
        ))}
      </td>
    </tr>
  );
}

// "Dateable" features: Campsite groupings, etc.
function CampGroundFeature({ feature }) {
  const currentSeasonDates = feature?.dateable?.currentSeasonDates;

  if (!currentSeasonDates) return null;

  // Group current season dates by date type
  const groupedDates = groupBy(
    currentSeasonDates,
    (dateType) => dateType.dateType.name,
  );

  return (
    <div className="feature">
      <h5>{feature.name}</h5>

      <table className="table table-striped sub-area-dates mb-0">
        <tbody>
          {Object.entries(groupedDates).map(([dateTypeName, dateRanges]) => (
            <DateTypeRow
              key={dateTypeName}
              dateTypeName={dateTypeName}
              dateRanges={dateRanges}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Campgrounds contain one or more dateable features
function CampGround({ campground }) {
  return (
    <div className="campground">
      <h4>{campground.name}</h4>

      {campground.features.map((feature) => (
        <CampGroundFeature key={feature.id} feature={feature} />
      ))}
    </div>
  );
}

export default function SeasonDates({ data }) {
  return (
    <div className="details-content">
      {data.campgrounds.map((campground) => (
        <CampGround key={campground.id} campground={campground} />
      ))}
    </div>
  );
}

// prop validation
const dateRangePropShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  dateType: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
});

const campgroundFeaturePropShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  dateable: PropTypes.shape({
    currentSeasonDates: PropTypes.arrayOf(dateRangePropShape),
  }),
});

const campgroundPropShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  features: PropTypes.arrayOf(campgroundFeaturePropShape),
});

SeasonDates.propTypes = {
  data: PropTypes.shape({
    campgrounds: PropTypes.arrayOf(campgroundPropShape),
  }),
};

CampGround.propTypes = {
  campground: campgroundPropShape,
};

CampGroundFeature.propTypes = {
  feature: campgroundFeaturePropShape,
};

DateTypeRow.propTypes = {
  dateTypeName: PropTypes.string.isRequired,
  dateRanges: PropTypes.arrayOf(dateRangePropShape),
};
