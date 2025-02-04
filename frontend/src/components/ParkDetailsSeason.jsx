import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import classNames from "classnames";
import PropTypes from "prop-types";
import { faChevronDown, faPen, faChevronUp } from "@fa-kit/icons/classic/solid";
import { faCircleExclamation } from "@fa-kit/icons/classic/regular";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDate } from "@/lib/utils";
import { useApiGet } from "@/hooks/useApi";
import ExpandableContent from "@/components/ExpandableContent";
import NotReadyFlag from "@/components/NotReadyFlag";
import SeasonDates from "@/components/ParkDetailsSeasonDates";
import StatusBadge from "@/components/StatusBadge";

import { useConfirmation } from "@/hooks/useConfirmation";
import ConfirmationDialog from "@/components/ConfirmationDialog";

export default function ParkSeason({ season }) {
  const { parkId } = useParams();
  const navigate = useNavigate();

  const [expanded, setExpanded] = useState(false);

  const {
    data: datesData,
    loading,
    error,
    fetchData,
  } = useApiGet(`/seasons/${season.id}`, {
    instant: false,
  });

  const {
    title,
    message,
    openConfirmation,
    handleConfirm,
    handleCancel,
    isConfirmationOpen,
  } = useConfirmation();

  function toggleExpand(event) {
    // Prevent button click events from bubbling up to the clickable parent
    event.stopPropagation();

    // If the panel is about to expand, fetch the data
    if (!expanded && datesData === null) {
      fetchData();
    }

    setExpanded(!expanded);
  }

  // @TODO: implement logic to show/hide preview button
  const showPreviewButton = true;

  // @TODO: implement logic to disable preview button
  const disablePreviewButton = true;

  const updateDate = formatDate(season.updatedAt, "America/Vancouver");

  async function navigateToEdit() {
    if (season.status === "pending review") {
      const confirm = await openConfirmation(
        "Edit submitted dates?",
        "A review may already be in progress and all dates will need to be reviewed again.",
      );

      if (confirm) {
        navigate(`/park/${parkId}/edit/${season.id}`);
      }
    } else if (season.status === "approved") {
      const confirm = await openConfirmation(
        "Edit approved dates?",
        "Dates will need to be reviewed again to be approved.",
      );

      if (confirm) {
        navigate(`/park/${parkId}/edit/${season.id}`);
      }
    } else if (season.status === "published") {
      const confirm = openConfirmation(
        "Edit published dates?",
        "Dates will need to be reviewed again to be approved and published. If reservations have already begun, visitors will be affected.",
      );

      if (confirm) {
        navigate(`/park/${parkId}/edit/${season.id}`);
      }
    } else {
      navigate(`/park/${parkId}/edit/${season.id}`);
    }
  }

  function navigateToPreview() {
    navigate(`/park/${parkId}/edit/${season.id}/preview`);
  }

  return (
    <div className={classNames("season expandable", { expanded })}>
      <ConfirmationDialog
        title={title}
        message={message}
        notes=""
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        isOpen={isConfirmationOpen}
      />
      <div className={classNames("details", { expanded })}>
        <header role="button" onClick={toggleExpand}>
          <h3>{season.operatingYear} season</h3>

          <StatusBadge status={season.status} />
          <NotReadyFlag show={!season.readyToPublish} />

          <button
            onClick={toggleExpand}
            className="btn btn-text-primary expand-toggle"
          >
            <span>Last updated: {updateDate}</span>
            <FontAwesomeIcon
              className="append-content ms-2"
              icon={expanded ? faChevronUp : faChevronDown}
            />
          </button>
        </header>

        <ExpandableContent expanded={expanded} loading={loading} error={error}>
          <SeasonDates data={datesData} />
        </ExpandableContent>
      </div>

      <div className="controls">
        <button onClick={navigateToEdit} className="btn btn-text-primary">
          <FontAwesomeIcon className="append-content me-2" icon={faPen} />
          <span>Edit</span>
        </button>

        {showPreviewButton && (
          <>
            <div className="divider"></div>

            <button
              onClick={navigateToPreview}
              className="btn btn-text-primary"
              disabled={disablePreviewButton}
            >
              <FontAwesomeIcon
                className="append-content me-2"
                icon={faCircleExclamation}
              />
              <span>Review</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// prop validation
ParkSeason.propTypes = {
  season: PropTypes.shape({
    id: PropTypes.number.isRequired,
    operatingYear: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    readyToPublish: PropTypes.bool.isRequired,
  }),
};
